// src/components/Matching/StepTracker.tsx

import React from 'react';

interface StepTrackerProps {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const StepTracker: React.FC<StepTrackerProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-1">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-0 shrink-0">
          <button
            onClick={() => i <= currentStep && onStepClick(i)}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
            style={{
              fontFamily: 'IBM Plex Mono',
              color: i === currentStep ? '#2D5A27' : i < currentStep ? '#186B4C' : '#5C6570',
              background: i === currentStep ? '#E8F0E4' : 'transparent',
            }}
          >
            {i < currentStep && <span style={{ color: '#186B4C' }}>✓</span>}
            {step}
          </button>
          {i < steps.length - 1 && (
            <div className="w-8 h-px mx-1" style={{ background: i < currentStep ? '#186B4C' : '#D3CFC5' }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepTracker;