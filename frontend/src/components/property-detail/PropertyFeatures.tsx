// src/components/property-detail/PropertyFeatures.tsx

import React from 'react';
import { 
  Wifi, Snowflake, Shield, Dumbbell, Waves, 
  TreePine, Utensils, Car, Sofa, Tv, Flame,
  School, Hospital, ShoppingBag, Bus, Coffee,
  MapPin, Store, Train, Book, Music
} from 'lucide-react';

interface PropertyFeaturesProps {
  amenities: string[];
  nearby: {
    name: string;
    distance: string;
    type: 'school' | 'hospital' | 'mall' | 'park' | 'transport' | 'restaurant';
    icon?: string;
  }[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={20} />,
  'Air Conditioning': <Snowflake size={20} />,
  'Security System': <Shield size={20} />,
  'Gym': <Dumbbell size={20} />,
  'Swimming Pool': <Waves size={20} />,
  'Garden': <TreePine size={20} />,
  'Kitchen': <Utensils size={20} />,
  'Parking': <Car size={20} />,
  'Furnished': <Sofa size={20} />,
  'Smart TV': <Tv size={20} />,
  'Fireplace': <Flame size={20} />,
};

const nearbyIcons: Record<string, React.ReactNode> = {
  'school': <School size={18} />,
  'hospital': <Hospital size={18} />,
  'mall': <ShoppingBag size={18} />,
  'park': <TreePine size={18} />,
  'transport': <Bus size={18} />,
  'restaurant': <Coffee size={18} />,
};

const nearbyColors: Record<string, string> = {
  'school': 'bg-blue-50 text-blue-600',
  'hospital': 'bg-red-50 text-red-600',
  'mall': 'bg-purple-50 text-purple-600',
  'park': 'bg-green-50 text-green-600',
  'transport': 'bg-orange-50 text-orange-600',
  'restaurant': 'bg-pink-50 text-pink-600',
};

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ amenities, nearby }) => {
  return (
    <div className="space-y-8">
      {/* Amenities */}
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
          Amenities & Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-xl transition-colors duration-200"
            >
              <span className="text-[#2D5A27]">
                {amenityIcons[amenity] || <div className="w-5 h-5 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] text-xs font-bold">✓</div>}
              </span>
              <span className="text-sm text-[#475569]">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Places */}
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
          Nearby Places
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nearby.map((place) => (
            <div
              key={place.name}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ${
                nearbyColors[place.type] || 'bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{nearbyIcons[place.type] || <MapPin size={18} />}</span>
                <span className="text-sm font-medium">{place.name}</span>
              </div>
              <span className="text-xs bg-white/60 px-2 py-1 rounded-full">
                {place.distance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;