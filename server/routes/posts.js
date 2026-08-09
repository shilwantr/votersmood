import express from 'express';
import { db } from '../config/firebase.js';
import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { verifyAuthToken, requireAuth, requireAdmin } from '../middleware/auth.js';
import { incrementLeaderQuestionCounts } from './leaders.js';

const router = express.Router();

let IN_MEMORY_POSTS = [];

// GET /api/posts - Fetch all posts from Cloud Firestore DB (Sorted by Total Reactions score when requested)
router.get('/', async (req, res) => {
  const { topic, leader, leaderId, isOpenQuestion, category, sort } = req.query;

  try {
    let posts = [];

    if (db) {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        posts = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            ...d,
            agreeCount: Math.max(0, d.agreeCount || 0),
            funnyCount: Math.max(0, d.funnyCount || 0),
            commentCount: Math.max(0, d.commentCount || 0)
          };
        });
        console.log(`🔥 Firestore DB: Retrieved ${posts.length} posts from database`);
      } catch (dbErr) {
        console.warn('⚠️ Firestore read posts warning:', dbErr.message);
      }
    }

    if (posts.length === 0) {
      posts = IN_MEMORY_POSTS;
    }

    let filtered = posts;

    if (leaderId) {
      filtered = filtered.filter(p => p.targetLeaderId === leaderId || (p.leaderTag || '').toLowerCase().includes(leaderId.toLowerCase()));
    }

    if (isOpenQuestion === 'true') {
      filtered = filtered.filter(p => p.isOpenQuestion === true);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.questionCategory === category);
    }

    if (topic) {
      const qTopic = topic.replace(/^#/, '').toLowerCase();
      filtered = filtered.filter(p => (p.topicTag || '').toLowerCase().includes(qTopic));
    }

    if (leader && !leaderId) {
      const qLeader = leader.toLowerCase();
      filtered = filtered.filter(p => (p.leaderTag || '').toLowerCase().includes(qLeader));
    }

    // Sort logic - Strictly sort by total reaction volume (agreeCount + funnyCount)
    if (sort === 'supported' || sort === 'reactions' || sort === 'trending') {
      filtered.sort((a, b) => {
        const scoreA = (a.agreeCount || 0) + (a.funnyCount || 0);
        const scoreB = (b.agreeCount || 0) + (b.funnyCount || 0);
        return scoreB - scoreA;
      });
    } else if (sort === 'discussed') {
      filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else if (sort === 'unanswered') {
      filtered = filtered.filter(p => p.responseStatus === 'pending');
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    }

    res.json(filtered);
  } catch (error) {
    res.json(IN_MEMORY_POSTS);
  }
});

// POST /api/posts - Publish Insight / Open Question to Cloud Firestore DB
router.post('/', verifyAuthToken, requireAuth, async (req, res) => {
  const { content, leaderTag, topicTag, poll, isOpenQuestion, targetLeaderId, targetLeaderName, questionCategory } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (content.length > 500) {
    return res.status(400).json({ error: 'Post insight exceeds maximum 500 character limit' });
  }

  let formattedPoll = null;
  if (poll && poll.question && Array.isArray(poll.options) && poll.options.length >= 2) {
    formattedPoll = {
      id: 'poll-post-' + Date.now(),
      question: poll.question.trim(),
      options: poll.options.map((opt, i) => ({
        id: `opt-${i}`,
        text: typeof opt === 'string' ? opt.trim() : opt.text,
        votes: 0
      })),
      totalVotes: 0,
      residentVotes: 0,
      nonResidentVotes: 0,
    };
  }

  const effectiveLeaderId = targetLeaderId || (isOpenQuestion ? 'devendra-fadnavis' : null);

  const newPost = {
    content: content.trim(),
    authorId: req.user.uid,
    authorName: req.user.name || req.user.displayName || req.user.email?.split('@')[0].toUpperCase() || 'VERIFIED CITIZEN',
    authorAvatar: req.user.picture || '',
    isVerified: true,
    isOpenQuestion: !!isOpenQuestion,
    targetLeaderId: effectiveLeaderId,
    targetLeaderName: targetLeaderName || (isOpenQuestion ? 'Devendra Fadnavis (MLA)' : null),
    questionCategory: questionCategory || 'General Infrastructure',
    responseStatus: isOpenQuestion ? 'pending' : null,
    officialResponse: null,
    leaderTag: leaderTag || (targetLeaderName ? targetLeaderName.toUpperCase() : 'DEVENDRA FADNAVIS (MLA)'),
    topicTag: (topicTag || 'MAHARASHTRAELECTIONS2026').replace(/^#/, '').toUpperCase(),
    poll: formattedPoll,
    agreeCount: 0,
    funnyCount: 0,
    commentCount: 0,
    isApproved: true,
    createdAt: Date.now(),
  };

  try {
    if (db) {
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log(`🔥 Firestore DB: Successfully saved new post to database [ID: ${docRef.id}]`);
      
      // If post is an open question to a leader, increment leader's openQuestionsCount & pendingCount
      if (isOpenQuestion && effectiveLeaderId) {
        await incrementLeaderQuestionCounts(effectiveLeaderId, 1);
      }

      const savedPost = { id: docRef.id, ...newPost };
      IN_MEMORY_POSTS.unshift(savedPost);
      return res.status(201).json(savedPost);
    }
    
    if (isOpenQuestion && effectiveLeaderId) {
      await incrementLeaderQuestionCounts(effectiveLeaderId, 1);
    }

    const mockPost = { id: 'post-' + Date.now(), ...newPost };
    IN_MEMORY_POSTS.unshift(mockPost);
    res.status(201).json(mockPost);
  } catch (error) {
    console.error('⚠️ Firestore post write error:', error);
    const mockPost = { id: 'post-' + Date.now(), ...newPost };
    IN_MEMORY_POSTS.unshift(mockPost);
    res.status(201).json(mockPost);
  }
});

// DELETE /api/posts/:id - Delete Post from Cloud Firestore DB
router.delete('/:id', verifyAuthToken, requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    let targetPost = IN_MEMORY_POSTS.find(p => p.id === id);

    if (db) {
      const postRef = doc(db, 'posts', id);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        targetPost = snap.data();
      }
      await deleteDoc(postRef);
      console.log(`🔥 Firestore DB: Deleted post [ID: ${id}]`);
    }

    if (targetPost && targetPost.isOpenQuestion && targetPost.targetLeaderId) {
      await incrementLeaderQuestionCounts(targetPost.targetLeaderId, -1);
    }

    IN_MEMORY_POSTS = IN_MEMORY_POSTS.filter(p => p.id !== id);
    res.json({ success: true, id });
  } catch (e) {
    IN_MEMORY_POSTS = IN_MEMORY_POSTS.filter(p => p.id !== id);
    res.json({ success: true, id });
  }
});

export default router;
