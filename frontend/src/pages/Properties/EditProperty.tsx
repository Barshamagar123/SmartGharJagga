// src/pages/seller/EditProperty.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
// ✅ FIXED: PropertyForm actually lives in components/property/ (singular),
// not components/properties/ (plural).
import { propertyApi } from '../../services/api/property';
import PropertyForm from '../../components/properties/PropertyForm';

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const property = await propertyApi.getById(id!);
        setPropertyData(property);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleSuccess = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleCancel = () => {
    navigate('/my-properties');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#2D5A27]" />
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/my-properties')}
            className="mt-4 px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E]"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/my-properties')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Properties
        </button>

        {/*
          ✅ propertyData already contains "id" from the API response, and
          usePropertyForm (via PropertyForm) picks that up automatically to
          know which property to PUT to when isEdit=true.
        */}
        <PropertyForm
          initialData={propertyData}
          isEdit={true}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditProperty;
