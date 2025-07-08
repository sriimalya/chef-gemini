import express from "express";
import verifyToken from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
