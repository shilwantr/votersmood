import express from 'express';
import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, increment } from 'firebase/firestore';
import { verifyAuthToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

let IN_MEMORY_COMMENTS = [];

// GET /api/comments?postId=... - Fetch comments from Cloud Firestore DB
router.get('/', async (req, res) => {
  const { postId } = req.query;
  try {
    let comments = [];

    if (db && postId) {
      try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postId', '==', postId));
        const snap = await getDocs(q);
        comments = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            ...d,
            agreeCount: Math.max(0, d.agreeCount || 0),
            funnyCount: Math.max(0, d.funnyCount || 0)
          };
        });
        console.log(`🔥 Firestore DB: Retrieved ${comments.length} comments for post [${postId}]`);
      } catch (dbErr) {
        console.warn('⚠️ Firestore read comments warning:', dbErr.message);
      }
    }

    if (comments.length === 0) {
      comments = IN_MEMORY_COMMENTS.filter(c => !postId || c.postId === postId);
    }

    res.json(comments);
  } catch (error) {
    res.json(IN_MEMORY_COMMENTS.filter(c => !postId || c.postId === postId));
  }
});

// POST /api/comments - Create comment or reply in Cloud Firestore DB
router.post('/', verifyAuthToken, requireAuth, async (req, res) => {
  const { postId, parentId, content } = req.body;

  if (!postId || !content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Post ID and content are required' });
  }

  const maxChars = parentId ? 50 : 500;
  if (content.length > maxChars) {
    return res.status(400).json({ 
      error: `Comment exceeds character limit. Top-level insights allow max 500 chars, sub-comment replies allow max 50 chars.` 
    });
  }

  const newComment = {
    postId,
    parentId: parentId || null,
    content: content.trim(),
    authorId: req.user.uid,
    authorName: req.user.name || req.user.displayName || req.user.email?.split('@')[0].toUpperCase() || 'VERIFIED CITIZEN',
    isApproved: true,
    agreeCount: 0,
    funnyCount: 0,
    createdAt: Date.now(),
  };

  try {
    if (db) {
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      console.log(`🔥 Firestore DB: Successfully saved comment to database [ID: ${docRef.id}]`);
      
      // Atomically increment commentCount on post
      try {
        await updateDoc(doc(db, 'posts', postId), {
          commentCount: increment(1)
        });
      } catch (e) {}

      const savedComment = { id: docRef.id, ...newComment };
      IN_MEMORY_COMMENTS.push(savedComment);
      return res.status(201).json(savedComment);
    }

    const mockComment = { id: 'comment-' + Date.now(), ...newComment };
    IN_MEMORY_COMMENTS.push(mockComment);
    res.status(201).json(mockComment);
  } catch (error) {
    console.error('⚠️ Firestore comment write error:', error);
    const mockComment = { id: 'comment-' + Date.now(), ...newComment };
    IN_MEMORY_COMMENTS.push(mockComment);
    res.status(201).json(mockComment);
  }
});

// DELETE /api/comments/:id - Delete comment from Cloud Firestore DB
router.delete('/:id', verifyAuthToken, requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    if (db) {
      await deleteDoc(doc(db, 'comments', id));
      console.log(`🔥 Firestore DB: Deleted comment [ID: ${id}]`);
    }
    IN_MEMORY_COMMENTS = IN_MEMORY_COMMENTS.filter(c => c.id !== id);
    res.json({ success: true, id });
  } catch (e) {
    IN_MEMORY_COMMENTS = IN_MEMORY_COMMENTS.filter(c => c.id !== id);
    res.json({ success: true, id });
  }
});

export default router;
