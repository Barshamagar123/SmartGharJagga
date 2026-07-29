// src/pages/Home/Home.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/common/Button/Button';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/common/Card/Card';
import FeaturedPropertiesSection from '../../components/Home/FeaturedPropertiesSection';

const HomePage: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  // ✅ Featured Properties for Carousel
  const featuredProperties = [
    {
      id: '1',
      title: 'Land For Sale At Chyasal, Balkumari, Lalitpur',
      location: 'Balkumari, Chyasal, Lalitpur Metropolitan City - 09, Lalitpur',
      price: 'Rs 65,00,000',
      pricePerUnit: '/aana',
      landSize: '15.0',
      landSizeUnit: 'aana',
      direction: 'South',
      contact: '9747899705',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    },
    {
      id: '2',
      title: 'Modern Villa with Garden',
      location: 'Lalitpur, Bhaisepati Metropolitan City - 5, Lalitpur',
      price: 'Rs 4.8 Cr',
      pricePerUnit: '',
      landSize: '4.5',
      landSizeUnit: 'aana',
      direction: 'East',
      contact: '9810342784',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    },
    {
      id: '3',
      title: 'Luxury Apartment with Mountain View',
      location: 'Pokhara, Lakeside - 6, Kaski',
      price: 'Rs 3.2 Cr',
      pricePerUnit: '',
      landSize: '1800',
      landSizeUnit: 'sqft',
      direction: 'North',
      contact: '9851234567',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    },
    {
      id: '4',
      title: 'Commercial Complex For Sale',
      location: 'Kathmandu, New Road - 22, Kathmandu',
      price: 'Rs 12.5 Cr',
      pricePerUnit: '',
      landSize: '2500',
      landSizeUnit: 'sqft',
      direction: 'West',
      contact: '9801234567',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    },
  ];

  // ✅ Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPropertyIndex((prevIndex) => 
        prevIndex === featuredProperties.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProperties.length]);

  const categories = [
    { icon: '🏠', label: 'Houses', count: '128' },
    { icon: '🏢', label: 'Apartments', count: '94' },
    { icon: '🏡', label: 'Bungalows', count: '42' },
    { icon: '🏘️', label: 'Villas', count: '37' },
    { icon: '🌄', label: 'Land', count: '61' },
    { icon: '🏭', label: 'Commercial', count: '28' },
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
    <div className="bg-[var(--color-primary)]">
      {/* ============================================
      HERO SECTION - WITH MARQUEE HEADLINE
      ============================================ */}
      <section className="relative min-h-[35vh] md:min-h-[40vh] lg:min-h-[45vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col items-center"
          >
            {/* Headline - Marquee Effect */}
            <div className="overflow-hidden w-full">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex whitespace-nowrap"
              >
                <span className="text-xl sm:text-2xl md:text-6xl lg:text-6xl font-bold text-white drop-shadow-lg px-4">
                  <span className="text-[#D4AF37]">घर, जग्गा, अपार्टमेन्ट</span>
                  <span className="text-white"> र व्यावसायिक सम्पत्ति</span>
                  <span className="text-[#D4AF37]"> को लागि</span>
                  <span className="text-white"> भरपर्दो मञ्च</span>
                  <span className="text-[#D4AF37] ml-4">✦</span>
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg px-4">
                  <span className="text-[#D4AF37]">घर, जग्गा, अपार्टमेन्ट</span>
                  <span className="text-white"> र व्यावसायिक सम्पत्ति</span>
                  <span className="text-[#D4AF37]"> को लागि</span>
                  <span className="text-white"> भरपर्दो मञ्च</span>
                  <span className="text-[#D4AF37] ml-4">✦</span>
                </span>
              </motion.div>
            </div>

            {/* Sub-headline */}
            <motion.p
              className="mt-2 text-xs sm:text-sm text-white/80 max-w-2xl mx-auto drop-shadow-md"
              variants={fadeInUp}
            >
              नेपालको अग्रणी सम्पत्ति बजारमा <span className="text-[#D4AF37] font-semibold">५००+</span> विश्वसनीय सूचीहरू
            </motion.p>

            {/* Search Box */}
            <motion.div
              className="mt-3 w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-white/30"
              variants={fadeInUp}
            >
              <div className="flex flex-col md:flex-row gap-1.5">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D5A27] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="स्थान, जस्तै: ललितपुर"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="px-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all min-w-[100px] cursor-pointer"
                >
                  <option value="">सबै प्रकार</option>
                  <option value="house">घर</option>
                  <option value="apartment">अपार्टमेन्ट</option>
                  <option value="villa">भिल्ला</option>
                  <option value="land">जग्गा</option>
                  <option value="commercial">व्यावसायिक</option>
                </select>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D5A27] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="मूल्य दायरा"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-white/80 rounded-lg text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] border border-transparent focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="min-w-[80px] py-1.5 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs"
                  leftIcon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                >
                  खोजी
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] text-white/70"
              variants={fadeInUp}
            >
              <span>५००+ सम्पत्तिहरू</span>
              <span className="w-px h-3 bg-white/30" />
              <span>३५०+ खुसी ग्राहकहरू</span>
              <span className="w-px h-3 bg-white/30" />
              <span>५०+ विज्ञ एजेन्टहरू</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
      FEATURED PROPERTY CAROUSEL - CONTINUOUS SLIDE
      ============================================ */}
      <section className="py-6 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4">

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPropertyIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--color-primary-border)]"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-[55%] lg:w-[58%] h-56 md:h-64 lg:h-72 relative flex-shrink-0">
                    <img
                      src={featuredProperties[currentPropertyIndex].image}
                      alt={featuredProperties[currentPropertyIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#2D5A27] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      ⭐ विशेष
                    </div>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                      {featuredProperties.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPropertyIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentPropertyIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-5 lg:p-6 flex flex-col justify-center">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                      {featuredProperties[currentPropertyIndex].title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                      <span>📍</span> {featuredProperties[currentPropertyIndex].location}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📐 {featuredProperties[currentPropertyIndex].landSize} {featuredProperties[currentPropertyIndex].landSizeUnit}
                      </span>
                      <span className="w-px h-3 bg-gray-300" />
                      <span className="flex items-center gap-1">
                        🧭 {featuredProperties[currentPropertyIndex].direction}
                      </span>
                      <span className="w-px h-3 bg-gray-300" />
                      <span className="flex items-center gap-1">
                        📞 {featuredProperties[currentPropertyIndex].contact}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-[#2D5A27]">
                          {featuredProperties[currentPropertyIndex].price}
                        </span>
                        {featuredProperties[currentPropertyIndex].pricePerUnit && (
                          <span className="text-xs text-gray-400 ml-1">
                            {featuredProperties[currentPropertyIndex].pricePerUnit}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/property/${featuredProperties[currentPropertyIndex].id}`}
                        className="px-4 py-1.5 bg-[#2D5A27] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#23461E] transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
                      >
                        Explore
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentPropertyIndex(
                currentPropertyIndex === 0 ? featuredProperties.length - 1 : currentPropertyIndex - 1
              )}
              className="absolute left-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPropertyIndex(
                currentPropertyIndex === featuredProperties.length - 1 ? 0 : currentPropertyIndex + 1
              )}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>


{/* ============================================
PROPERTY CATEGORIES - SCROLL + DRAG (FIXED)
============================================ */}
<section className="py-4 bg-white border-y border-[#2D5A27]/10 w-full overflow-hidden">
  <div className="relative w-full">
    {/* Scrollable Container */}
    <div className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8">
      {/* Drag Container */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: -800, right: 0 }}
        dragElastic={0.05}
        className="flex items-center gap-3 py-2 cursor-grab active:cursor-grabbing"
        style={{ width: 'max-content' }}
      >
        {[
          { icon: '🏠', label: 'Houses', count: '128' },
          { icon: '🌄', label: 'Residential Land', count: '61' },
          { icon: '🏭', label: 'Commercial Land', count: '28' },
          { icon: '🌾', label: 'Agricultural Land', count: '15' },
          { icon: '⚙️', label: 'Industrial Land', count: '12' },
          { icon: '🛍️', label: 'Shops', count: '45' },
          { icon: '📋', label: 'Offices', count: '33' },
          { icon: '📦', label: 'Warehouses', count: '18' },
          { icon: '🏨', label: 'Hotels', count: '9' },
          { icon: '🍽️', label: 'Restaurants', count: '21' },
        ].map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#F8F6F3] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#2D5A27]/20"
          >
            <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </span>
            <span className="text-xs md:text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-white transition-colors whitespace-nowrap">
              {category.label}
            </span>
            <span className="text-[10px] text-[var(--color-text-tertiary)] group-hover:text-white/70 transition-colors">
              {category.count}
            </span>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Gradient Fade on Edges (Optional) */}
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
  </div>
</section>

      {/* ============================================
      FEATURED EXCLUSIVE PROPERTIES
      ============================================ */}
      <FeaturedPropertiesSection />

      {/* ============================================
      FREE & PREMIUM
      ============================================ */}
      <section className="py-12 bg-[var(--color-primary)] border-t border-[var(--color-primary-border)]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="text-sm font-semibold text-[#2D5A27] uppercase tracking-wider">
              Choose Your Plan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mt-2">
              Free vs <span className="text-[#2D5A27]">Premium</span>
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
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
            >
              <Card
                variant="elevated"
                padding="lg"
                className="border-2 border-[var(--color-primary-border)] text-center h-full"
              >
                <CardContent>
                  <span className="text-4xl mb-3 block">🆓</span>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      Rs 0
                    </span>
                    <span className="text-[var(--color-text-tertiary)]"> / month</span>
                  </div>

                  <ul className="mt-8 space-y-3 text-left">
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">1 Active Property Listing</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Basic Property Details</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Up to 5 Images</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Standard Visibility</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-tertiary)]">
                      <span className="text-[var(--color-text-tertiary)] text-lg">✗</span>
                      <span className="text-sm line-through">Featured Badge</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-tertiary)]">
                      <span className="text-[var(--color-text-tertiary)] text-lg">✗</span>
                      <span className="text-sm line-through">Priority Support</span>
                    </li>
                  </ul>

                  <Link
                    to="/register"
                    className="block w-full mt-8 px-6 py-3 text-center text-[#2D5A27] font-semibold border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                  >
                    Get Started Free
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="border-2 border-[#D4AF37] relative transform scale-105 h-full"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#D4AF37] text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/25">
                    MOST POPULAR
                  </span>
                </div>
                <CardContent className="mt-2">
                  <span className="text-4xl mb-3 block">👑</span>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>For serious sellers & agents</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#2D5A27]">Rs 999</span>
                    <span className="text-[var(--color-text-tertiary)]"> / month</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                    Billed monthly • Cancel anytime
                  </p>

                  <ul className="mt-8 space-y-3 text-left">
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">
                        Unlimited Property Listings
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">Premium Property Details</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">
                        Up to 20 Images + Virtual Tour
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">Premium Visibility & Boost</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">⭐ Featured Badge</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">24/7 Priority Support</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">
                        AI-Powered Recommendations
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#D4AF37] text-lg">✓</span>
                      <span className="text-sm font-medium">
                        Advanced Analytics Dashboard
                      </span>
                    </li>
                  </ul>

                  <Link
                    to="/premium"
                    className="block w-full mt-8 px-6 py-3 text-center text-white font-semibold bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Upgrade to Premium
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="border-2 border-[var(--color-primary-border)] text-center h-full"
              >
                <CardContent>
                  <span className="text-4xl mb-3 block">🏢</span>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For agencies & developers</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                      Custom
                    </span>
                    <span className="text-[var(--color-text-tertiary)]"> / month</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                    Contact us for pricing
                  </p>

                  <ul className="mt-8 space-y-3 text-left">
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Everything in Premium</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Unlimited Properties & Agents</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Dedicated Account Manager</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">Custom Integrations</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">White-label Options</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="text-[#2D5A27] text-lg">✓</span>
                      <span className="text-sm">API Access</span>
                    </li>
                    <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
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
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-[var(--color-text-tertiary)] text-sm mt-8"
          >
            * All prices are in Nepali Rupees (NPR). Cancel anytime. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* ============================================
      CTA SECTION
      ============================================ */}
      <section className="py-6 md:py-8 bg-[#2D5A27] relative overflow-hidden rounded-2xl md:rounded-3xl mx-8">
        <div className="max-w-5xl mx-auto px-8">
          <div className="relative z-10 max-w-4xl mx-auto text-center py-4 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="text-3xl md:text-4xl mb-2 block"
              >
                🏡
              </motion.div>

              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">
                Ready to find your dream home?
              </h2>

              <p className="text-white/80 max-w-2xl mx-auto mb-4 text-sm leading-relaxed">
                Start exploring hand-picked homes, or talk with an expert agent — either
                way, we're here to help.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/properties">
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-5 py-2 text-sm bg-white text-[#2D5A27] hover:bg-gray-100"
                    >
                      Explore Properties
                    </Button>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-5 py-2 text-sm border-white/50 text-white hover:bg-white hover:text-[#2D5A27]"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;