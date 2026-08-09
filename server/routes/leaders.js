import express from 'express';
import { db } from '../config/firebase.js';
import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { verifyAuthToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

export let LEADERS_CACHE = [
  {
    id: 'rahul-gandhi',
    name: 'Rahul Gandhi',
    party: 'INC',
    state: 'UP',
    constituency: 'Rae Bareli',
    type: 'MP_LS',
    chamber: 'Lok Sabha',
    portfolio: 'Leader of Opposition, Lok Sabha',
    portfolios: ['External Affairs', 'Defense'],
    governmentPositions: ['Leader of Opposition'],
    status: 'Active',
    gender: 'Male',
    seatType: 'General',
    agreeCount: 18900,
    funnyCount: 1420,
    openQuestionsCount: 38,
    answeredCount: 10,
    pendingCount: 28,
    totalReactionsCount: 6210,
    totalCommentsCount: 1890
  },
  {
    id: 'mamata-banerjee',
    name: 'Mamata Banerjee',
    party: 'TMC',
    state: 'WB',
    constituency: 'Bhabanipur',
    type: 'MLA',
    chamber: 'Vidhan Sabha',
    portfolio: 'Chief Minister, West Bengal',
    portfolios: ['Home Affairs', 'Health', 'Land & Land Reforms'],
    governmentPositions: ['Chief Minister'],
    status: 'Active',
    gender: 'Female',
    seatType: 'General',
    agreeCount: 15400,
    funnyCount: 1120,
    openQuestionsCount: 29,
    answeredCount: 7,
    pendingCount: 22,
    totalReactionsCount: 4890,
    totalCommentsCount: 1150
  },
  {
    id: 'devendra-fadnavis',
    name: 'Devendra Fadnavis',
    party: 'BJP',
    state: 'MH',
    constituency: 'Nagpur South West',
    type: 'MLA',
    chamber: 'Vidhan Sabha',
    portfolio: 'Deputy Chief Minister, Home & Energy Affairs',
    portfolios: ['Home Affairs', 'Energy', 'Housing'],
    governmentPositions: ['Deputy Chief Minister'],
    status: 'Active',
    gender: 'Male',
    seatType: 'General',
    agreeCount: 12400,
    funnyCount: 840,
    openQuestionsCount: 25,
    answeredCount: 6,
    pendingCount: 19,
    totalReactionsCount: 4382,
    totalCommentsCount: 1245
  },
  {
    id: 'akhilesh-yadav',
    name: 'Akhilesh Yadav',
    party: 'SP',
    state: 'UP',
    constituency: 'Kannauj',
    type: 'MP_LS',
    chamber: 'Lok Sabha',
    portfolio: 'National President, Samajwadi Party',
    portfolios: ['Rural Development', 'Agriculture'],
    governmentPositions: ['Party President'],
    status: 'Active',
    gender: 'Male',
    seatType: 'General',
    agreeCount: 11200,
    funnyCount: 910,
    openQuestionsCount: 21,
    answeredCount: 4,
    pendingCount: 17,
    totalReactionsCount: 3890,
    totalCommentsCount: 810
  },
  {
    id: 'nitin-gadkari',
    name: 'Nitin Gadkari',
    party: 'BJP',
    state: 'MH',
    constituency: 'Nagpur',
    type: 'MP_LS',
    chamber: 'Lok Sabha',
    portfolio: 'Union Minister of Road Transport & Highways',
    portfolios: ['Road Transport', 'Highways', 'MSME'],
    governmentPositions: ['Cabinet Minister'],
    status: 'Active',
    gender: 'Male',
    seatType: 'General',
    agreeCount: 24100,
    funnyCount: 320,
    openQuestionsCount: 19,
    answeredCount: 8,
    pendingCount: 11,
    totalReactionsCount: 5120,
    totalCommentsCount: 980
  },
  {
    id: 'shashi-tharoor',
    name: 'Shashi Tharoor',
    party: 'INC',
    state: 'KL',
    constituency: 'Thiruvananthapuram',
    type: 'MP_LS',
    chamber: 'Lok Sabha',
    portfolio: 'Chairman, Parliamentary Standing Committee',
    portfolios: ['External Affairs', 'IT', 'Education'],
    governmentPositions: ['Committee Chairman'],
    status: 'Active',
    gender: 'Male',
    seatType: 'General',
    agreeCount: 9800,
    funnyCount: 450,
    openQuestionsCount: 15,
    answeredCount: 5,
    pendingCount: 10,
    totalReactionsCount: 3100,
    totalCommentsCount: 640
  }
];

// Seed default leader profiles to Cloud Firestore DB
const seedDefaultLeaders = async () => {
  if (!db) return;
  try {
    for (const leader of LEADERS_CACHE) {
      const leaderRef = doc(db, 'leaders', leader.id);
      const snap = await getDoc(leaderRef);
      if (!snap.exists()) {
        await setDoc(leaderRef, leader);
        console.log(`🔥 Firestore DB: Seeded default leader profile [ID: ${leader.id}]`);
      }
    }
  } catch (e) {
    console.warn('⚠️ Firestore seed leaders warning:', e.message);
  }
};

seedDefaultLeaders();

// Helper to atomically update open questions count on leader documents
export const incrementLeaderQuestionCounts = async (leaderId, delta = 1) => {
  if (!leaderId) return;

  const targetId = leaderId.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  
  // Update in-memory cache
  const leader = LEADERS_CACHE.find(l => l.id === targetId || l.id === leaderId);
  if (leader) {
    leader.openQuestionsCount = Math.max(0, (leader.openQuestionsCount || 0) + delta);
    leader.pendingCount = Math.max(0, (leader.pendingCount || 0) + delta);
  }

  // Update Cloud Firestore DB
  if (db) {
    try {
      const leaderRef = doc(db, 'leaders', targetId);
      const snap = await getDoc(leaderRef);
      if (snap.exists()) {
        const curOpen = snap.data().openQuestionsCount || 0;
        const curPending = snap.data().pendingCount || 0;
        const updatedOpen = Math.max(0, curOpen + delta);
        const updatedPending = Math.max(0, curPending + delta);

        await setDoc(leaderRef, {
          openQuestionsCount: updatedOpen,
          pendingCount: updatedPending
        }, { merge: true });
        console.log(`🔥 Firestore DB: Updated openQuestionsCount for leader [${targetId}] to ${updatedOpen}`);
      }
    } catch (e) {
      console.warn('⚠️ Leader open questions count update warning:', e.message);
    }
  }
};

// Async Sync from Cloud Firestore DB
const syncLeadersFromDB = async () => {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'leaders'));
      if (snap.docs.length > 0) {
        LEADERS_CACHE = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        console.log(`🔥 Firestore DB: Synchronized ${LEADERS_CACHE.length} leader profiles from database`);
      }
    } catch (e) {
      console.warn('⚠️ Firestore leaders sync warning:', e.message);
    }
  }
};

