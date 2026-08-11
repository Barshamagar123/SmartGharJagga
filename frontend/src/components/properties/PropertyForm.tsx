// src/components/property/PropertyForm.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import usePropertyForm from '../../hooks/usePropertyForm';
import PropertyFormStep1 from './PropertyFormStep1';
import PropertyFormStep2 from './PropertyFormStep2';
import PropertyFormStep3 from './PropertyFormStep3';
import PropertyFormStep4 from './PropertyFormStep4';
import PropertyListingHeader from './PropertyListingHeader';

interface PropertyFormProps {
  initialData?: any;
  isEdit?: boolean;
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
}

const steps = [
  { id: 'basic', label: 'Basic Info', icon: '📋' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'media', label: 'Media', icon: '📸' },
  { id: 'review', label: 'Review', icon: '✅' },
];

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, loading, error, updateField, submitForm } = usePropertyForm(
    initialData,
    isEdit
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const result = await submitForm();
    if (result.success && onSuccess) onSuccess(result.data);
  };

  const renderStep = () => {
    const props = { formData, updateField };
    switch (currentStep) {
      case 0:
        return <PropertyFormStep1 {...props} />;
      case 1:
        return <PropertyFormStep2 {...props} />;
      case 2:
        return <PropertyFormStep3 {...props} />;
      case 3:
        return <PropertyFormStep4 formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ========================================== */}
      {/* HEADER - Full Width */}
      {/* ========================================== */}
      <PropertyListingHeader
        title={isEdit ? 'Edit Your' : 'List Your'}
        subtitle="Property"
        description={
          isEdit
            ? 'Update your property details'
            : 'Fill in the details to list your property'
        }
        currentStep={currentStep + 1}
        totalSteps={steps.length}
      />

      {/* ========================================== */}
      {/* FORM - FULL WIDTH (max-w-7xl) */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        
        {/* Steps - Horizontal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                      index === currentStep
                        ? 'bg-[#2D5A27] text-white shadow-sm shadow-[#2D5A27]/30'
                        : index < currentStep
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
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
                    className={`flex-1 h-0.5 max-w-16 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <button
            onClick={currentStep === 0 ? onCancel : handlePrev}
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {loading ? 'Submitting...' : isEdit ? 'Update Property' : 'List Property'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all flex items-center gap-2 text-sm"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;