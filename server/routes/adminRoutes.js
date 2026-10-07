import express from 'express';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { requireAuth, getAuth } from '@clerk/express';

const router = express.Router();

// Middleware: check admin role
const requireAdmin = async (req, res, next) => {
  const { userId: clerkId } = getAuth(req);
  const user = await User.findOne({ clerkId });
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  req.adminUser = user;
  next();
};

// GET /api/admin/dashboard - Dashboard stats
router.get('/dashboard', requireAuth(), requireAdmin, async (req, res) => {
  try {
    const [totalBookings, totalUser, movies, bookings] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Movie.countDocuments({ isActive: true }),
      Booking.find({ isPaid: true }),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

    const activeShows = await Show.find({ isActive: true, showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 })
      .limit(10);

    res.json({ success: true, totalBookings, totalRevenue, totalUser, activeShows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
