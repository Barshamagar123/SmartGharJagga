// src/components/Matching/MatchResults.tsx

import React from 'react';
import MatchCard from './MatchCard';

interface MatchResult {
  propertyId: string;
  propertyTitle: string;
  price: number;
  location: string;
  mainImage?: string;
  matchScore: number;
  matchPercentage: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType?: string;
  views?: number;
}

interface MatchResultsProps {
  matches: MatchResult[];
  matchCount: number;
  loading: boolean;
  showResults: boolean; // ✅ Control when to show results
  onLearn?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const MatchResults: React.FC<MatchResultsProps> = ({
  matches,
  matchCount,
  loading,
  showResults,
  onLearn,
  onFavorite,
}) => {
  // ✅ 1. DON'T SHOW ANYTHING if results are not ready
  if (!showResults) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <div className="text-6xl mb-4">🔮</div>
        <h3 className="text-xl font-semibold" style={{ color: '#14181D', fontFamily: 'Khand' }}>
          Complete all steps to see your matches
        </h3>
        <p className="text-sm mt-2" style={{ color: '#5C6570' }}>
          Answer all questions to get AI-powered property recommendations
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="text-xs ml-1" style={{ color: '#5C6570' }}>
            Waiting for your answers...
          </span>
        </div>
      </div>
    );
  }

  // ✅ 2. Show loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="w-16 h-16 rounded bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ 3. Show no matches found
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
        <div className="text-5xl mb-3">🔍</div>
        <p className="font-medium text-lg" style={{ color: '#14181D', fontFamily: 'Khand' }}>
          No matches found
        </p>
        <p className="text-sm mt-1" style={{ color: '#5C6570' }}>
          Try adjusting your preferences
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm font-medium hover:underline"
          style={{ color: '#2D5A27' }}
        >
          Start over
        </button>
      </div>
    );
  }

  // ✅ 4. Show top 3 matches
  const topMatches = matches.slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Match count header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: '#2D5A27' }}>
          🎯 {matchCount} properties match your preferences
        </span>
        <span className="text-xs" style={{ color: '#5C6570' }}>
          Sorted by match score
        </span>
      </div>

      {topMatches.map((match, index) => (
        <MatchCard
          key={match.propertyId}
          id={match.propertyId}
          title={match.propertyTitle}
          price={match.price}
          location={match.location}
          image={match.mainImage || '/placeholder-property.jpg'}
          matchScore={Math.round(match.matchScore * 100)}
          matchPercentage={match.matchPercentage}
          isVerified={match.isVerified}
          isFeatured={match.isFeatured}
          bedrooms={match.bedrooms}
          bathrooms={match.bathrooms}
          area={match.area}
          areaUnit={match.areaUnit}
          propertyType={match.propertyType}
          views={match.views}
          onLearn={onLearn}
          onFavorite={onFavorite}
          rank={index + 1}
        />
      ))}

      {matchCount > 3 && (
        <div className="rounded-lg border p-5 mt-2" style={{ background: '#FAF1DC', borderColor: '#D9A93F' }}>
          <div className="font-bold mb-1" style={{ fontFamily: 'Khand', fontSize: 18, color: '#14181D' }}>
            {matchCount - 3} more properties scored above 60%
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
            {['eSewa', 'Khalti', 'IME Pay'].map((p) => (
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
  );
};

export default MatchResults;