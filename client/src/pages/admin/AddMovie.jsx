import React, { useState } from 'react';
import { PlusCircleIcon, UploadIcon, CheckIcon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Science Fiction',
  'Thriller', 'Western', 'Family',
];

const AddMovie = () => {
  const [form, setForm] = useState({
    title: '',
    overview: '',
    tagline: '',
    poster_path: '',
    backdrop_path: '',
    release_date: '',
    runtime: '',
    original_language: 'en',
    vote_average: '',
    genres: [],
    showPrice: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGenre = (genre) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.overview || !form.poster_path) {
      toast.error('Please fill required fields');
      return;
    }
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitting(false);
    setSuccess(true);
    toast.success('Movie added successfully!');
    setTimeout(() => setSuccess(false), 3000);
    setForm({
      title: '', overview: '', tagline: '', poster_path: '',
      backdrop_path: '', release_date: '', runtime: '',
      original_language: 'en', vote_average: '', genres: [], showPrice: '',
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Movie</h1>
        <p className="text-white/40 text-sm mt-1">
          Fill in movie details. An email will be sent to all users on submission.
        </p>
      </div>

      {success && (
        <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 animate-fade-in">
          <CheckIcon size={18} className="text-green-400" />
          <span className="text-green-300 text-sm font-medium">
            Movie added! Background email job triggered via Inngest.
          </span>
        </div>
      )}

      <form id="add-movie-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Basic Info</h3>

          {/* Title */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
              Movie Title *
            </label>
            <input
              id="movie-title-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Interstellar"
              className="input-dark"
              required
            />
          </div>

          {/* Overview */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
              Overview / Description *
            </label>
            <textarea
              id="movie-overview-input"
              name="overview"
              value={form.overview}
              onChange={handleChange}
              rows={4}
              placeholder="A brief description of the movie..."
              className="input-dark resize-none"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Tagline</label>
            <input
              id="movie-tagline-input"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="A catchy tagline"
              className="input-dark"
            />
          </div>
        </div>

        {/* Media */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Media</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
                Poster URL *
              </label>
              <input
                id="movie-poster-input"
                name="poster_path"
                value={form.poster_path}
                onChange={handleChange}
                placeholder="https://..."
                className="input-dark"
                required
              />
              {form.poster_path && (
                <img
                  src={form.poster_path}
                  alt="Poster preview"
                  className="mt-2 w-20 h-28 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
                Backdrop URL
              </label>
              <input
                id="movie-backdrop-input"
                name="backdrop_path"
                value={form.backdrop_path}
                onChange={handleChange}
                placeholder="https://..."
                className="input-dark"
              />
              {form.backdrop_path && (
                <img
                  src={form.backdrop_path}
                  alt="Backdrop preview"
                  className="mt-2 w-full h-16 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Details</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Release Date</label>
              <input
                id="movie-release-date-input"
                type="date"
                name="release_date"
                value={form.release_date}
                onChange={handleChange}
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Runtime (min)</label>
              <input
                id="movie-runtime-input"
                type="number"
                name="runtime"
                value={form.runtime}
                onChange={handleChange}
                placeholder="120"
                className="input-dark"
                min="1"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Rating (0-10)</label>
              <input
                id="movie-rating-input"
                type="number"
                name="vote_average"
                value={form.vote_average}
                onChange={handleChange}
                placeholder="7.5"
                className="input-dark"
                min="0"
                max="10"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Language</label>
              <select
                id="movie-language-select"
                name="original_language"
                value={form.original_language}
                onChange={handleChange}
                className="input-dark cursor-pointer"
              >
                <option value="en" className="bg-[#111]">English</option>
                <option value="hi" className="bg-[#111]">Hindi</option>
                <option value="es" className="bg-[#111]">Spanish</option>
                <option value="fr" className="bg-[#111]">French</option>
                <option value="ko" className="bg-[#111]">Korean</option>
                <option value="ja" className="bg-[#111]">Japanese</option>
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Ticket Price ($)</label>
              <input
                id="movie-price-input"
                type="number"
                name="showPrice"
                value={form.showPrice}
                onChange={handleChange}
                placeholder="12"
                className="input-dark"
                min="1"
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">
              Genres ({form.genres.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  id={`genre-toggle-${genre.toLowerCase()}`}
                  onClick={() => toggleGenre(genre)}
                  className={`badge cursor-pointer transition-all ${
                    form.genres.includes(genre)
                      ? 'badge-primary'
                      : 'badge-ghost hover:border-white/30'
                  }`}
                >
                  {form.genres.includes(genre) && <CheckIcon size={9} className="mr-1" />}
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            id="add-movie-submit-btn"
            type="submit"
            disabled={submitting}
            className={`btn-primary py-3 px-8 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding Movie...
              </>
            ) : (
              <>
                <PlusCircleIcon size={18} />
                Add Movie
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary py-3 px-6"
            onClick={() => setForm({
              title: '', overview: '', tagline: '', poster_path: '',
              backdrop_path: '', release_date: '', runtime: '',
              original_language: 'en', vote_average: '', genres: [], showPrice: '',
            })}
          >
            <XIcon size={16} /> Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
