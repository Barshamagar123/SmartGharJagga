// src/components/admin/StatsCard.tsx

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  color: string;
  bgColor: string;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color,
  bgColor,
  iconColor = 'text-[#1B6B45]'
}) => {
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${isUp ? 'text-green-600' : 'text-red-600'}`}>
            {isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span>{change}</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;