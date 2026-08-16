// src/context/LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect,  } from 'react';
import  type {ReactNode } from 'react';
import { languageApi } from '../services/api/language';

interface LanguageContextType {
  currentLang: string;
  translations: Record<string, string>;
  availableLanguages: { code: string; name: string }[];
  loading: boolean;
  error: string | null;
  switchLanguage: (lang: string) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load initial language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLoading(true);
        
        // Get saved language from localStorage or cookie
        const savedLang = localStorage.getItem('preferred_lang') || 'en';
        
        const response = await languageApi.getTranslations(savedLang);
        setCurrentLang(response.currentLang);
        setTranslations(response.translations);
        setAvailableLanguages(response.availableLanguages);
        
        // Save to localStorage
        localStorage.setItem('preferred_lang', response.currentLang);
        
        // Set HTML lang attribute
        document.documentElement.lang = response.currentLang;
      } catch (err) {
        console.error('Error loading language:', err);
        setError('Failed to load language');
        
        // Fallback to English
        setCurrentLang('en');
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // ✅ Switch language
  const switchLanguage = async (lang: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await languageApi.switchLanguage(lang);
      
      setCurrentLang(response.currentLang);
      setTranslations(response.translations);
      
      // Save to localStorage
      localStorage.setItem('preferred_lang', response.currentLang);
      
      // Set HTML lang attribute
      document.documentElement.lang = response.currentLang;
    } catch (err) {
      console.error('Error switching language:', err);
      setError('Failed to switch language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        translations,
        availableLanguages,
        loading,
        error,
        switchLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};