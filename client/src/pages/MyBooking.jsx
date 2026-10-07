import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyBookingData } from '../assets/assets';
import {
  TicketIcon, CalendarIcon, MapPinIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon, ArrowRightIcon
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import SignInModal from '../component/SignInModal';

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const MyBooking = () => {
  const { isSignedIn, user } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <TicketIcon size={36} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">My Bookings</h2>
          <p className="text-white/50 text-sm mb-6">
            Sign in to view your ticket booking history.
          </p>
          <button className="btn-primary" onClick={() => setShowSignIn(true)}>
            Sign In to View
          </button>
        </div>
        <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    );
  }

  const bookings = dummyBookingData;

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 md:px-10 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
          <TicketIcon size={30} className="text-primary" />
          My Bookings
        </h1>
        <p className="text-white/50">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="text-white text-xl font-semibold mb-2">No bookings yet</h3>
          <p className="text-white/40 text-sm mb-6">Start booking tickets for your favorite movies!</p>
          <Link to="/movies" className="btn-primary text-sm py-2.5">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => {
            const movie = booking.show?.movie;
            return (
              <div
                key={`${booking._id}-${i}`}
                id={`booking-card-${i}`}
                className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-5 animate-fade-in hover:border-white/15 transition-all"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={movie?.poster_path}
                    alt={movie?.title}
                    className="w-20 h-28 object-cover rounded-xl"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{movie?.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {movie?.genres?.slice(0, 2).map((g) => (
                          <span key={g.id} className="badge badge-ghost">{g.name}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      {booking.isPaid ? (
                        <span className="badge badge-success flex items-center gap-1">
                          <CheckCircleIcon size={11} /> Confirmed
                        </span>
                      ) : (
                        <span className="badge badge-warning flex items-center gap-1">
                          <ClockIcon size={11} /> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-white/60">
                    <div>
                      <p className="text-white/30 text-xs mb-1">Date & Time</p>
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        <span>{formatDateTime(booking.show?.showDateTime)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Seats</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.bookedSeats?.map((s) => (
                          <span key={s} className="text-white font-medium">{s}</span>
                        )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, ', ', el], [])}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Amount Paid</p>
                      <span className="text-primary font-bold text-base">${booking.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex sm:flex-col gap-2 sm:justify-center">
                  <Link
                    to={`/movie/${movie?._id}`}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    View Movie
                  </Link>
                  {!booking.isPaid && (
                    <button className="btn-primary text-xs py-2 px-4">
                      Complete Payment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
