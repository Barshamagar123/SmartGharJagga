// src/components/Matching/LocationStep.tsx - Simplified (No debounce)

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2, MapPin, TrendingUp } from 'lucide-react';
import { locationApi } from '../../services/api/location';

interface LocationStepProps {
  selected: string[];
  onToggle: (value: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ selected, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [popularLocations, setPopularLocations] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [allLocations, popular] = await Promise.all([
        locationApi.getAllLocations(),
        locationApi.getPopularLocations(12),
      ]);

      setLocations(allLocations);
      setPopularLocations(popular);
      setFilteredLocations(allLocations.slice(0, 12));
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations. Please try again.');
      setLocations([]);
      setPopularLocations([]);
      setFilteredLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // ✅ Simple search without debounce (searches on every keystroke)
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setFilteredLocations(showAll ? locations : locations.slice(0, 12));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await locationApi.searchLocations(value);
      setFilteredLocations(results);
    } catch (err) {
      console.error('Error searching locations:', err);
      const filtered = locations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(locations.slice(0, 12));
    }
  };

  const handleAddCustomLocation = () => {
    if (searchTerm.trim() && !locations.includes(searchTerm.trim())) {
      setLocations(prev => [...prev, searchTerm.trim()]);
      onToggle(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const displayLocations = searchTerm.trim() 
    ? filteredLocations 
    : showAll 
      ? locations 
      : locations.slice(0, 12);

  return (
    <div>
      <h2 className="font-bold mb-2" style={{ fontFamily: 'Khand', fontSize: 26, color: '#14181D' }}>
        Where do you want to be?
      </h2>
      <p className="text-sm mb-4" style={{ color: '#5C6570' }}>
        Search for a district or municipality. Select multiple locations.
      </p>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#5C6570' }} />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
            style={{
              borderColor: '#D3CFC5',
              background: '#FFFFFF',
              color: '#333A44',
              fontFamily: 'Mukta',
            }}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#2D5A27' }} />
          )}
          {searchTerm && !isSearching && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredLocations(locations.slice(0, 12));
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" style={{ color: '#5C6570' }} />
            </button>
          )}
        </div>
        
        {searchTerm && !locations.some(loc => loc.toLowerCase() === searchTerm.toLowerCase()) && (
          <button
            onClick={handleAddCustomLocation}
            className="mt-2 text-sm w-full text-left px-3 py-2 rounded-lg border border-dashed transition-colors"
            style={{
              borderColor: '#2D5A27',
              color: '#2D5A27',
              background: '#F5F9F4',
              fontFamily: 'Mukta',
            }}
          >
            + Add "{searchTerm}" as custom location
          </button>
        )}
      </div>

      {/* Selected locations tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((loc) => (
            <span
              key={loc}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style={{
                background: '#2D5A27',
                color: '#FFFFFF',
                fontFamily: 'Mukta',
              }}
            >
              <MapPin className="w-3 h-3" />
              {loc}
              <button
                onClick={() => onToggle(loc)}
                className="ml-1 hover:opacity-75"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Popular locations */}
      {!searchTerm && popularLocations.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#2D5A27' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#5C6570' }}>
              Popular Locations
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularLocations.slice(0, 6).map((loc) => {
              const isActive = selected.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => onToggle(loc)}
                  className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:scale-105"
                  style={{
                    background: isActive ? '#2D5A27' : '#F5F9F4',
                    color: isActive ? '#FFFFFF' : '#2D5A27',
                    border: isActive ? '1px solid #2D5A27' : '1px solid #D3CFC5',
                  }}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All locations */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#2D5A27' }} />
          <span className="ml-2 text-sm" style={{ color: '#5C6570' }}>Loading locations...</span>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchLocations}
            className="mt-2 text-sm font-medium hover:underline"
            style={{ color: '#2D5A27' }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {displayLocations.map((option) => {
              const isActive = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all hover:scale-105"
                  style={{
                    minHeight: 44,
                    background: isActive ? '#2D5A27' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#333A44',
                    border: isActive ? '1px solid #2D5A27' : '1px solid #D3CFC5',
                    fontFamily: 'Mukta',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {!searchTerm && locations.length > 12 && (
            <button
              onClick={handleShowAll}
              className="mt-3 text-sm font-medium hover:underline"
              style={{ color: '#2D5A27' }}
            >
              {showAll ? 'Show less' : `Show all ${locations.length} locations`}
            </button>
          )}

          {filteredLocations.length === 0 && searchTerm && !isSearching && (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: '#5C6570' }}>
                No locations found for "{searchTerm}"
              </p>
              <button
                onClick={handleAddCustomLocation}
                className="mt-2 text-sm font-medium hover:underline"
                style={{ color: '#2D5A27' }}
              >
                Add "{searchTerm}" as custom location
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-4 text-sm" style={{ color: '#5C6570' }}>
        {selected.length} location{selected.length !== 1 ? 's' : ''} selected
        {locations.length > 0 && ` · ${locations.length} total locations available`}
      </div>
    </div>
  );
};

export default LocationStep;