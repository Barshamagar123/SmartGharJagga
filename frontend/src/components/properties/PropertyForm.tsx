// src/components/property/PropertyForm.tsx

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import PropertyFormStep1 from './PropertyFormStep1';
import PropertyFormStep2 from './PropertyFormStep2';
import PropertyFormStep3 from './PropertyFormStep3';
import PropertyFormStep4 from './PropertyFormStep4';
import usePropertyForm from '../../hooks/usePropertyForm';

interface PropertyFormProps {
  initialData?: any;
  isEdit?: boolean;
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, loading, error, submitForm, updateField } = usePropertyForm(initialData);

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'media', label: 'Media', icon: '📸' },
    { id: 'review', label: 'Review', icon: '✅' },
  ];

  // ✅ Validate Step 1 before moving forward
  const validateStep1 = () => {
    const errors: string[] = [];

    if (!formData.title || formData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('Price must be greater than 0');
    }
    if (!formData.propertyType) {
      errors.push('Please select a property type');
    }
    if (!formData.purpose) {
      errors.push('Please select a purpose');
    }

    if (errors.length > 0) {
      alert(errors.join('\n')); // ✅ Show error to user
      return false;
    }
    return true;
  };

  // ✅ Validate Step 2 before moving forward
  const validateStep2 = () => {
    if (!formData.location || formData.location.trim().length < 2) {
      alert('Please enter a valid location');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    // ✅ Validate based on current step
    if (currentStep === 0 && !validateStep1()) return;
    if (currentStep === 1 && !validateStep2()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🔍 Final form data before submit:', formData);
    
    // ✅ Final validation before submit
    if (!formData.title || !formData.price || !formData.location || !formData.propertyType) {
      alert('Please fill all required fields');
      return;
    }

    const result = await submitForm();
    if (result.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PropertyFormStep1 formData={formData} updateField={updateField} />;
      case 1:
        return <PropertyFormStep2 formData={formData} updateField={updateField} />;
      case 2:
        return <PropertyFormStep3 formData={formData} updateField={updateField} />;
      case 3:
        return <PropertyFormStep4 formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D5A27] to-[#23461E] px-8 py-6">
        <h2 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit Property' : 'List Your Property'}
        </h2>
        <p className="text-white/70 text-sm mt-1">
          {isEdit ? 'Update your property details' : 'Fill in the details to list your property'}
        </p>
      </div>

      {/* Steps Progress */}
      <div className="px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-[#2D5A27] text-white'
                      : index < currentStep
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : step.icon}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    index === currentStep
                      ? 'text-[#2D5A27]'
                      : index < currentStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 w-8 sm:w-12 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <button
          onClick={onCancel || handlePrev}
          className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          type="button"
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </button>

        <div className="flex items-center gap-3">
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {isEdit ? 'Update Property' : 'List Property'}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200 flex items-center gap-2"
              type="button"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;