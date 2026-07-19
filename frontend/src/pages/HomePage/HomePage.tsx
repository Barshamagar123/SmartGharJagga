// src/pages/Home.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // ============================================
  // STATIC DATA
  // ============================================
  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Villa with Infinity Pool',
      price: '$850,000',
      location: 'Kathmandu, Nepal',
      beds: 5,
      baths: 4,
      sqft: 3200,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      type: 'Villa',
      status: 'For Sale',
      featured: true,
    },
    {
      id: 2,
      title: 'Luxury Apartment in City Center',
      price: '$450,000',
      location: 'Lalitpur, Nepal',
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      type: 'Apartment',
      status: 'For Sale',
      featured: false,
    },
    {
      id: 3,
      title: 'Spacious Family House with Garden',
      price: '$320,000',
      location: 'Bhaktapur, Nepal',
      beds: 4,
      baths: 3,
      sqft: 2500,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      type: 'House',
      status: 'For Rent',
      featured: false,
    },
    {
      id: 4,
      title: 'Premium Commercial Office Space',
      price: '$1,200,000',
      location: 'Kathmandu, Nepal',
      beds: 0,
      baths: 2,
      sqft: 5000,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      type: 'Office',
      status: 'For Sale',
      featured: true,
    },
    {
      id: 5,
      title: 'Peaceful Bungalow with Mountain View',
      price: '$275,000',
      location: 'Pokhara, Nepal',
      beds: 3,
      baths: 2,
      sqft: 2000,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      type: 'Bungalow',
      status: 'For Sale',
      featured: false,
    },
    {
      id: 6,
      title: 'Modern Studio Apartment',
      price: '$180,000',
      location: 'Kathmandu, Nepal',
      beds: 1,
      baths: 1,
      sqft: 800,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      type: 'Apartment',
      status: 'For Rent',
      featured: false,
    },
  ];

  const categories = [
    { icon: '🏠', label: 'Houses', count: 245, color: 'from-blue-500 to-blue-600' },
    { icon: '🏢', label: 'Apartments', count: 189, color: 'from-purple-500 to-purple-600' },
    { icon: '🏡', label: 'Bungalows', count: 67, color: 'from-emerald-500 to-emerald-600' },
    { icon: '🏘️', label: 'Villas', count: 43, color: 'from-amber-500 to-amber-600' },
    { icon: '🌄', label: 'Land', count: 156, color: 'from-green-500 to-green-600' },
    { icon: '🏭', label: 'Commercial', count: 89, color: 'from-red-500 to-red-600' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Ram Sharma',
      location: 'Kathmandu',
      comment: 'SmartGharJagga helped me find my dream home in just 2 weeks! The AI recommendations were spot on and the agents were incredibly professional.',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Ram+Sharma&background=2563EB&color=fff&size=100',
    },
    {
      id: 2,
      name: 'Sita Thapa',
      location: 'Lalitpur',
      comment: 'The best real estate platform in Nepal. Sold my property at the right price within a month. Highly recommended for anyone looking to buy or sell.',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Sita+Thapa&background=7C3AED&color=fff&size=100',
    },
    {
      id: 3,
      name: 'Hari Gurung',
      location: 'Pokhara',
      comment: 'Professional agents and amazing customer service. The virtual tour feature helped me view properties without visiting in person.',
      rating: 4,
      avatar: 'https://ui-avatars.com/api/?name=Hari+Gurung&background=059669&color=fff&size=100',
    },
  ];

  const partners = [
    { name: 'Nepal Bank', logo: '🏦' },
    { name: 'Real Estate Nepal', logo: '🏗️' },
    { name: 'Housing Nepal', logo: '🏠' },
    { name: 'Property Nepal', logo: '📊' },
    { name: 'Build Nepal', logo: '🔨' },
  ];

  const stats = [
    { value: '500+', label: 'Properties' },
    { value: '350+', label: 'Happy Clients' },
    { value: '50+', label: 'Expert Agents' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const steps = [
    {
      icon: '🔍',
      title: 'Search',
      description: 'Browse through thousands of properties with smart filters',
    },
    {
      icon: '📊',
      title: 'Compare',
      description: 'Compare properties side by side to make informed decisions',
    },
    {
      icon: '🤝',
      title: 'Connect',
      description: 'Connect with agents and schedule viewings instantly',
    },
  ];

  // ============================================
  // ANIMATION VARIANTS - FIXED
  // ============================================
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' as const 
      }
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
      SECTION 1: HERO
      ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              }}
              animate={{
                y: [null, -100, 100, -100],
                x: [null, 50, -50, 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
            >
              <motion.span
                className="text-yellow-400 text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✨
              </motion.span>
              <span className="text-sm text-white/90 font-medium tracking-wide">
                AI-Powered Real Estate Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-tight"
              variants={fadeInUp}
            >
              Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Dream Property
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
              variants={fadeInUp}
            >
              Discover the perfect home with our AI-driven recommendations and expert
              guidance. SmartGharJagga - Your trusted real estate partner in Nepal.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20"
              variants={fadeInUp}
            >
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All Locations</option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="lalitpur">Lalitpur</option>
                  <option value="bhaktapur">Bhaktapur</option>
                  <option value="pokhara">Pokhara</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-white/80"
              variants={fadeInUp}
            >
              {stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl">
                    {['🏠', '🤝', '⭐'][index]}
                  </span>
                  <span className="text-sm font-medium">
                    {stat.value} {stat.label}
                  </span>
                  {index < 2 && <div className="w-px h-6 bg-white/20 ml-4" />}
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
            <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================
      SECTION 2: STATS COUNTER
      ============================================ */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm sm:text-base text-gray-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECTION 3: CATEGORIES
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
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
              Browse by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Property Type
              </span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Explore properties across different categories and find what you're looking for.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.08, y: -8 }}
                className="group relative bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.label}
                  </div>
                  <div className="text-sm text-gray-400">{category.count} properties</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECTION 4: 3-STEP PROCESS
      ============================================ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
              Find Your Home in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 hidden md:block" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-300 relative z-10 border border-gray-100">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-blue-500/20">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{step.title}</h3>
                  <p className="mt-2 text-gray-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
      SECTION 5: FEATURED PROPERTIES
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center mb-12"
          >
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Featured
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Premium{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Properties
                </span>
              </h2>
            </div>
            <Link
              to="/properties"
              className="mt-4 sm:mt-0 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors group"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                variants={fadeInUp}
                whileHover={{ y: -12 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
                        property.status === 'For Sale'
                          ? 'bg-green-500/90 text-white'
                          : property.status === 'For Rent'
                          ? 'bg-blue-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}
                    >
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/90 text-white backdrop-blur-md">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </motion.button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <span>📍</span> {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <span className="flex items-center gap-1">🛏️ {property.beds}</span>
                    <span className="flex items-center gap-1">🛁 {property.baths}</span>
                    <span className="flex items-center gap-1">📐 {property.sqft} sqft</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {property.price}
                    </span>
                    <Link
                      to={`/property/${property.id}`}
                      className="px-5 py-2 text-sm font-medium text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
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
      SECTION 6: AI RECOMMENDATIONS
      ============================================ */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse at 20% 50%, white, transparent 70%)',
                'radial-gradient(ellipse at 80% 50%, white, transparent 70%)',
                'radial-gradient(ellipse at 20% 50%, white, transparent 70%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
            >
              <span className="text-2xl">🤖</span>
              <span className="text-sm font-medium">AI-Powered Recommendations</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Find Your Perfect Home with <span className="text-yellow-300">AI</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Our advanced AI algorithms analyze your preferences and suggest properties
              that match your dream home criteria perfectly.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/discover/ai-recommendations"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-200"
              >
                <span>Get Started with AI</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECTION 7: TRUST SECTION (Partners)
      ============================================ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Trusted Partners
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 sm:gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.1, y: -4 }}
                className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="text-3xl">{partner.logo}</span>
                <span className="text-sm font-semibold text-gray-700">{partner.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECTION 8: TESTIMONIALS
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
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
              What Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-4 border-white shadow-md"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400 text-lg' : 'text-gray-200 text-lg'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
      SECTION 9: FINAL CTA BANNER
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 sm:p-16"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 50%, white, transparent 50%)',
                    'radial-gradient(circle at 100% 50%, white, transparent 50%)',
                    'radial-gradient(circle at 0% 50%, white, transparent 50%)',
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10 text-center text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-5xl mb-4 block">🏡</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Ready to Find Your Dream Home?
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                  Join thousands of happy homeowners who found their perfect property through
                  SmartGharJagga.
                </p>
              </motion.div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-200"
                  >
                    Explore Properties
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;