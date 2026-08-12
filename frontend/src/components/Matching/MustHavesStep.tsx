// src/pages/FindMyMatch/components/MustHavesStep.tsx

import React from 'react';

interface MustHavesStepProps {
  roadWidth: string;
  onRoadWidthChange: (value: string) => void;
  parking: boolean;
  onParkingChange: (value: boolean) => void;
}

const roadOptions = ['Any width', '8ft+', '12ft+', '20ft+', 'Blacktopped'];

const MustHavesStep: React.FC<MustHavesStepProps> = ({
  roadWidth,
  onRoadWidthChange,
  parking,
  onParkingChange,
}) => {
  return (
    <div>
      <h2 className="font-bold mb-2" style={{ fontFamily: 'Khand', fontSize: 26, color: '#14181D' }}>
        Must-haves
      </h2>
      <p className="text-sm mb-3" style={{ color: '#5C6570' }}>
        We'll only show listings that meet your requirements.
      </p>
      
      <div className="mb-4">
        <div className="text-xs font-mono uppercase mb-2" style={{ color: '#5C6570' }}>
          Minimum road width
        </div>
        <div className="flex flex-wrap gap-2">
          {roadOptions.map((option) => (
            <button
              key={option}
              onClick={() => onRoadWidthChange(option)}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                minHeight: 44,
                background: roadWidth === option ? '#2D5A27' : '#FFFFFF',
                color: roadWidth === option ? '#FFFFFF' : '#333A44',
                border: roadWidth === option ? '1px solid #2D5A27' : '1px solid #D3CFC5',
                fontFamily: 'Mukta',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono uppercase mb-2" style={{ color: '#5C6570' }}>
          Parking required?
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onParkingChange(true)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{
              minHeight: 44,
              background: parking ? '#2D5A27' : '#FFFFFF',
              color: parking ? '#FFFFFF' : '#333A44',
              border: parking ? '1px solid #2D5A27' : '1px solid #D3CFC5',
              fontFamily: 'Mukta',
            }}
          >
            Yes, need parking
          </button>
          <button
            onClick={() => onParkingChange(false)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{
              minHeight: 44,
              background: !parking ? '#2D5A27' : '#FFFFFF',
              color: !parking ? '#FFFFFF' : '#333A44',
              border: !parking ? '1px solid #2D5A27' : '1px solid #D3CFC5',
              fontFamily: 'Mukta',
            }}
          >
            No parking needed
          </button>
        </div>
      </div>
    </div>
  );
};

export default MustHavesStep;