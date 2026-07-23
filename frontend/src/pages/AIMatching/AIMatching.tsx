// src/pages/AIMatching/AIMatching.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/common/Button/Button';
import { Card, CardTitle, CardDescription, CardContent } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import PreferenceForm from '../../components/AIMatching/PreferenceForm';
import MatchResults from '../../components/AIMatching/MatchResults';

const AIMatching: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMatches = () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F0E4] rounded-full border border-[#2D5A27]/10 mb-4">
            <span className="text-2xl">🤖</span>
            <span className="text-sm font-semibold text-[#2D5A27]">AI-Powered Matching</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            Find Your <span className="text-[#2D5A27]">Perfect Match</span>
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Tell us what you're looking for, and our AI will find the best properties that match your preferences.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Preference Form */}
          <div className="lg:col-span-2">
            <PreferenceForm
              onFindMatches={handleFindMatches}
              isLoading={isLoading}
              onReset={handleReset}
              showResults={showResults}
            />
          </div>

          {/* Right: Match Results */}
          <div className="lg:col-span-3">
            {showResults ? (
              <MatchResults />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <Card variant="elevated" padding="lg" className="w-full text-center border border-[var(--color-primary-border)]">
                  <CardContent className="py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <CardTitle className="text-2xl">No Matches Yet</CardTitle>
                    <CardDescription className="mt-2 max-w-md mx-auto">
                      Fill in your preferences on the left and click "Find Matches" to see AI-powered property recommendations.
                    </CardDescription>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">🏠 Houses</span>
                      <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">🏢 Apartments</span>
                      <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">🏡 Villas</span>
                      <span className="px-3 py-1 bg-[#E8F0E4] text-[#2D5A27] text-xs rounded-full">🌄 Land</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatching;