// src/pages/Home/components/HeroSection.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button/Button';

const HeroSection: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="relative min-h-[35vh] md:min-h-[40vh] lg:min-h-[45vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col items-center"
        >
          {/* Marquee Headline */}
          <div className="overflow-hidden w-full">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex whitespace-nowrap"
            >
              <span className="text-xl sm:text-2xl md:text-6xl lg:text-6xl font-bold text-white drop-shadow-lg px-4">
                <span className="text-[#D4AF37]">घर, जग्गा, अपार्टमेन्ट</span>
                <span className="text-white"> र व्यावसायिक सम्पत्ति</span>
                <span className="text-[#D4AF37]"> को लागि</span>
                <span className="text-white"> भरपर्दो मञ्च</span>
                <span className="text-[#D4AF37] ml-4">✦</span>
              </span>
              <span className="text-xl sm:text-2xl md:text-6xl lg:text-6xl font-bold text-white drop-shadow-lg px-4">
                <span className="text-[#D4AF37]">घर, जग्गा, अपार्टमेन्ट</span>
                <span className="text-white"> र व्यावसायिक सम्पत्ति</span>
                <span className="text-[#D4AF37]"> को लागि</span>
                <span className="text-white"> भरपर्दो मञ्च</span>
                <span className="text-[#D4AF37] ml-4">✦</span>
              </span>
            </motion.div>
          </div>

          {/* Sub-headline */}
          <motion.p
            className="mt-2 text-xs sm:text-sm text-white/80 max-w-2xl mx-auto drop-shadow-md"
            variants={fadeInUp}
          >
            नेपालको अग्रणी सम्पत्ति बजारमा <span className="text-[#D4AF37] font-semibold">५००+</span> विश्वसनीय सूचीहरू
          </motion.p>

          {/* Search Box */}
          <motion.div
            className="mt-3 w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-white/30"
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row gap-1.5">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D5A27] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="स्थान, जस्तै: ललितपुर"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all"
                />
              </div>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all min-w-[100px] cursor-pointer"
              >
                <option value="">सबै प्रकार</option>
                <option value="house">घर</option>
                <option value="apartment">अपार्टमेन्ट</option>
                <option value="villa">भिल्ला</option>
                <option value="land">जग्गा</option>
                <option value="commercial">व्यावसायिक</option>
              </select>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D5A27] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="मूल्य दायरा"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                className="min-w-[80px] py-1.5 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs"
                leftIcon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              >
                खोजी
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] text-white/70"
            variants={fadeInUp}
          >
            <span>५००+ सम्पत्तिहरू</span>
            <span className="w-px h-3 bg-white/30" />
            <span>३५०+ खुसी ग्राहकहरू</span>
            <span className="w-px h-3 bg-white/30" />
            <span>५०+ विज्ञ एजेन्टहरू</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;