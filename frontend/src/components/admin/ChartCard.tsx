// src/components/admin/ChartCard.tsx

import React from 'react';

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar';
  data: any[];
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  height = 300,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center" style={{ height: height }}>
        {data && data.length > 0 ? (
          <div className="w-full h-full flex items-end justify-around gap-2">
            {data.map((item, index) => (
              <div
                key={index}
                className={`${type === 'bar' ? 'w-8' : 'w-12'} rounded-lg transition-all duration-500`}
                style={{
                  height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                  backgroundColor: type === 'line' ? '#1B6B45' : '#2D5A27',
                  minHeight: '20px',
                }}
              >
                <div className="text-center -mt-6 text-xs text-gray-600">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No data available</p>
        )}
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        {data?.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;