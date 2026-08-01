// src/components/admin/StatusBadge.tsx

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    active: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    approved: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    pending: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    blocked: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    rejected: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    sold: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    inactive: { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
  };

  const defaultConfig = { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
  const { color, dot } = config[status.toLowerCase() as keyof typeof config] || defaultConfig;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${color} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

export default StatusBadge;