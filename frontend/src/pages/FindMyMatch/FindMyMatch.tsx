// src/pages/FindMyMatch/FindMyMatch.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatching } from '../../hooks/useMatching';
import { useAuth } from '../../hooks/useAuth';
import MatchGauge from '../../components/common/MatchGauge';
import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';

const steps = ['01 Budget', '02 Where', '03 Size & type', '04 Must-haves'];

type Answers = {
  budget: string;
  budgetMin: number;
  budgetMax: number;
  location: string[];
  type: string[];
  size: string;
  road: string;
  parking: boolean;
};

// ... ChipGroup and other components remain the same ...

const FindMyMatch: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    preferences,
    matches,
    matchCount,
    loading,
    saving,
    error,
    savePreferences,
    loadMatches,
    learnFromBehavior,
  } = useMatching();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    budget: '',
    budgetMin: 0,
    budgetMax: 0,
    location: [],
    type: [],
    size: '',
    road: '',
    parking: false,
  });

  // ✅ Load existing preferences when available
  useEffect(() => {
    if (preferences) {
      setAnswers(prev => ({
        ...prev,
        budgetMin: preferences.budgetMin,
        budgetMax: preferences.budgetMax,
        // Convert location to array if needed
        location: preferences.location ? [preferences.location] : [],
        type: [preferences.propertyType?.toLowerCase() || ''],
        parking: preferences.parkingNeeded || false,
      }));
    }
  }, [preferences]);

  // ✅ Save preferences when user completes steps
  const handleSavePreferences = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show message
      alert('Please login to save your preferences');
      return;
    }

    const success = await savePreferences({
      budgetMin: answers.budgetMin || 1000000,
      budgetMax: answers.budgetMax || 50000000,
      location: answers.location[0] || 'Kathmandu',
      propertyType: (answers.type[0]?.toUpperCase() || 'HOUSE') as any,
      bedrooms: 0, // You can add this to your form
      bathrooms: 0, // You can add this to your form
      amenities: [],
      purpose: 'SALE' as any,
      parkingNeeded: answers.parking,
    });

    if (success) {
      await loadMatches();
    }
  };

  // ... rest of the component logic ...

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Step tracker */}
      {/* ... */}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: questions */}
        <div>
          {/* Step content */}
          {/* ... */}

          <div className="flex gap-3">
            {/* Back button */}
            {/* Continue button - now saves preferences */}
            <button
              onClick={() => {
                if (step === 3) {
                  handleSavePreferences();
                } else {
                  setStep(s => s + 1);
                }
              }}
              className="px-5 py-2.5 rounded text-sm font-semibold transition-colors hover:bg-[#23461E]"
              style={{ background: '#2D5A27', color: '#FFFFFF', fontFamily: 'Mukta' }}
              disabled={saving}
            >
              {saving ? 'Saving...' : step < 3 ? 'Continue →' : 'See my matches'}
            </button>
          </div>
        </div>

        {/* Right: live results - NOW FROM API */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-mono" style={{ color: '#5C6570' }}>
              MATCHING AS YOU ANSWER
            </span>
          </div>
          <div className="font-bold mb-4" style={{ fontFamily: 'Khand', fontSize: 32, color: '#14181D' }}>
            {loading ? 'Loading...' : `${matchCount} verified properties still match`}
          </div>

          <div className="space-y-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-11 h-11 rounded-full bg-gray-200" />
                  <div className="w-14 h-14 rounded bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              ))
            ) : matches.length > 0 ? (
              matches.slice(0, 5).map((match) => (
                <Link
                  key={match.propertyId}
                  to={`/property/${match.propertyId}`}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-shadow hover:shadow-sm"
                  style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}
                  onClick={() => {
                    // ✅ Learn from behavior when user clicks a match
                    if (isAuthenticated) {
                      learnFromBehavior(match.propertyId);
                    }
                  }}
                >
                  <MatchGauge 
                    score={Math.round(match.matchScore * 100)} 
                    size={44} 
                  />
                  <img
                    src={match.mainImage || '/placeholder-property.jpg'}
                    alt={match.propertyTitle}
                    className="w-14 h-14 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-semibold" style={{ color: '#14181D' }}>
                      Rs {match.price.toLocaleString()}
                    </div>
                    <div className="truncate text-sm" style={{ fontFamily: 'Khand', fontSize: 14, color: '#14181D' }}>
                      {match.propertyTitle}
                    </div>
                    <div className="text-[11px]" style={{ color: '#5C6570' }}>
                      {match.matchPercentage} match · {match.location}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No matches found. Try adjusting your preferences.</p>
              </div>
            )}

            {/* Paywall card - dynamic */}
            {matchCount > 5 && (
              <div className="rounded-lg border p-5" style={{ background: '#FAF1DC', borderColor: '#D9A93F' }}>
                <div className="font-bold mb-1" style={{ fontFamily: 'Khand', fontSize: 18, color: '#14181D' }}>
                  {matchCount - 5} more properties scored above 60%
                </div>
                <p className="text-sm mb-1" style={{ color: '#5C6570' }}>
                  Verified properties ready to view
                </p>
                <p className="text-sm font-mono font-semibold mb-4" style={{ color: '#B07C1E' }}>
                  Rs 999/month
                </p>
                <button
                  className="w-full py-2.5 rounded text-sm font-semibold mb-3 transition-colors hover:bg-[#23461E]"
                  style={{ background: '#2D5A27', color: '#FFFFFF', fontFamily: 'Mukta' }}
                >
                  See all {matchCount} matches
                </button>
                <div className="flex justify-center gap-2 flex-wrap">
                  {['eSewa', 'Khalti', 'IME Pay'].map(p => (
                    <span
                      key={p}
                      className="text-[11px] px-2 py-0.5 rounded border font-mono"
                      style={{ borderColor: '#D3CFC5', color: '#5C6570', background: '#FFFFFF' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyMatch;