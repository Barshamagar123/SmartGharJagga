// src/components/property/PropertyFormStep4.tsx

import React from 'react';
import { CheckCircle, Home, MapPin, Image, Video, DollarSign, BedDouble, Bath, Maximize2, Car, Calendar } from 'lucide-react';
import { formatArea } from '../../utils/areaUtils';

interface Step4Props {
  formData: any;
}

const PropertyFormStep4: React.FC<Step4Props> = ({ formData }) => {
  const formatPrice = (price: any) => {
    const num = Number(price);
    if (!price || Number.isNaN(num)) return 'Not provided';
    if (num >= 10000000) {
      return `Rs ${(num / 10000000).toFixed(1)} Crore`;
    }
    return `Rs ${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-[#2D5A27]" />
          Review & Confirm
        </h3>
        <p className="text-sm text-gray-500 mt-1">Please review all details before submitting</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Basic Info */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Home className="w-4 h-4 text-[#2D5A27]" />
            Basic Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block">Title</span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.title || 'Not provided'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block">Price</span>
              <p className="font-semibold text-[#2D5A27] mt-0.5">{formatPrice(formData.price)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block">Type</span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.propertyType?.replace('_', ' ') || 'Not selected'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block">Purpose</span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.purpose || 'Not selected'}</p>
            </div>
            {formData.isFeatured && (
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200 col-span-2 md:col-span-1">
                <span className="text-xs text-yellow-600 block">⭐ Featured</span>
                <p className="font-medium text-yellow-700 mt-0.5">This property will be featured</p>
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Maximize2 className="w-4 h-4 text-[#2D5A27]" />
            Property Details
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <BedDouble className="w-3 h-3" /> Bedrooms
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.bedrooms || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Bath className="w-3 h-3" /> Bathrooms
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.bathrooms || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Area
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {formData.area && formData.areaUnit ? formatArea(formData.area, formData.areaUnit) : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Car className="w-3 h-3" /> Parking
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {formData.parking ? '✅ Available' : '❌ Not Available'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Floor
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.floor || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Year Built
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.yearBuilt || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#2D5A27]" />
            Location
          </h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-900">{formData.location || 'Not provided'}</p>
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Image className="w-4 h-4 text-[#2D5A27]" />
            Media
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Image className="w-3 h-3" /> Images
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.images?.length || 0} uploaded</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs text-gray-500 block flex items-center gap-1">
                <Video className="w-3 h-3" /> Videos
              </span>
              <p className="font-medium text-gray-900 mt-0.5">{formData.videos?.length || 0} uploaded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Ready to List!</p>
          <p className="text-sm text-gray-600 mt-0.5">
            By submitting, you confirm that all information provided is accurate and complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormStep4;