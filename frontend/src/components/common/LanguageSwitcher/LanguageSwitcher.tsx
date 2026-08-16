// src/components/common/LanguageSwitcher/LanguageSwitcher.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { currentLang, availableLanguages, switchLanguage, loading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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
    console.log('🔄 LanguageSwitcher: Changing to:', langCode);
    try {
      await switchLanguage(langCode);
      console.log('✅ LanguageSwitcher: Successfully changed to:', langCode);
      setIsOpen(false);
      // ✅ Force page to re-render by reloading (optional)
      // window.location.reload();
    } catch (error) {
      console.error('❌ LanguageSwitcher: Error changing language:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          console.log('👆 LanguageSwitcher: Button clicked');
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-50"
        style={{ borderColor: '#D3CFC5', color: '#5C6570' }}
        disabled={loading}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage?.name || (currentLang === 'en' ? 'English' : 'नेपाली')}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border shadow-lg overflow-hidden z-50"
          style={{ borderColor: '#D3CFC5' }}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              style={{ color: '#333A44' }}
            >
              <span>{lang.name}</span>
              {currentLang === lang.code && (
                <Check className="w-4 h-4 text-[#2D5A27]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;