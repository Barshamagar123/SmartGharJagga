// src/components/common/Navbar/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Avatar } from '../Avatar/Avatar';
import { useAuth } from '../../../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const isPremium = false;

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ Feature Lock Logic (Based on Business Model)
  const isFeatureLocked = (feature: string) => {
    // ✅ List Property - UNLOCKED for everyone (Free users can list)
    if (feature === 'List Property') {
      return false; // ✅ Always unlocked
    }
    
    // ✅ AI Match - LOCKED (Premium only)
    if (feature === 'AI Match') {
      return true;
    }
    
    // ✅ Map Search - LOCKED (Premium only)
    if (feature === 'Map Search') {
      return true;
    }
    
    return false;
  };

  const handleFeatureClick = (feature: string, path: string) => {
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

  // ✅ NAV LINKS
  const navLinks = [
    { label: 'Home', path: '/', locked: false },
    { label: 'Properties', path: '/properties', locked: false },
    {
      label: 'AI Match',
      path: '/ai-matching',
      locked: true,
      badge: '🔒 Premium',
    },
    {
      label: 'Map Search',
      path: '/map-search',
      locked: true,
      badge: '🔒 Premium',
    },
    {
      label: 'List Property',
      path: '/list-property',
      locked: false, // ✅ UNLOCKED for everyone
      badge: '✨ Free',
    },
  ];

  const getNavLinks = () => {
    return navLinks;
  };

  const finalNavLinks = getNavLinks();

  const showPremiumBadge = isAuthenticated && isPremium;
  const showUpgradeButton = isAuthenticated && !isPremium;

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
                  Real Estate Platform
                </p>
              </div>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {finalNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleFeatureClick(link.label, link.path)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#2D5A27] rounded-xl hover:bg-[#2D5A27]/5 transition-all duration-200 relative group"
                >
                  {link.label}

                  {link.locked && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                      Premium
                    </span>
                  )}

                  {!link.locked && link.badge === '✨ Free' && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-full bg-green-100 text-green-700">
                      Free
                    </span>
                  )}

                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2D5A27] rounded-full transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                </button>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#2D5A27] rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200"
              >
                {language === 'EN' ? '🇳🇵' : '🇬🇧'}
              </button>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
              ) : (
                <>
                  {/* Upgrade Button */}
                  {showUpgradeButton && (
                    <Link
                      to="/subscription"
                      className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span>Upgrade</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}

                  {showPremiumBadge && (
                    <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#D4AF37] rounded-full shadow-sm">
                      <span>👑</span>
                      Premium
                    </span>
                  )}

                  {/* Avatar with Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200">
                      <Avatar
                        name={user?.name || 'User'}
                        size="sm"
                        variant="primary"
                        src={user?.avatarUrl}
                      />
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        {showPremiumBadge && (
                          <Badge variant="gold" size="sm" className="mt-1">👑 Premium</Badge>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">📊</span>
                        Dashboard
                      </Link>

                      <Link
                        to="/favorites"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">❤️</span>
                        Favorites
                      </Link>

                      <Link
                        to="/messages"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">💬</span>
                        Messages
                      </Link>

                      {user?.role === 'ADMIN' && (
                        <>
                          <div className="h-px bg-gray-100 my-1" />
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <span className="mr-3 text-lg">⚙️</span>
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="h-px bg-gray-100 my-1" />

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">👤</span>
                        Profile Settings
                      </Link>

                      <Link
                        to="/refer"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-[#2D5A27]/5 hover:text-[#2D5A27] transition-colors"
                      >
                        <span className="mr-3 text-lg">🔗</span>
                        Refer & Earn
                      </Link>

                      {!isPremium && isAuthenticated && (
                        <>
                          <div className="h-px bg-gray-100 my-1" />
                          <Link
                            to="/subscription"
                            className="flex items-center px-4 py-2.5 text-sm text-[#2D5A27] font-semibold hover:bg-[#2D5A27]/10 transition-colors"
                          >
                            <span className="mr-3 text-lg">🚀</span>
                            Upgrade to Premium
                          </Link>
                        </>
                      )}

                      <div className="h-px bg-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-[#2D5A27]/5 transition-all duration-200"
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
              <span className="text-xl font-bold text-[#2D5A27]">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#2D5A27]/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-1">
              {finalNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
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

              {isAuthenticated && (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-[#2D5A27] hover:bg-[#2D5A27]/5 rounded-lg transition-all duration-200"
                  >
                    📊 Dashboard
                  </Link>
                </>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    {!isPremium && (
                      <Link
                        to="/subscription"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                      >
                        🚀 Upgrade to Premium
                      </Link>
                    )}
                    {isPremium && (
                      <div className="block w-full px-4 py-3 text-center text-white bg-[#D4AF37] rounded-xl">
                        👑 Premium Member
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN POPUP */}
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
                    <h3 className="text-2xl font-bold text-white mt-4">Login Required</h3>
                    <p className="text-white/80 text-sm mt-1">
                      You need to sign in to access <span className="font-semibold text-white">{selectedFeature}</span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Why sign in?</p>
                        <p className="text-xs text-gray-400">Save favorites, get AI matches, and more!</p>
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
                      Sign In Now
                    </Button>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <span className="relative px-4 text-xs text-gray-400 bg-white">or</span>
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
                      Create New Account
                    </Button>
                    <button
                      onClick={() => setShowLoginPopup(false)}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-2"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* UPGRADE POPUP */}
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
                    <h3 className="text-2xl font-bold text-white mt-4">Premium Feature</h3>
                    <p className="text-white/80 text-sm mt-1">
                      Upgrade to access <span className="font-semibold text-white">{selectedFeature}</span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-[#E8F0E4] rounded-xl p-4 mb-6 border border-[#2D5A27]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Premium Plan</p>
                        <p className="text-xs text-gray-400">All features unlocked</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#2D5A27]">₹999</p>
                        <p className="text-xs text-gray-400">/ month</p>
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
                      Upgrade Now 🚀
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => setShowUpgradePopup(false)}
                    >
                      Maybe Later
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