// src/pages/MapSearch/MapSearch.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mapApi } from '../../services/api/map';
import type { PropertyLocation, NearbyPlace} from '../../services/api/map';
import FilterChip from '../../components/MapSearch/FilterChip';
import MatchGauge from '../../components/Matching/MatchGauge';


// ✅ Image Helper - Same as your backend upload structure
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  
  // If it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with /uploads/
  if (path.startsWith('/uploads/')) {
    return `${BASE_URL}${path}`;
  }
  
  // If it starts with uploads/
  if (path.startsWith('uploads/')) {
    return `${BASE_URL}/${path}`;
  }
  
  // If it starts with / (but not uploads)
  if (path.startsWith('/')) {
    return `${BASE_URL}${path}`;
  }
  
  // Default: assume it's just the filename from your uploads
  return `${BASE_URL}/uploads/properties/images/${path}`;
};

const roadOptions = ['8ft+', '12ft+', '20ft', 'Blacktopped'];
const facingOptions = ['South', 'East', 'North', 'West'];
const typeOptions = ['Land', 'House', 'Apartment', 'Shutter'];
const sortOptions = ['Best match', 'Newest', 'Price ↑', 'Price ↓', 'Recently verified'];

// ✅ Format price
const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)}Cr`;
  }
  if (price >= 100000) {
    return `Rs ${(price / 100000).toFixed(1)}L`;
  }
  return `Rs ${price.toLocaleString()}`;
};

// ✅ MapPanel Component
const MapPanel: React.FC<{
  selected: string | null;
  properties: PropertyLocation[];
  allProperties: PropertyLocation[];
  onPinClick: (id: string) => void;
  loading: boolean;
  activeFilters: {
    types: string[];
    roads: string[];
    facings: string[];
    verifiedOnly: boolean;
  };
}> = ({ selected, properties, allProperties, onPinClick, loading, activeFilters }) => {
  const pins = properties.slice(0, 15).map((p, index) => ({
    x: 15 + (index * 7) % 70,
    y: 15 + (index * 11) % 70,
    price: formatPrice(p.price),
    verified: true,
    id: p.id,
  }));

  const fallbackPins = [
    { x: 30, y: 40, price: '1.25Cr', verified: true, id: '1' },
    { x: 55, y: 60, price: '4.9Cr', verified: true, id: '2' },
    { x: 70, y: 35, price: '78L', verified: true, id: '3' },
    { x: 45, y: 25, price: '45K/mo', verified: true, id: '4' },
    { x: 20, y: 65, price: '1.85Cr', verified: false, id: '5' },
    { x: 80, y: 55, price: '3.2Cr', verified: true, id: '6' },
  ];

  const displayPins = pins.length > 0 ? pins : fallbackPins;
  const selectedProperty = properties.find(p => p.id === selected);

  const activeFilterCount = 
    activeFilters.types.length + 
    activeFilters.roads.length + 
    activeFilters.facings.length + 
    (activeFilters.verifiedOnly ? 1 : 0);

  if (loading) {
    return (
      <div className="relative rounded-lg overflow-hidden" style={{ background: '#161B22', height: '100%', minHeight: 600 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 text-sm mt-2">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: '#161B22', height: '100%', minHeight: 600 }}>
      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
        {['Draw to search', 'Price heat', 'Verified only', 'Schools', 'Hospitals'].map(t => (
          <button key={t} className="px-2.5 py-1 rounded text-[11px] font-mono transition-colors hover:bg-white/10"
            style={{ background: 'rgba(22,27,34,0.9)', color: '#E6E3DB', border: '1px solid #333A44' }}>
            {t}
          </button>
        ))}
      </div>

      {activeFilterCount > 0 && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded text-[11px] font-mono"
          style={{ background: 'rgba(164, 20, 44, 0.9)', color: '#FFFFFF', border: '1px solid #A4142C' }}>
          {properties.length} of {allProperties.length} properties
        </div>
      )}

      {/* Street Grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {[15, 30, 45, 60, 75, 90].map(y => (
          <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1e2530" strokeWidth="1" />
        ))}
        {[15, 30, 45, 60, 75, 90].map(x => (
          <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#1e2530" strokeWidth="1" />
        ))}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#2a3442" strokeWidth="3" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#2a3442" strokeWidth="3" />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#252e3a" strokeWidth="2" />
      </svg>

      {/* Pins */}
      {displayPins.map(pin => (
        <div
          key={pin.id}
          onClick={() => onPinClick(pin.id)}
          className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold shadow-lg transition-transform group-hover:scale-110"
              style={{
                background: pin.verified ? '#186B4C' : '#5C6570',
                color: '#FFFFFF',
                border: pin.verified ? '2px solid #1E8A61' : 'none',
                outline: pin.verified ? '1px solid #E4F1EA' : 'none',
              }}>
              {pin.price}
            </div>
            <div className="w-1 h-2" style={{ background: pin.verified ? '#186B4C' : '#5C6570' }} />
          </div>
        </div>
      ))}

      {/* ✅ Selected pin preview with image */}
      {selectedProperty && (
        <Link to={`/property/${selectedProperty.id}`} className="absolute bottom-4 left-4 w-64 rounded-lg border p-3 shadow-xl z-20 hover:shadow-2xl transition-shadow"
          style={{ background: '#FFFFFF', borderColor: '#D3CFC5', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
          <div className="flex gap-3">
            <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              <img 
                src={getImageUrl(selectedProperty.mainImage || selectedProperty.images?.[0])} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/2D5A27/FFFFFF?text=No+Image';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs font-semibold" style={{ color: '#14181D' }}>
                {formatPrice(selectedProperty.price)}
              </div>
              <div className="text-[10px] truncate" style={{ fontFamily: 'Khand', color: '#14181D' }}>
                {selectedProperty.title}
              </div>
              <div className="text-[10px]" style={{ color: '#5C6570' }}>
                {selectedProperty.location}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MatchGauge score={75} size={28} />
                <span className="text-[10px] font-medium" style={{ color: '#2D5A27' }}>View →</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Heat legend */}
      <div className="absolute bottom-4 right-4 px-3 py-2 rounded"
        style={{ background: 'rgba(22,27,34,0.9)', border: '1px solid #333A44' }}>
        <div className="text-[10px] font-mono mb-1" style={{ color: '#5C6570' }}>PRICE / AREA</div>
        <div className="flex items-center gap-1">
          <div style={{ width: 80, height: 8, background: 'linear-gradient(90deg, #186B4C, #D9A93F, #A4142C)', borderRadius: 2 }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono" style={{ color: '#5C6570' }}>
          <span>Low</span><span>High</span>
        </div>
      </div>
    </div>
  );
};

// ✅ Main SearchMap Component
const SearchMap: React.FC = () => {
  const [properties, setProperties] = useState<PropertyLocation[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeRoads, setActiveRoads] = useState<string[]>([]);
  const [activeFacings, setActiveFacings] = useState<string[]>([]);
  const [sort, setSort] = useState('Best match');
  const [tab, setTab] = useState<'list' | 'map'>('list');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // ✅ Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const locations = await mapApi.getLocations();
        console.log('📍 API Response:', locations);
        console.log('📍 First property images:', locations[0]?.images);
        console.log('📍 First property mainImage:', locations[0]?.mainImage);
        setProperties(locations);
        setFilteredProperties(locations);
        if (locations.length > 0) {
          setSelectedPin(locations[0].id);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ✅ APPLY FILTERS
  useEffect(() => {
    const typeMap: Record<string, string> = {
      'Land': 'RESIDENTIAL_LAND',
      'House': 'HOUSE',
      'Apartment': 'APARTMENT',
      'Shutter': 'SHOP',
    };

    const filtered = properties.filter(p => {
      if (verifiedOnly) {
        // All properties from API are verified
      }

      if (activeTypes.length > 0) {
        const propertyType = p.propertyType || '';
        const matchesType = activeTypes.some(type => 
          propertyType === typeMap[type] || 
          propertyType.toLowerCase().includes(type.toLowerCase())
        );
        if (!matchesType) return false;
      }

      return true;
    });

    setFilteredProperties(filtered);
    
    if (selectedPin && !filtered.find(p => p.id === selectedPin)) {
      setSelectedPin(filtered.length > 0 ? filtered[0].id : null);
    }
  }, [properties, verifiedOnly, activeTypes, activeRoads, activeFacings, selectedPin]);

  const toggleType = (t: string) => setActiveTypes(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t]);
  const toggleRoad = (t: string) => setActiveRoads(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t]);
  const toggleFacing = (t: string) => setActiveFacings(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t]);

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sort) {
      case 'Price ↑': return a.price - b.price;
      case 'Price ↓': return b.price - a.price;
      default: return 0;
    }
  });

  const handlePinClick = (id: string) => {
    setSelectedPin(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#2D5A27] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      {/* ✅ Same as Navbar - max-w-7xl with px-4 sm:px-6 lg:px-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Khand', color: '#14181D' }}>
            🗺️ Search Properties on Map
          </h1>
          <p className="text-sm" style={{ color: '#5C6570' }}>
            Find properties visually on the map with powerful filters
          </p>
        </motion.div>

        {/* Mobile tab switcher */}
        <div className="flex md:hidden gap-1 mb-4 rounded-lg p-1" style={{ background: '#EFEDE6' }}>
          {(['list', 'map'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1.5 rounded text-sm font-medium capitalize transition-colors"
              style={{ background: tab === t ? '#FFFFFF' : 'transparent', color: tab === t ? '#14181D' : '#5C6570' }}>
              {t}
            </button>
          ))}
        </div>

        {/* ✅ 3-COLUMN LAYOUT: Filters 20% | Properties 50% | Map 30% */}
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* ✅ COLUMN 1: Filters - Left Side (20%) */}
          <div className="md:w-1/5 lg:w-1/5 flex-shrink-0">
            <div className="space-y-4 sticky top-24">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>Filters</span>
                <button
                  className="text-xs hover:underline"
                  style={{ color: '#A4142C' }}
                  onClick={() => {
                    setActiveTypes([]);
                    setActiveRoads([]);
                    setActiveFacings([]);
                    setVerifiedOnly(true);
                  }}
                >
                  Clear all
                </button>
              </div>

              {/* Verified toggle */}
              <div className="rounded-lg border p-3" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <div className="font-semibold text-xs uppercase tracking-wide mb-2" style={{ color: '#14181D', fontFamily: 'IBM Plex Mono' }}>Trust</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setVerifiedOnly(v => !v)}
                    className="w-9 h-5 rounded-full relative transition-colors"
                    style={{ background: verifiedOnly ? '#186B4C' : '#D3CFC5' }}>
                    <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm"
                      style={{ left: verifiedOnly ? '18px' : '2px' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#333A44' }}>Verified only</span>
                </label>
              </div>

              {/* Price */}
              <div className="rounded-lg border p-3" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <div className="font-semibold text-xs uppercase tracking-wide mb-2" style={{ color: '#14181D', fontFamily: 'IBM Plex Mono' }}>Price (Rs Lakh)</div>
                <div className="flex gap-2 mb-2">
                  <input placeholder="Min" className="flex-1 px-2 py-1.5 rounded border text-sm font-mono"
                    style={{ borderColor: '#D3CFC5', background: '#F7F5F0', width: 0 }} />
                  <input placeholder="Max" className="flex-1 px-2 py-1.5 rounded border text-sm font-mono"
                    style={{ borderColor: '#D3CFC5', background: '#F7F5F0', width: 0 }} />
                </div>
                <input type="range" min={0} max={1000} className="w-full" style={{ accentColor: '#A4142C' }} />
              </div>

              {/* Type */}
              <div className="rounded-lg border p-3" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <div className="font-semibold text-xs uppercase tracking-wide mb-2" style={{ color: '#14181D', fontFamily: 'IBM Plex Mono' }}>Property type</div>
                <div className="flex flex-wrap gap-1.5">
                  {typeOptions.map(t => (
                    <FilterChip key={t} label={t} active={activeTypes.includes(t)} onClick={() => toggleType(t)} />
                  ))}
                </div>
              </div>

              {/* Road */}
              <div className="rounded-lg border p-3" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <div className="font-semibold text-xs uppercase tracking-wide mb-2" style={{ color: '#14181D', fontFamily: 'IBM Plex Mono' }}>Road access</div>
                <div className="flex flex-wrap gap-1.5">
                  {roadOptions.map(t => (
                    <FilterChip key={t} label={t} active={activeRoads.includes(t)} onClick={() => toggleRoad(t)} />
                  ))}
                </div>
              </div>

              {/* Facing */}
              <div className="rounded-lg border p-3" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <div className="font-semibold text-xs uppercase tracking-wide mb-2" style={{ color: '#14181D', fontFamily: 'IBM Plex Mono' }}>Facing</div>
                <div className="flex flex-wrap gap-1.5">
                  {facingOptions.map(t => (
                    <FilterChip key={t} label={t} active={activeFacings.includes(t)} onClick={() => toggleFacing(t)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ COLUMN 2: Properties List - Middle (50%) */}
          <div className="flex-1 md:w-1/2 lg:w-1/2">
            <div className="flex items-center justify-between mb-4 gap-3">
              <span className="font-semibold" style={{ fontFamily: 'Khand', fontSize: 17, color: '#14181D' }}>
                {sortedProperties.length} verified {sortedProperties.length === 1 ? 'property' : 'properties'}
              </span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="px-3 py-1.5 rounded border text-sm"
                style={{ borderColor: '#D3CFC5', background: '#FFFFFF', fontFamily: 'Mukta', color: '#333A44' }}>
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {sortedProperties.slice(0, 7).map(p => (
                <div key={p.id} onClick={() => setSelectedPin(p.id)} className="cursor-pointer">
                  <div className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow" style={{ borderColor: '#D3CFC5' }}>
                    <div className="flex gap-3">
                      {/* ✅ Property Image - Using getImageUrl helper */}
                      <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={getImageUrl(p.mainImage || p.images?.[0])} 
                          alt={p.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/2D5A27/FFFFFF?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{p.location}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="font-bold text-[#2D5A27] text-sm">{formatPrice(p.price)}</span>
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded">{p.propertyType}</span>
                          <span className="text-[10px] text-gray-500">{p.bedrooms} 🛏️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {sortedProperties.length > 7 && (
                <div className="rounded-lg border-2 border-dashed p-4 text-center"
                  style={{ borderColor: '#D9A93F', background: '#FAF1DC' }}>
                  <div className="font-semibold mb-1 text-sm" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                    {sortedProperties.length - 7} more results
                  </div>
                  <button className="px-3 py-1.5 rounded text-xs font-semibold transition-colors hover:bg-[#C21C38]"
                    style={{ background: '#A4142C', color: '#FFFFFF', fontFamily: 'Mukta' }}>
                    See all {sortedProperties.length} matches · Rs 999/month
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ✅ COLUMN 3: Map - Right Side (30%) */}
          <div className="md:w-[30%] lg:w-[30%] flex-shrink-0" style={{ minHeight: 700 }}>
            <MapPanel
              selected={selectedPin}
              properties={filteredProperties}
              allProperties={properties}
              onPinClick={handlePinClick}
              loading={loading}
              activeFilters={{
                types: activeTypes,
                roads: activeRoads,
                facings: activeFacings,
                verifiedOnly: verifiedOnly,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMap;