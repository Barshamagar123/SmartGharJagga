// src/components/common/LanguageSwitcher/LanguageSwitcher.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  const { currentLang, availableLanguages, switchLanguage, loading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = availableLanguages.find(lang => lang.code === currentLang);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLang || isChanging) return;
    
    console.log('🔄 LanguageSwitcher: Changing to:', langCode);
    setIsChanging(true);
    
    try {
      await switchLanguage(langCode);
      console.log('✅ LanguageSwitcher: Successfully changed to:', langCode);
      setIsOpen(false);
    } catch (error) {
      console.error('❌ LanguageSwitcher: Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const getDisplayName = () => {
    if (variant === 'minimal') {
      return currentLang === 'en' ? 'EN' : 'ने';
    }
    return currentLanguage?.name || (currentLang === 'en' ? 'English' : 'नेपाली');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isChanging) {
            setIsOpen(!isOpen);
          }
        }}
        className={`flex items-center gap-1.5 rounded-lg border transition-colors hover:bg-gray-50 ${
          variant === 'minimal' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
        } ${isChanging ? 'opacity-50 cursor-wait' : ''}`}
        style={{ borderColor: '#D3CFC5', color: '#5C6570' }}
        disabled={loading || isChanging}
      >
        <span className="text-base">🌐</span>
        <span className="font-medium">{getDisplayName()}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isChanging && (
          <span className="ml-1 inline-block w-3 h-3 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg border shadow-lg overflow-hidden z-50"
          style={{ borderColor: '#D3CFC5' }}
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              style={{ color: '#333A44' }}
              disabled={isChanging}
            >
              <span>{lang.name}</span>
              {currentLang === lang.code && (
                <span className="text-[#2D5A27]">✓</span>
              )}
              {lang.code !== currentLang && isChanging && (
                <span className="text-xs text-gray-400">Loading...</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;