// src/components/properties/PropertyHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface PropertyHeaderProps {
  totalProperties: number;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ totalProperties }) => {
  return (
    <div className="bg-white border-b border-[var(--color-primary-border)]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 md:pt-14 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight"
        >
          Properties <span className="text-[#2D5A27]">for you</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-[var(--color-text-secondary)] text-lg mt-3"
        >
          {totalProperties} homes matching your filters across Nepal.
        </motion.p>
      </div>
    </div>
  );
};

export default PropertyHeader;