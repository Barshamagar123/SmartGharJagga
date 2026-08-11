// src/components/property/PropertyFormStep1.tsx

import React, { useState, useEffect } from 'react';
import {
  Star,
  AlertCircle,
  Home,
  Banknote,
  Maximize,
  Bed,
  Bath,
  Calendar,
  Layers,
  Check,
  Info,
  Ruler,
  Building2,
  Tag,
  Hash,
  ArrowLeft
} from 'lucide-react';
import {
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS
} from '../../constants/filters';
import { AREA_UNIT_OPTIONS } from '../../utils/areaUtils';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Step1Props {
  formData: any;
  updateField: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const PropertyFormStep1: React.FC<Step1Props> = ({
  formData = {},
  updateField,
  onValidationChange
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const safeFormData = formData || {};
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canMarkFeatured = user?.role === 'SELLER' || user?.role === 'ADMIN';

  // Validation
  const validate = (field: string, value: any) => {
    switch (field) {
      case 'title':
        if (!value || value.length < 10) return 'Title must be at least 10 characters';
        if (value.length > 100) return 'Title too long';
        return '';
      case 'price':
        if (!value || Number(value) <= 0) return 'Valid price is required';
        return '';
      case 'propertyType':
        if (!value) return 'Please select a property type';
        return '';
      case 'location':
        if (!value) return 'Location is required';
        return '';
      default:
        return '';
    }
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {
      title: validate('title', safeFormData.title),
      price: validate('price', safeFormData.price),
      propertyType: validate('propertyType', safeFormData.propertyType),
      location: validate('location', safeFormData.location)
    };

    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some((error) => error !== '');
    onValidationChange?.(isValid);
  }, [safeFormData, onValidationChange]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Input Component - Spacious
  const FormInput = ({
    label,
    icon: Icon,
    error,
    touched,
    children,
    hint,
    required,
    className = ''
  }: any) => (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} strokeWidth={1.5} />
          </div>
        )}
        {children}
        {touched && error && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      

      {/* FORM - Same padding as navbar (px-8) */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ========================================== */}
          {/* LEFT COLUMN */}
          {/* ========================================== */}
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Home size={20} className="text-[#2D5A27]" />
                </div>
                <span className="text-base font-bold text-gray-900">Basic Information</span>
              </div>

              <div className="space-y-5">
                <FormInput
                  label="Property Title"
                  required
                  icon={Hash}
                  error={errors.title}
                  touched={touched.title}
                  hint={`${safeFormData.title?.length || 0}/100`}
                >
                  <input
                    type="text"
                    placeholder="e.g. Modern Villa with Private Pool"
                    value={safeFormData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl transition-all outline-none text-base placeholder:text-gray-400 ${
                      touched.title && errors.title
                        ? 'border-rose-300 ring-2 ring-rose-50'
                        : 'border-gray-200 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20'
                    }`}
                  />
                </FormInput>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    value={safeFormData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe the neighborhood, amenities, renovations, and unique features..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 resize-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                  />
                  <div className="flex justify-end mt-1.5">
                    <span className="text-xs text-gray-400">
                      {safeFormData.description?.length || 0} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Type */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Tag size={20} className="text-[#2D5A27]" />
                </div>
                <span className="text-base font-bold text-gray-900">Pricing & Category</span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FormInput
                  label="Listing Price"
                  required
                  icon={Banknote}
                  error={errors.price}
                  touched={touched.price}
                >
                  <div className="relative">
                    <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 border-r border-gray-200 pr-2.5">Rs.</span>
                    <input
                      type="number"
                      value={safeFormData.price || ''}
                      onChange={(e) => updateField('price', e.target.value)}
                      onBlur={() => handleBlur('price')}
                      placeholder="Enter price"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                    />
                  </div>
                </FormInput>

                <FormInput
                  label="Property Type"
                  required
                  icon={Building2}
                  error={errors.propertyType}
                  touched={touched.propertyType}
                >
                  <select
                    value={safeFormData.propertyType || ''}
                    onChange={(e) => updateField('propertyType', e.target.value)}
                    onBlur={() => handleBlur('propertyType')}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base appearance-none cursor-pointer focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                  >
                    <option value="">Select Type</option>
                    {PROPERTY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </FormInput>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Purpose</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PURPOSE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateField('purpose', opt.value)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          safeFormData.purpose === opt.value
                            ? 'bg-[#2D5A27] text-white shadow-sm shadow-[#2D5A27]/30'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        For {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN */}
          {/* ========================================== */}
          <div className="space-y-6">
            
            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Maximize size={20} className="text-[#2D5A27]" />
                </div>
                <span className="text-base font-bold text-gray-900">Specifications</span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FormInput label="Bedrooms" icon={Bed}>
                  <input
                    type="number"
                    value={safeFormData.bedrooms || ''}
                    onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || null)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                    placeholder="0"
                  />
                </FormInput>

                <FormInput label="Bathrooms" icon={Bath}>
                  <input
                    type="number"
                    value={safeFormData.bathrooms || ''}
                    onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || null)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                    placeholder="0"
                  />
                </FormInput>

                <FormInput label="Floor" icon={Layers}>
                  <input
                    type="number"
                    value={safeFormData.floor || ''}
                    onChange={(e) => updateField('floor', parseInt(e.target.value) || null)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                    placeholder="0"
                  />
                </FormInput>

                <FormInput label="Year Built" icon={Calendar}>
                  <input
                    type="number"
                    value={safeFormData.yearBuilt || ''}
                    onChange={(e) => updateField('yearBuilt', parseInt(e.target.value) || null)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                    placeholder="2024"
                  />
                </FormInput>

                <div className="col-span-2">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <FormInput label="Area" icon={Ruler}>
                        <input
                          type="number"
                          value={safeFormData.area || ''}
                          onChange={(e) => updateField('area', parseFloat(e.target.value) || null)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </FormInput>
                    </div>
                    <div className="w-36 flex-shrink-0">
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Unit</label>
                      <select
                        value={safeFormData.areaUnit || 'SQFT'}
                        onChange={(e) => updateField('areaUnit', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium text-gray-600 outline-none cursor-pointer focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20"
                      >
                        {AREA_UNIT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => updateField('parking', !safeFormData.parking)}
                    className={`w-full py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all text-base font-medium ${
                      safeFormData.parking
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                      safeFormData.parking ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'
                    }`}>
                      {safeFormData.parking && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span>Parking Available</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured */}
            {canMarkFeatured && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      safeFormData.isFeatured ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Star size={22} fill={safeFormData.isFeatured ? 'currentColor' : 'none'} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">Feature this Property</p>
                      <p className="text-sm text-gray-500">Get 5x more visibility in search results</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('isFeatured', !safeFormData.isFeatured)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      safeFormData.isFeatured ? 'bg-amber-400' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      safeFormData.isFeatured ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
          <Info size={18} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700 font-medium">
            Step 1 of 4: Provide accurate information to help buyers find your property faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormStep1;