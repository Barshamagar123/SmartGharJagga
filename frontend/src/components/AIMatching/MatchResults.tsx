// src/pages/AIMatching/components/MatchResults.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMatching } from '../../hooks/useMatching';
import { getImageUrl } from '../../utils/imageUtils';


interface MatchResultsProps {
  onLearnFromBehavior?: (propertyId: string) => void;
}

const MatchResults: React.FC<MatchResultsProps> = ({ onLearnFromBehavior }) => {
  const { matches, matchCount, loading, learnFromBehavior } = useMatching();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // ✅ Matches are already top 3 from the hook
  const sortedMatches = [...matches].sort((a, b) => b.matchScore - a.matchScore);
  
  // ✅ No pagination needed for top 3, but keep it if you want
  const totalPages = Math.ceil(sortedMatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedMatches.slice(startIndex, startIndex + itemsPerPage);

  const getMatchColor = (score: number) => {
    if (score >= 0.85) return 'bg-green-500 text-white';
    if (score >= 0.65) return 'bg-blue-500 text-white';
    if (score >= 0.50) return 'bg-yellow-500 text-white';
    return 'bg-gray-400 text-white';
  };

  const getMatchLabel = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 85) return '🌟 Excellent Match';
    if (percentage >= 65) return '👍 Good Match';
    if (percentage >= 50) return '👌 Fair Match';
    return '💡 Possible Match';
  };

  const handlePropertyClick = (propertyId: string) => {
    if (learnFromBehavior) {
      learnFromBehavior(propertyId);
    }
    if (onLearnFromBehavior) {
      onLearnFromBehavior(propertyId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900">No Matches Found</h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your preferences to find more properties
        </p>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Top 3 AI Matches
          </h2>
          <p className="text-sm text-gray-500">
            Showing your top {sortedMatches.length} matched properties
          </p>
        </div>
        {matchCount > 3 && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">
              +{matchCount - 3} more matches available
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">
            🎯 AI Powered
          </span>
        </div>
      </motion.div>

      {/* Results - Only Top 3 */}
      {currentItems.map((property) => (
        <motion.div key={property.propertyId} variants={fadeInUp}>
          <Link
            to={`/property/${property.propertyId}`}
            onClick={() => handlePropertyClick(property.propertyId)}
            className="block bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={getImageUrl(property.mainImage || property.images?.[0])}
                  alt={property.propertyTitle}
                  className="w-full h-48 md:h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/2D5A27/FFFFFF?text=No+Image';
                  }}
                />
                {/* Match Score Badge */}
                <div className="absolute top-3 right-3">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white ${getMatchColor(
                        property.matchScore
                      )}`}
                    >
                      <span className="text-xl font-bold">{Math.round(property.matchScore * 100)}%</span>
                      <span className="text-[8px] font-medium uppercase">Match</span>
                    </div>
                  </div>
                </div>
                {/* Rank Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    #{(sortedMatches.indexOf(property) + 1)} Match
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">
                      {property.propertyType.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getMatchColor(property.matchScore)}`}
                    >
                      {getMatchLabel(property.matchScore)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-[#2D5A27] transition-colors">
                    {property.propertyTitle}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <span>📍</span> {property.location}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                    {property.bedrooms > 0 && <span>🛏️ {property.bedrooms} Beds</span>}
                    {property.bathrooms > 0 && <span>🛁 {property.bathrooms} Baths</span>}
                  </div>

                  <div className="mt-3">
                    <span className="text-2xl font-bold text-[#2D5A27]">
                      Rs {(property.price / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      AI Match: {Math.round(property.matchScore * 100)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          property.matchScore >= 0.85
                            ? 'bg-green-500'
                            : property.matchScore >= 0.65
                            ? 'bg-blue-500'
                            : property.matchScore >= 0.50
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${Math.round(property.matchScore * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#2D5A27]">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* ✅ Show "More Matches" button if there are more than 3 */}
      {matchCount > 3 && (
        <motion.div variants={fadeInUp}>
          <div className="bg-gradient-to-r from-[#E8F0E4] to-[#2D5A27]/10 rounded-xl p-6 text-center border border-[#2D5A27]/20">
            <p className="text-sm text-gray-600">
              You have {matchCount - 3} more matches waiting for you!
            </p>
            <button
              onClick={() => window.location.href = '/properties'}
              className="mt-3 px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors text-sm font-medium"
            >
              View All {matchCount} Matches
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MatchResults;