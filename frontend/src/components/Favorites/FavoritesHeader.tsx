// src/components/Favorites/FavoritesHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoritesHeaderProps {
  totalFavorites: number;
  notificationCount?: number;
  onShare?: () => void;
  onResetNotifications?: () => void;
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ 
  totalFavorites,
  notificationCount = 0,
  onShare,
  onResetNotifications
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
              My <span className="text-[#2D5A27]">Favorites</span>
            </h1>
            
            {/* Notification Badge */}
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {notificationCount} new
                </span>
                {onResetNotifications && (
                  <button
                    onClick={onResetNotifications}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
          
          <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
            <Link
              to="/properties"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Properties
            </Link>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-4 h-4" />
                Share Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesHeader;