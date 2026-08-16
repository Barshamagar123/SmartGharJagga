// src/components/MatchGauge.tsx

import React, { useState } from 'react';

interface MatchReason {
  label: string;
  matched: boolean;
  note?: string;
}

interface MatchGaugeProps {
  score: number;
  size?: number;
  reasons?: MatchReason[];
  showTooltip?: boolean;
}

const defaultReasons: MatchReason[] = [
  { label: 'Budget range', matched: true },
  { label: 'Location preference', matched: true },
  { label: 'Road width (12ft min → 13ft)', matched: true, note: 'close' },
  { label: 'South facing', matched: true },
  { label: 'Land area (4–8 Aana)', matched: true },
];

const MatchGauge: React.FC<MatchGaugeProps> = ({ 
  score, 
  size = 44, 
  reasons = defaultReasons,
  showTooltip = true
}) => {
  const [open, setOpen] = useState(false);

  if (score < 40) return null;

  // ✅ Color based on score
  const color = score >= 85 ? '#186B4C' : score >= 60 ? '#A4142C' : '#B07C1E';
  const bgColor = score >= 85 ? '#E4F1EA' : score >= 60 ? '#FAECEF' : '#FAF1DC';
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  // ✅ Score label
  const getScoreLabel = () => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Great Match';
    if (score >= 60) return 'Good Match';
    if (score >= 50) return 'Average Match';
    return 'Low Match';
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#2D5A27] transition-transform hover:scale-105"
        style={{ 
          width: size, 
          height: size, 
          minWidth: 44, 
          minHeight: 44, 
          background: bgColor,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        aria-label={`Match score ${score}%. Click for details.`}
        title={showTooltip ? getScoreLabel() : undefined}
      >
        {/* Background circle */}
        <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={r} 
            fill="none" 
            stroke={bgColor} 
            strokeWidth="3" 
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score text */}
        <span className="font-mono text-[11px] font-semibold relative z-10 leading-none" style={{ color }}>
          {score}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 rounded-lg border p-3 w-56 shadow-xl"
          style={{ 
            background: '#FFFFFF', 
            borderColor: '#D3CFC5', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)' 
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ fontFamily: 'Khand', color: '#14181D', fontSize: 13 }}>
              Match Score
            </span>
            <span className="text-xs font-semibold" style={{ color }}>
              {score}%
            </span>
          </div>
          <div className="space-y-1.5">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px]">
                <span style={{ 
                  color: r.matched ? '#186B4C' : '#B07C1E', 
                  flexShrink: 0, 
                  marginTop: 1,
                  fontWeight: 600,
                }}>
                  {r.matched ? '✓' : '~'}
                </span>
                <span style={{ color: '#333A44' }}>
                  {r.label}
                  {r.note && (
                    <span className="ml-1 font-mono text-[11px]" style={{ color: '#B07C1E' }}>
                      ({r.note})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-[10px] text-gray-400">
              {getScoreLabel()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchGauge;