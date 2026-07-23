// src/pages/AIMatching/components/MatchResults.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../common/Badge/Badge';
import Card, { CardDescription, CardTitle, CardContent } from '../common/Card/Card';
import {Button} from '../common/Button/Button'

interface MatchProperty {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: string;
  matchScore: number;
  featured: boolean;
}

const MatchResults: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const matchedProperties: MatchProperty[] = [
    {
      id: 1,
      title: 'Aspen Ridge Villa',
      price: 'Rs 4.8 Cr',
      location: 'Lalitpur, Bhaisepati',
      beds: 5,
      baths: 4,
      sqft: '4,200',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      type: 'VILLA',
      matchScore: 95,
      featured: true,
    },
    {
      id: 2,
      title: 'Greenwood Townhouse',
      price: 'Rs 3.2 Cr',
      location: 'Kathmandu, Baluwatar',
      beds: 4,
      baths: 3,
      sqft: '3,100',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      type: 'HOUSE',
      matchScore: 87,
      featured: false,
    },
    {
      id: 3,
      title: 'Monsoon Loft',
      price: 'Rs 1.4 Cr',
      location: 'Kathmandu, Thamel',
      beds: 2,
      baths: 2,
      sqft: '1,350',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      type: 'APARTMENT',
      matchScore: 78,
      featured: false,
    },
    {
      id: 4,
      title: 'Hillside Estate',
      price: 'Rs 5.2 Cr',
      location: 'Kavre, Dhulikhel',
      beds: 5,
      baths: 5,
      sqft: '5,600',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'VILLA',
      matchScore: 92,
      featured: true,
    },
    {
      id: 5,
      title: 'Cedar Bungalow',
      price: 'Rs 2.6 Cr',
      location: 'Bhaktapur, Suryabinayak',
      beds: 3,
      baths: 3,
      sqft: '2,400',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'BUNGALOW',
      matchScore: 82,
      featured: false,
    },
    {
      id: 6,
      title: 'Riverstone Plot',
      price: 'Rs 95 Lakh',
      location: 'Pokhara, Lakeside',
      beds: 0,
      baths: 0,
      sqft: '5,600',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      type: 'LAND',
      matchScore: 65,
      featured: false,
    },
  ];

  // Sort by match score (highest first)
  const sortedProperties = [...matchedProperties].sort((a, b) => b.matchScore - a.matchScore);

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedProperties.slice(startIndex, startIndex + itemsPerPage);

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 75) return 'bg-blue-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    return 'bg-gray-400 text-white';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return '🌟 Excellent Match';
    if (score >= 75) return '👍 Good Match';
    if (score >= 60) return '👌 Fair Match';
    return '💡 Possible Match';
  };

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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Your AI Matches
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Showing {sortedProperties.length} properties matched to your preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="lg">
            🎯 AI Powered
          </Badge>
        </div>
      </motion.div>

      {/* Results */}
      {currentItems.map((property) => (
        <motion.div key={property.id} variants={fadeInUp}>
          <Card variant="hover" padding="none" className="overflow-hidden border border-[var(--color-primary-border)]">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 md:h-full object-cover"
                />
                {/* Match Score Badge */}
                <div className="absolute top-3 right-3">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white ${getMatchColor(
                        property.matchScore
                      )}`}
                    >
                      <span className="text-xl font-bold">{property.matchScore}%</span>
                      <span className="text-[8px] font-medium uppercase">Match</span>
                    </div>
                  </div>
                </div>
                {property.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold">⭐ Featured</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" size="sm">
                      {property.type}
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className={getMatchColor(property.matchScore)}
                    >
                      {getMatchLabel(property.matchScore)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-[#2D5A27] transition-colors">
                    {property.title}
                  </CardTitle>
                  <CardDescription className="text-sm flex items-center gap-1 mt-1">
                    <span>📍</span> {property.location}
                  </CardDescription>

                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-3">
                    {property.beds > 0 && <span>🛏️ {property.beds} Beds</span>}
                    {property.baths > 0 && <span>🛁 {property.baths} Baths</span>}
                    {property.sqft && <span>📐 {property.sqft} sqft</span>}
                  </div>

                  <div className="mt-3">
                    <span className="text-2xl font-bold text-[#2D5A27]">
                      {property.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-primary-border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text-tertiary)]">
                      AI Match: {property.matchScore}%
                    </span>
                    <div className="w-24 h-2 bg-[var(--color-primary-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          property.matchScore >= 90
                            ? 'bg-green-500'
                            : property.matchScore >= 75
                            ? 'bg-blue-500'
                            : property.matchScore >= 60
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${property.matchScore}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-lg hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={fadeInUp} className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === i + 1
                  ? 'bg-[#2D5A27] text-white'
                  : 'border border-[var(--color-primary-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Premium Upgrade Prompt */}
      <motion.div variants={fadeInUp}>
        <Card variant="elevated" padding="md" className="bg-gradient-to-r from-[#E8F0E4] to-[#2D5A27]/10 border border-[#2D5A27]/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <CardTitle className="text-base">Want More Matches?</CardTitle>
                <CardDescription>
                  Upgrade to Premium for unlimited AI matches and priority support
                </CardDescription>
              </div>
            </div>
            <Link to="/subscription">
              <Button variant="gold" size="md">
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MatchResults;