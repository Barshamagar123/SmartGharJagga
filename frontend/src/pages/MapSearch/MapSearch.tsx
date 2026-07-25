// src/pages/MapSearch/MapSearch.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import HeatMap from '../../components/MapSearch/HeatMap';
import PropertyMarker from '../../components/MapSearch/PropertyMarker';
import DrawSearch from '../../components/MapSearch/DrawSearch';
import NeighborhoodInfo from '../../components/MapSearch/NeighborhoodInfo';

interface PropertyLocation {
  id: number;
  title: string;
  price: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  image: string;
}

const MapSearch: React.FC = () => {
  const [properties, setProperties] = useState<PropertyLocation[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 27.7172, lng: 85.3240 });
  const [mapZoom, setMapZoom] = useState(12);
  const [drawMode, setDrawMode] = useState(false);
  const [searchRadius, setSearchRadius] = useState(0);

  // Sample properties with coordinates
  const sampleProperties: PropertyLocation[] = [
    {
      id: 1,
      title: 'Aspen Ridge Villa',
      price: 'Rs 4.8 Cr',
      location: 'Lalitpur, Bhaisepati',
      lat: 27.6784,
      lng: 85.3257,
      type: 'VILLA',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    },
    {
      id: 2,
      title: 'Greenwood Townhouse',
      price: 'Rs 3.2 Cr',
      location: 'Kathmandu, Baluwatar',
      lat: 27.7131,
      lng: 85.3216,
      type: 'HOUSE',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    },
    {
      id: 3,
      title: 'Monsoon Loft',
      price: 'Rs 1.4 Cr',
      location: 'Kathmandu, Thamel',
      lat: 27.7145,
      lng: 85.3119,
      type: 'APARTMENT',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    },
    {
      id: 4,
      title: 'Hillside Estate',
      price: 'Rs 5.2 Cr',
      location: 'Kavre, Dhulikhel',
      lat: 27.6216,
      lng: 85.5556,
      type: 'VILLA',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    },
    {
      id: 5,
      title: 'Cedar Bungalow',
      price: 'Rs 2.6 Cr',
      location: 'Bhaktapur, Suryabinayak',
      lat: 27.6763,
      lng: 85.4222,
      type: 'BUNGALOW',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    },
    {
      id: 6,
      title: 'Riverstone Plot',
      price: 'Rs 95 Lakh',
      location: 'Pokhara, Lakeside',
      lat: 28.2096,
      lng: 83.9850,
      type: 'LAND',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    },
  ];

  useEffect(() => {
    setProperties(sampleProperties);
  }, []);

  const handleMarkerClick = (property: PropertyLocation) => {
    setSelectedProperty(property);
  };

  const handleDrawComplete = (circle: any) => {
    const radius = circle.getRadius();
    setSearchRadius(radius);
    setDrawMode(false);
    // Filter properties within radius
    // This would integrate with your API
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
              🗺️ Map Search
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Find properties by location on the map
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showHeatMap ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowHeatMap(!showHeatMap)}
            >
              🔥 Heat Map
            </Button>
            <Button
              variant={showNeighborhood ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowNeighborhood(!showNeighborhood)}
            >
              🏫 Neighborhood
            </Button>
            <Button
              variant={drawMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDrawMode(!drawMode)}
            >
              ✏️ Draw Search
            </Button>
          </div>
        </motion.div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[var(--color-primary-border)]">
          <div className="w-full h-[600px] md:h-[700px]">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={mapZoom}
                options={{
                  styles: [
                    {
                      featureType: 'poi',
                      elementType: 'labels',
                      stylers: [{ visibility: 'off' }],
                    },
                  ],
                }}
              >
                {/* Property Markers */}
                {properties.map((property) => (
                  <PropertyMarker
                    key={property.id}
                    property={property}
                    onClick={handleMarkerClick}
                    isSelected={selectedProperty?.id === property.id}
                  />
                ))}

                {/* Heat Map Layer */}
                {showHeatMap && <HeatMap properties={properties} />}

                {/* Draw Search Tool */}
                {drawMode && (
                  <DrawSearch
                    onDrawComplete={handleDrawComplete}
                    onCancel={() => setDrawMode(false)}
                  />
                )}

                {/* Selected Property Info Window */}
                {selectedProperty && (
                  <InfoWindow
                    position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
                    onCloseClick={() => setSelectedProperty(null)}
                  >
                    <div className="p-3 max-w-xs">
                      <img
                        src={selectedProperty.image}
                        alt={selectedProperty.title}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-bold text-[var(--color-text-primary)]">
                        {selectedProperty.title}
                      </h4>
                      <p className="text-[#2D5A27] font-semibold">{selectedProperty.price}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {selectedProperty.location}
                      </p>
                      <Badge variant="primary" size="sm" className="mt-1">
                        {selectedProperty.type}
                      </Badge>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="mt-2"
                        onClick={() => window.location.href = `/property/${selectedProperty.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <Card variant="default" padding="sm" className="shadow-lg">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setMapZoom((z) => Math.min(z + 1, 20))}
                  className="w-8 h-8 bg-white hover:bg-[var(--color-primary-hover)] rounded-lg text-xl font-bold transition-colors"
                >
                  +
                </button>
                <button
                  onClick={() => setMapZoom((z) => Math.max(z - 1, 3))}
                  className="w-8 h-8 bg-white hover:bg-[var(--color-primary-hover)] rounded-lg text-xl font-bold transition-colors"
                >
                  −
                </button>
              </div>
            </Card>
            <Button
              variant="outline"
              size="sm"
              className="shadow-lg"
              onClick={() => {
                setMapCenter({ lat: 27.7172, lng: 85.3240 });
                setMapZoom(12);
              }}
            >
              📍 Recenter
            </Button>
          </div>

          {/* Results Count */}
          {!drawMode && (
            <div className="absolute top-4 right-4">
              <Badge variant="primary" size="lg" className="shadow-lg">
                {properties.length} Properties Found
              </Badge>
            </div>
          )}

          {/* Draw Search Info */}
          {drawMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg px-6 py-3 border border-[var(--color-primary-border)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                ✏️ Click and drag on the map to draw a circle
              </p>
            </div>
          )}
        </div>

        {/* Neighborhood Info */}
        {showNeighborhood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <NeighborhoodInfo
              location={{ lat: mapCenter.lat, lng: mapCenter.lng }}
              properties={properties}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MapSearch;