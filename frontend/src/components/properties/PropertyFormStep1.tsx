// src/components/property/PropertyFormStep1.tsx

import React from 'react';
import { Input } from '../common/Input/Input';
import { PROPERTY_TYPE_OPTIONS, PURPOSE_OPTIONS } from '../../constants/filters';
import { AREA_UNIT_OPTIONS } from '../../utils/areaUtils';

interface PropertyFormStep1Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep1: React.FC<PropertyFormStep1Props> = ({
  formData,
  updateField,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
      <p className="text-sm text-gray-500">Tell us about your property</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <Input
            label="Property Title"
            placeholder="e.g. Modern Villa with Garden"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
            placeholder="Describe your property in detail..."
          />
        </div>

        {/* Price */}
        <Input
          label="Price (Rs)"
          type="number"
          placeholder="Enter price"
          value={formData.price || ''}
          onChange={(e) => updateField('price', parseFloat(e.target.value))}
          required
        />

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={formData.propertyType || ''}
            onChange={(e) => updateField('propertyType', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
            required
          >
            <option value="">Select type</option>
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose
          </label>
          <select
            value={formData.purpose || 'SALE'}
            onChange={(e) => updateField('purpose', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
          >
            {PURPOSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <Input
          label="Bedrooms"
          type="number"
          placeholder="Number of bedrooms"
          value={formData.bedrooms || ''}
          onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || null)}
        />

        {/* Bathrooms */}
        <Input
          label="Bathrooms"
          type="number"
          placeholder="Number of bathrooms"
          value={formData.bathrooms || ''}
          onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || null)}
        />

        {/* Area */}
        <Input
          label="Area"
          type="number"
          placeholder="e.g. 4.5"
          value={formData.area || ''}
          onChange={(e) => updateField('area', parseFloat(e.target.value) || null)}
        />

        {/* Area Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area Unit
          </label>
          <select
            value={formData.areaUnit || 'AANA'}
            onChange={(e) => updateField('areaUnit', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
          >
            {AREA_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Parking */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="parking"
            checked={formData.parking || false}
            onChange={(e) => updateField('parking', e.target.checked)}
            className="w-4 h-4 text-[#2D5A27] rounded focus:ring-[#2D5A27]"
          />
          <label htmlFor="parking" className="text-sm font-medium text-gray-700">
            Parking Available
          </label>
        </div>

        {/* Floor */}
        <Input
          label="Floor Number"
          type="number"
          placeholder="e.g. 2"
          value={formData.floor || ''}
          onChange={(e) => updateField('floor', parseInt(e.target.value) || null)}
        />

        {/* Year Built */}
        <Input
          label="Year Built"
          type="number"
          placeholder="e.g. 2020"
          value={formData.yearBuilt || ''}
          onChange={(e) => updateField('yearBuilt', parseInt(e.target.value) || null)}
        />
      </div>
    </div>
  );
};

export default PropertyFormStep1;