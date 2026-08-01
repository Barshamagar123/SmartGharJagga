// src/components/property/PropertyFormStep2.tsx

import React, { useState } from 'react';
import { Input } from '../common/Input/Input';
import { Crosshair, Loader2 } from 'lucide-react';

interface Step2Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep2: React.FC<Step2Props> = ({ formData, updateField }) => {
  const [loading, setLoading] = useState(false);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateField('latitude', pos.coords.latitude);
          updateField('longitude', pos.coords.longitude);
          setLoading(false);
        },
        () => {
          alert('Unable to get location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">📍 Location</h3>
      <p className="text-sm text-gray-500">Where is your property located?</p>

      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Location / Address *"
          placeholder="e.g. Damak, Jhapa"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Latitude"
            type="number"
            step="any"
            placeholder="e.g. 26.6579"
            value={formData.latitude || ''}
            onChange={(e) => updateField('latitude', parseFloat(e.target.value) || null)}
          />
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
          disabled={loading}
          className="text-sm text-[#2D5A27] hover:text-[#23461E] flex items-center gap-2 font-medium disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
          {loading ? 'Getting location...' : 'Use my current location'}
        </button>

        {/* Map Preview */}
        {formData.latitude && formData.longitude && GOOGLE_MAPS_API_KEY && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location Preview</label>
            <div className="h-56 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`}
                title="Property Location"
              />
            </div>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <span>
                📍 {formData.latitude}, {formData.longitude}
              </span>
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
