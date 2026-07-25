// src/components/ui/MapSearch/HeatMap.tsx

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  image: string;
}

interface HeatMapProps {
  properties: Property[];
}

const HeatMap: React.FC<HeatMapProps> = ({ properties }) => {
  const map = useGoogleMap();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Load visualization library
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?libraries=visualization&key=' +
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    script.async = true;
    script.onload = () => {
      if (!window.google) return;

      const heatmapData = properties.map((property) => ({
        location: new google.maps.LatLng(property.lat, property.lng),
        weight: 1,
      }));

      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 30,
        opacity: 0.6,
        gradient: [
          'rgba(0, 255, 0, 0)',
          'rgba(0, 255, 0, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(255, 165, 0, 1)',
          'rgba(255, 0, 0, 1)',
        ],
      });

      heatmapRef.current.setMap(map);
    };

    document.body.appendChild(script);

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
      document.body.removeChild(script);
    };
  }, [map, properties]);

  return null;
};

export default HeatMap;