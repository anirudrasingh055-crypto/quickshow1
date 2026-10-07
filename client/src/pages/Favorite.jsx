import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../component/MovieCard';
import { HeartIcon, SearchIcon, XIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Favorite = () => {
  const { isSignedIn } = useUser();
  const [search, setSearch] = useState('');

  // For demo: first 3 movies are favorited
  const favoriteMovies = dummyShowsData
    .slice(0, 4)
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <HeartIcon size={36} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your Favorites</h2>
          <p className="text-white/50 text-sm mb-6">
            Sign in to save and view your favorite movies.
          </p>
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 md:px-10 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <HeartIcon size={30} className="text-primary fill-primary" />
            My Favorites
          </h1>
          <p className="text-white/50 mt-1">{favoriteMovies.length} saved movies</p>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="favorites-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorites..."
            className="input-dark pl-9 text-sm"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              onClick={() => setSearch('')}
            >
              <XIcon size={12} />
            </button>
          )}
        </div>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {search ? 'No matches found' : 'No favorites yet'}
          </h3>
          <p className="text-white/40 text-sm mb-6">
            {search ? 'Try a different search' : 'Start adding movies you love!'}
          </p>
          <Link to="/movies" className="btn-primary text-sm py-2.5">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteMovies.map((movie, i) => (
            <div
              key={movie._id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <MovieCard movie={movie} onClick={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
