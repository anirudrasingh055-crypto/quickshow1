import express from 'express';
import Show from '../models/Show.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// GET /api/shows?movieId=xxx - Get showtimes for a movie
router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;
    let query = { isActive: true };
    if (movieId) query.movie = movieId;

    const shows = await Show.find(query)
      .populate('movie', 'title poster_path runtime')
      .sort({ showDateTime: 1 });

    // Group by date for the frontend picker
    const grouped = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push({
        showId: show._id,
        time: show.showDateTime.toISOString(),
        price: show.showPrice,
        availableSeats: show.totalSeats - show.occupiedSeats.size,
      });
    });

    res.json({ success: true, shows, grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/shows/:id - Get show details with occupied seats
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, show });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shows - Create show (Admin only)
router.post('/', requireAuth(), async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json({ success: true, show });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
