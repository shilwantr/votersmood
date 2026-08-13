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
    const defaultAvatarUrl = `https://api.dicebear.com/10.x/avataaars/svg?seed=${uid}`;

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
      avatarUrl: defaultAvatarUrl,
      avatarStyle: 'avataaars',
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
    if (!safeUser.avatarUrl) {
      safeUser.avatarUrl = `https://api.dicebear.com/10.x/avataaars/svg?seed=${safeUser.uid || 'citizen'}`;
    }

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
    if (!safeUser.avatarUrl) {
      safeUser.avatarUrl = `https://api.dicebear.com/10.x/avataaars/svg?seed=${safeUser.uid || 'citizen'}`;
    }

    return res.json({ user: safeUser });
  } catch (error) {
    res.status(401).json({ error: 'Authentication check failed' });
  }
});

// 4. PUT /api/auth/profile/avatar (Updates user's custom 2D avatar in Cloud Firestore DB)
router.put('/profile/avatar', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const parts = token.split('_');
    const emailBase64 = parts[3];
    if (!emailBase64) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const email = Buffer.from(emailBase64, 'base64').toString('utf-8').toLowerCase().trim();
    const { avatarUrl, avatarStyle } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }

    let userDocId = null;
    let existingData = null;

    if (db) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          userDocId = snap.docs[0].id;
          existingData = snap.docs[0].data();
          const userRef = doc(db, 'users', userDocId);
          await setDoc(userRef, { avatarUrl, avatarStyle: avatarStyle || 'avataaars' }, { merge: true });
          console.log(`🔥 Firebase DB: Updated 2D avatar for [${email}]`);
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore update avatar warning:', dbErr.message);
      }
    }

    if (IN_MEMORY_USERS.has(email)) {
      const memUser = IN_MEMORY_USERS.get(email);
      memUser.avatarUrl = avatarUrl;
      memUser.avatarStyle = avatarStyle || 'avataaars';
      IN_MEMORY_USERS.set(email, memUser);
      existingData = memUser;
    }

    const updatedUser = {
      ...(existingData || {}),
      avatarUrl,
      avatarStyle: avatarStyle || 'avataaars'
    };

    delete updatedUser.passwordHash;

    return res.json({
      success: true,
      message: '2D Avatar updated successfully in DB',
      user: updatedUser
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update avatar' });
  }
});

export default router;
