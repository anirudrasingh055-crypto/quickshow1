import express from 'express';
import Movie from '../models/Movie.js';
import { inngest } from '../inngest/client.js';
import User from '../models/User.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// GET /api/movies - List all active movies
router.get('/', async (req, res) => {
  try {
    const { genre, search, sort } = req.query;
    let query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query['genres.name'] = genre;
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'rating-desc') sortObj = { vote_average: -1 };
    if (sort === 'rating-asc') sortObj = { vote_average: 1 };
    if (sort === 'newest') sortObj = { release_date: -1 };

    const movies = await Movie.find(query).sort(sortObj);
    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/movies/:id - Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/movies - Add new movie (Admin only)
router.post('/', requireAuth(), async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    // Trigger Inngest: send email to all users
    const users = await User.find({ role: 'user' }, 'email name');
    await inngest.send({
      name: 'quickshow/movie.added',
      data: { movie: movie.toObject(), users },
    });

    res.status(201).json({ success: true, movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/movies/:id - Update movie (Admin only)
router.put('/:id', requireAuth(), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/movies/:id - Delete movie (Admin only)
router.delete('/:id', requireAuth(), async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Movie deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
