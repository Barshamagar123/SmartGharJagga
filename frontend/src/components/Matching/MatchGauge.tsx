// src/components/common/MatchGauge.tsx

import React, { useState } from 'react';

interface MatchGaugeProps {
  score: number;
  size?: number;
}

const MatchGauge: React.FC<MatchGaugeProps> = ({ score, size = 44 }) => {
  const [open, setOpen] = useState(false);

  if (score < 40) return null;

  const color = score >= 85 ? '#186B4C' : score >= 60 ? '#2D5A27' : '#B07C1E';
  const bgColor = score >= 85 ? '#E4F1EA' : score >= 60 ? '#E8F0E4' : '#FAF1DC';
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative rounded-full flex items-center justify-center focus-visible:outline-2"
        style={{ width: size, height: size, minWidth: 44, minHeight: 44, background: bgColor }}
        aria-label={`Match score ${score}%. Click for details.`}
      >
        <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bgColor} strokeWidth="3" />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span className="font-mono text-[11px] font-semibold relative z-10" style={{ color }}>
          {score}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 rounded-lg border p-3 w-56 shadow-lg"
          style={{ background: '#FFFFFF', borderColor: '#D3CFC5', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <div className="text-xs font-semibold mb-2" style={{ fontFamily: 'Khand', color: '#14181D', fontSize: 13 }}>
            Why this score?
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-[12px]">
              <span style={{ color: '#186B4C' }}>✓</span>
              <span style={{ color: '#333A44' }}>Budget range</span>
            </div>
            <div className="flex items-start gap-2 text-[12px]">
              <span style={{ color: '#186B4C' }}>✓</span>
              <span style={{ color: '#333A44' }}>Location preference</span>
            </div>
            <div className="flex items-start gap-2 text-[12px]">
              <span style={{ color: '#186B4C' }}>✓</span>
              <span style={{ color: '#333A44' }}>Property type</span>
            </div>
            <div className="flex items-start gap-2 text-[12px]">
              <span style={{ color: '#B07C1E' }}>~</span>
              <span style={{ color: '#333A44' }}>Road width <span className="ml-1 font-mono text-[11px]" style={{ color: '#B07C1E' }}>(close)</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchGauge;