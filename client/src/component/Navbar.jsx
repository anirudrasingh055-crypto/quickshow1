import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { SearchIcon, MenuIcon, XIcon, TicketIcon, HeartIcon, UserIcon, ChevronDownIcon } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import SignInModal from './SignInModal';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Movies', path: '/movies' },
  { label: 'My Bookings', path: '/my-bookings' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'glass-dark py-3 shadow-2xl' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={assets.logo} alt="QuickShow" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary bg-[rgba(248,69,101,0.1)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                to="/favorite"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive('/favorite')
                    ? 'text-primary bg-[rgba(248,69,101,0.1)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <HeartIcon size={14} />
                Favorites
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link to="/my-bookings" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                  <TicketIcon size={16} />
                  My Tickets
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9',
                      userButtonPopoverCard: 'bg-[#111] border border-white/10',
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </>
            ) : (
              <button
                id="navbar-signin-btn"
                className="btn-primary text-sm py-2 px-5"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            id="navbar-menu-toggle"
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 glass-dark p-6 flex flex-col gap-4 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <img src={assets.logo} alt="QuickShow" className="h-7" />
            <button onClick={() => setIsOpen(false)}>
              <XIcon size={20} className="text-white/60" />
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-primary bg-[rgba(248,69,101,0.1)] border border-[rgba(248,69,101,0.2)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isSignedIn && (
            <Link
              to="/favorite"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              <HeartIcon size={14} /> Favorites
            </Link>
          )}

          <div className="mt-auto">
            {isSignedIn ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm text-white/80">{user?.firstName}</span>
              </div>
            ) : (
              <button
                className="btn-primary w-full justify-center"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
};

export default Navbar;
