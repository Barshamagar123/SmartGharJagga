import React, { useState, useEffect } from 'react';
import Card, { CardDescription, CardTitle } from '../common/Card/Card';
import Badge from '../common/Badge/Badge';



interface NeighborhoodInfoProps {
  location: { lat: number; lng: number };
  properties: any[];
}

const NeighborhoodInfo: React.FC<NeighborhoodInfoProps> = ({ location, properties }) => {
  const [info, setInfo] = useState({
    schools: 0,
    hospitals: 0,
    markets: 0,
    parks: 0,
    restaurants: 0,
    transit: 0,
  });

  // Simulate fetching neighborhood data
  useEffect(() => {
    // In real implementation, this would call Google Places API
    setInfo({
      schools: Math.floor(Math.random() * 8) + 2,
      hospitals: Math.floor(Math.random() * 4) + 1,
      markets: Math.floor(Math.random() * 6) + 3,
      parks: Math.floor(Math.random() * 5) + 1,
      restaurants: Math.floor(Math.random() * 10) + 5,
      transit: Math.floor(Math.random() * 4) + 1,
    });
  }, [location]);

  const nearbyProperties = properties.filter(
    (p) =>
      Math.abs(p.lat - location.lat) < 0.1 && Math.abs(p.lng - location.lng) < 0.1
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Nearby Properties */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🏠 Nearby Properties</CardTitle>
        <CardDescription className="mt-2">
          {nearbyProperties.length} properties in this area
        </CardDescription>
        <div className="mt-3 space-y-2">
          {nearbyProperties.slice(0, 3).map((prop) => (
            <div
              key={prop.id}
              className="flex items-center gap-2 p-2 bg-[var(--color-primary-surface)] rounded-lg"
            >
              <img
                src={prop.image}
                alt={prop.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{prop.title}</p>
                <p className="text-xs text-[#2D5A27] font-semibold">{prop.price}</p>
              </div>
              <Badge variant="primary" size="sm">
                {prop.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Schools */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🏫 Schools</CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Nearby Schools</span>
            <Badge variant="primary">{info.schools}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">4.2/5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Distance</span>
            <span className="text-sm font-medium">0.5 - 2.0 km</span>
          </div>
        </div>
      </Card>

      {/* Hospitals */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🏥 Hospitals</CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Nearby Hospitals</span>
            <Badge variant="success">{info.hospitals}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">4.0/5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Distance</span>
            <span className="text-sm font-medium">0.3 - 1.5 km</span>
          </div>
        </div>
      </Card>

      {/* Markets */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🛒 Markets</CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Nearby Markets</span>
            <Badge variant="secondary">{info.markets}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">4.5/5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Distance</span>
            <span className="text-sm font-medium">0.2 - 1.0 km</span>
          </div>
        </div>
      </Card>

      {/* Parks */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🌳 Parks</CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Nearby Parks</span>
            <Badge variant="success">{info.parks}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">4.3/5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Distance</span>
            <span className="text-sm font-medium">0.4 - 1.2 km</span>
          </div>
        </div>
      </Card>

      {/* Transit */}
      <Card variant="default" padding="md">
        <CardTitle className="text-base">🚌 Transit</CardTitle>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Bus Stops</span>
            <Badge variant="primary">{info.transit}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">3.8/5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Distance</span>
            <span className="text-sm font-medium">0.1 - 0.5 km</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NeighborhoodInfo;