// src/pages/FindMyMatch/components/BudgetStep.tsx

import React from 'react';

interface BudgetStepProps {
  value: string;
  onChange: (value: string) => void;
}

const budgetOptions = ['Under Rs 50 Lakh', 'Rs 50L – 1 Crore', 'Rs 1Cr – 3Cr', 'Rs 3Cr – 7Cr', 'Rs 7Cr+'];

const BudgetStep: React.FC<BudgetStepProps> = ({ value, onChange }) => {
  return (
    <div>
      <h2 className="font-bold mb-2" style={{ fontFamily: 'Khand', fontSize: 26, color: '#14181D' }}>
        What's your budget?
      </h2>
      <p className="text-sm mb-4" style={{ color: '#5C6570' }}>
        Total price for a purchase, or monthly rent if renting.
      </p>
      <div className="flex flex-wrap gap-2">
        {budgetOptions.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{
              minHeight: 44,
              background: value === option ? '#2D5A27' : '#FFFFFF',
              color: value === option ? '#FFFFFF' : '#333A44',
              border: value === option ? '1px solid #2D5A27' : '1px solid #D3CFC5',
              fontFamily: 'Mukta',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BudgetStep;