// src/components/property/PropertyFormStep1.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'lucide-react';
import {
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS
} from '../../constants/filters';
import { AREA_UNIT_OPTIONS } from '../../utils/areaUtils';
import { useAuth } from '../../hooks/useAuth';

interface Step1Props {
  formData: any;
  updateField: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// ✅ FIXED Text Input Component - no parent update on every keystroke
const TextInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  error?: boolean;
}> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  className = '',
  icon,
  maxLength,
  error,
}) => {
  const [localValue, setLocalValue] = useState<string>(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Only update local when prop changes (parent updates)
  useEffect(() => {
    // Only update if not currently focused
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    // ✅ Don't call onChange here - only on blur
  };

  const handleBlurEvent = () => {
    // ✅ Update parent only on blur
    onChange(localValue);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlurEvent}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || ''}
        maxLength={maxLength}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white border rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20 ${className} ${
          error ? 'border-rose-300 ring-2 ring-rose-50' : 'border-gray-200'
        }`}
      />
    </div>
  );
};

// ✅ TextArea with same pattern - update parent only on blur
const TextAreaInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
}) => {
  const [localValue, setLocalValue] = useState<string>(value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (document.activeElement !== textareaRef.current) {
      setLocalValue(value || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    onChange(localValue);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder || ''}
      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 resize-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20 ${className}`}
    />
  );
};

// ✅ Number Input Component - update parent only on blur
const NumberInput: React.FC<{
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
}> = ({
  value,
  onChange,
  placeholder,
  className = '',
  icon,
  min,
  max,
  step = 1,
}) => {
  const [localValue, setLocalValue] = useState<string>(value?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value?.toString() || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue) && numValue >= 0) {
      const finalValue = max !== undefined ? Math.min(numValue, max) : numValue;
      const finalValueMin = min !== undefined ? Math.max(finalValue, min) : finalValue;
      onChange(finalValueMin);
      setLocalValue(finalValueMin.toString());
    } else if (localValue === '') {
      onChange(null);
    } else {
      setLocalValue(value?.toString() || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || '0'}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-base placeholder:text-gray-400 focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/20 ${className}`}
      />
    </div>
  );
};

const PropertyFormStep1: React.FC<Step1Props> = ({
  formData = {},
  updateField,
  onValidationChange
}) => {
  const { user } = useAuth();
  const safeFormData = formData || {};
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canMarkFeatured = user?.role === 'SELLER' || user?.role === 'ADMIN';

  const validate = useCallback((field: string, value: any) => {
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
      default:
        return '';
    }
  }, []);

  useEffect(() => {
    const newErrors: Record<string, string> = {
      title: validate('title', safeFormData.title),
      price: validate('price', safeFormData.price),
      propertyType: validate('propertyType', safeFormData.propertyType),
    };

    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some((error) => error !== '');
    onValidationChange?.(isValid);
  }, [safeFormData, validate, onValidationChange]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ✅ Handlers - parent updates only happen on blur now
  const handleTextChange = useCallback((field: string, value: string) => {
    updateField(field, value);
  }, [updateField]);

  const handleBooleanChange = useCallback((field: string, value: boolean) => {
    updateField(field, value);
  }, [updateField]);

  const handleNumberChange = useCallback((field: string, value: number | null) => {
    updateField(field, value);
  }, [updateField]);

  // Input Component wrapper
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN */}
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
                  error={errors.title}
                  touched={touched.title}
                  hint={`${safeFormData.title?.length || 0}/100`}
                >
                  <TextInput
                    value={safeFormData.title || ''}
                    onChange={(val) => handleTextChange('title', val)}
                    onBlur={() => handleBlur('title')}
                    placeholder="e.g. Modern Villa with Private Pool"
                    maxLength={100}
                    icon={<Hash size={18} strokeWidth={1.5} className="text-gray-400" />}
                    error={touched.title && !!errors.title}
                  />
                </FormInput>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <TextAreaInput
                    value={safeFormData.description || ''}
                    onChange={(val) => handleTextChange('description', val)}
                    placeholder="Describe the neighborhood, amenities, renovations, and unique features..."
                    rows={4}
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
                  error={errors.price}
                  touched={touched.price}
                >
                  <div className="relative">
                    <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 border-r border-gray-200 pr-2.5 z-10">Rs.</span>
                    <NumberInput
                      value={safeFormData.price}
                      onChange={(val) => handleNumberChange('price', val)}
                      placeholder="Enter price"
                      min={0}
                      step={1000}
                      className="pl-9"
                    />
                  </div>
                </FormInput>

                <FormInput
                  label="Property Type"
                  required
                  error={errors.propertyType}
                  touched={touched.propertyType}
                >
                  <select
                    value={safeFormData.propertyType || ''}
                    onChange={(e) => handleTextChange('propertyType', e.target.value)}
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
                        onClick={() => handleTextChange('purpose', opt.value)}
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

          {/* RIGHT COLUMN */}
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
                <FormInput label="Bedrooms">
                  <NumberInput
                    value={safeFormData.bedrooms}
                    onChange={(val) => handleNumberChange('bedrooms', val)}
                    placeholder="0"
                    min={0}
                    max={20}
                    icon={<Bed size={18} strokeWidth={1.5} className="text-gray-400" />}
                  />
                </FormInput>

                <FormInput label="Bathrooms">
                  <NumberInput
                    value={safeFormData.bathrooms}
                    onChange={(val) => handleNumberChange('bathrooms', val)}
                    placeholder="0"
                    min={0}
                    max={20}
                    icon={<Bath size={18} strokeWidth={1.5} className="text-gray-400" />}
                  />
                </FormInput>

                <FormInput label="Floor">
                  <NumberInput
                    value={safeFormData.floor}
                    onChange={(val) => handleNumberChange('floor', val)}
                    placeholder="0"
                    min={0}
                    max={100}
                    icon={<Layers size={18} strokeWidth={1.5} className="text-gray-400" />}
                  />
                </FormInput>

                <FormInput label="Year Built">
                  <NumberInput
                    value={safeFormData.yearBuilt}
                    onChange={(val) => handleNumberChange('yearBuilt', val)}
                    placeholder="2024"
                    min={1900}
                    max={2100}
                    icon={<Calendar size={18} strokeWidth={1.5} className="text-gray-400" />}
                  />
                </FormInput>

                <div className="col-span-2">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <FormInput label="Area">
                        <NumberInput
                          value={safeFormData.area}
                          onChange={(val) => handleNumberChange('area', val)}
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          icon={<Ruler size={18} strokeWidth={1.5} className="text-gray-400" />}
                        />
                      </FormInput>
                    </div>
                    <div className="w-36 flex-shrink-0">
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Unit</label>
                      <select
                        value={safeFormData.areaUnit || 'SQFT'}
                        onChange={(e) => handleTextChange('areaUnit', e.target.value)}
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
                    onClick={() => handleBooleanChange('parking', !safeFormData.parking)}
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
                    onClick={() => handleBooleanChange('isFeatured', !safeFormData.isFeatured)}
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