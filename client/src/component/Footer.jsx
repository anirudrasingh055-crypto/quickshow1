import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  MailIcon, PhoneIcon, MapPinIcon, ArrowRightIcon,
  Share2Icon, GlobeIcon
} from 'lucide-react';

const footerLinks = {
  'Company': [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Blog', path: '/blog' },
  ],
  'Support': [
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
  'Quick Links': [
    { label: 'Now Showing', path: '/movies' },
    { label: 'Coming Soon', path: '/movies?tab=upcoming' },
    { label: 'My Bookings', path: '/my-bookings' },
    { label: 'Favorites', path: '/favorite' },
  ],
};

const socials = [
  { icon: GlobeIcon, label: 'Website', href: '#' },
  { icon: Share2Icon, label: 'Share', href: '#' },
];

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
              <img src={assets.logo} alt="QuickShow" className="h-10 mb-5" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Your ultimate destination for movie tickets. Book seats, explore shows, and enjoy cinema like never before.
            </p>
            {/* App Store Buttons */}
            <div className="flex gap-3 mb-6">
              <a href="#" className="glass px-3 py-2 rounded-xl flex items-center gap-2 hover:border-primary/30 transition-all">
                <img src={assets.appStore} alt="App Store" className="h-5" />
              </a>
              <a href="#" className="glass px-3 py-2 rounded-xl flex items-center gap-2 hover:border-primary/30 transition-all">
                <img src={assets.googlePlay} alt="Google Play" className="h-5" />
              </a>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                    >
                      <span className="group-hover:text-primary transition-colors">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Subscribe to our newsletter</h4>
            <p className="text-white/50 text-sm">Get notified about new movies and exclusive offers.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-dark md:w-64 text-sm"
            />
            <button className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              Subscribe <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} QuickShow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
