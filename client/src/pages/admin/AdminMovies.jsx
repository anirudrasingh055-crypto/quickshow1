import React, { useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import { SearchIcon, TrashIcon, EditIcon, StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminMovies = () => {
  const [movies, setMovies] = useState(dummyShowsData);
  const [search, setSearch] = useState('');

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this movie?')) {
      setMovies((prev) => prev.filter((m) => m._id !== id && String(m.id) !== id));
      toast.success('Movie removed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Movies</h1>
          <p className="text-white/40 text-sm mt-1">{movies.length} movies in the database</p>
        </div>
        <Link to="/admin/add-movie" id="go-to-add-movie-btn" className="btn-primary text-sm py-2.5">
          + Add New Movie
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          id="admin-movies-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="input-dark pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Genre</th>
              <th>Release</th>
              <th>Rating</th>
              <th>Runtime</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((movie) => (
              <tr key={movie._id || movie.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-9 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{movie.title}</p>
                      <p className="text-white/30 text-xs uppercase">{movie.original_language}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres?.slice(0, 2).map((g) => (
                      <span key={g.id} className="badge badge-ghost text-[10px]">{g.name}</span>
                    ))}
                  </div>
                </td>
                <td className="text-sm">
                  {movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  }) : 'N/A'}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <StarIcon size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </td>
                <td className="text-sm text-white/60">
                  {movie.runtime ? `${movie.runtime}m` : 'N/A'}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/movie/${movie._id || movie.id}`}
                      id={`view-movie-${movie._id || movie.id}`}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white transition-all"
                    >
                      <EditIcon size={13} />
                    </Link>
                    <button
                      id={`delete-movie-${movie._id || movie.id}`}
                      onClick={() => handleDelete(movie._id || String(movie.id))}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <p>No movies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovies;
