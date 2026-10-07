import express from 'express';
import User from '../models/User.js';
import { requireAuth, getAuth } from '@clerk/express';

const router = express.Router();

// GET /api/users/me - Get current user profile
router.get('/me', requireAuth(), async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/favorites/:movieId - Toggle favorite
router.post('/favorites/:movieId', requireAuth(), async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { movieId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const idx = user.favorites.indexOf(movieId);
    if (idx === -1) {
      user.favorites.push(movieId);
    } else {
      user.favorites.splice(idx, 1);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
