// src/pages/Properties/Properties.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Properties: React.FC = () => {
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState(800);
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');

  // Properties Data
  const properties = [
    {
      id: 1,
      title: 'Aspen Ridge Villa',
      price: 'Rs 4.8 Cr',
      location: 'Lalitpur, Bhaisepati',
      beds: 5,
      baths: 4,
      sqft: '4,200',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      type: 'VILLA',
      featured: true,
    },
    {
      id: 2,
      title: 'Greenwood Townhouse',
      price: 'Rs 3.2 Cr',
      location: 'Kathmandu, Baluwatar',
      beds: 4,
      baths: 3,
      sqft: '3,100',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      type: 'HOUSE',
      featured: false,
    },
    {
      id: 3,
      title: 'Monsoon Loft',
      price: 'Rs 1.4 Cr',
      location: 'Kathmandu, Thamel',
      beds: 2,
      baths: 2,
      sqft: '1,350',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      type: 'APARTMENT',
      featured: false,
    },
    {
      id: 4,
      title: 'Cedar Bungalow',
      price: 'Rs 2.6 Cr',
      location: 'Bhaktapur, Suryabinayak',
      beds: 3,
      baths: 3,
      sqft: '2,400',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'BUNGALOW',
      featured: false,
    },
    {
      id: 5,
      title: 'Hillside Estate',
      price: 'Rs 5.2 Cr',
      location: 'Kavre, Dhulikhel',
      beds: 5,
      baths: 5,
      sqft: '5,600',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'VILLA',
      featured: true,
    },
    {
      id: 6,
      title: 'Riverstone Plot',
      price: 'Rs 95 Lakh',
      location: 'Pokhara, Lakeside',
      beds: 0,
      baths: 0,
      sqft: '5,600',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      type: 'LAND',
      featured: false,
    },
  ];

  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathroomOptions = ['Any', '1+', '2+', '3+', '4+'];

  // ============================================
  // ANIMATIONS
  // ============================================
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
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ============================================
          SIDEBAR - FILTERS
          ============================================ */}
          <aside className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-primary-border)] sticky top-24">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
                # Filters
              </h2>

              {/* Property Type */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  PROPERTY TYPE
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                >
                  <option value="">Any</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Max Price */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  MAX PRICE (RS {maxPrice} LAKH)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--color-primary-border)] rounded-lg appearance-none cursor-pointer accent-[#2D5A27]"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mt-1">
                  <span>Rs 0</span>
                  <span>Rs 1000 Lakh</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  BEDROOMS
                </label>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setBedrooms(option)}
                      className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                        bedrooms === option
                          ? 'bg-[#2D5A27] text-white'
                          : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  BATHROOMS
                </label>
                <div className="flex flex-wrap gap-2">
                  {bathroomOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setBathrooms(option)}
                      className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                        bathrooms === option
                          ? 'bg-[#2D5A27] text-white'
                          : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-[var(--color-text-primary)] block mb-2">
                  LOCATION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lalitpur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                />
              </div>

              {/* Apply Filters Button */}
              <button className="w-full py-3 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ============================================
          PROPERTIES GRID
          ============================================ */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-[var(--color-text-secondary)] text-sm">
                Showing <span className="font-semibold text-[var(--color-text-primary)]">{properties.length}</span> properties
              </p>
              <select className="px-4 py-2 bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Properties Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-primary-border)]"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        property.type === 'VILLA' 
                          ? 'bg-[#D4AF37] text-white' 
                          : property.type === 'HOUSE'
                          ? 'bg-[#2D5A27] text-white'
                          : property.type === 'APARTMENT'
                          ? 'bg-[#4A7D42] text-white'
                          : property.type === 'LAND'
                          ? 'bg-[#6B9D63] text-white'
                          : 'bg-[#94A3B8] text-white'
                      }`}>
                        {property.type}
                      </span>
                      {property.featured && (
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#D4AF37] text-white">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[#2D5A27] transition-colors">
                      {property.title}
                    </h3>
                    
                    <p className="text-2xl font-bold text-[#2D5A27] mt-1">
                      {property.price}
                    </p>
                    
                    <p className="text-[var(--color-text-tertiary)] text-sm flex items-center gap-1 mt-1">
                      <span>📍</span> {property.location}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-3">
                      {property.beds > 0 && <span>🛏️ {property.beds} Beds</span>}
                      {property.baths > 0 && <span>🛁 {property.baths} Baths</span>}
                      {property.sqft && <span>📐 {property.sqft} sqft</span>}
                    </div>

                    <Link
                      to={`/property/${property.id}`}
                      className="mt-4 inline-block w-full text-center px-4 py-2.5 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] transition-all duration-200">
                Previous
              </button>
              <button className="px-4 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-all duration-200">
                1
              </button>
              <button className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] transition-all duration-200">
                2
              </button>
              <button className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] transition-all duration-200">
                3
              </button>
              <button className="px-4 py-2 border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-surface)] transition-all duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;