// src/pages/Home/Home.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Categories Data
  const categories = [
    { icon: '🏠', label: 'Houses', count: '128' },
    { icon: '🏢', label: 'Apartments', count: '94' },
    { icon: '🏡', label: 'Bungalows', count: '42' },
    { icon: '🏘️', label: 'Villas', count: '37' },
    { icon: '🌄', label: 'Land', count: '61' },
    { icon: '🏭', label: 'Commercial', count: '28' },
  ];

  // Featured Properties
  const featuredProperties = [
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
      featured: true,
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
      featured: true,
    },
    {
      id: 4,
      title: 'Hilltop Bungalow',
      price: 'Rs 2.8 Cr',
      location: 'Pokhara, Lakeside',
      beds: 3,
      baths: 2,
      sqft: '2,500',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'BUNGALOW',
      featured: true,
    },
    {
      id: 5,
      title: 'Modern Villa with Garden',
      price: 'Rs 5.2 Cr',
      location: 'Kathmandu, Budhanilkantha',
      beds: 6,
      baths: 5,
      sqft: '5,000',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'VILLA',
      featured: true,
    },
    {
      id: 6,
      title: 'City Center Apartment',
      price: 'Rs 2.1 Cr',
      location: 'Lalitpur, Jawalakhel',
      beds: 3,
      baths: 2,
      sqft: '1,800',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      type: 'APARTMENT',
      featured: false,
    },
  ];

  const stats = [
    { value: '500+', label: 'PROPERTIES' },
    { value: '350+', label: 'HAPPY CLIENTS' },
    { value: '50+', label: 'EXPERT AGENTS' },
  ];

  // ============================================
  // ANIMATIONS
  // ============================================
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const }
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
    <div className="pt-16 md:pt-20 bg-white">
      {/* ============================================
      HERO SECTION
      ============================================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D5A27] text-white text-xs font-semibold rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Listing
              </span>
              <span className="text-sm text-[#475569] font-medium">Legal title checked</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0F172A] leading-tight"
              variants={fadeInUp}
            >
              Find Your
              <span className="block text-[#2D5A27]">Dream Property</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-4 text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed"
              variants={fadeInUp}
            >
              Discover your perfect home with our premium real estate platform—curated listings, honest agents, and neighborhoods you'll love coming home to.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-[#E2E8F0]"
              variants={fadeInUp}
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] text-lg">📍</span>
                  <input
                    type="text"
                    placeholder="Location, e.g. Lalitpur"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                  />
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="px-4 py-3 bg-[#F8FAFC] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all min-w-[140px]"
                >
                  <option value="">Any type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] text-lg">💰</span>
                  <input
                    type="text"
                    placeholder="Price"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
                  />
                </div>
                <button className="px-6 py-3 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[120px]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </motion.div>

            {/* Premium Tag */}
            <motion.div
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#E8F0E4] rounded-xl border border-[#2D5A27]/10"
              variants={fadeInUp}
            >
              <span className="text-lg">🏅</span>
              <span className="text-sm font-semibold text-[#2D5A27]">Premium</span>
              <span className="w-px h-5 bg-[#2D5A27]/30" />
              <span className="text-sm text-[#475569] font-medium">Bhaisepati</span>
              <span className="text-xs text-[#94A3B8] ml-1">• Up to Rs 5 Cr</span>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-6 md:gap-10"
              variants={fadeInUp}
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-[#2D5A27]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-semibold text-[#94A3B8] tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="w-px h-10 bg-[#E2E8F0]" />
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#94A3B8] text-[10px] tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-[#94A3B8]/30 flex items-start justify-center p-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#2D5A27]"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================
      BROWSE BY CATEGORY
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-[#2D5A27] uppercase tracking-wider">
              Browse By Category
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-2">
              Explore our property types
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              From city apartments to hillside villas — find a home shaped around how you actually live.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-[#E2E8F0]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A27] to-[#4A7D42] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="font-semibold text-[#0F172A] group-hover:text-[#2D5A27] transition-colors">
                    {category.label}
                  </div>
                  <div className="text-sm text-[#94A3B8] mt-1">{category.count} listings</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      FEATURED PROPERTIES
      ============================================ */}
      <section className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center mb-12"
          >
            <div>
              <span className="text-sm font-semibold text-[#2D5A27] uppercase tracking-wider">
                Featured Properties
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-1">
                A curated selection of the season's most-loved listings.
              </h2>
            </div>
            <Link
              to="/properties"
              className="mt-4 sm:mt-0 text-[#2D5A27] font-semibold hover:text-[#23461E] flex items-center gap-2 transition-colors group"
            >
              View All Properties
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProperties.slice(0, 3).map((property) => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#E2E8F0]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      property.type === 'VILLA' 
                        ? 'bg-[#D4AF37] text-white' 
                        : property.type === 'HOUSE'
                        ? 'bg-[#2D5A27] text-white'
                        : property.type === 'APARTMENT'
                        ? 'bg-[#4A7D42] text-white'
                        : 'bg-[#6B9D63] text-white'
                    }`}>
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#D4AF37] text-white">
                        ⭐ FEATURED
                      </span>
                    )}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <svg className="w-5 h-5 text-[#94A3B8] hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2D5A27] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-[#94A3B8] text-sm flex items-center gap-1 mt-1">
                    <span>📍</span> {property.location}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-[#475569] mt-3">
                    <span>🛏️ {property.beds} Beds</span>
                    <span>🛁 {property.baths} Baths</span>
                    <span>📐 {property.sqft} sqft</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                    <span className="text-2xl font-bold text-[#2D5A27]">
                      {property.price}
                    </span>
                    <Link
                      to={`/property/${property.id}`}
                      className="px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-lg hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECOND ROW - FEATURED PROPERTIES
      ============================================ */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProperties.slice(3, 6).map((property) => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#E2E8F0]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      property.type === 'VILLA' 
                        ? 'bg-[#D4AF37] text-white' 
                        : property.type === 'HOUSE'
                        ? 'bg-[#2D5A27] text-white'
                        : property.type === 'APARTMENT'
                        ? 'bg-[#4A7D42] text-white'
                        : property.type === 'BUNGALOW'
                        ? 'bg-[#6B9D63] text-white'
                        : 'bg-[#94A3B8] text-white'
                    }`}>
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#D4AF37] text-white">
                        ⭐ FEATURED
                      </span>
                    )}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <svg className="w-5 h-5 text-[#94A3B8] hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2D5A27] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-[#94A3B8] text-sm flex items-center gap-1 mt-1">
                    <span>📍</span> {property.location}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-[#475569] mt-3">
                    <span>🛏️ {property.beds} Beds</span>
                    <span>🛁 {property.baths} Baths</span>
                    <span>📐 {property.sqft} sqft</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E2E8F0]">
                    <span className="text-2xl font-bold text-[#2D5A27]">
                      {property.price}
                    </span>
                    <Link
                      to={`/property/${property.id}`}
                      className="px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-lg hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      FREE & PREMIUM SECTION
      ============================================ */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-[#2D5A27] uppercase tracking-wider">
              Choose Your Plan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-2">
              Free vs <span className="text-[#2D5A27]">Premium</span>
            </h2>
            <p className="mt-3 text-[#475569] max-w-2xl mx-auto">
              Get more visibility and faster sales with our premium features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#E2E8F0]"
            >
              <div className="text-center">
                <span className="text-4xl mb-3 block">🆓</span>
                <h3 className="text-2xl font-bold text-[#0F172A]">Free</h3>
                <p className="text-[#94A3B8] mt-2 text-sm">Perfect for getting started</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#0F172A]">Rs 0</span>
                  <span className="text-[#94A3B8]"> / month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">1 Active Property Listing</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Basic Property Details</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Up to 5 Images</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Standard Visibility</span>
                </li>
                <li className="flex items-center gap-3 text-[#94A3B8]">
                  <span className="text-[#94A3B8] text-lg">✗</span>
                  <span className="text-sm line-through">Featured Badge</span>
                </li>
                <li className="flex items-center gap-3 text-[#94A3B8]">
                  <span className="text-[#94A3B8] text-lg">✗</span>
                  <span className="text-sm line-through">Priority Support</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="block w-full mt-8 px-6 py-3 text-center text-[#2D5A27] font-semibold border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#D4AF37] relative transform scale-105"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#D4AF37] text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/25">
                  MOST POPULAR
                </span>
              </div>

              <div className="text-center mt-2">
                <span className="text-4xl mb-3 block">👑</span>
                <h3 className="text-2xl font-bold text-[#0F172A]">Premium</h3>
                <p className="text-[#94A3B8] mt-2 text-sm">For serious sellers & agents</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#2D5A27]">Rs 999</span>
                  <span className="text-[#94A3B8]"> / month</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">Billed monthly • Cancel anytime</p>
              </div>

              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">Unlimited Property Listings</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">Premium Property Details</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">Up to 20 Images + Virtual Tour</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">Premium Visibility & Boost</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">⭐ Featured Badge</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">24/7 Priority Support</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">AI-Powered Recommendations</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#D4AF37] text-lg">✓</span>
                  <span className="text-sm font-medium">Advanced Analytics Dashboard</span>
                </li>
              </ul>

              <Link
                to="/premium"
                className="block w-full mt-8 px-6 py-3 text-center text-white font-semibold bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Upgrade to Premium
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#E2E8F0]"
            >
              <div className="text-center">
                <span className="text-4xl mb-3 block">🏢</span>
                <h3 className="text-2xl font-bold text-[#0F172A]">Enterprise</h3>
                <p className="text-[#94A3B8] mt-2 text-sm">For agencies & developers</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#0F172A]">Custom</span>
                  <span className="text-[#94A3B8]"> / month</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">Contact us for pricing</p>
              </div>

              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Everything in Premium</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Unlimited Properties & Agents</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Dedicated Account Manager</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Custom Integrations</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">White-label Options</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">API Access</span>
                </li>
                <li className="flex items-center gap-3 text-[#475569]">
                  <span className="text-[#2D5A27] text-lg">✓</span>
                  <span className="text-sm">Custom Development</span>
                </li>
              </ul>

              <Link
                to="/contact"
                className="block w-full mt-8 px-6 py-3 text-center text-[#2D5A27] font-semibold border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-[#94A3B8] text-sm mt-8"
          >
            * All prices are in Nepali Rupees (NPR). Cancel anytime. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* ============================================
      CTA SECTION
      ============================================ */}
      <section className="py-16 md:py-20 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tNCAwaC00di00aDR2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-5xl mb-4 block">🏡</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to find your dream home?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
              Start exploring hand-picked homes, or talk with an expert agent — either way, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="px-8 py-4 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore Properties
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-semibold rounded-xl hover:bg-white hover:text-[#0F172A] hover:border-white transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;