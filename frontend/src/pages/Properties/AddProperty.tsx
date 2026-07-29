// src/pages/seller/AddProperty.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropertyForm from '../../components/properties/PropertyForm';
const AddProperty: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (property: any) => {
    // Navigate to property detail page
    navigate(`/property/${property.id}`);
  };

  const handleCancel = () => {
    navigate('/my-properties');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-properties')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Properties
        </button>

        <PropertyForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddProperty;