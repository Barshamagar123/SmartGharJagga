// src/components/Home/FindMyMatchPromo.tsx - Dynamic Version

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';
import MatchGauge from '../Matching/MatchGauge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(2)} Crore`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const FindMyMatchPromo: React.FC = () => {
  const [previewProperties, setPreviewProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const result = await propertyApi.getAll({
          limit: 2,
          sortBy: 'views',
          sortOrder: 'desc'
        });
        setPreviewProperties(result.properties || []);
      } catch (error) {
        console.error('Error fetching preview properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 pb-14">
      <div className="rounded-lg border overflow-hidden grid md:grid-cols-2"
        style={{ borderColor: '#D3CFC5', background: '#FFFFFF' }}>
        
        {/* Left - Content */}
        <div className="p-8 border-r" style={{ borderColor: '#E6E3DB' }}>
          <div className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold mb-3"
            style={{ background: '#FAECEF', color: '#A4142C' }}>
            NEW FEATURE
          </div>
          <h2 className="font-bold mb-3" style={{ fontFamily: 'Khand', fontSize: 28, color: '#14181D', lineHeight: 1.1 }}>
            Tell us what you need.<br />We'll rank every match.
          </h2>
          <p className="text-sm mb-6" style={{ color: '#5C6570', maxWidth: 320 }}>
            Answer 4 questions in 90 seconds — budget, location, size, must-haves — and we score every verified listing against your preferences in real time. No broker, no calls, no surprises.
          </p>
          <Link
            to="/match"
            className="inline-flex items-center px-5 py-2.5 rounded font-semibold text-sm transition-colors hover:bg-[#23461E]"
            style={{ background: '#2D5A27', color: '#FFFFFF', fontFamily: 'Mukta' }}
          >
            Start matching →
          </Link>
        </div>

        {/* Right - Live Results Preview (Dynamic) */}
        <div className="p-6 space-y-3" style={{ background: '#F7F5F0' }}>
          <div className="text-xs font-mono mb-4" style={{ color: '#5C6570' }}>
            LIVE RESULTS PREVIEW
          </div>
          
          {loading ? (
            // Loading skeletons
            <>
              <div className="animate-pulse flex items-center gap-3 p-3 rounded border">
                <div className="w-11 h-11 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
              <div className="animate-pulse flex items-center gap-3 p-3 rounded border">
                <div className="w-11 h-11 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
            </>
          ) : previewProperties.length > 0 ? (
            previewProperties.map((property, index) => {
              // Generate random match score between 60-95
              const score = 60 + Math.floor(Math.random() * 35);
              return (
                <div key={property.id} className="flex items-center gap-3 p-3 rounded border"
                  style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                  <MatchGauge score={score} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                      {property.title}
                    </div>
                    <div className="font-mono text-[12px]" style={{ color: '#333A44' }}>
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#5C6570' }}>
                      {property.isVerified ? '✓ Verified' : '✓ Featured'} {property.location}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback if no properties
            <>
              <div className="flex items-center gap-3 p-3 rounded border"
                style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <MatchGauge score={95} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                    6-Aana Plot, Suryabinayak
                  </div>
                  <div className="font-mono text-[12px]" style={{ color: '#333A44' }}>
                    Rs 1.25 Crore
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#5C6570' }}>
                    ✓ Budget ✓ South-facing ✓ 12ft road
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded border"
                style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
                <MatchGauge score={68} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                    4-Bedroom House, Dhapakhel
                  </div>
                  <div className="font-mono text-[12px]" style={{ color: '#333A44' }}>
                    Rs 4.90 Crore
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#5C6570' }}>
                    ✓ Location  ~ Size (prefer 4–6A)
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FindMyMatchPromo;