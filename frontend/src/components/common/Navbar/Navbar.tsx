// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import MobileMenu from './MobileMenu';
import DropdownMenu from './DropdownMenu';

import type { DropdownItem } from './DropdownMenu';

// ============================================
// PROPERTY TYPES
// ============================================
const PROPERTY_TYPES = [
  { label: 'Houses', value: 'HOUSE' },
  { label: 'Apartments', value: 'APARTMENT' },
  { label: 'Bungalows', value: 'BUNGALOW' },
  { label: 'Villas', value: 'VILLA' },
  { label: 'Residential Land', value: 'RESIDENTIAL_LAND' },
  { label: 'Commercial Land', value: 'COMMERCIAL_LAND' },
  { label: 'Agricultural Land', value: 'AGRICULTURAL_LAND' },
  { label: 'Industrial Land', value: 'INDUSTRIAL_LAND' },
  { label: 'Shops', value: 'SHOP' },
  { label: 'Offices', value: 'OFFICE' },
  { label: 'Warehouses', value: 'WAREHOUSE' },
  { label: 'Hotels', value: 'HOTEL' },
  { label: 'Restaurants', value: 'RESTAURANT' },
];

// ============================================
// DROPDOWN DATA
// ============================================
const discoverItems: DropdownItem[] = [
  { label: 'AI Recommendations', path: '/discover/ai-recommendations' },
  { label: 'Trending Properties', path: '/discover/trending' },
  { label: 'New Listings', path: '/discover/new' },
  { label: 'Price Drops', path: '/discover/price-drops' },
  { label: 'Open Houses', path: '/discover/open-houses' },
];

const sellItems: DropdownItem[] = [
  { label: 'Quick List', path: '/sell/quick-list' },
  { label: 'Agent Match', path: '/sell/agent-match' },
  { label: 'Free Valuation', path: '/sell/valuation' },
  { label: 'Market Insights', path: '/sell/insights' },
  { divider: true },
  { label: 'Sell with AI', path: '/sell/ai-assist' },
];

const projectsItems: DropdownItem[] = [
  { label: 'Featured Projects', path: '/projects/featured' },
  { label: 'Upcoming Projects', path: '/projects/upcoming' },
  { label: 'New Launch', path: '/projects/new-launch' },
  { label: 'Completed Projects', path: '/projects/completed' },
];

const insightsItems: DropdownItem[] = [
  { label: 'Market Trends', path: '/insights/market-trends' },
  { label: 'Blog', path: '/insights/blog' },
  { label: 'Guides & Tips', path: '/insights/guides' },
  { label: 'Real Estate News', path: '/insights/news' },
  { label: 'Investor Corner', path: '/insights/investor' },
];

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('');

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
  // BUY DROPDOWN
  // ============================================
  const buyDropdownItems: DropdownItem[] = [
    { label: 'All Properties', path: '/properties' },
    { divider: true },
    ...PROPERTY_TYPES.map((type) => ({
      label: type.label,
      path: `/properties?type=${type.value}`,
    })),
    { divider: true },
    { label: 'Luxury Properties', path: '/properties/luxury' },
    { label: 'Budget Properties', path: '/properties/budget' },
  ];

  // ============================================
  // USER DROPDOWN
  // ============================================
  const userDropdownItems: DropdownItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Properties', path: '/my-properties' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Messages', path: '/messages' },
    { divider: true },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
    ...(user?.role === 'ADMIN' 
      ? [{ divider: true }, { label: 'Admin Panel', path: '/admin' }] 
      : []),
  ];

  // ============================================
  // NAV ITEMS
  // ============================================
  const navItems = [
    { id: 'home', label: 'Home', path: '/', isLink: true },
    { id: 'discover', label: 'Discover', items: discoverItems, isDropdown: true },
    { id: 'buy', label: 'Buy', items: buyDropdownItems, isDropdown: true },
    { id: 'sell', label: 'Sell', items: sellItems, isDropdown: true },
    { id: 'projects', label: 'Projects', items: projectsItems, isDropdown: true },
    { id: 'insights', label: 'Insights', items: insightsItems, isDropdown: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50' 
            : 'bg-white/90 backdrop-blur-sm shadow-sm'
        }`}
      >
        {/* NO PADDING - FULL WIDTH EDGE TO EDGE */}
        <div className="w-full">
          <div className="flex items-center justify-between h-16 md:h-20 px-0">
            {/* ============================================
            LOGO
            ============================================ */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0 ml-4 sm:ml-6 lg:ml-8 xl:ml-12 2xl:ml-16">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25"
              >
                <span className="text-xl">🏠</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Smart</span>
                  <span className="text-gray-800">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                  Real Estate
                </p>
              </div>
            </Link>

            {/* ============================================
            MAIN MENU
            ============================================ */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.isLink ? (
                    <Link
                      to={item.path || '/'}
                      className="px-4 xl:px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-200 relative group"
                      onMouseEnter={() => setActiveItem(item.id)}
                      onMouseLeave={() => setActiveItem('')}
                    >
                      {item.label}
                      <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                    </Link>
                  ) : (
                    <DropdownMenu
                      trigger={
                        <span 
                          className="px-4 xl:px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 relative group"
                          onMouseEnter={() => setActiveItem(item.id)}
                          onMouseLeave={() => setActiveItem('')}
                        >
                          {item.label}
                          <svg 
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              activeItem === item.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                        </span>
                      }
                      items={item.items || []}
                      align="left"
                      triggerMode="hover"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ============================================
            RIGHT ACTIONS
            ============================================ */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 mr-4 sm:mr-6 lg:mr-8 xl:mr-12 2xl:mr-16">
              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="relative p-2.5 text-sm font-medium text-gray-600 hover:text-primary rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-lg">{language === 'en' ? '🇳🇵' : '🇬🇧'}</span>
                  <span className="hidden xl:inline text-xs font-medium uppercase">
                    {language === 'en' ? 'EN' : 'नेपाली'}
                  </span>
                </span>
              </motion.button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              {/* Post Property CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/add-property"
                  className="hidden md:flex items-center gap-2 px-5 xl:px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden xl:inline">List Property</span>
                  <span className="xl:hidden">List</span>
                </Link>
              </motion.div>

              {/* User */}
              <div className="flex items-center gap-1">
                {isAuthenticated && user ? (
                  <DropdownMenu
                    trigger={
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 px-2 xl:px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary/20">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="hidden xl:block text-left">
                          <p className="text-sm font-medium text-gray-800 leading-tight">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-400 leading-tight">
                            {user.role?.toLowerCase() || 'member'}
                          </p>
                        </div>
                        <svg 
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 group-hover:rotate-180`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    }
                    items={userDropdownItems}
                    align="right"
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="px-5 xl:px-6 py-2.5 text-sm font-medium text-primary border-2 border-primary/20 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 group-hover:bg-primary ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`} />
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 group-hover:bg-primary ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`} />
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 group-hover:bg-primary ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;