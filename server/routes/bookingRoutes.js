import express from 'express';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { inngest } from '../inngest/client.js';
import { requireAuth, getAuth } from '@clerk/express';

const router = express.Router();

// POST /api/bookings - Create a new booking (reserve seats)
router.post('/', requireAuth(), async (req, res) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { showId, seats } = req.body;
    const { userId: clerkId } = getAuth(req);

    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Show and seats are required' });
    }

    const show = await Show.findById(showId).session(session);
    if (!show) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Check if any seat is already occupied
    for (const seat of seats) {
      if (show.occupiedSeats.has(seat)) {
        await session.abortTransaction();
        return res.status(409).json({
          success: false,
          message: `Seat ${seat} is already taken. Please choose a different seat.`,
        });
      }
    }

    // Find user
    const user = await User.findOne({ clerkId }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate amount
    const amount = seats.length * show.showPrice;

    // Reserve seats on the show
    seats.forEach((seat) => {
      show.occupiedSeats.set(seat, clerkId);
    });
    await show.save({ session });

    // Create booking in pending state
    const booking = new Booking({
      user: user._id,
      show: showId,
      bookedSeats: seats,
      amount,
      isPaid: false,
      reservedUntil: new Date(Date.now() + 10 * 60 * 1000),
    });
    await booking.save({ session });

    await session.commitTransaction();

    // Trigger Inngest: 10-min seat release function
    await inngest.send({
      name: 'quickshow/booking.created',
      data: {
        bookingId: booking._id,
        showId,
        seats,
      },
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
});

// POST /api/bookings/:id/confirm - Confirm payment
router.post('/:id/confirm', requireAuth(), async (req, res) => {
  try {
    const { paymentId } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'show', populate: { path: 'movie' } })
      .populate('user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.isPaid = true;
    booking.paymentId = paymentId;
    booking.status = 'confirmed';
    await booking.save();

    // Trigger booking confirmation + reminder email
    await inngest.send({
      name: 'quickshow/booking.confirmed',
      data: {
        booking: booking.toObject(),
        user: booking.user,
        movie: booking.show.movie,
        showTime: booking.show.showDateTime,
      },
    });

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my - Get current user's bookings
router.get('/my', requireAuth(), async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate({
        path: 'show',
        populate: { path: 'movie', select: 'title poster_path genres backdrop_path' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings - All bookings (Admin only)
router.get('/', requireAuth(), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: { path: 'movie', select: 'title poster_path' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
