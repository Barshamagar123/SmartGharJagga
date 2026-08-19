// src/components/Favorites/FavoritesStats.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Eye, Calendar } from 'lucide-react';

interface FavoritesStatsProps {
  stats: {
    total: number;
    totalValue: number;
    totalViews: number;
    newThisWeek: number;
  };
  formatPrice: (price: number) => string;
}

const FavoritesStats: React.FC<FavoritesStatsProps> = ({ stats, formatPrice }) => {
  const statItems = [
    { 
      icon: Heart, 
      label: 'Saved', 
      value: stats.total, 
      suffix: 'Properties',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    { 
      icon: TrendingUp, 
      label: 'Total Value', 
      value: formatPrice(stats.totalValue), 
      suffix: '',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      icon: Eye, 
      label: 'Total Views', 
      value: stats.totalViews.toLocaleString(), 
      suffix: 'Views',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Calendar, 
      label: 'New This Week', 
      value: stats.newThisWeek, 
      suffix: 'Added',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${item.bgColor} rounded-xl`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-[#0F172A]">
                    {item.value}
                  </p>
                  {item.suffix && (
                    <p className="text-xs text-[#475569]">
                      {item.suffix}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesStats;