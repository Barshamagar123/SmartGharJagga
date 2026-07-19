// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate }  from 'react-router-dom';
import { useAuth, getRoleDisplay } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import MobileMenu from './MobileMenu';
import DropdownMenu from './DropdownMenu';
import type { DropdownItem } from './DropdownMenu';

// ============================================
// PROPERTY TYPES DATA
// ============================================
const PROPERTY_TYPES = [
  { label: 'House', value: 'HOUSE', icon: '🏠' },
  { label: 'Apartment', value: 'APARTMENT', icon: '🏢' },
  { label: 'Bungalow', value: 'BUNGALOW', icon: '🏡' },
  { label: 'Villa', value: 'VILLA', icon: '🏘️' },
  { label: 'Residential Land', value: 'RESIDENTIAL_LAND', icon: '🌄' },
  { label: 'Commercial Land', value: 'COMMERCIAL_LAND', icon: '🏗️' },
  { label: 'Agricultural Land', value: 'AGRICULTURAL_LAND', icon: '🌾' },
  { label: 'Industrial Land', value: 'INDUSTRIAL_LAND', icon: '🏭' },
  { label: 'Shop', value: 'SHOP', icon: '🛍️' },
  { label: 'Office', value: 'OFFICE', icon: '💼' },
  { label: 'Warehouse', value: 'WAREHOUSE', icon: '📦' },
  { label: 'Hotel', value: 'HOTEL', icon: '🏨' },
  { label: 'Restaurant', value: 'RESTAURANT', icon: '🍽️' },
];

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  // ============================================
  // ✅ BUY DROPDOWN ITEMS (On Hover)
  // ============================================
  const buyDropdownItems: DropdownItem[] = [
    { label: 'All Properties', path: '/properties', icon: '🔍' },
    { divider: true },
    ...PROPERTY_TYPES.map((type) => ({
      label: type.label,
      path: `/properties?type=${type.value}`,
      icon: type.icon,
    })),
  ];

  // ============================================
  // ✅ USER DROPDOWN ITEMS
  // ============================================
  const buyerDropdownItems: DropdownItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'AI Matching', path: '/matching', icon: '🤖' },
    { label: 'Favorites', path: '/favorites', icon: '❤️' },
    { label: 'My Messages', path: '/messages', icon: '💬' },
    { label: 'Subscription', path: '/subscription', icon: '💎' },
    { divider: true },
    { label: 'My Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const sellerDropdownItems: DropdownItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'My Properties', path: '/my-properties', icon: '🏠' },
    { label: 'Add Property', path: '/add-property', icon: '➕' },
    { label: 'Inquiries', path: '/inquiries', icon: '📩' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { divider: true },
    { label: 'Subscription', path: '/subscription', icon: '💎' },
    { label: 'My Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const adminDropdownItems: DropdownItem[] = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'User Management', path: '/admin/users', icon: '👥' },
    { label: 'Property Management', path: '/admin/properties', icon: '🏠' },
    { label: 'Subscription Management', path: '/admin/subscriptions', icon: '💎' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { divider: true },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const getUserDropdownItems = (): DropdownItem[] => {
    if (!user) return [];
    switch (user.role) {
      case 'BUYER': return buyerDropdownItems;
      case 'SELLER': return sellerDropdownItems;
      case 'ADMIN': return adminDropdownItems;
      default: return [];
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'BUYER': return 'Buyer';
      case 'SELLER': return 'Seller';
      case 'ADMIN': return 'Admin';
      default: return '';
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm shadow-sm'
      } border-b border-gray-100/50`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-primary tracking-tight">
                  Smart<span className="text-text-primary">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-text-secondary tracking-wider uppercase -mt-0.5">
                  AI Powered
                </p>
              </div>
            </Link>

            {/* ✅ Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-lg hover:bg-primary-light/50 transition-all duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
              </Link>

              {/* ✅ BUY DROPDOWN - HOVER ONLY */}
              <DropdownMenu
                trigger={
                  <span className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-lg hover:bg-primary-light/50 transition-all duration-200 cursor-pointer flex items-center gap-1">
                    Buy
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                }
                items={buyDropdownItems}
                align="left"
                triggerMode="hover"
              />

              {/* ✅ LIST PROPERTY BUTTON (Replaces Sell) */}
              <Link
                to="/add-property"
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-secondary to-green-600 hover:from-green-600 hover:to-secondary rounded-lg shadow-md shadow-secondary/25 hover:shadow-lg hover:shadow-secondary/35 transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-lg">📋</span>
                List Property
              </Link>

              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-lg hover:bg-primary-light/50 transition-all duration-200 relative group"
              >
                About
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-lg hover:bg-primary-light/50 transition-all duration-200 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-text-secondary hover:text-primary rounded-xl border border-gray-200/60 hover:border-primary/30 hover:bg-primary-light/30 transition-all duration-200"
              >
                {language === 'en' ? (
                  <>
                    <span className="text-base">🇳🇵</span>
                    <span className="hidden sm:inline">नेपाली</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🇬🇧</span>
                    <span className="hidden sm:inline">English</span>
                  </>
                )}
              </button>

              {/* ✅ Desktop Auth */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenu
                      trigger={
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-primary-light/30 transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-primary/20">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {user.isVerified && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center text-[8px]">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-text-primary leading-tight">
                              {user.name.split(' ')[0]}
                            </p>
                            <p className="text-[10px] font-medium text-text-secondary">
                              {getRoleDisplayName(user.role)}
                            </p>
                          </div>
                          <svg className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      }
                      items={getUserDropdownItems()}
                      align="right"
                    />
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-danger hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary-light/50 rounded-xl transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-primary-light/30 transition-all duration-200 group"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-full h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-full h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;