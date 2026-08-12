// src/components/Matching/SizeTypeStep.tsx

import React from 'react';

interface SizeTypeStepProps {
  selectedTypes: string[];
  onTypeToggle: (value: string) => void;
  selectedSize: string;
  onSizeChange: (value: string) => void;
}

const typeOptions = ['Land', 'House', 'Apartment', 'Shutter'];
const sizeOptions = ['Under 2 Aana', '2–4 Aana', '4–8 Aana', '8–20 Aana', '1+ Ropani'];

const SizeTypeStep: React.FC<SizeTypeStepProps> = ({
  selectedTypes,
  onTypeToggle,
  selectedSize,
  onSizeChange,
}) => {
  return (
    <div>
      <h2 className="font-bold mb-2" style={{ fontFamily: 'Khand', fontSize: 26, color: '#14181D' }}>
        Size and type
      </h2>
      <p className="text-sm mb-3" style={{ color: '#5C6570' }}>
        What kind of property? Select all that apply.
      </p>
      
      <div className="mb-4">
        <div className="text-xs font-mono uppercase mb-2" style={{ color: '#5C6570' }}>
          Property type
        </div>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => {
            const isActive = selectedTypes.includes(option);
            return (
              <button
                key={option}
                onClick={() => onTypeToggle(option)}
                className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all hover:scale-105"
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

      <div>
        <div className="text-xs font-mono uppercase mb-2" style={{ color: '#5C6570' }}>
          Land area (for plots / houses)
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSizeChange(option)}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all hover:scale-105"
              style={{
                minHeight: 44,
                background: selectedSize === option ? '#2D5A27' : '#FFFFFF',
                color: selectedSize === option ? '#FFFFFF' : '#333A44',
                border: selectedSize === option ? '1px solid #2D5A27' : '1px solid #D3CFC5',
                fontFamily: 'Mukta',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeTypeStep;