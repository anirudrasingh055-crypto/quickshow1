import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboardIcon, FilmIcon, TicketIcon,
  PlusCircleIcon, LogOutIcon, MenuIcon
} from 'lucide-react';
import { assets } from '../../assets/assets';
import { useClerk } from '@clerk/clerk-react';

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon, exact: true },
  { label: 'Add Movie', path: '/admin/add-movie', icon: PlusCircleIcon },
  { label: 'All Movies', path: '/admin/movies', icon: FilmIcon },
  { label: 'Bookings', path: '/admin/bookings', icon: TicketIcon },
];

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useClerk();

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.path;
    return location.pathname.startsWith(link.path);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="admin-sidebar hidden md:flex flex-col py-6 px-3 flex-shrink-0">
        <div className="mb-8 px-3">
          <img src={assets.logo} alt="QuickShow Admin" className="h-7" />
          <p className="text-white/30 text-xs mt-2">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1">
          {adminLinks.map(({ label, path, icon: Icon, exact }) => (
            <Link
              key={path}
              to={path}
              id={`admin-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              className={`admin-sidebar-link ${isActive({ path, exact }) ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <button
          id="admin-signout-btn"
          onClick={() => signOut()}
          className="admin-sidebar-link text-red-400/70 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 mt-auto"
        >
          <LogOutIcon size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 glass-dark sticky top-0 z-50">
          <img src={assets.logo} alt="QuickShow" className="h-7" />
          <div className="flex items-center gap-3">
            {adminLinks.map(({ label, path, icon: Icon }) => (
              <Link key={path} to={path} className="text-white/60 hover:text-primary transition-colors">
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
