// src/components/property/PropertyFormStep4.tsx

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { formatArea } from '../../utils/areaUtils';

interface Step4Props {
  formData: any;
}

const PropertyFormStep4: React.FC<Step4Props> = ({ formData }) => {
  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">✅ Review Your Property</h3>
      <p className="text-sm text-gray-500">Please review all details before submitting</p>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        {/* Basic Info */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Title</span><p className="font-medium">{formData.title || 'Not provided'}</p></div>
            <div><span className="text-gray-500">Price</span><p className="font-medium text-[#2D5A27]">{formatPrice(formData.price)}</p></div>
            <div><span className="text-gray-500">Type</span><p className="font-medium">{formData.propertyType || 'Not selected'}</p></div>
            <div><span className="text-gray-500">Purpose</span><p className="font-medium">{formData.purpose || 'Not selected'}</p></div>
          </div>
        </div>

        <div className="border-t" />

        {/* Details */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Bedrooms</span><p className="font-medium">{formData.bedrooms || 'N/A'}</p></div>
            <div><span className="text-gray-500">Bathrooms</span><p className="font-medium">{formData.bathrooms || 'N/A'}</p></div>
            <div><span className="text-gray-500">Area</span><p className="font-medium">{formData.area && formData.areaUnit ? formatArea(formData.area, formData.areaUnit) : 'N/A'}</p></div>
            <div><span className="text-gray-500">Parking</span><p className="font-medium">{formData.parking ? '✅ Available' : '❌ Not Available'}</p></div>
            <div><span className="text-gray-500">Floor</span><p className="font-medium">{formData.floor || 'N/A'}</p></div>
            <div><span className="text-gray-500">Year Built</span><p className="font-medium">{formData.yearBuilt || 'N/A'}</p></div>
          </div>
        </div>

        <div className="border-t" />

        {/* Location */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">📍 Location</h4>
          <p className="text-sm font-medium">{formData.location || 'Not provided'}</p>
          {formData.latitude && formData.longitude && (
            <p className="text-xs text-gray-500 mt-1">{formData.latitude}, {formData.longitude}</p>
          )}
        </div>

        <div className="border-t" />

        {/* Media */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">📸 Media</h4>
          <div className="flex gap-4 text-sm">
            <span><span className="text-gray-500">Images:</span> <span className="font-medium">{formData.images?.length || 0}</span></span>
            <span><span className="text-gray-500">Videos:</span> <span className="font-medium">{formData.videos?.length || 0}</span></span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">Confirmation</p>
          <p className="text-sm text-gray-600">By submitting, you confirm that all information provided is accurate.</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormStep4;