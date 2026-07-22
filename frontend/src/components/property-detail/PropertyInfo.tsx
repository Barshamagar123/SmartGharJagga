// src/components/property-detail/PropertyInfo.tsx

import React, { useState } from 'react';
import { 
  MapPin, BedDouble, Bath, Maximize2, Calendar, 
  Car, DollarSign, Share2, Heart, Printer, 
  Star, Clock, Building2, Phone, Mail, User,
 X ,  Link2
} from 'lucide-react';
import type { PropertyDetail } from '../../types/property';

interface PropertyInfoProps {
  property: PropertyDetail;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleSave = () => setIsSaved(!isSaved);

  // Fix: Use X icon instead of Twitter (if you want the new logo)
  // Or import Twitter from 'lucide-react' if available in your version
  const shareLinks = [
    // { icon: Facebook, label: 'Facebook', color: '#1877F2' },
    // { icon: Twitter, label: 'Twitter', color: '#000000' },
    // { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: Link2, label: 'Copy Link', color: '#475569' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'SOLD': return 'bg-red-500';
      case 'UNDER_CONTRACT': return 'bg-yellow-500';
      case 'RENTED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0F172A]">
              {property.title}
            </h1>
            {property.status && (
              <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(property.status)}`}>
                {property.status.replace('_', ' ')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-[#475569]">
            <MapPin size={18} className="text-[#2D5A27]" />
            <span>{property.location}</span>
          </div>

          {property.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-[#0F172A]">{property.rating}</span>
              </div>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#475569] text-sm">{property.reviews} reviews</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#475569] text-sm">Updated {property.lastUpdated}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSave}
            className={`p-2.5 rounded-full border transition-all duration-200 ${
              isSaved 
                ? 'bg-[#2D5A27] text-white border-[#2D5A27]' 
                : 'bg-white border-gray-200 hover:border-[#2D5A27] text-[#475569]'
            }`}
            aria-label="Save property"
          >
            <Heart size={20} className={isSaved ? 'fill-current' : ''} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="p-2.5 bg-white border border-gray-200 rounded-full hover:border-[#2D5A27] transition-all duration-200 text-[#475569]"
              aria-label="Share property"
            >
              <Share2 size={20} />
            </button>

            {showShare && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px] z-10">
                {shareLinks.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                    style={{ color }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="p-2.5 bg-white border border-gray-200 rounded-full hover:border-[#2D5A27] transition-all duration-200 text-[#475569]"
            aria-label="Print property"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
};

export default PropertyInfo;