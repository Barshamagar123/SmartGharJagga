// src/context/LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect, } from 'react';
import type {ReactNode } from 'react';
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
  'nav.login_to_access': 'You need to sign in to access',
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
  'welcome': 'Welcome to Smart GharJagga',
  'search': 'Search',
  'login': 'Login',
  'register': 'Register',
  'logout': 'Logout',
  'profile': 'Profile',
  'dashboard': 'Dashboard',
  'properties': 'Properties',
  'favorites': 'Favorites',
  'messages': 'Messages',
  'settings': 'Settings',
  'language': 'Language',
  'selectLanguage': 'Select Language',
  'nepali': 'Nepali',
  'english': 'English',
  'submit': 'Submit',
  'cancel': 'Cancel',
  'save': 'Save',
  'delete': 'Delete',
  'edit': 'Edit',
  'view': 'View',
  'loading': 'Loading...',
  'noResults': 'No results found',
  'error': 'Error',
  'success': 'Success',
  'home': 'Home',
  'about': 'About Us',
  'contact': 'Contact',
  'terms': 'Terms & Conditions',
  'privacy': 'Privacy Policy',
  'copyright': 'All rights reserved',
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>(FALLBACK_TRANSLATIONS);
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
        
        // ✅ Merge with fallback translations
        setTranslations({
          ...FALLBACK_TRANSLATIONS,
          ...response.translations,
        });
        setCurrentLang(response.currentLang || savedLang);
        setAvailableLanguages(response.availableLanguages || [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ]);
        document.documentElement.lang = response.currentLang || savedLang;
      } catch (err) {
        console.error('Error loading language:', err);
        setError('Failed to load language');
        // ✅ Keep fallback translations
        setTranslations(FALLBACK_TRANSLATIONS);
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
      
      // ✅ Merge with fallback translations
      setTranslations({
        ...FALLBACK_TRANSLATIONS,
        ...response.translations,
      });
      setCurrentLang(response.currentLang || lang);
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

  // ✅ Translation function with fallback
  const t = (key: string): string => {
    const value = translations[key];
    if (!value) {
      console.warn(`⚠️ Translation missing for key: "${key}" in language: "${currentLang}"`);
      return FALLBACK_TRANSLATIONS[key] || key;
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