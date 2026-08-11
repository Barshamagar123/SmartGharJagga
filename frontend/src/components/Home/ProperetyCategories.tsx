// src/pages/Home/components/PropertyCategories.tsx

import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { icon: '🏠', label: 'Houses', count: '128' },
  { icon: '🌄', label: 'Residential Land', count: '61' },
  { icon: '🏭', label: 'Commercial Land', count: '28' },
  { icon: '🌾', label: 'Agricultural Land', count: '15' },
  { icon: '⚙️', label: 'Industrial Land', count: '12' },
  { icon: '🛍️', label: 'Shops', count: '45' },
  { icon: '📋', label: 'Offices', count: '33' },
  { icon: '📦', label: 'Warehouses', count: '18' },
  { icon: '🏨', label: 'Hotels', count: '9' },
  { icon: '🍽️', label: 'Restaurants', count: '21' },
];

const PropertyCategories: React.FC = () => {
  return (
    <section className="py-4 bg-white border-y border-[#2D5A27]/10 w-full overflow-hidden">
      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8">
          <motion.div
            drag="x"
            dragConstraints={{ left: -800, right: 0 }}
            dragElastic={0.05}
            className="flex items-center gap-3 py-2 cursor-grab active:cursor-grabbing"
            style={{ width: 'max-content' }}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#F8F6F3] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#2D5A27]/20"
              >
                <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="text-xs md:text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors whitespace-nowrap">
                  {category.label}
                </span>
                <span className="text-[10px] text-[var(--color-text-tertiary)] group-hover:text-white/70 transition-colors">
                  {category.count}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient Fade on Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default PropertyCategories;