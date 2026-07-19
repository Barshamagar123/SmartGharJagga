// src/components/common/Navbar/MobileMenu.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Discover', path: '/discover' },
    { label: 'Buy', path: '/properties' },
    { label: 'Sell', path: '/sell' },
    { label: 'Projects', path: '/projects' },
    { label: 'Insights', path: '/insights' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-xl font-bold text-primary">Menu</span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-2" />

                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={onClose}
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center px-6 py-3 text-primary hover:bg-primary/5 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="flex items-center px-6 py-3 bg-primary text-white mx-4 rounded-xl hover:bg-primary-dark transition-all duration-200 text-center"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  SmartGharJagga © 2024
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;