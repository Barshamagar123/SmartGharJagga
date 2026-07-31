// src/hooks/usePropertyForm.ts

import { useState, useCallback } from 'react';
import { propertyApi } from '../services/api/property';

export const usePropertyForm = (initialData?: any) => {
  // ✅ Initial state with proper defaults
  const [formData, setFormData] = useState<any>(() => {
    const defaultData = {
      title: '',
      description: '',
      price: '',
      location: '',
      latitude: null,
      longitude: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      areaUnit: 'AANA',
      propertyType: '',
      purpose: 'SALE',
      amenities: [],
      parking: false,
      floor: null,
      yearBuilt: null,
      images: [],
      videos: [],
    };
    
    // ✅ Merge initialData if provided
    if (initialData) {
      console.log('📦 Initial data provided:', initialData);
      return { ...defaultData, ...initialData };
    }
    
    return defaultData;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Update field with proper logging
  const updateField = useCallback((field: string, value: any) => {
    console.log(`📝 Updating ${field}:`, value);
    console.log('📝 Current formData before update:', formData);
    
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      console.log('📦 New formData after update:', newData);
      return newData;
    });
  }, [formData]);

  // ✅ Validate all required fields
  const validateForm = useCallback(() => {
    const errors: string[] = [];

    console.log('🔍 Validating formData:', formData);

    // Title validation
    if (!formData.title || formData.title.trim().length < 3) {
      errors.push('Title is required (minimum 3 characters)');
    }

    // Price validation
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      errors.push('Price is required and must be a valid number greater than 0');
    }

    // Location validation
    if (!formData.location || formData.location.trim().length < 2) {
      errors.push('Location is required');
    }

    // Property Type validation
    if (!formData.propertyType) {
      errors.push('Property type is required');
    }

    // Purpose validation
    if (!formData.purpose) {
      errors.push('Purpose is required');
    }

    console.log('🔍 Validation errors:', errors);
    return errors;
  }, [formData]);

  // ✅ Submit form
  const submitForm = async () => {
    console.log('📤 ===== SUBMITTING FORM =====');
    console.log('📤 Current formData:', formData);
    console.log('📤 Title:', formData.title);
    console.log('📤 Price:', formData.price);
    console.log('📤 Location:', formData.location);
    console.log('📤 Property Type:', formData.propertyType);
    console.log('📤 Purpose:', formData.purpose);

    setLoading(true);
    setError(null);

    try {
      // ✅ Validate all fields
      const errors = validateForm();
      if (errors.length > 0) {
        const errorMessage = errors.join('. ');
        setError(errorMessage);
        console.log('❌ Validation failed:', errorMessage);
        setLoading(false);
        return { success: false, data: null };
      }

      // ✅ Build JSON data with proper types
      const jsonData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price), // ✅ Convert to number
        location: formData.location.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        areaUnit: formData.areaUnit || 'AANA',
        propertyType: formData.propertyType,
        purpose: formData.purpose || 'SALE',
        parking: formData.parking || false,
        floor: formData.floor ? parseInt(formData.floor) : null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        amenities: formData.amenities || [],
      };

      console.log('📤 Sending JSON to backend:', JSON.stringify(jsonData, null, 2));

      // ✅ Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(jsonData));

      // ✅ Add images
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          if (typeof image !== 'string' && image instanceof File) {
            formDataToSend.append('images', image);
          }
        }
      }

      // ✅ Add videos
      if (formData.videos && formData.videos.length > 0) {
        for (const video of formData.videos) {
          if (typeof video !== 'string' && video instanceof File) {
            formDataToSend.append('videos', video);
          }
        }
      }

      // ✅ Send request
      const result = await propertyApi.create(formDataToSend);
      console.log('✅ Property created successfully:', result);
      
      setLoading(false);
      return { success: true, data: result };
    } catch (err: any) {
      console.error('❌ Submit Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map((e: any) => {
          const field = e.field ? e.field.replace('body.', '') : '';
          return field ? `${field}: ${e.message}` : e.message;
        }).join(', ');
        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create property');
      }
      
      setLoading(false);
      return { success: false, data: null };
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    updateField,
    submitForm,
    validateForm,
  };
};

export default usePropertyForm;