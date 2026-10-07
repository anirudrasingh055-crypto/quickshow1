import React, { useState } from 'react';
import { dummyBookingData } from '../../assets/assets';
import { SearchIcon, CheckCircleIcon, ClockIcon, DownloadIcon } from 'lucide-react';

const formatDateTime = (str) => {
  if (!str) return 'N/A';
  return new Date(str).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const AdminBookings = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'paid' | 'pending'

  const bookings = dummyBookingData.filter((b) => {
    const matchSearch =
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.show?.movie?.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'paid' && b.isPaid) ||
      (filter === 'pending' && !b.isPaid);
    return matchSearch && matchFilter;
  });

  const totalRevenue = dummyBookingData
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Bookings</h1>
          <p className="text-white/40 text-sm mt-1">
            {dummyBookingData.length} total · Revenue: <span className="text-primary font-semibold">${totalRevenue}</span>
          </p>
        </div>
        <button
          id="export-bookings-btn"
          className="btn-secondary text-sm py-2.5"
          onClick={() => alert('Export coming soon!')}
        >
          <DownloadIcon size={14} /> Export CSV
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="bookings-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or movie..."
            className="input-dark pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'paid', 'pending'].map((f) => (
            <button
              key={f}
              id={`booking-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Movie</th>
              <th>Show Time</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, i) => (
              <tr key={`booking-row-${i}`} id={`booking-row-${i}`}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                      {booking.user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-white">{booking.user?.name}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={booking.show?.movie?.poster_path}
                      alt=""
                      className="w-7 h-9 object-cover rounded"
                    />
                    <span className="text-sm text-white/80">{booking.show?.movie?.title}</span>
                  </div>
                </td>
                <td className="text-sm text-white/60">{formatDateTime(booking.show?.showDateTime)}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {booking.bookedSeats?.map((s) => (
                      <span key={s} className="badge badge-ghost text-[10px]">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="text-primary font-semibold">${booking.amount}</td>
                <td>
                  {booking.isPaid ? (
                    <span className="badge badge-success flex items-center gap-1 w-fit">
                      <CheckCircleIcon size={10} /> Paid
                    </span>
                  ) : (
                    <span className="badge badge-warning flex items-center gap-1 w-fit">
                      <ClockIcon size={10} /> Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
