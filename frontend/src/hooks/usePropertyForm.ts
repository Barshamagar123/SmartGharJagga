// src/hooks/usePropertyForm.ts

import { useState } from 'react';
import { propertyApi } from '../services/api/property';

export const usePropertyForm = (initialData?: any) => {
  const [formData, setFormData] = useState<any>({
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
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: any) => {
    console.log(`📝 Updating ${field}:`, value); // ✅ Debug log
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    console.log('📤 Submitting form with data:', formData); // ✅ Debug log

    setLoading(true);
    setError(null);

    try {
      // ✅ STEP 1: Validate all required fields
      const errors: string[] = [];

      // ✅ Check title
      if (!formData.title || formData.title.trim().length < 3) {
        errors.push('Title is required and must be at least 3 characters');
      }

      // ✅ Check price
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        errors.push('Price is required and must be a valid number greater than 0');
      }

      // ✅ Check location
      if (!formData.location || formData.location.trim().length < 2) {
        errors.push('Location is required and must be at least 2 characters');
      }

      // ✅ Check propertyType
      if (!formData.propertyType) {
        errors.push('Property type is required');
      }

      // ✅ Check purpose
      if (!formData.purpose) {
        errors.push('Purpose is required');
      }

      if (errors.length > 0) {
        setError(errors.join('. '));
        setLoading(false);
        return { success: false, data: null };
      }

      // ✅ STEP 2: Build JSON data with validated values
      const jsonData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        price: parseFloat(formData.price),
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

      console.log('📤 Sending JSON:', jsonData);

      // ✅ STEP 3: Create FormData
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

      // ✅ STEP 4: Send request
      const result = await propertyApi.create(formDataToSend);
      
      setLoading(false);
      return { success: true, data: result };
    } catch (err: any) {
      console.error('❌ Submit Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      
      // ✅ Show detailed error
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
  };
};

export default usePropertyForm;