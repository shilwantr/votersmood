import express from 'express';
import { verifyAuthToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', verifyAuthToken, requireAdmin, (req, res) => {
  res.json({
    totalUsers: 1420,
    totalPosts: 890,
    activePolls: 24,
    pendingModeration: 3
  });
});

// GET /api/admin/config
router.get('/config', (req, res) => {
  res.json({
    imagePostingEnabled: true,
    commentModerationEnabled: true,
    pollCreationEnabled: true,
    electionStates: ['MH', 'UP']
  });
});

export default router;
