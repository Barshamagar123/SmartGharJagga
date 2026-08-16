// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Avatar } from '../Avatar/Avatar';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface NavLink {
  label: string;
  path: string;
  locked: boolean;
  badge?: string;
  requiresAuth?: boolean;
}

// ✅ Fallback translations
const FALLBACK_TRANSLATIONS: Record<string, string> = {
  'nav.home': 'Home',
  'nav.properties': 'Properties',
  'nav.list_property': 'List Property',
  'nav.dashboard': 'Dashboard',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.logout': 'Logout',
  'nav.profile': 'Profile',
  'nav.find_match': 'Find My Match',
  'nav.ai_match': 'AI Match',
  'nav.map_search': 'Map Search',
  'nav.admin_panel': 'Admin Panel',
  'nav.my_properties': 'My Properties',
  'nav.favorites': 'Favorites',
  'nav.analytics': 'Analytics',
  'nav.messages': 'Messages',
  'nav.profile_settings': 'Profile Settings',
  'nav.refer_earn': 'Refer & Earn',
  'nav.upgrade_premium': 'Upgrade to Premium',
  'nav.premium': 'Premium',
  'nav.premium_member': 'Premium Member',
  'nav.admin': 'Admin',
  'nav.seller': 'Seller',
  'nav.buyer': 'Buyer',
  'nav.real_estate_platform': 'Real Estate Platform',
  'nav.menu': 'Menu',
  'nav.language': 'Language',
  'nav.login_required': 'Login Required',
  'nav.login_to_access': 'Sign in to unlock this feature',
  'nav.why_signin': 'Why sign in?',
  'nav.why_signin_desc': 'Save favorites, get AI matches, and more!',
  'nav.sign_in_now': 'Sign In Now',
  'nav.or': 'or',
  'nav.create_account': 'Create New Account',
  'nav.maybe_later': 'Maybe later',
  'nav.premium_feature': 'Premium Feature',
  'nav.upgrade_to_access': 'Upgrade to access',
  'nav.premium_plan': 'Premium Plan',
  'nav.all_features_unlocked': 'All features unlocked',
  'nav.per_month': '/ month',
  'nav.upgrade_now': 'Upgrade Now',
  'nav.upgrade': 'Upgrade',
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();
  const { t, currentLang } = useLanguage();
  const isPremium = false;

  // ✅ Safe translation with fallback
  const safeT = (key: string): string => {
    const translated = t(key);
    if (translated === key) {
      return FALLBACK_TRANSLATIONS[key] || key;
    }
    return translated;
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role?.toUpperCase() || '';
  const isAdmin = userRole === 'ADMIN';
  const isSeller = userRole === 'SELLER';
  const isBuyer = userRole === 'BUYER';

  const isFeatureLocked = (feature: string) => {
    if (feature === 'AI Match' || feature === 'Map Search') return true;
    return false;
  };

  const handleFeatureClick = (feature: string, path: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !isAuthenticated) {
      setSelectedFeature(feature);
      setShowLoginPopup(true);
      return;
    }

    if (feature === 'List Property' || feature === 'Favorites' || feature === 'My Properties') {
      if (!isAuthenticated) {
        setSelectedFeature(feature);
        setShowLoginPopup(true);
        return;
      }
      navigate(path);
      return;
    }

    if (isFeatureLocked(feature)) {
      if (!isAuthenticated) {
        setSelectedFeature(feature);
        setShowLoginPopup(true);
        return;
      }
      if (isAuthenticated && !isPremium) {
        setSelectedFeature(feature);
        setShowUpgradePopup(true);
        return;
      }
    }

    navigate(path);
  };

  const getNavLinks = (): NavLink[] => {
    const commonLinks: NavLink[] = [
      { label: safeT('nav.home'), path: '/', locked: false },
      { label: safeT('nav.properties'), path: '/properties', locked: false },
    ];

    if (!isAuthenticated) {
      return [
        ...commonLinks,
        { label: safeT('nav.list_property'), path: '/list-property', locked: false, badge: '✨ Free', requiresAuth: true },
        { label: safeT('nav.ai_match'), path: '/ai-matching', locked: true, badge: '🔒 Premium', requiresAuth: true },
        { label: safeT('nav.map_search'), path: '/map-search', locked: true, badge: '🔒 Premium', requiresAuth: true },
      ];
    }

    if (isAdmin) {
      return [
        ...commonLinks,
        { label: safeT('nav.admin_panel'), path: '/admin', locked: false },
      ];
    }

    if (isSeller) {
      return [
        ...commonLinks,
        { label: safeT('nav.list_property'), path: '/list-property', locked: false, badge: '✨ Free' },
        { label: safeT('nav.my_properties'), path: '/my-properties', locked: false },
      ];
    }

    if (isBuyer) {
      return [
        ...commonLinks,
        { label: safeT('nav.favorites'), path: '/favorites', locked: false },
        { label: safeT('nav.ai_match'), path: '/ai-matching', locked: true, badge: '🔒 Premium' },
        { label: safeT('nav.map_search'), path: '/map-search', locked: true, badge: '🔒 Premium' },
      ];
    }

    return commonLinks;
  };

  const finalNavLinks = getNavLinks();

  const showPremiumBadge = isAuthenticated && isPremium;
  const showUpgradeButton = isAuthenticated && !isPremium && !isAdmin;

  const getRoleDisplay = () => {
    if (!isAuthenticated) return null;
    if (isAdmin) {
      return (
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
          🛡️ {safeT('nav.admin')}
        </span>
      );
    }
    if (isSeller) {
      return (
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
          📈 {safeT('nav.seller')}
        </span>
      );
    }
    if (isBuyer) {
      return (
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          🏠 {safeT('nav.buyer')}
        </span>
      );
    }
    return null;
  };

  // ✅ Login Popup - Modern Design
  const LoginPopup = () => (
    <AnimatePresence>
      {showLoginPopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowLoginPopup(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100/20">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-[#2D5A27] via-[#1a3d14] to-[#0f2a0c] px-6 py-8 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/10">
                    🔐
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-4 font-serif">
                    {safeT('nav.login_required')}
                  </h3>
                  <p className="text-white/80 text-sm mt-1 max-w-xs mx-auto">
                    {safeT('nav.login_to_access')}{' '}
                    <span className="font-semibold text-white bg-white/10 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                      ✨ {selectedFeature}
                    </span>
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl p-4 mb-6 border border-emerald-100/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{safeT('nav.why_signin')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{safeT('nav.why_signin_desc')}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-green-500">✓</span> Save properties to favorites
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-green-500">✓</span> Get AI-powered property matches
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-green-500">✓</span> Track your property inquiries
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowLoginPopup(false);
                      navigate('/login');
                    }}
                    className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-all duration-200 font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-[#2D5A27]/20"
                  >
                    <span className="text-lg">🔑</span>
                    {safeT('nav.sign_in_now')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <span className="relative px-4 text-xs text-gray-400 bg-white">{safeT('nav.or')}</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowLoginPopup(false);
                      navigate('/register');
                    }}
                    className="w-full py-3 border-2 border-[#2D5A27] text-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">📝</span>
                    {safeT('nav.create_account')}
                  </button>

                  <button
                    onClick={() => setShowLoginPopup(false)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-2 hover:bg-gray-50 rounded-lg"
                  >
                    {safeT('nav.maybe_later')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ✅ Upgrade Popup - Premium Design
  const UpgradePopup = () => (
    <AnimatePresence>
      {showUpgradePopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowUpgradePopup(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
              {/* Header with gold gradient */}
              <div className="relative bg-gradient-to-br from-[#2D5A27] via-[#1a3d14] to-[#0f2a0c] px-6 py-8 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full -ml-20 -mb-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/20">
                    👑
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-4 font-serif flex items-center justify-center gap-2">
                    <span className="text-yellow-400">👑</span>
                    {safeT('nav.premium_feature')}
                  </h3>
                  <p className="text-white/80 text-sm mt-1 max-w-xs mx-auto">
                    {safeT('nav.upgrade_to_access')}{' '}
                    <span className="font-semibold text-yellow-300 bg-white/10 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                      ✨ {selectedFeature}
                    </span>
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 rounded-xl p-4 mb-6 border border-yellow-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-yellow-500">👑</span>
                        {safeT('nav.premium_plan')}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{safeT('nav.all_features_unlocked')}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✅ AI Match</span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✅ Map Search</span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✅ Priority Support</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#2D5A27]">₹999</p>
                      <p className="text-xs text-gray-400">{safeT('nav.per_month')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowUpgradePopup(false);
                      navigate('/subscription');
                    }}
                    className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-all duration-200 font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-[#2D5A27]/20"
                  >
                    <span className="text-lg">👑</span>
                    {safeT('nav.upgrade_now')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => setShowUpgradePopup(false)}
                    className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    {safeT('nav.maybe_later')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100/50'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2D5A27] text-white shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-xl">🏠</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#2D5A27]">Smart</span>
                  <span className="text-gray-800">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                  {safeT('nav.real_estate_platform')}
                </p>
              </div>
            </Link>

            {/* NAV LINKS - Desktop */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {finalNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleFeatureClick(link.label, link.path, link.requiresAuth || false)}
                  className={`px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-[#2D5A27] bg-[#2D5A27]/10'
                      : 'text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5'
                  }`}
                >
                  {link.label}
                  {link.locked && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                      Premium
                    </span>
                  )}
                  {!link.locked && link.badge === '✨ Free' && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-semibold uppercase rounded-full bg-green-100 text-green-700 border border-green-200">
                      Free
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* ✅ Language Switcher - Now Working */}
              <LanguageSwitcher />

              {getRoleDisplay()}

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                  >
                    {safeT('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:flex px-4 py-2 text-sm font-medium text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                  >
                    {safeT('nav.register')}
                  </Link>
                </div>
              ) : (
                <>
                  {showUpgradeButton && (
                    <Link
                      to="/subscription"
                      className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span>👑</span>
                      <span>{safeT('nav.upgrade')}</span>
                    </Link>
                  )}

                  {showPremiumBadge && (
                    <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-sm">
                      <span>👑</span>
                      {safeT('nav.premium')}
                    </span>
                  )}

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200 cursor-pointer">
                      <Avatar
                        name={user?.name || 'User'}
                        size="sm"
                        variant="primary"
                        src={user?.avatarUrl || undefined}
                      />
                      <svg className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {isAdmin && (
                            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              🛡️ {safeT('nav.admin')}
                            </span>
                          )}
                          {isSeller && (
                            <span className="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              📈 {safeT('nav.seller')}
                            </span>
                          )}
                          {isBuyer && (
                            <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              🏠 {safeT('nav.buyer')}
                            </span>
                          )}
                          {showPremiumBadge && (
                            <Badge variant="gold" size="sm">👑 {safeT('nav.premium')}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                        >
                          <span className="text-lg">📊</span>
                          {safeT('nav.dashboard')}
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors font-medium"
                          >
                            <span className="text-lg">⚙️</span>
                            {safeT('nav.admin_panel')}
                          </Link>
                        )}

                        {isSeller && (
                          <>
                            <Link
                              to="/list-property"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">➕</span>
                              {safeT('nav.list_property')}
                            </Link>
                            <Link
                              to="/my-properties"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">📋</span>
                              {safeT('nav.my_properties')}
                            </Link>
                            <Link
                              to="/analytics"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">📊</span>
                              {safeT('nav.analytics')}
                            </Link>
                          </>
                        )}

                        {isBuyer && (
                          <>
                            <Link
                              to="/favorites"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">❤️</span>
                              {safeT('nav.favorites')}
                            </Link>
                            <Link
                              to="/ai-matching"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">🤖</span>
                              {safeT('nav.ai_match')}
                              {!isPremium && <span className="ml-auto text-[10px] text-yellow-600">🔒</span>}
                            </Link>
                            <Link
                              to="/map-search"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                            >
                              <span className="text-lg">🗺️</span>
                              {safeT('nav.map_search')}
                              {!isPremium && <span className="ml-auto text-[10px] text-yellow-600">🔒</span>}
                            </Link>
                          </>
                        )}

                        <Link
                          to="/messages"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                        >
                          <span className="text-lg">💬</span>
                          {safeT('nav.messages')}
                        </Link>

                        <div className="h-px bg-gray-100 my-1" />

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                        >
                          <span className="text-lg">👤</span>
                          {safeT('nav.profile_settings')}
                        </Link>

                        <Link
                          to="/refer"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                        >
                          <span className="text-lg">🔗</span>
                          {safeT('nav.refer_earn')}
                        </Link>

                        {!isPremium && isAuthenticated && !isAdmin && (
                          <>
                            <div className="h-px bg-gray-100 my-1" />
                            <Link
                              to="/subscription"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2D5A27] font-semibold hover:bg-[#2D5A27]/10 transition-colors"
                            >
                              <span className="text-lg">🚀</span>
                              {safeT('nav.upgrade_premium')}
                            </Link>
                          </>
                        )}

                        <div className="h-px bg-gray-100 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span className="text-lg">🚪</span>
                          {safeT('nav.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200 cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-[#2D5A27]">{safeT('nav.menu')}</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-[#2D5A27]/5 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{safeT('nav.language')}</span>
                    <LanguageSwitcher />
                  </div>
                </div>

                <div className="space-y-1">
                  {finalNavLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => {
                        if (link.requiresAuth && !isAuthenticated) {
                          setSelectedFeature(link.label);
                          setShowLoginPopup(true);
                          setIsMobileMenuOpen(false);
                          return;
                        }

                        if (link.label === safeT('nav.list_property') || 
                            link.label === safeT('nav.favorites') || 
                            link.label === safeT('nav.my_properties')) {
                          if (!isAuthenticated) {
                            setSelectedFeature(link.label);
                            setShowLoginPopup(true);
                            setIsMobileMenuOpen(false);
                            return;
                          }
                          navigate(link.path);
                          setIsMobileMenuOpen(false);
                          return;
                        }

                        if (isFeatureLocked(link.label)) {
                          if (!isAuthenticated) {
                            setSelectedFeature(link.label);
                            setShowLoginPopup(true);
                            setIsMobileMenuOpen(false);
                            return;
                          }
                          if (isAuthenticated && !isPremium) {
                            setSelectedFeature(link.label);
                            setShowUpgradePopup(true);
                            setIsMobileMenuOpen(false);
                            return;
                          }
                        }
                        navigate(link.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                    >
                      <span>{link.label}</span>
                      {link.locked && (
                        <Badge variant="gold" size="sm">🔒</Badge>
                      )}
                      {!link.locked && link.badge === '✨ Free' && (
                        <Badge variant="success" size="sm">✅ Free</Badge>
                      )}
                    </button>
                  ))}

                  {!isAuthenticated ? (
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                      >
                        <span className="text-lg mr-2">🔑</span>
                        {safeT('nav.login')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                      >
                        <span className="text-lg mr-2">📝</span>
                        {safeT('nav.register')}
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="h-px bg-gray-100 my-2" />
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        <span className="text-lg">📊</span>
                        {safeT('nav.dashboard')}
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                        >
                          <span className="text-lg">⚙️</span>
                          {safeT('nav.admin_panel')}
                        </Link>
                      )}

                      {isSeller && (
                        <>
                          <Link
                            to="/list-property"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg">➕</span>
                            {safeT('nav.list_property')}
                          </Link>
                          <Link
                            to="/my-properties"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg">📋</span>
                            {safeT('nav.my_properties')}
                          </Link>
                        </>
                      )}

                      {isBuyer && (
                        <>
                          <Link
                            to="/favorites"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg">❤️</span>
                            {safeT('nav.favorites')}
                          </Link>
                          <Link
                            to="/ai-matching"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg">🤖</span>
                            {safeT('nav.ai_match')}
                            {!isPremium && <span className="ml-auto text-[10px] text-yellow-600">🔒</span>}
                          </Link>
                          <Link
                            to="/map-search"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg">🗺️</span>
                            {safeT('nav.map_search')}
                            {!isPremium && <span className="ml-auto text-[10px] text-yellow-600">🔒</span>}
                          </Link>
                        </>
                      )}

                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        {!isPremium && !isAdmin && (
                          <Link
                            to="/subscription"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                          >
                            <span className="text-lg mr-2">👑</span>
                            {safeT('nav.upgrade_premium')}
                          </Link>
                        )}
                        {isPremium && (
                          <div className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                            <span className="text-lg mr-2">👑</span>
                            {safeT('nav.premium_member')}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full px-4 py-3 text-center text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
                        >
                          <span className="text-lg mr-2">🚪</span>
                          {safeT('nav.logout')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Popups */}
      <LoginPopup />
      <UpgradePopup />
    </>
  );
};

export default Navbar;