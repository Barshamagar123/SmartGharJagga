// src/components/admin/StatsCard.tsx (With Gradient Support)

import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | string;
  color?: string;
  bgColor?: string;
  iconColor?: string;
  subtitle?: string;
  loading?: boolean;
  gradient?: boolean; // ✅ Add gradient support
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  change = '0%',
  trend = 'neutral',
  color = 'from-blue-500 to-blue-600',
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  subtitle,
  loading = false,
  gradient = false,
}) => {
  // ✅ Convert string to proper trend
  const getTrendType = (trendValue: string): 'up' | 'down' | 'neutral' => {
    if (trendValue === 'up' || trendValue === '+' || trendValue === 'positive') {
      return 'up';
    }
    if (trendValue === 'down' || trendValue === '-' || trendValue === 'negative') {
      return 'down';
    }
    return 'neutral';
  };

  const trendType = getTrendType(trend);
  const isUp = trendType === 'up';
  const isDown = trendType === 'down';
  const isNeutral = trendType === 'neutral';

  const displayValue = typeof value === 'number' && value === 0 ? '0' : value;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // ✅ Gradient card
  if (gradient) {
    return (
      <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1 truncate">{displayValue}</p>
            
            {subtitle && (
              <p className="text-xs text-white/60 mt-1 truncate">{subtitle}</p>
            )}
            
            {change && !isNeutral && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                isUp ? 'text-green-300' : 'text-red-300'
              }`}>
                {isUp ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                <span className="font-medium">{change}</span>
                <span className="text-white/50 text-xs ml-1">vs last month</span>
              </div>
            )}
            
            {change && isNeutral && (
              <div className="flex items-center gap-1 mt-2 text-sm text-white/50">
                <Minus className="w-3 h-3" />
                <span>{change}</span>
                <span className="text-white/40 text-xs ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div className="bg-white/20 p-3 rounded-xl flex-shrink-0 ml-3 backdrop-blur-sm">
            <Icon className={`w-5 h-5 text-white`} />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Regular card
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
            {displayValue}
          </p>
          
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>
          )}
          
          {change && !isNeutral && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              isUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {isUp ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span className="font-medium">{change}</span>
              <span className="text-gray-400 text-xs ml-1">vs last month</span>
            </div>
          )}
          
          {change && isNeutral && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <Minus className="w-3 h-3" />
              <span>{change}</span>
              <span className="text-gray-400 text-xs ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`${bgColor} p-3 rounded-xl flex-shrink-0 ml-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;