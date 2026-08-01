// src/hooks/usePropertyForm.ts

import { useState, useCallback } from 'react';
import { propertyApi } from '../services/api/property';
import type { Property } from '../types/property';

interface FormData {
  id?: string;
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

interface UsePropertyFormReturn {
  formData: FormData;
  loading: boolean;
  error: string | null;
  updateField: (field: keyof FormData, value: any) => void;
  resetForm: () => void;
  submitForm: () => Promise<{ success: boolean; data?: Property }>;
}

/**
 * Normalizes a property object (as returned from the API, used to prefill
 * an edit form) into the shape this hook's FormData expects.
 *
 * - price comes back from the API as a number, but the form stores it as a
 *   string (because it's bound to a text/number input) — without this
 *   conversion the input would silently show nothing on edit.
 * - images/videos come back as arrays of URL strings, which is fine — the
 *   preview components already handle string vs File.
 */
const normalizeInitialData = (data?: Partial<Property> | Partial<FormData>): Partial<FormData> => {
  if (!data) return {};

  return {
    ...data,
    price: data.price !== undefined && data.price !== null ? String(data.price) : '',
  } as Partial<FormData>;
};

export const usePropertyForm = (
  initialData?: Partial<Property> | Partial<FormData>,
  isEdit: boolean = false
): UsePropertyFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    ...normalizeInitialData(initialData),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      console.log(`📝 Updated ${field}:`, value);
      return newData;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  const submitForm = async () => {
    console.log('📤 ===== SUBMITTING PROPERTY FORM =====');
    console.log('📤 Form Data:', formData);

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
        areaUnit: formData.areaUnit || 'SQFT',
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        parking: formData.parking,
        floor: formData.floor,
        yearBuilt: formData.yearBuilt,
        amenities: formData.amenities,
      };

      console.log('📤 Payload:', payload);

      // ✅ Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(payload));

      // ✅ Append only newly-added images (File objects).
      // Existing images (plain URL strings from the server, present when
      // editing) are intentionally NOT re-sent — the backend keeps them
      // automatically and just appends whatever new files arrive.
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        }
      }

      // ✅ Append only newly-added videos (File objects) — same reasoning.
      if (formData.videos && formData.videos.length > 0) {
        for (const video of formData.videos) {
          if (video instanceof File) {
            formDataToSend.append('videos', video);
          }
        }
      }

      // ✅ Log FormData
      console.log('📤 FormData entries:');
      formDataToSend.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      });

      // ✅ Send request — create vs update depending on mode
      const result =
        isEdit && formData.id
          ? await propertyApi.update(formData.id, formDataToSend)
          : await propertyApi.create(formDataToSend);

      console.log('✅ Property saved successfully:', result);
      setLoading(false);
      return { success: true, data: result };
    } catch (err: any) {
      console.error('❌ Submit Error:', err);
      console.error('❌ Error Response:', err.response?.data);

      const errorResponse = err.response?.data;
      if (errorResponse?.errors) {
        const messages = errorResponse.errors
          .map((e: any) => {
            const field = e.field?.replace('body.data.', '') || e.field || '';
            return field ? `${field}: ${e.message}` : e.message;
          })
          .join('\n');
        setError(`Validation failed:\n${messages}`);
      } else {
        setError(errorResponse?.message || 'Failed to save property');
      }

      setLoading(false);
      return { success: false };
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
