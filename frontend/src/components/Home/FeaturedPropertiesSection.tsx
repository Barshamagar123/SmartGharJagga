// src/pages/Home/components/FeaturedPropertiesSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Eye, Home, Bed, Bath, Square, TrendingUp, Heart, Share2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  titleNepali?: string;
  location: string;
  address: string;
  price: string;
  pricePerUnit?: string;
  landSize: string;
  landSizeUnit?: string;
  direction: string;
  contact: string;
  image: string;
  type: 'sale' | 'rent' | 'featured';
  beds?: number;
  baths?: number;
  sqft?: number;
  features?: string[];
  isFeatured?: boolean;
}

const FeaturedPropertiesSection: React.FC = () => {
  const properties: Property[] = [
    {
      id: '1',
      title: 'Land For Sale at Biratnagar, Morang',
      titleNepali: 'विक्रीमा रहेको जग्गा - बिराटनगर, मोरङ',
      location: 'Dharmasala Tole, Prativa Marga, Biratnagar',
      address: 'Metropolitan-01, Morang',
      price: 'Rs 6,00,000',
      pricePerUnit: '/dhur',
      landSize: '15.0',
      landSizeUnit: 'Dhur',
      direction: 'South',
      contact: '9852080523',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
      type: 'sale',
      isFeatured: true,
      features: ['East Facing', 'Main Road', 'Ready to Build'],
    },
    {
      id: '2',
      title: 'Modern Villa with Garden',
      titleNepali: 'बगैचासहितको आधुनिक भिल्ला',
      location: 'Lalitpur, Bhaisepati',
      address: 'Bhaisepati-5, Lalitpur',
      price: 'Rs 4.8 Cr',
      landSize: '4.5',
      landSizeUnit: 'Aana',
      direction: 'East',
      contact: '9810342784',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
      type: 'featured',
      beds: 5,
      baths: 4,
      sqft: 4200,
      isFeatured: true,
      features: ['Swimming Pool', 'Garden', 'Parking'],
    },
    {
      id: '3',
      title: 'Luxury Apartment with View',
      titleNepali: 'दृश्य सहितको लक्जरी अपार्टमेन्ट',
      location: 'Pokhara, Lakeside',
      address: 'Lakeside-6, Pokhara',
      price: 'Rs 3.2 Cr',
      landSize: '1200',
      landSizeUnit: 'sqft',
      direction: 'North',
      contact: '9851234567',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      type: 'rent',
      beds: 3,
      baths: 2,
      sqft: 1800,
      features: ['Lake View', 'Balcony', 'Security'],
    },
    {
      id: '4',
      title: 'Commercial Space For Sale',
      titleNepali: 'व्यावसायिक स्थान बिक्रीमा',
      location: 'Kathmandu, New Road',
      address: 'New Road-22, Kathmandu',
      price: 'Rs 12.5 Cr',
      landSize: '2500',
      landSizeUnit: 'sqft',
      direction: 'West',
      contact: '9801234567',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      type: 'sale',
      features: ['Prime Location', 'High Footfall', 'Parking'],
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-16 bg-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[#2D5A27] uppercase tracking-wider">
            Our Featured Exclusive Properties
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mt-2">
            Handpicked Properties For You
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Discover our curated selection of premium properties across Nepal
          </p>
        </motion.div>

        {/* Property Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--color-primary-border)] group"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Featured Badge */}
                {property.isFeatured && (
                  <div className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Featured
                  </div>
                )}
                {/* Type Badge */}
                <div className="absolute top-3 right-3 bg-[#2D5A27] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Featured'}
                </div>
                {/* Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                    <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                    <Share2 className="w-4 h-4 text-gray-500 hover:text-[#2D5A27] transition-colors" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                  {property.title}
                </h3>
                {property.titleNepali && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {property.titleNepali}
                  </p>
                )}

                {/* Location */}
                <div className="mt-2 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2D5A27] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {property.location}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {property.address}
                    </p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    📐 {property.landSize} {property.landSizeUnit}
                  </span>
                  <span className="w-px h-3 bg-gray-300" />
                  <span className="flex items-center gap-1">
                    🧭 {property.direction}
                  </span>
                </div>

                {/* Beds/Baths/Sqft (if available) */}
                {(property.beds || property.baths || property.sqft) && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" /> {property.beds}
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {property.baths}
                      </span>
                    )}
                    {property.sqft && (
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" /> {property.sqft} sqft
                      </span>
                    )}
                  </div>
                )}

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {property.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price & Contact */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-[#2D5A27]">
                      {property.price}
                    </span>
                    {property.pricePerUnit && (
                      <span className="text-xs text-gray-400">{property.pricePerUnit}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="w-3 h-3 text-[#2D5A27]" />
                    <span>{property.contact}</span>
                  </div>
                </div>

                {/* Explore Button */}
                <Link
                  to={`/property/${property.id}`}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2D5A27] text-white text-sm font-medium rounded-lg hover:bg-[#23461E] transition-all duration-200 group"
                >
                  <Eye className="w-4 h-4" />
                  Explore Now
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#2D5A27] text-[#2D5A27] font-semibold rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
          >
            View All Properties
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;