// GET /api/leaders (Live Database Query, Ranking & Dynamic Filtering)
router.get('/', async (req, res) => {
  const { state, party, type, search, page, limit, sort } = req.query;
  
  if (db) {
    await syncLeadersFromDB();
  }

  let filtered = [...LEADERS_CACHE];

  if (state) {
    filtered = filtered.filter(l => l.state === state);
  }
  if (party) {
    filtered = filtered.filter(l => l.party === party);
  }
  if (type) {
    filtered = filtered.filter(l => l.type === type || l.repType === type);
  }
  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) || 
      (l.constituency && l.constituency.toLowerCase().includes(q)) || 
      (l.portfolio && l.portfolio.toLowerCase().includes(q)) ||
      (l.portfolios && Array.isArray(l.portfolios) && l.portfolios.some(p => p.toLowerCase().includes(q)))
    );
  }

  // Sort logic - Rank by openQuestionsCount descending
  if (sort === 'openQuestions' || !sort) {
    filtered.sort((a, b) => (b.openQuestionsCount || 0) - (a.openQuestionsCount || 0));
  } else if (sort === 'supported') {
    filtered.sort((a, b) => (b.agreeCount || 0) - (a.agreeCount || 0));
  }

  const total = filtered.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || (sort === 'openQuestions' ? 5 : 6);

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedLeaders = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  if (page || limit) {
    return res.json({
      leaders: paginatedLeaders,
      total,
      hasMore,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  }

  res.json(filtered);
});

// GET /api/leaders/:id (Instant Server Lookup)
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'leaders', id));
      if (snap.exists()) {
        return res.json({ id: snap.id, ...snap.data() });
      }
    } catch (e) {}
  }

  const leader = LEADERS_CACHE.find(l => l.id === id);
  if (!leader) {
    return res.json({
      id: id,
      name: id.replace(/-/g, ' ').toUpperCase(),
      party: 'INDEPENDENT',
      state: 'MH',
      constituency: 'Constituency Registry',
      type: 'MLA',
      portfolio: 'Elected Representative',
      agreeCount: 0,
      funnyCount: 0,
      openQuestionsCount: 0,
      answeredCount: 0,
      pendingCount: 0,
      totalReactionsCount: 0,
      totalCommentsCount: 0
    });
  }
  res.json(leader);
});

