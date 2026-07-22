// src/components/layout/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'NE' : 'EN');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Discover', path: '/discover' },
    { label: 'Buy', path: '/properties' },
    { label: 'Sell', path: '/sell' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--color-primary)]/95 backdrop-blur-xl shadow-md'
            : 'bg-[var(--color-primary)]/90 backdrop-blur-sm'
        }`}
      >
        {/* 32px Padding (px-8) */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#2D5A27]">Smart</span>
                  <span className="text-[var(--color-text-primary)]">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] tracking-wider uppercase">
                  Real Estate Platform
                </p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[#2D5A27] rounded-lg hover:bg-[var(--color-secondary-surface)] transition-all duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2D5A27] rounded-full transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[#2D5A27] rounded-lg hover:bg-[var(--color-secondary-surface)] transition-all duration-200"
              >
                {language}
              </button>

              {/* List Property */}
              <Link
                to="/add-property"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>+</span>
                <span>List Property</span>
              </Link>

              {/* Sign In */}
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-secondary-surface)] transition-all duration-200"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block w-full h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-full h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-[var(--color-primary)] shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-[#2D5A27]">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[var(--color-secondary-surface)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[var(--color-text-secondary)] hover:text-[#2D5A27] hover:bg-[var(--color-secondary-surface)] rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--color-primary-border)]">
                <Link
                  to="/add-property"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                >
                  + List Property
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 mt-2 text-center text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;