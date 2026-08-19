// src/pages/AIMatching/components/PreferenceForm.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';
import { useMatching } from '../../hooks/useMatching';


interface PreferenceFormProps {
  onFindMatches: () => void;
  isLoading: boolean;
  onReset: () => void;
  showResults: boolean;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({
  onFindMatches,
  isLoading,
  onReset,
  showResults,
}) => {
  const { isAuthenticated } = useAuth();
  const { preferences, savePreferences } = useMatching();
  
  const [budgetMin, setBudgetMin] = useState(1000000);
  const [budgetMax, setBudgetMax] = useState(50000000);
  const [location, setLocation] = useState('Kathmandu');
  const [propertyType, setPropertyType] = useState('HOUSE');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [purpose, setPurpose] = useState('SALE');
  const [parkingNeeded, setParkingNeeded] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const amenities = [
    { id: 'parking', label: '🚗 Parking' },
    { id: 'garden', label: '🌿 Garden' },
    { id: 'pool', label: '🏊 Pool' },
    { id: 'gym', label: '💪 Gym' },
    { id: 'security', label: '🛡️ Security' },
    { id: 'elevator', label: '🛗 Elevator' },
    { id: 'ac', label: '❄️ AC' },
    { id: 'furnished', label: '🛋️ Furnished' },
  ];

  // ✅ Load existing preferences
  useEffect(() => {
    if (preferences) {
      setBudgetMin(preferences.budgetMin || 1000000);
      setBudgetMax(preferences.budgetMax || 50000000);
      setLocation(preferences.location || 'Kathmandu');
      setPropertyType(preferences.propertyType || 'HOUSE');
      setBedrooms(preferences.bedrooms || 0);
      setBathrooms(preferences.bathrooms || 0);
      setPurpose(preferences.purpose || 'SALE');
      setParkingNeeded(preferences.parkingNeeded || false);
      setSelectedAmenities(preferences.amenities || []);
    }
  }, [preferences]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // ✅ Validate before submitting
  const validateForm = () => {
    if (!location || location.trim() === '') {
      setError('Please enter a location');
      return false;
    }
    if (budgetMin <= 0) {
      setError('Minimum budget must be greater than 0');
      return false;
    }
    if (budgetMax <= budgetMin) {
      setError('Maximum budget must be greater than minimum budget');
      return false;
    }
    if (!propertyType) {
      setError('Please select a property type');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      alert('Please login to save preferences and find matches');
      return;
    }

    // ✅ Validate form
    if (!validateForm()) {
      return;
    }

    // ✅ Prepare data for backend - MATCHING YOUR BACKEND SCHEMA
    const preferencesData = {
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      location: location.trim(),
      propertyType: propertyType.toUpperCase(), // HOUSE, APARTMENT, VILLA, etc.
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: selectedAmenities,
      purpose: purpose, // SALE or RENT
      parkingNeeded: parkingNeeded,
    };

    console.log('📤 Sending preferences:', preferencesData);

    try {
      const result = await savePreferences(preferencesData);
      if (result) {
        onFindMatches();
      }
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to save preferences. Please try again.');
      }
    }
  };

  // ✅ Property type options (matching your backend enum)
  const propertyTypeOptions = [
    { value: 'HOUSE', label: 'House' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'RESIDENTIAL_LAND', label: 'Residential Land' },
    { value: 'COMMERCIAL_LAND', label: 'Commercial Land' },
    { value: 'AGRICULTURAL_LAND', label: 'Agricultural Land' },
    { value: 'INDUSTRIAL_LAND', label: 'Industrial Land' },
    { value: 'SHOP', label: 'Shop' },
    { value: 'OFFICE', label: 'Office' },
    { value: 'WAREHOUSE', label: 'Warehouse' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESTAURANT', label: 'Restaurant' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="sticky top-24"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Preferences</h2>
            <p className="text-sm text-gray-500">Tell us what you're looking for</p>
          </div>
          {showResults && (
            <button
              onClick={onReset}
              className="text-sm text-[#2D5A27] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            ⚠️ Please login to save preferences and get AI matches
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Purpose */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Purpose
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPurpose('SALE')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  purpose === 'SALE'
                    ? 'bg-[#2D5A27] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                🏠 Buy
              </button>
              <button
                type="button"
                onClick={() => setPurpose('RENT')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  purpose === 'RENT'
                    ? 'bg-[#2D5A27] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 Rent
              </button>
            </div>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Min Budget (Rs)
              </label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                placeholder="Min"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Max Budget (Rs)
              </label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Preferred Location
            </label>
            <input
              type="text"
              placeholder="e.g. Kathmandu, Lalitpur"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
            >
              {propertyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={5}>5+</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </div>

          {/* Parking */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Parking Required?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setParkingNeeded(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  parkingNeeded
                    ? 'bg-[#2D5A27] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✅ Yes
              </button>
              <button
                type="button"
                onClick={() => setParkingNeeded(false)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  !parkingNeeded
                    ? 'bg-[#2D5A27] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                ❌ No
              </button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                    selectedAmenities.includes(amenity.id)
                      ? 'bg-[#2D5A27] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {amenity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={isLoading || !isAuthenticated}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
              isLoading || !isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2D5A27] hover:bg-[#23461E] shadow-lg shadow-[#2D5A27]/20'
            }`}
          >
            {isLoading ? '⏳ Analyzing...' : '🔍 Find Matches'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {isAuthenticated 
              ? 'Powered by AI Cosine Similarity Matching' 
              : 'Please login to use AI matching'}
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default PreferenceForm;