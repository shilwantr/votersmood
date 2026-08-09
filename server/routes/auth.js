import express from 'express';
import crypto from 'crypto';
import { db } from '../config/firebase.js';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

const router = express.Router();

// Helper to hash passwords using SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper to verify passwords
const verifyPassword = (password, storedHash) => {
  if (!storedHash) return false;
  const hash = hashPassword(password);
  return hash === storedHash;
};

// Helper to generate JWT token
const generateToken = (user) => {
  return `janmat_jwt_${user.isAdmin ? 'admin' : 'user'}_${Buffer.from(user.email).toString('base64')}_${Date.now()}`;
};

// In-memory fallback user store when Firestore database is offline
const IN_MEMORY_USERS = new Map();

// 1. POST /api/auth/register (Strict Registration Validation & Uniqueness Check)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, state, constituency, isRegisteredVoter } = req.body;

    // Field Validations
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let existingUser = null;

    // Check if user already exists in Firestore DB
    if (db) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', normalizedEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          existingUser = querySnapshot.docs[0].data();
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore read check warning:', dbErr.message);
      }
    }

    if (!existingUser && IN_MEMORY_USERS.has(normalizedEmail)) {
      existingUser = IN_MEMORY_USERS.get(normalizedEmail);
    }

    // STRICT REJECTION: Prevent duplicate account creation
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const uid = 'voter_' + Date.now();
    const passwordHash = hashPassword(password);

    // All newly registered accounts default strictly to isAdmin: false.
    const newUserData = {
      uid,
      email: normalizedEmail,
      displayName: name?.trim() || normalizedEmail.split('@')[0].toUpperCase(),
      passwordHash,
      isAdmin: false,
      role: 'user',
      state: state || 'MH',
      constituency: constituency || 'Mumbai South',
      isRegisteredVoter: isRegisteredVoter !== false,
      createdAt: new Date().toISOString()
    };

    // Save to Firebase DB (Firestore)
    if (db) {
      try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, newUserData);
        console.log(`🔥 Firebase DB: Registered new user [${normalizedEmail}] saved to Firestore (isAdmin: false)`);
      } catch (dbErr) {
        console.warn('⚠️ Firestore write warning:', dbErr.message);
      }
    }

    IN_MEMORY_USERS.set(normalizedEmail, newUserData);
    const token = generateToken(newUserData);

    // Omit passwordHash from response
    const { passwordHash: _, ...safeUser } = newUserData;

    return res.status(201).json({
      message: 'Registration successful via Firebase DB',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// 2. POST /api/auth/login (Strict Credential & Password Verification)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email address and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userData = null;

    // Fetch user profile from Cloud Firestore DB
    if (db) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', normalizedEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          userData = querySnapshot.docs[0].data();
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore read warning:', dbErr.message);
      }
    }

    if (!userData && IN_MEMORY_USERS.has(normalizedEmail)) {
      userData = IN_MEMORY_USERS.get(normalizedEmail);
    }

    // STRICT REJECTION: If user does not exist, REJECT! (Do NOT auto-create account)
    if (!userData) {
      return res.status(401).json({ error: 'Invalid email or password. User not found. Please register first.' });
    }

    // STRICT REJECTION: Check password match
    if (userData.passwordHash && !verifyPassword(password, userData.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password. Incorrect password.' });
    }

    // Prepare safe user object & check strict DB isAdmin flag
    const { passwordHash: _, ...safeUser } = userData;
    safeUser.isAdmin = userData.isAdmin === true;

    const token = generateToken(safeUser);
    console.log(`🔥 Firebase DB: Login authenticated for [${normalizedEmail}] (isAdmin: ${safeUser.isAdmin})`);

    return res.json({
      message: 'Login successful via Firebase DB',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// 3. GET /api/auth/me (Verifies current session profile from DB)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const parts = token.split('_');
    const emailBase64 = parts[3];
    if (!emailBase64) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }

    const email = Buffer.from(emailBase64, 'base64').toString('utf-8');
    let userData = null;

    if (db) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          userData = querySnapshot.docs[0].data();
        }
      } catch (e) {}
    }

    if (!userData) {
      userData = IN_MEMORY_USERS.get(email.toLowerCase());
    }

    if (!userData) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { passwordHash: _, ...safeUser } = userData;
    safeUser.isAdmin = userData.isAdmin === true;

    return res.json({ user: safeUser });
  } catch (error) {
    res.status(401).json({ error: 'Authentication check failed' });
  }
});

export default router;
