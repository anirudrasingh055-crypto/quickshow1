import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon, CalendarIcon } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const genre = movie.genres?.[0]?.name || '';

  return (
    <div
      className="movie-card group"
      onClick={onClick}
      id={`movie-card-${movie._id || movie.id}`}
    >
      {/* Poster */}
      <div className="relative img-zoom-wrap aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="img-zoom w-full h-full object-cover"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          <Link
            to={`/movie/${movie._id || movie.id}`}
            className="btn-primary text-xs py-2 px-4 text-center w-full justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            Book Now
          </Link>
        </div>
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
          <StarIcon size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">{rating}</span>
        </div>
        {/* Genre badge */}
        {genre && (
          <div className="absolute top-3 right-3 badge badge-primary text-[10px]">
            {genre}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-white line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-white/40 text-xs">
          <div className="flex items-center gap-1">
            <CalendarIcon size={11} />
            <span>{year}</span>
          </div>
          {runtime && (
            <div className="flex items-center gap-1">
              <ClockIcon size={11} />
              <span>{runtime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
