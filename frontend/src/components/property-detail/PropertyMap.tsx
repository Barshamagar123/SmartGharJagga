// src/components/property-detail/PropertyMap.tsx

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  location,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    // Google Maps Embed URL with markers
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}&zoom=15&maptype=roadmap`;
    
    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.style.borderRadius = '12px';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.title = `Map showing ${title} location`;
    
    mapContainer.innerHTML = '';
    mapContainer.appendChild(iframe);

    return () => {
      mapContainer.innerHTML = '';
    };
  }, [latitude, longitude, title]);

  const toggleFullscreen = () => {
    if (!mapRef.current) return;
    
    if (!document.fullscreenElement) {
      mapRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Location</h3>
          <div className="flex items-center gap-1 text-sm text-[#475569] mt-1">
            <MapPin size={16} className="text-[#2D5A27]" />
            <span>{location}</span>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-[#F8FAFC] transition-colors"
          aria-label="Toggle fullscreen map"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
      
      <div 
        ref={mapRef}
        className={`w-full rounded-2xl overflow-hidden bg-[#F8FAFC] transition-all duration-300 ${
          isFullscreen ? 'h-[80vh]' : 'h-[350px]'
        }`}
      />
    </div>
  );
};

export default PropertyMap;