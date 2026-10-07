import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Favorite from './pages/Favorite';
import SeatLayout from './pages/SeatLayout';
import MyBooking from './pages/MyBooking';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMovie from './pages/admin/AddMovie';
import AdminMovies from './pages/admin/AdminMovies';
import AdminBookings from './pages/admin/AdminBookings';

const App = () => {
  return (
    <div className="bg-[#09090B] text-white min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#F84565', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Admin Routes (no Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="pt-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/favorite" element={<Favorite />} />
                  <Route path="/seat-layout" element={<SeatLayout />} />
                  <Route path="/my-bookings" element={<MyBooking />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;