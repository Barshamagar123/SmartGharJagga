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
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Validate required fields
      const required = ['title', 'price', 'location', 'propertyType', 'purpose'];
      for (const field of required) {
        if (!formData[field]) {
          setError(`Please fill in ${field}`);
          setLoading(false);
          return { success: false, data: null };
        }
      }

      // ✅ Create form data
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        areaUnit: formData.areaUnit,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        parking: formData.parking,
        floor: formData.floor ? parseInt(formData.floor) : null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        amenities: formData.amenities || [],
      }));

      // ✅ Add images
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          if (typeof image !== 'string') {
            formDataToSend.append('images', image);
          }
        }
      }

      // ✅ Add videos
      if (formData.videos && formData.videos.length > 0) {
        for (const video of formData.videos) {
          if (typeof video !== 'string') {
            formDataToSend.append('videos', video);
          }
        }
      }

      const result = await propertyApi.create(formDataToSend);
      setLoading(false);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create property');
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