// src/components/Favorites/FavoritesHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface FavoritesHeaderProps {
  totalFavorites: number;
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ totalFavorites }) => {
  return (
    <div className="bg-white border-b border-gray-100">
      {/* ✅ SAME PADDING AS PropertyHeader - px-8, max-w-7xl */}
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight"
        >
          My <span className="text-[#2D5A27]">Favorites</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-[#475569] text-base md:text-lg mt-2"
        >
          {totalFavorites} {totalFavorites === 1 ? 'property' : 'properties'} saved to your wishlist
        </motion.p>
      </div>
    </div>
  );
};

export default FavoritesHeader;