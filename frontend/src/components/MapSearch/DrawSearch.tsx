// src/components/ui/MapSearch/DrawSearch.tsx

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

interface DrawSearchProps {
  onDrawComplete: (circle: google.maps.Circle) => void;
  onCancel: () => void;
}

const DrawSearch: React.FC<DrawSearchProps> = ({ onDrawComplete, onCancel }) => {
  const map = useGoogleMap();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    if (!map) return;

    const loadDrawingLibrary = () => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?libraries=drawing&key=' +
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.async = true;
      script.onload = () => {
        if (!window.google) return;

        drawingManagerRef.current = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.CIRCLE,
          drawingControl: false,
          circleOptions: {
            fillColor: '#2D5A27',
            fillOpacity: 0.2,
            strokeColor: '#2D5A27',
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: true,
            zIndex: 1,
          },
        });

        drawingManagerRef.current.setMap(map);

        google.maps.event.addListener(
          drawingManagerRef.current,
          'overlaycomplete',
          (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
              const circle = event.overlay as google.maps.Circle;
              onDrawComplete(circle);
            }
          }
        );

        // Cancel drawing on escape
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onCancel();
            if (drawingManagerRef.current) {
              drawingManagerRef.current.setDrawingMode(null);
            }
          }
        };
        document.addEventListener('keydown', handleEscape);

        return () => {
          document.removeEventListener('keydown', handleEscape);
        };
      };
      document.body.appendChild(script);
    };

    loadDrawingLibrary();

    return () => {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
    };
  }, [map, onDrawComplete, onCancel]);

  return null;
};

export default DrawSearch;