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
  Hash
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

const PropertyFormStep1: React.FC<Step1Props> = ({
  formData = {},
  updateField,
  onValidationChange
}) => {
  const { user } = useAuth();

  // Defensive fallback: if a parent ever passes formData as
  // undefined/null explicitly (default params don't catch null),
  // fall back to an empty object so safeFormData.title etc. never throws.
  const safeFormData = formData || {};

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canMarkFeatured =
    user?.role === 'SELLER' || user?.role === 'ADMIN';

  // ------------------------------------------
  // Validation Logic
  // ------------------------------------------
  const validate = (field: string, value: any) => {
    switch (field) {
      case 'title':
        if (!value || value.length < 10) {
          return 'Title must be at least 10 characters';
        }

        if (value.length > 100) {
          return 'Title too long';
        }

        return '';

      case 'price':
        if (!value || Number(value) <= 0) {
          return 'Valid price is required';
        }

        return '';

      case 'propertyType':
        if (!value) {
          return 'Please select a property type';
        }

        return '';

      case 'location':
        if (!value) {
          return 'Location is required';
        }

        return '';

      default:
        return '';
    }
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {
      title: validate('title', safeFormData.title),
      price: validate('price', safeFormData.price),
      propertyType: validate(
        'propertyType',
        safeFormData.propertyType
      ),
      location: validate(
        'location',
        safeFormData.location
      )
    };

    setErrors(newErrors);

    const isValid = !Object.values(newErrors).some(
      (error) => error !== ''
    );

    onValidationChange?.(isValid);
  }, [safeFormData, onValidationChange]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));
  };

  // ------------------------------------------
  // Reusable Form Input
  // ------------------------------------------
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
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {label}

          {required && (
            <span className="text-rose-500">*</span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-gray-400 font-medium">
            {hint}
          </span>
        )}
      </div>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} strokeWidth={1.5} />
          </div>
        )}

        {children}

        {touched && error && (
          <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-rose-500">
            <AlertCircle size={12} />

            <span className="text-[10px] font-medium">
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // PropertyFormStep1 renders ONLY its form fields. The page header
  // (title + "Step X of 4" badge) and the full-page layout are owned by
  // the parent <PropertyForm /> component, which renders this header
  // once for all 4 steps (Basic Info, Location, Media, Review). Adding
  // a header or page wrapper back here would recreate the duplicate
  // "List Your Property" banner seen in earlier screenshots.

  return (
    <div className="max-w-3xl mx-auto space-y-8">

          {/* ========================================== */}
          {/* 1. TITLE & DESCRIPTION */}
          {/* ========================================== */}

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">

            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">

              <div className="p-2 bg-emerald-50 rounded-xl">
                <Home
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Basic Information
                </h3>

                <p className="text-xs text-gray-400">
                  Tell buyers what makes your property special
                </p>
              </div>

            </div>

            <div className="space-y-5">

              {/* Property Title */}

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
                  placeholder="e.g. Modern 4BHK Villa with Private Pool"
                  value={safeFormData.title || ''}
                  onChange={(e) =>
                    updateField('title', e.target.value)
                  }
                  onBlur={() => handleBlur('title')}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 ${
                    touched.title && errors.title
                      ? 'border-rose-300 ring-2 ring-rose-50'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50'
                  }`}
                />
              </FormInput>

              {/* Description */}

              <div>
                <div className="flex items-center justify-between mb-1.5">

                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </label>

                  <span className="text-[10px] text-gray-400 font-medium">
                    Optional
                  </span>

                </div>

                <textarea
                  rows={4}
                  value={safeFormData.description || ''}
                  onChange={(e) =>
                    updateField(
                      'description',
                      e.target.value
                    )
                  }
                  placeholder="Describe the neighborhood, amenities, renovations, and unique features..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                />

                <div className="flex justify-end mt-1">

                  <span className="text-[10px] text-gray-400">
                    {safeFormData.description?.length || 0} characters
                  </span>

                </div>
              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* 2. PRICING & TYPE */}
          {/* ========================================== */}

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">

            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">

              <div className="p-2 bg-emerald-50 rounded-xl">
                <Tag
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h3 className="text-base font-bold text-gray-900">
                  Pricing & Category
                </h3>

                <p className="text-xs text-gray-400">
                  Set the right price and property type
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Price */}

              <FormInput
                label="Listing Price"
                required
                icon={Banknote}
                error={errors.price}
                touched={touched.price}
                className="md:col-span-1"
              >

                <div className="relative">

                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 border-r border-gray-200 pr-2.5">
                    Rs.
                  </span>

                  <input
                    type="number"
                    value={safeFormData.price || ''}
                    onChange={(e) =>
                      updateField(
                        'price',
                        e.target.value
                      )
                    }
                    onBlur={() => handleBlur('price')}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                  />

                </div>

              </FormInput>

              {/* Property Type */}

              <FormInput
                label="Property Type"
                required
                icon={Building2}
                error={errors.propertyType}
                touched={touched.propertyType}
              >

                <select
                  value={safeFormData.propertyType || ''}
                  onChange={(e) =>
                    updateField(
                      'propertyType',
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur('propertyType')
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 appearance-none cursor-pointer focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                >

                  <option value="">
                    Select Type
                  </option>

                  {PROPERTY_TYPE_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}

                </select>

              </FormInput>

              {/* Purpose */}

              <div className="md:col-span-2">

                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
                  Purpose
                </label>

                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">

                  {PURPOSE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        updateField(
                          'purpose',
                          opt.value
                        )
                      }
                      className={`py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        safeFormData.purpose === opt.value
                          ? 'bg-white text-emerald-700 shadow-sm border border-gray-200'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      For {opt.label}
                    </button>
                  ))}

                </div>

              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* 3. SPECIFICATIONS */}
          {/* ========================================== */}

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">

            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">

              <div className="p-2 bg-emerald-50 rounded-xl">
                <Maximize
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h3 className="text-base font-bold text-gray-900">
                  Specifications
                </h3>

                <p className="text-xs text-gray-400">
                  Tell buyers about the space and layout
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Bedrooms */}

              <FormInput
                label="Beds"
                icon={Bed}
              >
                <input
                  type="number"
                  value={safeFormData.bedrooms || ''}
                  onChange={(e) =>
                    updateField(
                      'bedrooms',
                      parseInt(e.target.value) || null
                    )
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                  placeholder="0"
                />
              </FormInput>

              {/* Bathrooms */}

              <FormInput
                label="Baths"
                icon={Bath}
              >
                <input
                  type="number"
                  value={safeFormData.bathrooms || ''}
                  onChange={(e) =>
                    updateField(
                      'bathrooms',
                      parseInt(e.target.value) || null
                    )
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                  placeholder="0"
                />
              </FormInput>

              {/* Floor */}

              <FormInput
                label="Floor"
                icon={Layers}
              >
                <input
                  type="number"
                  value={safeFormData.floor || ''}
                  onChange={(e) =>
                    updateField(
                      'floor',
                      parseInt(e.target.value) || null
                    )
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                  placeholder="2"
                />
              </FormInput>

              {/* Year Built */}

              <FormInput
                label="Year Built"
                icon={Calendar}
              >
                <input
                  type="number"
                  value={safeFormData.yearBuilt || ''}
                  onChange={(e) =>
                    updateField(
                      'yearBuilt',
                      parseInt(e.target.value) || null
                    )
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                  placeholder="2024"
                />
              </FormInput>

              {/* Area */}

              <div className="col-span-2 md:col-span-3">

                <div className="flex items-end gap-3">

                  <div className="flex-1">

                    <FormInput
                      label="Total Area"
                      icon={Ruler}
                    >
                      <input
                        type="number"
                        value={safeFormData.area || ''}
                        onChange={(e) =>
                          updateField(
                            'area',
                            parseFloat(
                              e.target.value
                            ) || null
                          )
                        }
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </FormInput>

                  </div>

                  <div className="w-32 flex-shrink-0">

                    <div className="space-y-1.5">

                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Unit
                      </label>

                      <select
                        value={
                          safeFormData.areaUnit || 'SQFT'
                        }
                        onChange={(e) =>
                          updateField(
                            'areaUnit',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 outline-none cursor-pointer focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50"
                      >

                        {AREA_UNIT_OPTIONS.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                          >
                            {opt.label}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                </div>

              </div>

              {/* Parking */}

              <div className="col-span-2 md:col-span-1 flex items-end">

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      'parking',
                      !safeFormData.parking
                    )
                  }
                  className={`w-full py-2.5 px-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200 ${
                    safeFormData.parking
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >

                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${
                      safeFormData.parking
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {safeFormData.parking && (
                      <Check
                        size={12}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>

                  <span className="text-xs font-semibold">
                    Parking
                  </span>

                </button>

              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* 4. PREMIUM FEATURE */}
          {/* ========================================== */}

          {canMarkFeatured && (
            <div
              onClick={() =>
                updateField(
                  'isFeatured',
                  !safeFormData.isFeatured
                )
              }
              className={`group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                safeFormData.isFeatured
                  ? 'border-amber-400 bg-gradient-to-br from-amber-50/80 to-white shadow-lg shadow-amber-100/50'
                  : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/30'
              }`}
            >

              <div className="p-5 flex items-center gap-5">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    safeFormData.isFeatured
                      ? 'bg-amber-400 text-white shadow-lg shadow-amber-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Star
                    size={22}
                    fill={
                      safeFormData.isFeatured
                        ? 'currentColor'
                        : 'none'
                    }
                    strokeWidth={2}
                  />
                </div>

                <div className="flex-1 min-w-0">

                  <h4 className="text-sm font-bold text-gray-900">
                    Feature this Property
                  </h4>

                  <p className="text-xs text-gray-500">
                    Get 5x more visibility and priority in search results
                  </p>

                </div>

                <div className="flex items-center gap-3 flex-shrink-0">

                  <span className="text-[10px] font-semibold text-gray-400">
                    {safeFormData.isFeatured
                      ? 'Active'
                      : 'Inactive'}
                  </span>

                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                      safeFormData.isFeatured
                        ? 'bg-amber-400'
                        : 'bg-gray-300'
                    }`}
                  >

                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        safeFormData.isFeatured
                          ? 'left-5'
                          : 'left-0.5'
                      }`}
                    />

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* 5. FOOTER MESSAGE */}
          {/* ========================================== */}

          <div className="flex items-center gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">

            <div className="p-1.5 bg-blue-100 rounded-lg">

              <Info
                size={14}
                className="text-blue-600"
              />

            </div>

            <p className="text-xs text-blue-700 font-medium">
              Step 1 of 4: Provide accurate information to help buyers find your property faster.
            </p>

          </div>

    </div>
  );
};

export default PropertyFormStep1;