// POST /api/leaders - Dynamic Add Representative (Persisted & Merged in Firestore DB)
router.post('/', verifyAuthToken, requireAdmin, async (req, res) => {
  const data = req.body;
  if (!data.name || data.name.trim() === '') {
    return res.status(400).json({ error: 'Representative Name is required' });
  }

  const id = data.id || data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  
  const newLeader = {
    id,
    name: data.name.trim(),
    displayName: data.displayName || data.name,
    party: data.party || 'INDEPENDENT',
    state: data.state || 'MH',
    constituency: data.constituency || 'State Wide',
    type: data.type || 'MLA',
    chamber: data.chamber || (data.type === 'MP_LS' ? 'Lok Sabha' : data.type === 'MP_RS' ? 'Rajya Sabha' : data.type === 'MLC' ? 'Vidhan Parishad' : 'Vidhan Sabha'),
    
    gender: data.gender || 'Male',
    dob: data.dob || '',
    email: data.email || '',
    phone: data.phone || '',
    website: data.website || '',
    biography: data.biography || '',
    profilePhoto: data.profilePhoto || '',
    status: data.status || 'Active',
    verificationStatus: data.verificationStatus || 'Verified',

    seatType: data.seatType || 'General',
    electionMethod: data.electionMethod || 'Elected',
    nominatedBy: data.nominatedBy || '',
    mlcCategory: data.mlcCategory || '',
    termStart: data.termStart || '',
    termEnd: data.termEnd || '',
    electionYear: data.electionYear || '2024',

    governmentPositions: data.governmentPositions || [],
    portfolios: data.portfolios || (data.portfolio ? [data.portfolio] : ['Elected Representative']),
    committees: data.committees || [],
    portfolio: (data.portfolios && data.portfolios.length > 0) ? data.portfolios.join(', ') : (data.portfolio || 'Elected Representative'),

    agreeCount: data.agreeCount || 0,
    funnyCount: data.funnyCount || 0,
    openQuestionsCount: data.openQuestionsCount || 0,
    answeredCount: data.answeredCount || 0,
    pendingCount: data.pendingCount || 0,
    totalReactionsCount: data.totalReactionsCount || 0,
    totalCommentsCount: data.totalCommentsCount || 0,
    createdAt: Date.now(),
  };

  try {
    if (db) {
      await setDoc(doc(db, 'leaders', id), newLeader, { merge: true });
      console.log(`🔥 Firestore DB: Successfully persisted new representative [ID: ${id}]`);
    }
  } catch (e) {
    console.warn('⚠️ Firestore leaders write warning:', e.message);
  }

  // Update in-memory cache
  const idx = LEADERS_CACHE.findIndex(l => l.id === id);
  if (idx !== -1) {
    LEADERS_CACHE[idx] = newLeader;
  } else {
    LEADERS_CACHE.unshift(newLeader);
  }

  res.status(201).json(newLeader);
});

// PUT /api/leaders/:id - Update Representative Profile (Persisted & Merged in Firestore DB)
router.put('/:id', verifyAuthToken, requireAdmin, async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const updatedLeader = {
    ...data,
    id,
    portfolio: (data.portfolios && data.portfolios.length > 0) ? data.portfolios.join(', ') : (data.portfolio || 'Elected Representative')
  };

  try {
    if (db) {
      await setDoc(doc(db, 'leaders', id), updatedLeader, { merge: true });
      console.log(`🔥 Firestore DB: Successfully updated representative profile [ID: ${id}]`);
    }
  } catch (e) {
    console.warn('⚠️ Firestore leaders update warning:', e.message);
  }

  const idx = LEADERS_CACHE.findIndex(l => l.id === id);
  if (idx !== -1) {
    LEADERS_CACHE[idx] = { ...LEADERS_CACHE[idx], ...updatedLeader };
  } else {
    LEADERS_CACHE.unshift(updatedLeader);
  }

  res.json({ success: true, id, leader: updatedLeader });
});

// DELETE /api/leaders/:id - Delete Representative Profile from Cloud Firestore DB
router.delete('/:id', verifyAuthToken, requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    if (db) {
      await deleteDoc(doc(db, 'leaders', id));
      console.log(`🔥 Firestore DB: Successfully deleted leader profile [ID: ${id}]`);
    }
  } catch (e) {
    console.warn('⚠️ Firestore leaders delete warning:', e.message);
  }

  LEADERS_CACHE = LEADERS_CACHE.filter(l => l.id !== id);
  res.json({ success: true, id });
});

export default router;
