import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets, dummyShowsData } from '../assets/assets';
import { TicketIcon, ArrowLeftIcon, CheckCircleIcon, XCircleIcon, InfoIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

// Seat layout config: rows A-J, cols 1-12
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);
const PRICE_PER_SEAT = 12;

// Some occupied seats for demo
const DEMO_OCCUPIED = {
  'A1': 'user_xxx', 'A2': 'user_xxx', 'A3': 'user_xxx',
  'C4': 'user_xxx', 'C5': 'user_xxx',
  'E6': 'user_xxx', 'E7': 'user_xxx', 'E8': 'user_xxx',
  'G2': 'user_xxx', 'G3': 'user_xxx',
  'H10': 'user_xxx', 'H11': 'user_xxx',
};

const SeatLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const stateData = location.state || {};
  const movie = stateData.movie || dummyShowsData[0];
  const showTime = stateData.showTime;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const occupiedSeats = DEMO_OCCUPIED;

  const getSeatStatus = (seatId) => {
    if (occupiedSeats[seatId]) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const toggleSeat = (seatId) => {
    if (occupiedSeats[seatId]) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const totalPrice = selectedSeats.length * PRICE_PER_SEAT;

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setIsBooking(true);
    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2000));
    setIsBooking(false);
    setBookingSuccess(true);
    toast.success('Booking confirmed! Check your email for details.');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const d = new Date(timeStr);
    return d.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full glass rounded-3xl p-10 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon size={36} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/50 text-sm mb-6">
            Your tickets for <span className="text-white font-medium">{movie.title}</span> have been booked.
            A confirmation email has been sent.
          </p>

          {/* Ticket preview */}
          <div className="glass rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-4 mb-4">
              <img src={movie.poster_path} alt={movie.title} className="w-14 rounded-lg" />
              <div>
                <p className="text-white font-semibold">{movie.title}</p>
                <p className="text-white/40 text-xs">{formatTime(showTime)}</p>
              </div>
            </div>
            <div className="divider my-3" />
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-white/40 text-xs mb-1">Seats</p>
                <p className="text-white font-medium">{selectedSeats.join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs mb-1">Total Paid</p>
                <p className="text-primary font-bold text-lg">${totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-secondary flex-1 text-sm py-2.5" onClick={() => navigate('/my-bookings')}>
              My Bookings
            </button>
            <button className="btn-primary flex-1 text-sm py-2.5" onClick={() => navigate('/movies')}>
              More Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          id="back-btn"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-all"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
          <p className="text-white/40 text-sm">{formatTime(showTime)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          {/* Screen */}
          <div className="mb-10 text-center">
            <div className="relative mx-auto w-4/5 max-w-lg">
              <img src={assets.screenImage} alt="Screen" className="w-full" />
              <p className="text-white/30 text-xs mt-2 uppercase tracking-widest">SCREEN</p>
            </div>
            <div className="screen-glow w-60 h-6 mx-auto mt-1 opacity-60" />
          </div>

          {/* Seat Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max mx-auto">
              {/* Column headers */}
              <div className="flex gap-2 mb-2 pl-8">
                {COLS.map((col) => (
                  <div key={col} className="w-7 text-center text-white/20 text-xs">{col}</div>
                ))}
              </div>

              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2 mb-2">
                  {/* Row label */}
                  <div className="w-6 text-white/30 text-xs font-medium flex-shrink-0">{row}</div>

                  {/* Seats */}
                  {COLS.map((col) => {
                    const seatId = `${row}${col}`;
                    const status = getSeatStatus(seatId);
                    return (
                      <button
                        key={seatId}
                        id={`seat-${seatId}`}
                        className={`seat tooltip ${status}`}
                        data-tip={seatId}
                        onClick={() => toggleSeat(seatId)}
                        disabled={status === 'occupied'}
                        aria-label={`Seat ${seatId} - ${status}`}
                      />
                    );
                  })}

                  {/* Row label right */}
                  <div className="w-6 text-white/30 text-xs font-medium flex-shrink-0">{row}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { status: 'available', label: 'Available', cls: 'bg-white/10 border border-white/20' },
              { status: 'selected', label: 'Selected', cls: 'bg-primary border-primary' },
              { status: 'occupied', label: 'Occupied', cls: 'bg-white/5 border border-white/10' },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md ${cls}`} />
                <span className="text-white/50 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-28">
            {/* Movie Info */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/5">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-14 rounded-xl flex-shrink-0"
              />
              <div>
                <p className="text-white font-semibold text-sm">{movie.title}</p>
                <p className="text-white/40 text-xs mt-1">{formatTime(showTime)}</p>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="mb-5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Selected Seats</p>
              {selectedSeats.length === 0 ? (
                <div className="flex items-center gap-2 text-white/30 text-sm py-3">
                  <InfoIcon size={14} />
                  <span>Click on seats to select them</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className="badge badge-primary flex items-center gap-1 cursor-pointer hover:opacity-80"
                    >
                      {seat} <XCircleIcon size={10} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-5 pb-5 border-b border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ${PRICE_PER_SEAT}
                </span>
                <span className="text-white">${selectedSeats.length * PRICE_PER_SEAT}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Convenience fee</span>
                <span className="text-white">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold">Total</span>
              <span className="text-primary font-bold text-2xl">${totalPrice}</span>
            </div>

            {/* Pay button */}
            <button
              id="pay-now-btn"
              onClick={handlePayment}
              disabled={selectedSeats.length === 0 || isBooking}
              className={`btn-primary w-full justify-center py-3 text-sm ${
                selectedSeats.length === 0 || isBooking ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'
              }`}
            >
              {isBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TicketIcon size={16} />
                  {selectedSeats.length === 0 ? 'Select Seats' : `Pay $${totalPrice}`}
                </>
              )}
            </button>

            {/* 10 min note */}
            {selectedSeats.length > 0 && !isBooking && (
              <p className="text-white/30 text-xs text-center mt-3">
                ⏱ Seats reserved for 10 minutes after payment initiation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
