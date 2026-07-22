// src/components/property-detail/PropertyGallery.tsx

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Play } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  virtualTour?: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ 
  images, 
  title, 
  virtualTour 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number>(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  };

  return (
    <>
      {/* Main Gallery Container */}
      <div className="relative group rounded-2xl overflow-hidden bg-gray-100">
        {/* Main Image */}
        <div 
          className="relative cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className={`w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : ''
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Zoom Indicator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            aria-label="Toggle zoom"
          >
            <Maximize2 size={18} />
          </button>

          {/* Virtual Tour Badge */}
          {virtualTour && (
            <div className="absolute top-4 left-4">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                <Play size={14} className="fill-current" />
                Virtual Tour
              </span>
            </div>
          )}
        </div>

        {/* Navigation Arrows - Desktop Only */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight size={22} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Click to expand */}
        <button
          onClick={openModal}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
          aria-label="Expand gallery"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                index === currentIndex
                  ? 'border-[#2D5A27] shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-14 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt={`${title} - Full size`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                >
                  <ChevronLeft size={28} className="text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                >
                  <ChevronRight size={28} className="text-white" />
                </button>
              </>
            )}

            {/* Counter in Modal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;