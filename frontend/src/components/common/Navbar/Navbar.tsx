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

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();
  const { t, currentLang, switchLanguage } = useLanguage();
  const isPremium = false;

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

  // ✅ ROLE CHECK
  const userRole = user?.role?.toUpperCase() || '';
  const isAdmin = userRole === 'ADMIN';
  const isSeller = userRole === 'SELLER';
  const isBuyer = userRole === 'BUYER';

  console.log('🔍 Current User Role:', userRole);
  console.log('🔍 Is Admin:', isAdmin);
  console.log('🔍 Is Seller:', isSeller);
  console.log('🔍 Is Buyer:', isBuyer);

  const isFeatureLocked = (feature: string) => {
    if (feature === 'AI Match') return true;
    if (feature === 'Map Search') return true;
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

  // ✅ NAV LINKS WITH TRANSLATIONS
  const getNavLinks = (): NavLink[] => {
    const commonLinks: NavLink[] = [
      { label: t('nav.home'), path: '/', locked: false },
      { label: t('nav.properties'), path: '/properties', locked: false },
    ];

    if (!isAuthenticated) {
      return [
        ...commonLinks,
        { label: t('nav.list_property'), path: '/list-property', locked: false, badge: '✨ Free', requiresAuth: true },
        { label: t('nav.ai_match'), path: '/ai-matching', locked: true, badge: '🔒 Premium', requiresAuth: true },
        { label: t('nav.map_search'), path: '/map-search', locked: true, badge: '🔒 Premium', requiresAuth: true },
      ];
    }

    if (isAdmin) {
      return [
        ...commonLinks,
        { label: t('nav.admin_panel'), path: '/admin', locked: false },
      ];
    }

    if (isSeller) {
      return [
        ...commonLinks,
        { label: t('nav.list_property'), path: '/list-property', locked: false, badge: '✨ Free' },
        { label: t('nav.my_properties'), path: '/my-properties', locked: false },
      ];
    }

    if (isBuyer) {
      return [
        ...commonLinks,
        { label: t('nav.favorites'), path: '/favorites', locked: false },
        { label: t('nav.ai_match'), path: '/ai-matching', locked: true, badge: '🔒 Premium' },
        { label: t('nav.map_search'), path: '/map-search', locked: true, badge: '🔒 Premium' },
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
          🛡️ {t('nav.admin')}
        </span>
      );
    }
    if (isSeller) {
      return (
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
          📈 {t('nav.seller')}
        </span>
      );
    }
    if (isBuyer) {
      return (
        <span className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          🏠 {t('nav.buyer')}
        </span>
      );
    }
    return null;
  };

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
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2D5A27] text-white shadow-sm">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#2D5A27]">Smart</span>
                  <span className="text-gray-800">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                  {t('nav.real_estate_platform')}
                </p>
              </div>
            </Link>

            {/* ✅ NAV LINKS */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {finalNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleFeatureClick(link.label, link.path, link.requiresAuth || false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#2D5A27] rounded-xl hover:bg-[#2D5A27]/5 transition-all duration-200 relative group cursor-pointer"
                >
                  {link.label}

                  {link.locked && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                      Premium
                    </span>
                  )}

                  {!link.locked && link.badge && link.badge === '✨ Free' && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-full bg-green-100 text-green-700">
                      Free
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* ✅ Language Switcher - Integrated */}
              <LanguageSwitcher />

              {getRoleDisplay()}

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                >
                  {t('nav.login')}
                </Link>
              ) : (
                <>
                  {showUpgradeButton && (
                    <Link
                      to="/subscription"
                      className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span>{t('nav.upgrade')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}

                  {showPremiumBadge && (
                    <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#D4AF37] rounded-full shadow-sm">
                      <span>👑</span>
                      {t('nav.premium')}
                    </span>
                  )}

                  <div className="relative group">
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200 cursor-pointer">
                      <Avatar
                        name={user?.name || 'User'}
                        size="sm"
                        variant="primary"
                        src={user?.avatarUrl || undefined}
                      />
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {isAdmin ? (
                            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              🛡️ {t('nav.admin')}
                            </span>
                          ) : isSeller ? (
                            <span className="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                              📈 {t('nav.seller')}
                            </span>
                          ) : isBuyer ? (
                            <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                              🏠 {t('nav.buyer')}
                            </span>
                          ) : null}
                          {showPremiumBadge && (
                            <Badge variant="gold" size="sm">👑 {t('nav.premium')}</Badge>
                          )}
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">📊</span>
                        {t('nav.dashboard')}
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors font-medium"
                        >
                          <span className="mr-3 text-lg">⚙️</span>
                          {t('nav.admin_panel')}
                        </Link>
                      )}

                      {isSeller && (
                        <>
                          <Link
                            to="/list-property"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">➕</span>
                            {t('nav.list_property')}
                          </Link>
                          <Link
                            to="/my-properties"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">📋</span>
                            {t('nav.my_properties')}
                          </Link>
                          <Link
                            to="/analytics"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">📊</span>
                            {t('nav.analytics')}
                          </Link>
                        </>
                      )}

                      {isBuyer && (
                        <>
                          <Link
                            to="/favorites"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">❤️</span>
                            {t('nav.favorites')}
                          </Link>
                          <Link
                            to="/ai-matching"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">🤖</span>
                            {t('nav.ai_match')}
                            {!isPremium && <span className="ml-2 text-[10px] text-yellow-600">🔒</span>}
                          </Link>
                          <Link
                            to="/map-search"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                          >
                            <span className="mr-3 text-lg">🗺️</span>
                            {t('nav.map_search')}
                            {!isPremium && <span className="ml-2 text-[10px] text-yellow-600">🔒</span>}
                          </Link>
                        </>
                      )}

                      <Link
                        to="/messages"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">💬</span>
                        {t('nav.messages')}
                      </Link>

                      <div className="h-px bg-gray-100 my-1" />

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">👤</span>
                        {t('nav.profile_settings')}
                      </Link>

                      <Link
                        to="/refer"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">🔗</span>
                        {t('nav.refer_earn')}
                      </Link>

                      {!isPremium && isAuthenticated && !isAdmin && (
                        <>
                          <div className="h-px bg-gray-100 my-1" />
                          <Link
                            to="/subscription"
                            className="flex items-center px-4 py-2.5 text-sm text-[#2D5A27] font-semibold hover:bg-[#2D5A27]/10 transition-colors"
                          >
                            <span className="mr-3 text-lg">🚀</span>
                            {t('nav.upgrade_premium')}
                          </Link>
                        </>
                      )}

                      <div className="h-px bg-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">🚪</span>
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-[#2D5A27]">{t('nav.menu')}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#2D5A27]/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ✅ Mobile Language Switcher */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('nav.language')}</span>
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

                    if (link.label === t('nav.list_property') || link.label === t('nav.favorites') || link.label === t('nav.my_properties')) {
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
                  {!link.locked && link.badge && link.badge === '✨ Free' && (
                    <Badge variant="success" size="sm">✅ Free</Badge>
                  )}
                </button>
              ))}

              {isAuthenticated && (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                  >
                    📊 {t('nav.dashboard')}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center w-full px-4 py-3 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                    >
                      ⚙️ {t('nav.admin_panel')}
                    </Link>
                  )}

                  {isSeller && (
                    <>
                      <Link
                        to="/list-property"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        ➕ {t('nav.list_property')}
                      </Link>
                      <Link
                        to="/my-properties"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        📋 {t('nav.my_properties')}
                      </Link>
                    </>
                  )}

                  {isBuyer && (
                    <>
                      <Link
                        to="/favorites"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        ❤️ {t('nav.favorites')}
                      </Link>
                      <Link
                        to="/ai-matching"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        🤖 {t('nav.ai_match')}
                        {!isPremium && <span className="ml-2 text-[10px] text-yellow-600">🔒</span>}
                      </Link>
                      <Link
                        to="/map-search"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                      >
                        🗺️ {t('nav.map_search')}
                        {!isPremium && <span className="ml-2 text-[10px] text-yellow-600">🔒</span>}
                      </Link>
                    </>
                  )}
                </>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    {!isPremium && !isAdmin && (
                      <Link
                        to="/subscription"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                      >
                        🚀 {t('nav.upgrade_premium')}
                      </Link>
                    )}
                    {isPremium && (
                      <div className="block w-full px-4 py-3 text-center text-white bg-[#D4AF37] rounded-xl">
                        👑 {t('nav.premium_member')}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN POPUP - With Translations */}
      <AnimatePresence>
        {showLoginPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowLoginPopup(false)}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="relative bg-gradient-to-r from-[#2D5A27] to-[#23461E] px-6 py-8 text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-sm shadow-lg">🔒</div>
                    <h3 className="text-2xl font-bold text-white mt-4">{t('nav.login_required')}</h3>
                    <p className="text-white/80 text-sm mt-1">
                      {t('nav.login_to_access')} <span className="font-semibold text-white">{selectedFeature}</span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t('nav.why_signin')}</p>
                        <p className="text-xs text-gray-400">{t('nav.why_signin_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        setShowLoginPopup(false);
                        navigate('/login');
                      }}
                      className="font-semibold"
                    >
                      {t('nav.sign_in_now')}
                    </Button>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <span className="relative px-4 text-xs text-gray-400 bg-white">{t('nav.or')}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        setShowLoginPopup(false);
                        navigate('/register');
                      }}
                    >
                      {t('nav.create_account')}
                    </Button>
                    <button
                      onClick={() => setShowLoginPopup(false)}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-2"
                    >
                      {t('nav.maybe_later')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* UPGRADE POPUP - With Translations */}
      <AnimatePresence>
        {showUpgradePopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowUpgradePopup(false)}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#2D5A27]/20">
                <div className="relative bg-gradient-to-r from-[#2D5A27] to-[#23461E] px-6 py-8 text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-sm shadow-lg">🚀</div>
                    <h3 className="text-2xl font-bold text-white mt-4">{t('nav.premium_feature')}</h3>
                    <p className="text-white/80 text-sm mt-1">
                      {t('nav.upgrade_to_access')} <span className="font-semibold text-white">{selectedFeature}</span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-[#E8F0E4] rounded-xl p-4 mb-6 border border-[#2D5A27]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{t('nav.premium_plan')}</p>
                        <p className="text-xs text-gray-400">{t('nav.all_features_unlocked')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#2D5A27]">₹999</p>
                        <p className="text-xs text-gray-400">{t('nav.per_month')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        setShowUpgradePopup(false);
                        navigate('/subscription');
                      }}
                      className="font-semibold"
                    >
                      {t('nav.upgrade_now')} 🚀
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => setShowUpgradePopup(false)}
                    >
                      {t('nav.maybe_later')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;