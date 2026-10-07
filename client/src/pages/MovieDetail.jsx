import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import {
  StarIcon, ClockIcon, CalendarIcon, HeartIcon,
  PlayIcon, TicketIcon, ChevronRightIcon, UserIcon
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import SignInModal from '../component/SignInModal';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (timeStr) => {
  const d = new Date(timeStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const movie = dummyShowsData.find((m) => m._id === id || String(m.id) === id);

  const dateTimeEntries = Object.entries(dummyDateTimeData);

  useEffect(() => {
    if (dateTimeEntries.length > 0) {
      setSelectedDate(dateTimeEntries[0][0]);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
          <button className="btn-primary mt-4" onClick={() => navigate('/movies')}>
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  const rating = movie.vote_average?.toFixed(1);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  const handleBookNow = () => {
    if (!selectedShow) return;
    if (!isSignedIn) return;
    navigate(`/seat-layout`, {
      state: { movie, showId: selectedShow.showId, showTime: selectedShow.time },
    });
  };

  return (
    <div className="min-h-screen">
      {/* ===== Backdrop ===== */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />

        {/* Content on backdrop */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex gap-10 items-end pb-16">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <div className="w-44 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
                <img src={movie.poster_path} alt={movie.title} className="w-full h-auto" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="badge badge-ghost">{g.name}</span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">{movie.title}</h1>

              {movie.tagline && (
                <p className="text-white/50 italic mb-4">"{movie.tagline}"</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                  <StarIcon size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold text-sm">{rating}</span>
                  <span className="text-white/40 text-xs">({(movie.vote_count / 1000).toFixed(0)}K votes)</span>
                </div>
                {runtime && (
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <ClockIcon size={14} />
                    <span>{runtime}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <CalendarIcon size={14} />
                  <span>{year}</span>
                </div>
                <span className="badge badge-ghost uppercase text-[10px]">{movie.original_language}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  id="watch-trailer-btn"
                  className="btn-secondary text-sm py-2.5"
                  onClick={() => setShowTrailer(true)}
                >
                  <PlayIcon size={15} fill="white" /> Watch Trailer
                </button>
                <button
                  id="favorite-btn"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isFavorite
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'glass text-white/60 hover:text-primary'
                  }`}
                >
                  <HeartIcon size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main content ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Overview + Cast */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
              <p className="text-white/60 leading-relaxed">{movie.overview}</p>
            </section>

            {/* Cast */}
            {movie.casts && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5">Top Cast</h2>
                <div className="scroll-row">
                  {movie.casts.slice(0, 10).map((cast, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 text-center group"
                      style={{ width: '80px' }}
                    >
                      <div className="w-16 h-16 rounded-full mx-auto overflow-hidden mb-2 ring-2 ring-white/10 group-hover:ring-primary transition-all">
                        <img
                          src={cast.profile_path}
                          alt={cast.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white/70 text-xs line-clamp-2">{cast.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Showtime Picker */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <TicketIcon size={18} className="text-primary" />
                Book Tickets
              </h2>

              {/* Date picker */}
              <div className="mb-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Select Date</p>
                <div className="grid grid-cols-2 gap-2">
                  {dateTimeEntries.map(([date]) => (
                    <button
                      key={date}
                      id={`date-btn-${date}`}
                      onClick={() => { setSelectedDate(date); setSelectedShow(null); }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedDate === date
                          ? 'bg-primary text-white'
                          : 'glass text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time picker */}
              {selectedDate && (
                <div className="mb-6">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Select Time</p>
                  <div className="flex flex-col gap-2">
                    {dummyDateTimeData[selectedDate]?.map((show) => (
                      <button
                        key={show.showId}
                        id={`time-btn-${show.showId}`}
                        onClick={() => setSelectedShow(show)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                          selectedShow?.showId === show.showId
                            ? 'bg-primary text-white'
                            : 'glass text-white/70 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{formatTime(show.time)}</span>
                        <span className="text-xs opacity-70">Standard</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price info */}
              <div className="flex items-center justify-between mb-5 py-3 border-t border-white/5">
                <span className="text-white/50 text-sm">Price per seat</span>
                <span className="text-white font-bold">$12.00</span>
              </div>

              {/* Book button */}
              {isSignedIn ? (
                <button
                  id="book-now-btn"
                  onClick={handleBookNow}
                  disabled={!selectedShow}
                  className={`btn-primary w-full justify-center text-sm py-3 ${
                    !selectedShow ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <TicketIcon size={16} />
                  {selectedShow ? 'Select Seats' : 'Choose a Showtime'}
                </button>
              ) : (
                <button
                  id="signin-to-book-btn"
                  className="btn-primary w-full justify-center text-sm py-3"
                  onClick={() => setShowSignIn(true)}
                >
                  <UserIcon size={16} /> Sign In to Book
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl overflow-hidden glass-dark animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video flex items-center justify-center text-white/40">
              <p>No trailer available for this movie</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
