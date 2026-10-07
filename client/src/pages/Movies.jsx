import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../component/MovieCard';
import { SearchIcon, SlidersHorizontalIcon, XIcon, FilterIcon } from 'lucide-react';

const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Science Fiction', 'Thriller', 'Family'];
const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Rating: High to Low', value: 'rating-desc' },
  { label: 'Rating: Low to High', value: 'rating-asc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
];

const Movies = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMovies = dummyShowsData
    .filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre =
        selectedGenre === 'All' || m.genres?.some((g) => g.name === selectedGenre);
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating-desc') return b.vote_average - a.vote_average;
      if (sortBy === 'rating-asc') return a.vote_average - b.vote_average;
      if (sortBy === 'newest') return new Date(b.release_date) - new Date(a.release_date);
      if (sortBy === 'oldest') return new Date(a.release_date) - new Date(b.release_date);
      return b.vote_count - a.vote_count; // popular
    });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 md:px-10 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
        <p className="text-white/50">
          Explore {dummyShowsData.length}+ movies — find your next adventure
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
        {/* Search */}
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="movies-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="input-dark pl-10 text-sm"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              onClick={() => setSearch('')}
            >
              <XIcon size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          id="movies-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-dark sm:w-52 text-sm cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Filter toggle (mobile) */}
        <button
          className="sm:hidden btn-secondary text-sm py-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Genres */}
        <aside className={`flex-shrink-0 w-48 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="glass rounded-2xl p-4 sticky top-28">
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Genre</h3>
            <div className="flex flex-col gap-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  id={`genre-filter-${genre.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => setSelectedGenre(genre)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedGenre === genre
                      ? 'bg-primary text-white font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Movies grid */}
        <div className="flex-1">
          {filteredMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">No movies found</h3>
              <p className="text-white/40 text-sm">Try adjusting your search or filters</p>
              <button
                className="btn-secondary mt-4 text-sm py-2"
                onClick={() => { setSearch(''); setSelectedGenre('All'); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-white/40 text-sm mb-5">
                Showing <span className="text-white">{filteredMovies.length}</span> results
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMovies.map((movie, i) => (
                  <div
                    key={movie._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
                  >
                    <MovieCard
                      movie={movie}
                      onClick={() => navigate(`/movie/${movie._id}`)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
