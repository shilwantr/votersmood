import express from 'express';
import { db } from '../config/firebase.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { verifyAuthToken, requireAuth } from '../middleware/auth.js';
import { LEADERS_CACHE } from './leaders.js';

const router = express.Router();

// GET /api/reactions/user-reactions - Fetch active reactions cast by the authenticated user in Cloud Firestore DB
router.get('/user-reactions', verifyAuthToken, requireAuth, async (req, res) => {
  const userId = req.user.uid;
  try {
    const userReactions = {};
    if (db) {
      try {
        const snap = await getDocs(query(collection(db, 'reactions'), where('userId', '==', userId), where('active', '==', true)));
        snap.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.targetId && data.reactionType) {
            if (!userReactions[data.targetId]) {
              userReactions[data.targetId] = {};
            }
            userReactions[data.targetId][data.reactionType] = true;
          }
        });
      } catch (e) {
        console.warn('⚠️ Firestore read user reactions warning:', e.message);
      }
    }
    res.json({ success: true, userId, userReactions });
  } catch (error) {
    res.json({ success: true, userId, userReactions: {} });
  }
});

// POST /api/reactions - Toggle agree or funny reaction on posts, leaders, or comments (Persisted to Cloud Firestore DB)
router.post('/', verifyAuthToken, requireAuth, async (req, res) => {
  const { targetId, targetType, reactionType } = req.body;

  if (!targetId || !reactionType) {
    return res.status(400).json({ error: 'Target ID and reaction type are required' });
  }

  const userId = req.user.uid;
  const reactionDocId = `${userId}_${targetId}_${reactionType}`;

  try {
    let toggled = true;
    let newCount = 0;

    const targetCollection = targetType === 'leader' ? 'leaders' : targetType === 'comment' ? 'comments' : 'posts';
    const fieldName = reactionType === 'funny' ? 'funnyCount' : 'agreeCount';

    if (db) {
      const reactionRef = doc(db, 'reactions', reactionDocId);
      const snap = await getDoc(reactionRef);

      const targetRef = doc(db, targetCollection, targetId);
      const targetSnap = await getDoc(targetRef);
      const currentVal = targetSnap.exists() ? (targetSnap.data()[fieldName] || 0) : 0;

      if (snap.exists() && snap.data().active) {
        // Toggle OFF (remove reaction)
        await setDoc(reactionRef, { active: false }, { merge: true });
        toggled = false;
        newCount = Math.max(0, currentVal - 1);
        try {
          await setDoc(targetRef, { [fieldName]: newCount }, { merge: true });
        } catch (e) {}
      } else {
        // Toggle ON (add reaction)
        await setDoc(reactionRef, {
          userId,
          targetId,
          targetType: targetType || 'post',
          reactionType,
          active: true,
          createdAt: Date.now()
        }, { merge: true });
        toggled = true;
        newCount = Math.max(0, currentVal + 1);
        try {
          await setDoc(targetRef, { [fieldName]: newCount }, { merge: true });
        } catch (e) {}
      }
      console.log(`🔥 Firestore DB: Toggled reaction [${reactionType}] on ${targetType} [${targetId}] (Toggled: ${toggled}, New Count: ${newCount})`);
    }

    // Sync in-memory cache for leaders
    if (targetType === 'leader') {
      const leader = LEADERS_CACHE.find(l => l.id === targetId);
      if (leader) {
        leader[fieldName] = newCount;
      }
    }

    res.json({
      success: true,
      userId,
      targetId,
      reactionType,
      toggled,
      newCount
    });
  } catch (error) {
    console.error('⚠️ Reaction toggle error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
