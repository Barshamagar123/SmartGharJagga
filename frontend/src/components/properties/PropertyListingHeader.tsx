// src/components/properties/PropertyListingHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Filter, Grid3x3, List, SlidersHorizontal } from 'lucide-react';

interface PropertyListingHeaderProps {
  totalProperties: number;
  title?: string;
  subtitle?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const PropertyListingHeader: React.FC<PropertyListingHeaderProps> = ({
  totalProperties,
  title = "Properties",
  subtitle = "for you",
  viewMode = 'grid',
  onViewModeChange,
  showFilters = false,
  onToggleFilters,
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight"
            >
              {title} <span className="text-[#2D5A27]">{subtitle}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-[#475569] text-base md:text-lg mt-2"
            >
              {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} available across Nepal.
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2"
          >
            {/* Filter Toggle */}
            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showFilters
                    ? 'bg-[#2D5A27] text-white shadow-md shadow-[#2D5A27]/20'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#EDF5EC] hover:text-[#2D5A27]'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            )}

            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex bg-[#F8FAFC] rounded-lg p-1 border border-gray-100">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#2D5A27] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-[#2D5A27] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingHeader;