// src/components/property/PropertyFormStep2.tsx

import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input/Input';
import { Crosshair, Loader2, MapPin, AlertCircle } from 'lucide-react';

interface Step2Props {
  formData: any;
  updateField: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const PropertyFormStep2: React.FC<Step2Props> = ({ formData, updateField, onValidationChange }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ✅ Validate
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'location':
        if (!value || value.trim().length < 2) {
          return 'Please enter a valid location';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const isValid = formData.location && formData.location.trim().length >= 2 && !hasErrors;
    if (onValidationChange) onValidationChange(isValid);
  }, [formData, errors]);

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
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#2D5A27]" />
          Location
        </h3>
        <p className="text-sm text-gray-500 mt-1">Where is your property located?</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location / Address *
          </label>
          <input
            placeholder="e.g. Damak, Jhapa"
            value={formData.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all duration-200 text-lg"
          />
          {touched.location && errors.location && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.location}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 26.6579"
              value={formData.latitude || ''}
              onChange={(e) => updateField('latitude', parseFloat(e.target.value) || null)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 87.7014"
              value={formData.longitude || ''}
              onChange={(e) => updateField('longitude', parseFloat(e.target.value) || null)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-[#2D5A27] hover:text-[#23461E] font-medium transition-colors duration-200 disabled:opacity-50 bg-[#EDF5EC] px-4 py-2.5 rounded-xl hover:bg-[#D4E8D0] w-fit"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
          {loading ? 'Getting location...' : '📍 Use my current location'}
        </button>

        {/* Map Preview */}
        {formData.latitude && formData.longitude && GOOGLE_MAPS_API_KEY && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">📍 Location Preview</label>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`}
                title="Property Location"
                className="w-full"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </span>
              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D5A27] hover:underline font-medium flex items-center gap-1"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFormStep2;