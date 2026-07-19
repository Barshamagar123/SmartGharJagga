// src/components/common/Navbar/MobileMenu.tsx

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, getRoleDisplay } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 animate-slideDown md:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="font-bold text-lg text-primary">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-5 bg-gradient-to-r from-primary-light/30 to-transparent border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{user.name}</p>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                  <p className="text-xs font-medium text-primary">{getRoleDisplay(user.role)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <Link to="/" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
              🏠 Home
            </Link>
            <Link to="/properties" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
              🏘️ Properties
            </Link>
            <Link to="/about" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
              ℹ️ About
            </Link>
            <Link to="/contact" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
              📞 Contact
            </Link>

            {isAuthenticated && user && (
              <>
                <div className="h-px bg-gray-100 my-2" />

                {user.role === 'BUYER' && (
                  <>
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      📊 Dashboard
                    </Link>
                    <Link to="/matching" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      🤖 AI Matching
                    </Link>
                    <Link to="/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      ❤️ Favorites
                    </Link>
                    <Link to="/messages" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      💬 Messages
                    </Link>
                  </>
                )}

                {user.role === 'SELLER' && (
                  <>
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      📊 Dashboard
                    </Link>
                    <Link to="/my-properties" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      🏠 My Properties
                    </Link>
                    <Link to="/add-property" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      ➕ Add Property
                    </Link>
                    <Link to="/inquiries" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      📩 Inquiries
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      👑 Admin Panel
                    </Link>
                    <Link to="/admin/users" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      👥 Users
                    </Link>
                    <Link to="/admin/properties" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                      🏠 Properties
                    </Link>
                  </>
                )}

                <div className="h-px bg-gray-100 my-2" />
                <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                  👤 Profile
                </Link>
                <Link to="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light/30 transition-colors">
                  ⚙️ Settings
                </Link>
              </>
            )}

            <div className="h-px bg-gray-100 my-2" />

            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 text-primary font-medium bg-primary-light/30 rounded-xl hover:bg-primary-light/50 transition-colors">
                  🔐 Login
                </Link>
                <Link to="/register" onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 text-white font-medium bg-gradient-to-r from-primary to-primary-dark rounded-xl hover:from-primary-dark hover:to-primary transition-colors">
                  ✨ Register
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 transition-colors"
              >
                🚪 Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;