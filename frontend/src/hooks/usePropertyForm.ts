// src/hooks/usePropertyForm.ts

import { useState, useCallback } from 'react';
import { propertyApi } from '../services/api/property';

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  areaUnit: string;
  propertyType: string;
  purpose: string;
  amenities: string[];
  parking: boolean;
  floor: number | null;
  yearBuilt: number | null;
  images: any[];
  videos: any[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  latitude: null,
  longitude: null,
  bedrooms: null,
  bathrooms: null,
  area: null,
  areaUnit: 'SQFT',
  propertyType: '',
  purpose: 'SALE',
  amenities: [],
  parking: false,
  floor: null,
  yearBuilt: null,
  images: [],
  videos: [],
};

export const usePropertyForm = (initialData?: Partial<FormData>) => {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  const submitForm = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Build payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        areaUnit: formData.areaUnit,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        parking: formData.parking,
        floor: formData.floor,
        yearBuilt: formData.yearBuilt,
        amenities: formData.amenities,
      };

      // ✅ Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(payload));

      // ✅ Append images
      formData.images.forEach((img) => {
        if (img instanceof File) formDataToSend.append('images', img);
      });

      // ✅ Append videos
      formData.videos.forEach((video) => {
        if (video instanceof File) formDataToSend.append('videos', video);
      });

      const result = await propertyApi.create(formDataToSend);
      setLoading(false);
      return { success: true, data: result };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create property';
      setError(message);
      setLoading(false);
      return { success: false, data: null };
    }
  };

  return {
    formData,
    loading,
    error,
    updateField,
    resetForm,
    submitForm,
  };
};

export default usePropertyForm;