// src/pages/Home/components/PricingSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '../common/Card/Card';

const PricingSection: React.FC = () => {
  return (
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
            <Card variant="elevated" padding="lg" className="border-2 border-[var(--color-primary-border)] text-center h-full">
              <CardContent>
                <span className="text-4xl mb-3 block">🆓</span>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">Rs 0</span>
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
                    <span className="text-sm font-medium">Unlimited Property Listings</span>
                  </li>
                  <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                    <span className="text-[#D4AF37] text-lg">✓</span>
                    <span className="text-sm font-medium">Premium Property Details</span>
                  </li>
                  <li className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                    <span className="text-[#D4AF37] text-lg">✓</span>
                    <span className="text-sm font-medium">Up to 20 Images + Virtual Tour</span>
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
            <Card variant="elevated" padding="lg" className="border-2 border-[var(--color-primary-border)] text-center h-full">
              <CardContent>
                <span className="text-4xl mb-3 block">🏢</span>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For agencies & developers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">Custom</span>
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
  );
};

export default PricingSection;