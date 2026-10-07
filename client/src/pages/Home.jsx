import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets, dummyShowsData, dummyTrailers } from '../assets/assets';
import MovieCard from '../component/MovieCard';
import TrailerCard from '../component/TrailerCard';
import {
  PlayIcon, ChevronRightIcon, StarIcon, TicketIcon,
  TrendingUpIcon, ArrowRightIcon, ChevronLeftIcon
} from 'lucide-react';

// Hero slides
const heroMovies = dummyShowsData.slice(0, 4);

const Home = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentHero = heroMovies[heroIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [heroIndex]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroMovies.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
      setIsAnimating(false);
    }, 300);
  };

  const nowShowing = dummyShowsData.slice(0, 6);
  const comingSoon = dummyShowsData.slice(3, 7);

  return (
    <div className="min-h-screen">
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-end pb-24 overflow-hidden" id="hero-section">
        {/* Background Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <img
            src={currentHero?.backdrop_path}
            alt={currentHero?.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-10 w-full transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="max-w-2xl">
            {/* Marvel / Studio Logo */}
            <div className="flex items-center gap-3 mb-5">
              <img src={assets.marvelLogo} alt="Marvel" className="h-6 opacity-80" />
              <div className="badge badge-primary">{currentHero?.genres?.[0]?.name}</div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {currentHero?.title}
            </h1>

            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-4 line-clamp-3">
              {currentHero?.overview}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 mb-8 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <StarIcon size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white/80 font-medium">{currentHero?.vote_average?.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{currentHero?.runtime} min</span>
              <span>•</span>
              <span>{new Date(currentHero?.release_date).getFullYear()}</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to={`/movie/${currentHero?._id}`} className="btn-primary text-base py-3 px-7">
                <TicketIcon size={18} />
                Book Tickets
              </Link>
              <button className="btn-secondary text-base py-3 px-6">
                <PlayIcon size={18} fill="white" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>

        {/* Hero Navigation */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
          <button
            onClick={goToPrev}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            onClick={goToNext}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        {/* Hero Thumbnails */}
        <div className="absolute bottom-8 right-10 z-10 hidden lg:flex gap-2">
          {heroMovies.map((movie, i) => (
            <button
              key={movie._id}
              onClick={() => setHeroIndex(i)}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                i === heroIndex
                  ? 'w-20 h-14 ring-2 ring-primary scale-105'
                  : 'w-14 h-10 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* ========== STATS BANNER ========== */}
      <section className="py-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Movies Available', value: '200+', icon: '🎬' },
              { label: 'Happy Customers', value: '50K+', icon: '😊' },
              { label: 'Partner Theaters', value: '120+', icon: '🏛️' },
              { label: 'Cities Covered', value: '30+', icon: '🌆' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center">
                <div className="text-3xl mb-1">{icon}</div>
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-white/50 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NOW SHOWING ========== */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-10" id="now-showing">
        <div className="section-header">
          <div>
            <h2 className="text-3xl font-bold text-white">Now Showing</h2>
            <p className="text-white/50 text-sm mt-1">Currently playing in theaters near you</p>
          </div>
          <Link to="/movies" className="ml-auto flex items-center gap-1 text-primary text-sm hover:gap-2 transition-all">
            View All <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {nowShowing.map((movie, i) => (
            <div key={movie._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <MovieCard
                movie={movie}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED MOVIE BANNER ========== */}
      <section className="py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={dummyShowsData[5]?.backdrop_path}
              alt="Featured"
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-12">
              <div className="max-w-md">
                <div className="badge badge-primary mb-3">Featured</div>
                <h3 className="text-3xl font-bold text-white mb-2">{dummyShowsData[5]?.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{dummyShowsData[5]?.tagline}</p>
                <Link to={`/movie/${dummyShowsData[5]?._id}`} className="btn-primary text-sm py-2 px-5">
                  <TicketIcon size={15} /> Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMING SOON ========== */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-10" id="coming-soon">
        <div className="section-header">
          <div>
            <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
            <p className="text-white/50 text-sm mt-1">Mark your calendar for upcoming releases</p>
          </div>
          <Link to="/movies?tab=upcoming" className="ml-auto flex items-center gap-1 text-primary text-sm hover:gap-2 transition-all">
            View All <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {comingSoon.map((movie, i) => (
            <div key={movie._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <MovieCard movie={movie} onClick={() => {}} />
            </div>
          ))}
        </div>
      </section>

      {/* ========== TRAILERS ========== */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-10" id="trailers-section">
        <div className="section-header">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest Trailers</h2>
            <p className="text-white/50 text-sm mt-1">Watch trailers for the hottest movies</p>
          </div>
        </div>
        <div className="scroll-row">
          {dummyTrailers.map((trailer, i) => (
            <TrailerCard key={i} trailer={trailer} />
          ))}
        </div>
      </section>

      {/* ========== APP DOWNLOAD ========== */}
      <section className="py-20 px-6 md:px-10" id="app-download">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="badge badge-primary mb-4">Mobile App</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Book Tickets <span className="gradient-text">Anywhere</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Download our mobile app and book tickets on the go. Get exclusive deals, real-time seat availability, and instant booking confirmations.
              </p>
              <div className="flex gap-4">
                <a href="#" className="glass px-5 py-3 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all">
                  <img src={assets.appStore} alt="App Store" className="h-8" />
                </a>
                <a href="#" className="glass px-5 py-3 rounded-xl flex items-center gap-3 hover:border-primary/30 transition-all">
                  <img src={assets.googlePlay} alt="Google Play" className="h-8" />
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 animate-float">
              <img
                src={assets.screenImage}
                alt="App Preview"
                className="h-72 w-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
