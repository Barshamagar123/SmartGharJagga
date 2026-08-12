// src/pages/FindMyMatch/components/LocationStep.tsx

import React from 'react';

interface LocationStepProps {
  selected: string[];
  onToggle: (value: string) => void;
}

const locationOptions = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Godawari', 'Pokhara', 'Chitwan'];

const LocationStep: React.FC<LocationStepProps> = ({ selected, onToggle }) => {
  return (
    <div>
      <h2 className="font-bold mb-2" style={{ fontFamily: 'Khand', fontSize: 26, color: '#14181D' }}>
        Where do you want to be?
      </h2>
      <p className="text-sm mb-4" style={{ color: '#5C6570' }}>
        Select one or more districts or municipalities.
      </p>
      <div className="flex flex-wrap gap-2">
        {locationOptions.map((option) => {
          const isActive = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                minHeight: 44,
                background: isActive ? '#2D5A27' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#333A44',
                border: isActive ? '1px solid #2D5A27' : '1px solid #D3CFC5',
                fontFamily: 'Mukta',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationStep;