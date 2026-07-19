// src/context/LanguageContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'common.welcome': 'Welcome',
    'common.language': 'Language',
    'common.nepali': 'Nepali',
    'common.english': 'English',
  },
  ne: {
    'nav.home': 'गृह पृष्ठ',
    'nav.properties': 'सम्पत्तिहरू',
    'nav.about': 'हाम्रो बारेमा',
    'nav.contact': 'सम्पर्क',
    'nav.dashboard': 'ड्यासबोर्ड',
    'nav.logout': 'लगआउट',
    'nav.login': 'लगइन',
    'nav.register': 'दर्ता हुनुहोस्',
    'common.welcome': 'स्वागतम्',
    'common.language': 'भाषा',
    'common.nepali': 'नेपाली',
    'common.english': 'अङ्ग्रेजी',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    if (language === 'ne') {
      document.documentElement.classList.add('font-nepali');
    } else {
      document.documentElement.classList.remove('font-nepali');
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};