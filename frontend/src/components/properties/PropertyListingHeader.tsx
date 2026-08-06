// src/components/property/PropertyListingHeader.tsx

import React from 'react';

interface PropertyListingHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
}

const PropertyListingHeader: React.FC<PropertyListingHeaderProps> = ({
  title = "List Your",
  subtitle = "Property",
  description = "Fill in the details to list your property",
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
              {title} <span className="text-[#2D5A27]">{subtitle}</span>
            </h1>
            <p className="text-[#475569] text-base md:text-lg mt-2">
              {description}
            </p>
          </div>
          {currentStep && totalSteps && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#EDF5EC] text-[#2D5A27] text-xs font-semibold rounded-full">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListingHeader;