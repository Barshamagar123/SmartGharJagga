// src/components/MapSearch/PropertyMarker.tsx

import React from 'react';
import { Marker } from '@react-google-maps/api';

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

interface PropertyMarkerProps {
  property: Property;
  onClick: (property: Property) => void;
  isSelected: boolean;
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({
  property,
  onClick,
  isSelected,
}) => {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'VILLA':
        return '#D4AF37';
      case 'HOUSE':
        return '#2D5A27';
      case 'APARTMENT':
        return '#4A7D42';
      case 'BUNGALOW':
        return '#6B9D63';
      case 'LAND':
        return '#94A3B8';
      default:
        return '#2D5A27';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'VILLA':
        return '🏘️';
      case 'HOUSE':
        return '🏠';
      case 'APARTMENT':
        return '🏢';
      case 'BUNGALOW':
        return '🏡';
      case 'LAND':
        return '🌄';
      default:
        return '📍';
    }
  };

  return (
    <Marker
      position={{ lat: property.lat, lng: property.lng }}
      onClick={() => onClick(property)}
      icon={{
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
        fillColor: isSelected ? '#D4AF37' : getMarkerColor(property.type),
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 1.5,
      }}
      label={{
        text: getMarkerIcon(property.type),
        className: 'text-sm font-bold',
      }}
    />
  );
};

export default PropertyMarker;