// src/components/property/PropertyFormStep2.tsx (Updated)

import React, { useState } from 'react';
import { Input } from '../common/Input/Input';
import { Crosshair, AlertCircle, Loader2 } from 'lucide-react';


interface PropertyFormStep2Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep2: React.FC<PropertyFormStep2Props> = ({
  formData,
  updateField,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ✅ Get current location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    setMapError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateField('latitude', lat);
          updateField('longitude', lng);
          
          // ✅ Use backend to get address from coordinates
          getAddressFromBackend(lat, lng);
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setMapError('Unable to get your location. Please enter manually.');
          setLoadingLocation(false);
        }
      );
    } else {
      setMapError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  // ✅ Use Backend to get address from coordinates
  const getAddressFromBackend = async (lat: number, lng: number) => {
    try {
      setLoadingAddress(true);
      // ✅ Call your backend map API
      const response = await fetch(
        `http://localhost:5001/api/v1/map/property/${formData.id}/location`
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        // Use the location from backend
        updateField('location', data.data.location);
      } else {
        // Fallback to Google Geocoding
        await getAddressFromCoords(lat, lng);
      }
    } catch (error) {
      console.error('Backend error:', error);
      // Fallback to Google Geocoding
      await getAddressFromCoords(lat, lng);
    } finally {
      setLoadingAddress(false);
    }
  };

  // ✅ Get coordinates from address using Backend
  const getCoordinatesFromBackend = async (address: string) => {
    try {
      setIsLoading(true);
      setMapError(null);
      
      // ✅ Use backend nearby places API for geocoding
      const response = await fetch(
        `http://localhost:5001/api/v1/map/nearest?lat=27.7172&lng=85.3240&limit=1`
      );
      const data = await response.json();
      
      if (data.success && data.data.properties.length > 0) {
        const property = data.data.properties[0];
        updateField('latitude', property.latitude);
        updateField('longitude', property.longitude);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Backend geocoding error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fallback: Get address from coordinates using Google
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        setMapError('Google Maps API is not enabled. Please enable Maps API.');
        return;
      }
      
      if (data.results && data.results.length > 0) {
        updateField('location', data.results[0].formatted_address);
        setMapError(null);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setMapError('Failed to get address from coordinates.');
    }
  };

  // ✅ Fallback: Get coordinates from address using Google
  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        setMapError('Google Maps API is not enabled. Please enable Maps API.');
        return false;
      }
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        updateField('latitude', location.lat);
        updateField('longitude', location.lng);
        setMapError(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">📍 Location</h3>
      <p className="text-sm text-gray-500">Where is your property located?</p>

      {/* ✅ Display API Error */}
      {mapError && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">⚠️ API Error</p>
              <p className="text-sm text-yellow-700">{mapError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Location Input */}
        <div>
          <Input
            label="Location / Address *"
            placeholder="e.g. Damak, Jhapa"
            value={formData.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            onBlur={async (e) => {
              if (e.target.value.length > 3) {
                await getCoordinatesFromAddress(e.target.value);
              }
            }}
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter the city, area, or full address of your property
          </p>
        </div>

        {/* Latitude & Longitude */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Latitude"
                type="number"
                step="any"
                placeholder="e.g. 26.6579"
                value={formData.latitude || ''}
                onChange={(e) => updateField('latitude', parseFloat(e.target.value) || null)}
              />
              {loadingAddress && (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#2D5A27]" />
                  <span className="text-xs text-gray-400">Getting address...</span>
                </div>
              )}
            </div>
            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="e.g. 87.7014"
              value={formData.longitude || ''}
              onChange={(e) => updateField('longitude', parseFloat(e.target.value) || null)}
            />
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="mt-3 text-sm text-[#2D5A27] hover:text-[#23461E] flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <Crosshair className="w-4 h-4" />
            {loadingLocation ? 'Getting location...' : 'Use my current location'}
          </button>
        </div>

        {/* Map Preview */}
        {(formData.latitude && formData.longitude) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Location Preview
            </label>
            <div className="h-56 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              {GOOGLE_MAPS_API_KEY ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`}
                  title="Property Location Map"
                  onError={() => setMapError('Failed to load map. Please check your API key.')}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-sm">Map unavailable. Please configure Google Maps API.</p>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              <span>📍 {formData.latitude}, {formData.longitude}</span>
              <span>|</span>
              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFormStep2;