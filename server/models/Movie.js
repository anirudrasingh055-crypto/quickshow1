import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    overview: { type: String, required: true },
    tagline: { type: String, default: '' },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, default: '' },
    genres: [
      {
        id: { type: Number },
        name: { type: String },
      },
    ],
    release_date: { type: String },
    original_language: { type: String, default: 'en' },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    runtime: { type: Number }, // in minutes
    casts: [
      {
        name: { type: String },
        profile_path: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
