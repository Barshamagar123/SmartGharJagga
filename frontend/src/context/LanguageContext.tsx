// src/context/LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect} from 'react';
import type {ReactNode} from 'react';
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
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([
    { code: 'en', name: 'English' },
    { code: 'ne', name: 'नेपाली' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLoading(true);
        const savedLang = localStorage.getItem('preferred_lang') || 'en';
        console.log('📚 Loading language:', savedLang);
        
        const response = await languageApi.getTranslations(savedLang);
        
        console.log('📚 Response:', response);
        console.log('📚 Translations keys:', Object.keys(response.translations || {}));
        
        setCurrentLang(response.currentLang || savedLang);
        setTranslations(response.translations || {});
        setAvailableLanguages(response.availableLanguages || [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ]);
        document.documentElement.lang = response.currentLang || savedLang;
      } catch (err) {
        console.error('Error loading language:', err);
        setError('Failed to load language');
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
      
      console.log('🔄 Switching to language:', lang);
      
      const response = await languageApi.switchLanguage(lang);
      
      console.log('🔄 Switch response:', response);
      console.log('🔄 New translations keys:', Object.keys(response.translations || {}));
      
      setCurrentLang(response.currentLang || lang);
      setTranslations(response.translations || {});
      setAvailableLanguages(response.availableLanguages || [
        { code: 'en', name: 'English' },
        { code: 'ne', name: 'नेपाली' },
      ]);
      
      localStorage.setItem('preferred_lang', response.currentLang || lang);
      document.documentElement.lang = response.currentLang || lang;
      
      console.log('✅ Language switched to:', response.currentLang || lang);
    } catch (err) {
      console.error('Error switching language:', err);
      setError('Failed to switch language');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string): string => {
    const value = translations[key];
    if (!value) {
      console.warn(`⚠️ Translation missing for key: "${key}" in language: "${currentLang}"`);
      return key;
    }
    return value;
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