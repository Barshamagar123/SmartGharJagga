// src/pages/Home/HomePage.tsx

import React from 'react';

import FeaturedPropertiesSection from '../../components/Home/FeaturedPropertiesSection';
import HeroSection from '../../components/Home/HeroSection';
import FeaturedCarousel from '../../components/Home/FeaturedCarousel';
import PropertyCategories from '../../components/Home/ProperetyCategories';
import PricingSection from '../../components/Home/PricingSection';
import CTASection from '../../components/Home/CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-[var(--color-primary)]">
      <HeroSection />
      <FeaturedCarousel />
      <PropertyCategories />
      <FeaturedPropertiesSection />
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default HomePage;