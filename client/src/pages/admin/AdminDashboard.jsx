import React from 'react';
import { dummyShowsData, dummyBookingData, dummyDashboardData } from '../../assets/assets';
import { TrendingUpIcon, UsersIcon, TicketIcon, FilmIcon, ArrowUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatDateTime = (str) => {
  if (!str) return 'N/A';
  return new Date(str).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const stats = [
  {
    label: 'Total Bookings',
    value: dummyDashboardData.totalBookings,
    icon: TicketIcon,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    change: '+12%',
  },
  {
    label: 'Total Revenue',
    value: `$${dummyDashboardData.totalRevenue}`,
    icon: TrendingUpIcon,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
    change: '+8%',
  },
  {
    label: 'Registered Users',
    value: dummyDashboardData.totalUser,
    icon: UsersIcon,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
    change: '+3%',
  },
  {
    label: 'Active Shows',
    value: dummyDashboardData.activeShows.length,
    icon: FilmIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
    change: 'Live',
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, change }, i) => (
          <div
            key={label}
            id={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}
            className={`stat-card animate-fade-in`}
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${bg} border flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <ArrowUpIcon size={10} />
                {change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-white/40 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Active Shows */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="text-xl font-semibold text-white">Active Shows</h2>
            <p className="text-white/40 text-sm mt-0.5">Currently scheduled screenings</p>
          </div>
          <Link to="/admin/movies" className="ml-auto text-primary text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Seats Booked</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {dummyDashboardData.activeShows.map((show) => {
                const totalSeats = 120;
                const booked = Object.keys(show.occupiedSeats || {}).length;
                const pct = Math.round((booked / totalSeats) * 100);
                return (
                  <tr key={show._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={show.movie?.poster_path}
                          alt={show.movie?.title}
                          className="w-9 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{show.movie?.title}</p>
                          <p className="text-white/40 text-xs">
                            {show.movie?.genres?.[0]?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{formatDateTime(show.showDateTime)}</td>
                    <td className="text-primary font-semibold">${show.showPrice}</td>
                    <td className="text-sm">{booked} / {totalSeats}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-24">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-white/50 text-xs w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
            <p className="text-white/40 text-sm mt-0.5">Latest ticket purchases</p>
          </div>
          <Link to="/admin/bookings" className="ml-auto text-primary text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Movie</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyBookingData.map((booking, i) => (
                <tr key={`${booking._id}-${i}`}>
                  <td className="text-sm">{booking.user?.name}</td>
                  <td className="text-sm text-white/80">{booking.show?.movie?.title}</td>
                  <td className="text-sm">{booking.bookedSeats?.join(', ')}</td>
                  <td className="text-primary font-semibold">${booking.amount}</td>
                  <td>
                    <span className={`badge ${booking.isPaid ? 'badge-success' : 'badge-warning'}`}>
                      {booking.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
