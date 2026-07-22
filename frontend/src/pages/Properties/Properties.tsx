// src/pages/Properties/Properties.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================
type PropertyType = 'VILLA' | 'HOUSE' | 'APARTMENT' | 'BUNGALOW' | 'LAND';

interface Property {
  id: number;
  slug: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: PropertyType;
  featured: boolean;
}

// ============================================
// DATA
// ============================================
const PROPERTIES: Property[] = [
  {
    id: 1,
    slug: 'aspen-ridge-villa',
    title: 'Aspen Ridge Villa',
    price: 'Rs 4.8 Cr',
    location: 'Lalitpur, Bhaisepati',
    beds: 5,
    baths: 4,
    sqft: '4,200',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
    type: 'VILLA',
    featured: true,
  },
  {
    id: 2,
    slug: 'greenwood-townhouse',
    title: 'Greenwood Townhouse',
    price: 'Rs 3.2 Cr',
    location: 'Kathmandu, Baluwatar',
    beds: 4,
    baths: 3,
    sqft: '3,100',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&auto=format&fit=crop',
    type: 'HOUSE',
    featured: true,
  },
  {
    id: 3,
    slug: 'monsoon-loft',
    title: 'Monsoon Loft',
    price: 'Rs 1.4 Cr',
    location: 'Kathmandu, Thamel',
    beds: 2,
    baths: 2,
    sqft: '1,350',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop',
    type: 'APARTMENT',
    featured: true,
  },
  {
    id: 4,
    slug: 'cedar-bungalow',
    title: 'Cedar Bungalow',
    price: 'Rs 2.6 Cr',
    location: 'Bhaktapur, Suryabinayak',
    beds: 3,
    baths: 3,
    sqft: '2,400',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&auto=format&fit=crop',
    type: 'BUNGALOW',
    featured: true,
  },
  {
    id: 5,
    slug: 'hillside-estate',
    title: 'Hillside Estate',
    price: 'Rs 5.2 Cr',
    location: 'Kavre, Dhulikhel',
    beds: 5,
    baths: 5,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop',
    type: 'VILLA',
    featured: true,
  },
  {
    id: 6,
    slug: 'riverstone-plot',
    title: 'Riverstone Plot',
    price: 'Rs 95 Lakh',
    location: 'Pokhara, Lakeside',
    beds: 0,
    baths: 0,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop',
    type: 'LAND',
    featured: false,
  },
];

const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];
const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+'];

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
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
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const Properties: React.FC = () => {
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState(800);
  const [bedrooms, setBedrooms] = useState('Any');
  const [bathrooms, setBathrooms] = useState('Any');
  const [location, setLocation] = useState('');

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      {/* ============================================
      PAGE HEADER
      ============================================ */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 md:pt-14 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight"
        >
          Properties <span className="text-[#2D5A27]">for you</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-[var(--color-text-secondary)] text-lg mt-3"
        >
          {PROPERTIES.length} homes matching your filters across Nepal.
        </motion.p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ============================================
          SIDEBAR - FILTERS
          ============================================ */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-primary-border)] sticky top-24">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--color-text-primary)] mb-4">
                <SlidersHorizontal size={17} className="text-[#2D5A27]" aria-hidden="true" />
                Filters
              </h2>

              {/* Property Type */}
              <div className="mb-4">
                <label
                  htmlFor="property-type"
                  className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5"
                >
                  Property type
                </label>
                <div className="relative">
                  <select
                    id="property-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none px-4 py-2 text-sm bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-full text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                  >
                    <option value="">Any</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-tertiary)]"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-4">
                <label
                  htmlFor="max-price"
                  className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-2"
                >
                  Max price <span className="text-[var(--color-text-primary)] normal-case font-semibold">(Rs {maxPrice} Lakh)</span>
                </label>
                <input
                  id="max-price"
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-valuetext={`Rs ${maxPrice} Lakh`}
                  className="w-full h-1.5 bg-[var(--color-primary-border)] rounded-full appearance-none cursor-pointer accent-[#2D5A27]"
                />
              </div>

              {/* Bedrooms */}
              <fieldset className="mb-4">
                <legend className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5">
                  Bedrooms
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {BEDROOM_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBedrooms(option)}
                      aria-pressed={bedrooms === option}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                        bedrooms === option
                          ? 'bg-[#2D5A27] text-white shadow-sm'
                          : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Bathrooms */}
              <fieldset className="mb-4">
                <legend className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5">
                  Bathrooms
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {BATHROOM_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBathrooms(option)}
                      aria-pressed={bathrooms === option}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                        bathrooms === option
                          ? 'bg-[#2D5A27] text-white shadow-sm'
                          : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Location */}
              <div className="mb-5">
                <label
                  htmlFor="location"
                  className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Lalitpur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-full text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                />
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                className="w-full py-2.5 text-sm bg-[#2D5A27] text-white font-semibold rounded-full hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A27] focus-visible:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ============================================
          PROPERTIES GRID
          ============================================ */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-end items-center mb-6">
              <div className="relative">
                <select className="appearance-none pl-5 pr-10 py-2.5 bg-white border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]">
                  <option>Sort by: Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-tertiary)]"
                  viewBox="0 0 12 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Properties Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {PROPERTIES.map((property) => (
                <motion.div
                  key={property.id}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[var(--color-primary-border)]"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={`${property.title} in ${property.location}`}
                      loading="lazy"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {property.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-full bg-[#2D5A27] text-white shadow-sm">
                        FEATURED
                      </span>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-full bg-white/90 backdrop-blur-sm text-[var(--color-text-primary)] shadow-sm">
                      {property.type}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base font-bold text-[var(--color-text-primary)] group-hover:text-[#2D5A27] transition-colors leading-snug">
                        {property.title}
                      </h3>
                      <p className="font-serif text-base font-bold text-[#2D5A27] whitespace-nowrap">
                        {property.price}
                      </p>
                    </div>

                    <p className="text-[var(--color-text-tertiary)] text-xs flex items-center gap-1 mt-1.5">
                      <MapPin size={12} className="flex-shrink-0" aria-hidden="true" />
                      {property.location}
                    </p>

                    <div className="h-px bg-[var(--color-primary-border)] my-3" />

                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      {property.beds > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={14} aria-hidden="true" /> {property.beds} Beds
                        </span>
                      )}
                      {property.baths > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath size={14} aria-hidden="true" /> {property.baths} Baths
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize2 size={12} aria-hidden="true" /> {property.sqft} sqft
                      </span>
                    </div>

                    <Link
                      to={`/property/${property.slug}`}
                      className="mt-4 inline-block w-full text-center px-4 py-2 text-xs font-semibold text-[#2D5A27] border-2 border-[#2D5A27] rounded-full hover:bg-[#2D5A27] hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A27] focus-visible:ring-offset-2"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                type="button"
                className="px-5 py-2.5 border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200"
              >
                Previous
              </button>
              <button
                type="button"
                aria-current="page"
                className="w-10 h-10 flex items-center justify-center bg-[#2D5A27] text-white rounded-full text-sm hover:bg-[#23461E] transition-all duration-200"
              >
                1
              </button>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200"
              >
                2
              </button>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200"
              >
                3
              </button>
              <button
                type="button"
                className="px-5 py-2.5 border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200"
              >
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