// src/pages/seller/AddProperty.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../../components/properties/PropertyForm';
// ✅ FIXED: PropertyForm actually lives in components/property/ (singular),
// not components/properties/ (plural) — this was causing a module-not-found
// error that broke the whole page.

const AddProperty: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (property: any) => {
    // Navigate to property detail page
    navigate(`/property/${property.id}`);
  };

  const handleCancel = () => {
    navigate('/my-properties');
  };

  // ✅ FIXED: removed the "max-w-4xl mx-auto" wrapper that used to sit
  // around <PropertyForm />. That wrapper capped the ENTIRE form —
  // including PropertyForm's own full-width PropertyListingHeader — at
  // 896px, which is why the header rendered "half width" instead of
  // stretching edge-to-edge under the navbar. PropertyForm already
  // manages its own internal layout (full-width header, narrow card
  // below it), so this page should render it directly with no width
  // constraint of its own.
  //
  // ✅ FIXED: removed the "Back to My Properties" button, as requested.

  return (
    <PropertyForm onSuccess={handleSuccess} onCancel={handleCancel} />
  );
};

export default AddProperty;
