// src/components/property/PropertyFormStep2.tsx

import React, { useState } from 'react';
import { Input } from '../common/Input/Input';
import { MapPin, Crosshair } from 'lucide-react';

interface PropertyFormStep2Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep2: React.FC<PropertyFormStep2Props> = ({
  formData,
  updateField,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  // ✅ Get current location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField('latitude', position.coords.latitude);
          updateField('longitude', position.coords.longitude);
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">📍 Location</h3>
      <p className="text-sm text-gray-500">Where is your property located?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address / Location */}
        <div className="md:col-span-2">
          <Input
            label="Location / Address"
            placeholder="e.g. Sankhu, Kathmandu"
            value={formData.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            required
          />
        </div>

        {/* Latitude & Longitude */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              placeholder="e.g. 27.7172"
              value={formData.latitude || ''}
              onChange={(e) => updateField('latitude', parseFloat(e.target.value) || null)}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="e.g. 85.3240"
              value={formData.longitude || ''}
              onChange={(e) => updateField('longitude', parseFloat(e.target.value) || null)}
            />
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="mt-3 text-sm text-[#2D5A27] hover:text-[#23461E] flex items-center gap-2 font-medium"
          >
            <Crosshair className="w-4 h-4" />
            {loadingLocation ? 'Getting location...' : 'Use my current location'}
          </button>
        </div>

        {/* Map Preview */}
        {(formData.latitude && formData.longitude) && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Location Preview
            </label>
            <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${formData.latitude},${formData.longitude}&zoom=15`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFormStep2;