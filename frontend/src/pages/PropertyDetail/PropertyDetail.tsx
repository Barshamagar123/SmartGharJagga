// src/pages/PropertyDetail/PropertyDetail.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, Loader2, 
  Calendar, Phone, Mail, MapPin, Star,
  BedDouble, Bath, Maximize2, Car,
  Building2, DollarSign, CheckCircle,
  QrCode, Copy, Download, ExternalLink,
  User, ChevronLeft, ChevronRight, X,
  Maximize, Clock, Home, Navigation,
  Award, Shield, MessageCircle, Info,
  Send, Layers, Ruler, CalendarDays
} from 'lucide-react';
import type { PropertyDetail as PropertyDetailType } from '../../types/property';

// Mock Data
const MOCK_PROPERTY: PropertyDetailType = {
  id: 1,
  slug: 'luxury-villa-budhanilkantha',
  title: 'Contemporary Luxury Villa in Budhanilkantha',
  price: 'NPR 8,50,000,000',
  location: 'Budhanilkantha, Kathmandu',
  beds: 3,
  baths: 4,
  sqft: '3,500',
  image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
  type: 'VILLA',
  featured: true,
  status: 'AVAILABLE',
  description: 'This exquisite property offers modern architecture, spacious interiors, and a peaceful garden. It features high-end finishes throughout.',
  yearBuilt: 2022,
  garage: 2,
  propertyTax: 'NPR 1,20,000/year',
  coordinates: {
    lat: 27.7745,
    lng: 85.3681,
  },
  amenities: [
    'WiFi', 'Air Conditioning', 'Security System', 'Gym',
    'Swimming Pool', 'Garden', 'Kitchen', 'Parking',
    'Furnished', 'Smart TV', 'Fireplace'
  ],
  nearby: [
    { name: 'Budhanilkantha School', distance: '500m', type: 'school' },
    { name: 'City Hospital', distance: '1.2km', type: 'hospital' },
    { name: 'Supermarket', distance: '800m', type: 'mall' },
    { name: 'Bus Stop', distance: '300m', type: 'transport' },
  ],
  images: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop',
  ],
  rating: 4.8,
  reviews: 5,
  agent: {
    name: 'Sital Paudel',
    phone: '+977 9851342035',
    email: 'sales@lalpurjanepal.com.np',
    avatar: 'https://ui-avatars.com/api/?name=Sital+Paudel&size=100&background=2D5A27&color=fff',
    company: 'Lalpurja Nepal Real Estate',
    experience: '8+ Years',
    propertiesSold: 120,
    rating: 4.9,
    verified: true,
  },
  virtualTour: 'https://example.com/virtual-tour',
  lastUpdated: '2 days ago',
};

const PropertyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: 'Hi, I am interested in this House for Sale at Budhanilkantha, Kathmandu'
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setProperty(MOCK_PROPERTY);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  const nextImage = () => {
    if (property) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={48} className="animate-spin text-[#2D5A27]" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="pt-16 md:pt-20 bg-[#F8FAFC] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-10">
        <div className="max-w-[1440px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#475569] hover:text-[#2D5A27]">Home</Link>
            <span className="text-[#94A3B8]">/</span>
            <Link to="/properties" className="text-[#475569] hover:text-[#2D5A27]">Properties</Link>
            <span className="text-[#94A3B8]">/</span>
            <span className="text-[#0F172A] font-medium truncate">Luxury Villa in Budhanilkantha</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-[#475569] hover:text-[#2D5A27] transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Properties</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gallery with Thumbnails */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              {/* Main Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={property.images[currentImage]}
                  alt={property.title}
                  className="w-full h-[400px] md:h-[500px] object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                  {currentImage + 1} / {property.images.length}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200"
                >
                  <Maximize size={18} />
                </button>

                {/* Featured Badge */}
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImage
                          ? 'border-[#2D5A27] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                onClick={() => setIsLightboxOpen(false)}
              >
                <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute -top-14 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={32} />
                  </button>
                  <img
                    src={property.images[currentImage]}
                    alt={property.title}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                      >
                        <ChevronLeft size={28} className="text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                      >
                        <ChevronRight size={28} className="text-white" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                    {currentImage + 1} of {property.images.length}
                  </div>
                </div>
              </div>
            )}

            {/* Property Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-[#0F172A] mb-3">Property Description</h2>
              <p className="text-[#475569] leading-relaxed">{property.description}</p>
            </div>

            {/* Property Specs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Property Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <BedDouble size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">{property.beds} Beds</div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Bath size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">{property.baths} Baths</div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Maximize2 size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">{property.sqft} Sq Ft</div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Car size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">Coverage</div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <MapPin size={20} className="text-[#2D5A27]" />
                  Location Map
                </h3>
                <span className="text-sm text-[#475569]">{property.location}</span>
              </div>
              
              <div className="w-full h-[300px] rounded-xl overflow-hidden bg-[#EDF5EC] relative">
                {/* Google Maps Embed */}
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${property.coordinates.lat},${property.coordinates.lng}&zoom=15&maptype=roadmap`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location Map"
                  className="rounded-xl"
                />
                
                {/* Map Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-[#2D5A27] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div className="absolute -inset-4 bg-[#2D5A27]/20 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>

              {/* Nearby Places */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-[#0F172A] mb-2">Nearby Places</h4>
                <div className="flex flex-wrap gap-2">
                  {property.nearby.map((place, index) => (
                    <span key={index} className="flex items-center gap-1 text-xs bg-[#F8FAFC] px-3 py-1.5 rounded-full text-[#475569] border border-gray-200">
                      <MapPin size={12} className="text-[#2D5A27]" />
                      {place.name} ({place.distance})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Virtual Tour & QR */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#EDF5EC] text-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-colors">
                  <ExternalLink size={18} />
                  360° Virtual Tour
                </button>
                <div className="flex items-center gap-2">
                  <QrCode size={20} className="text-[#2D5A27]" />
                  <span className="text-sm text-[#475569]">Scan for Property Details</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              {/* ============================================
              SELLER DETAILS - TOP OF ENQUIRY FORM
              ============================================ */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#EDF5EC] rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-[#2D5A27]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">{property.agent.name}</h4>
                    <p className="text-xs text-[#475569]">{property.agent.company}</p>
                  </div>
                </div>
                
                {/* Seller Contact */}
                <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <Phone size={14} className="text-[#2D5A27] flex-shrink-0" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <Mail size={14} className="text-[#2D5A27] flex-shrink-0" />
                    <span className="truncate">{property.agent.email}</span>
                  </div>
                </div>

                {/* Seller Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 bg-[#F8FAFC] rounded-lg">
                    <div className="text-xs font-semibold text-[#0F172A]">{property.agent.experience}</div>
                    <div className="text-[10px] text-[#475569]">Experience</div>
                  </div>
                  <div className="text-center p-2 bg-[#F8FAFC] rounded-lg">
                    <div className="text-xs font-semibold text-[#0F172A]">{property.agent.propertiesSold}+</div>
                    <div className="text-[10px] text-[#475569]">Properties</div>
                  </div>
                  <div className="text-center p-2 bg-[#F8FAFC] rounded-lg">
                    <div className="text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-0.5">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      {property.agent.rating}
                    </div>
                    <div className="text-[10px] text-[#475569]">Rating</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={12} />
                    Verified Seller
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Shield size={12} />
                    Licensed
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#475569]">Price</div>
                    <div className="font-serif text-2xl font-bold text-[#2D5A27]">
                      {property.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{property.rating}</span>
                      <span className="text-[#94A3B8]">({property.reviews})</span>
                    </div>
                    <div className="text-xs text-[#94A3B8]">{property.status}</div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <BedDouble size={14} className="text-[#2D5A27]" />
                  {property.beds} Beds
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Bath size={14} className="text-[#2D5A27]" />
                  {property.baths} Baths
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Maximize2 size={14} className="text-[#2D5A27]" />
                  {property.sqft} sqft
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Car size={14} className="text-[#2D5A27]" />
                  {property.garage} Cars
                </div>
              </div>

              <button className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium mb-4 flex items-center justify-center gap-2">
                <Phone size={18} />
                Contact Agent
              </button>

              {/* QR Code Section */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <button
                  onClick={() => setIsQRExpanded(!isQRExpanded)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-[#2D5A27]" />
                    <span className="text-sm font-medium text-[#0F172A]">QR Code</span>
                  </div>
                  <span className="text-xs text-[#94A3B8]">
                    {isQRExpanded ? 'Hide' : 'Show'}
                  </span>
                </button>

                {isQRExpanded && (
                  <div className="mt-3">
                    <div className="flex items-center justify-center bg-[#F8FAFC] rounded-xl p-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <QrCode size={80} className="text-[#2D5A27]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={handleCopyLink}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm text-[#475569]"
                      >
                        {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm text-[#475569]">
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                    <p className="text-xs text-[#94A3B8] text-center mt-2">Scan for Property Details</p>
                  </div>
                )}
              </div>

              {/* Enquiry Form */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#2D5A27]" />
                  Enquiry Form
                </h4>
                {isSubmitted ? (
                  <div className="bg-[#EDF5EC] rounded-xl p-4 text-center">
                    <CheckCircle size={32} className="text-[#2D5A27] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#2D5A27]">Enquiry Sent!</p>
                    <p className="text-xs text-[#475569]">Agent will contact you shortly</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email (Optional)"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        placeholder="Message *"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send Enquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;