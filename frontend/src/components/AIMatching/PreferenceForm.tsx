// src/pages/AIMatching/components/PreferenceForm.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card, { CardDescription, CardTitle, CardContent } from '../common/Card/Card';
import {Button} from '../common/Button/Button'
import { Badge } from '../common/Badge/Badge';

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
  const [budget, setBudget] = useState(5000000);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [purpose, setPurpose] = useState('BUY');

  const amenities = [
    { id: 'parking', label: '🚗 Parking', selected: false },
    { id: 'garden', label: '🌿 Garden', selected: false },
    { id: 'pool', label: '🏊 Pool', selected: false },
    { id: 'gym', label: '💪 Gym', selected: false },
    { id: 'security', label: '🛡️ Security', selected: false },
    { id: 'elevator', label: '🛗 Elevator', selected: false },
    { id: 'ac', label: '❄️ AC', selected: false },
    { id: 'furnished', label: '🛋️ Furnished', selected: false },
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

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
      <Card variant="elevated" padding="lg" className="border border-[var(--color-primary-border)]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-xl">Your Preferences</CardTitle>
              <CardDescription>Tell us what you're looking for</CardDescription>
            </div>
            {showResults && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFindMatches();
            }}
            className="space-y-5"
          >
            {/* Purpose */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                Purpose
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPurpose('BUY')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    purpose === 'BUY'
                      ? 'bg-[#2D5A27] text-white shadow-md'
                      : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
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
                      : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                  }`}
                >
                  📋 Rent
                </button>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                Budget (Rs {budget.toLocaleString()})
              </label>
              <input
                type="range"
                min="100000"
                max="20000000"
                step="500000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-[var(--color-primary-border)] rounded-lg appearance-none cursor-pointer accent-[#2D5A27]"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mt-1">
                <span>Rs 1 Lakh</span>
                <span>Rs 2 Cr</span>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                placeholder="e.g. Lalitpur, Kathmandu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="bungalow">Bungalow</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
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
                        : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                    }`}
                  >
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Lock */}
            <div className="bg-[#E8F0E4] rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#2D5A27]">Premium Feature</p>
                <p className="text-xs text-[#4A7D42]">Upgrade to Premium for unlimited matches</p>
              </div>
              <Badge variant="gold">Premium</Badge>
            </div>

            {/* Buttons */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Finding Matches..."
              className="font-semibold"
            >
              {isLoading ? 'Analyzing...' : 'Find Matches 🔍'}
            </Button>

            <p className="text-xs text-[var(--color-text-tertiary)] text-center">
              {isLoading ? 'AI is analyzing your preferences...' : 'Powered by AI Cosine Similarity Matching'}
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PreferenceForm;