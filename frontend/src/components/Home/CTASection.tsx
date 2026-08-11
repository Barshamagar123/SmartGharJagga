// src/pages/Home/components/CTASection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../common/Button/Button';

const CTASection: React.FC = () => {
  return (
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
  );
};

export default CTASection;