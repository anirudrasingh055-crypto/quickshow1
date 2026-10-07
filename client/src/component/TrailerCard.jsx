import React, { useState } from 'react';
import { PlayIcon, XIcon } from 'lucide-react';

const TrailerCard = ({ trailer }) => {
  const [showModal, setShowModal] = useState(false);

  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(trailer.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';

  return (
    <>
      <div
        id={`trailer-${videoId}`}
        className="relative group cursor-pointer rounded-2xl overflow-hidden img-zoom-wrap flex-shrink-0"
        style={{ width: '320px', height: '180px' }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={trailer.image}
          alt="Movie trailer"
          className="img-zoom w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
            <PlayIcon size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Video Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden glass-dark animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setShowModal(false)}
            >
              <XIcon size={18} />
            </button>
            <div className="aspect-video">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Movie Trailer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  Video not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerCard;
