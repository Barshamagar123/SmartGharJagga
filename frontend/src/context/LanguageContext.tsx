// src/context/LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
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

// ✅ Default translations as fallback
const DEFAULT_TRANSLATIONS: Record<string, string> = {
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
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>(DEFAULT_TRANSLATIONS);
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([
    { code: 'en', name: 'English' },
    { code: 'ne', name: 'नेपाली' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setLoading(true);
        const savedLang = localStorage.getItem('preferred_lang') || 'en';
        
        // ✅ Try to fetch from API
        const response = await languageApi.getTranslations(savedLang);
        
        if (response && response.translations) {
          // ✅ Merge with default translations so we have fallbacks
          setTranslations({
            ...DEFAULT_TRANSLATIONS,
            ...response.translations,
          });
          setCurrentLang(response.currentLang);
          setAvailableLanguages(response.availableLanguages || [
            { code: 'en', name: 'English' },
            { code: 'ne', name: 'नेपाली' },
          ]);
        } else {
          // ✅ Use defaults if API returns empty
          setTranslations(DEFAULT_TRANSLATIONS);
          setCurrentLang(savedLang);
        }
        
        document.documentElement.lang = savedLang;
      } catch (err) {
        console.error('Error loading language, using defaults:', err);
        // ✅ Use default translations on error
        setTranslations(DEFAULT_TRANSLATIONS);
        setCurrentLang('en');
        setError('Failed to load language');
      } finally {
        setLoading(false);
      }
    };
    loadLanguage();
  }, []);

  const switchLanguage = async (lang: string) => {
    try {
      setLoading(true);
      const response = await languageApi.switchLanguage(lang);
      
      if (response && response.translations) {
        setTranslations({
          ...DEFAULT_TRANSLATIONS,
          ...response.translations,
        });
        setCurrentLang(response.currentLang);
      } else {
        setCurrentLang(lang);
      }
      
      localStorage.setItem('preferred_lang', lang);
      document.documentElement.lang = lang;
    } catch (err) {
      console.error('Error switching language:', err);
      setError('Failed to switch language');
      // ✅ Still switch language even if API fails
      setCurrentLang(lang);
      localStorage.setItem('preferred_lang', lang);
      document.documentElement.lang = lang;
    } finally {
      setLoading(false);
    }
  };

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