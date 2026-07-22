// src/components/property-detail/PropertyEnquiry.tsx

import React, { useState } from 'react';
import { Send, Phone, Mail, User, MessageCircle, CheckCircle, Building2 } from 'lucide-react';

interface PropertyEnquiryProps {
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyType: string;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const PropertyEnquiry: React.FC<PropertyEnquiryProps> = ({
  agentName,
  agentPhone,
  agentEmail,
  propertyTitle,
  propertyLocation,
  propertyType,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: `Hi, I am interested in this ${propertyType} for Sale at ${propertyLocation}`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Enquiry submitted:', {
        ...formData,
        propertyTitle,
        propertyLocation,
        agentName,
        agentEmail,
        agentPhone,
      });
      
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#EDF5EC] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-[#2D5A27]" />
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
            Enquiry Sent Successfully!
          </h3>
          <p className="text-[#475569] text-sm">
            Thank you for your interest. The agent will contact you shortly.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-4 px-6 py-2 bg-[#2D5A27] text-white rounded-full hover:bg-[#23461E] transition-colors text-sm"
          >
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header - Agent Info */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#F8FAFC] to-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#EDF5EC] rounded-full flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-[#2D5A27]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#0F172A]">{agentName}</h3>
            <div className="flex flex-col text-sm text-[#475569]">
              <span className="flex items-center gap-1">
                <Phone size={14} className="text-[#2D5A27] flex-shrink-0" />
                {agentPhone}
              </span>
              <span className="flex items-center gap-1 truncate">
                <Mail size={14} className="text-[#2D5A27] flex-shrink-0" />
                {agentEmail}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-[#EDF5EC] rounded-lg p-2.5 text-sm text-[#475569] flex items-center gap-2">
          <Building2 size={16} className="text-[#2D5A27] flex-shrink-0" />
          <span className="font-medium text-[#0F172A]">Contact For Enquiry</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-[#94A3B8]" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border ${
                errors.fullName ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-[#0F172A] placeholder-[#94A3B8]`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-[#94A3B8]" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-[#0F172A] placeholder-[#94A3B8]`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-[#94A3B8]" />
            </div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-[#0F172A] placeholder-[#94A3B8]`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Message <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageCircle size={18} className="text-[#94A3B8]" />
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Type your message here..."
              className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border ${
                errors.message ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-[#0F172A] placeholder-[#94A3B8] resize-none`}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Enquiry
            </>
          )}
        </button>

        <p className="text-xs text-[#94A3B8] text-center">
          By submitting this form, you agree to our privacy policy
        </p>
      </form>
    </div>
  );
};

export default PropertyEnquiry;