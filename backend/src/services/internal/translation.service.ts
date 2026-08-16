// src/services/internal/translation.service.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TranslationService {
  private translations: Record<string, Record<string, string>> = {};
  private translationsPath: string;

  constructor() {
    // ✅ Log the path being used
    this.translationsPath = path.join(__dirname, '../../locales');
    console.log('📂 __dirname:', __dirname);
    console.log('📂 Translations path:', this.translationsPath);
    
    // ✅ Check if directory exists
    const exists = fs.existsSync(this.translationsPath);
    console.log('📂 Directory exists:', exists);
    
    if (exists) {
      const files = fs.readdirSync(this.translationsPath);
      console.log('📂 Files in directory:', files);
    }
    
    this.loadTranslations();
    
    // ✅ Log what was loaded
    console.log('📚 Loaded languages:', Object.keys(this.translations));
    console.log('📚 English keys count:', Object.keys(this.translations.en || {}).length);
    console.log('📚 Nepali keys count:', Object.keys(this.translations.ne || {}).length);
  }

  private loadTranslations(): void {
    try {
      if (!fs.existsSync(this.translationsPath)) {
        console.warn(`⚠️ Translations directory not found: ${this.translationsPath}`);
        this.loadDefaultTranslations();
        return;
      }

      const files = fs.readdirSync(this.translationsPath);
      
      if (files.length === 0) {
        console.warn(`⚠️ No files found in translations directory`);
        this.loadDefaultTranslations();
        return;
      }
      
      let loadedCount = 0;
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const langCode = path.basename(file, '.json');
          const filePath = path.join(this.translationsPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          try {
            const parsed = JSON.parse(content);
            this.translations[langCode] = parsed;
            loadedCount++;
            console.log(`✅ Loaded ${Object.keys(parsed).length} keys for: ${langCode}`);
          } catch (error) {
            console.error(`❌ Error parsing ${file}:`, error);
          }
        }
      });
      
      if (loadedCount === 0) {
        console.warn('⚠️ No translation files loaded, using defaults');
        this.loadDefaultTranslations();
      }
    } catch (error) {
      console.error('❌ Error loading translations:', error);
      this.loadDefaultTranslations();
    }
  }

  // ✅ Get all translations for a language
  getAllTranslations(lang: string): Record<string, string> {
    const cleanLang = lang.trim();
    console.log(`🔍 Getting translations for: "${cleanLang}"`);
    console.log(`🔍 Available languages:`, Object.keys(this.translations));
    
    if (!this.translations[cleanLang]) {
      console.warn(`⚠️ Language "${cleanLang}" not found, falling back to English`);
      return this.translations.en || {};
    }
    
    const translations = this.translations[cleanLang];
    console.log(`✅ Found ${Object.keys(translations).length} keys for ${cleanLang}`);
    return translations;
  }

  // ✅ Translate a single key
  translate(lang: string, key: string): string {
    const translations = this.getAllTranslations(lang);
    return translations[key] || key;
  }

  // ✅ Get available languages
  getAvailableLanguages() {
    const languages = Object.keys(this.translations).map(code => ({
      code,
      name: code === 'en' ? 'English' : code === 'ne' ? 'नेपाली' : code,
    }));
    
    if (languages.length === 0) {
      return [
        { code: 'en', name: 'English' },
        { code: 'ne', name: 'नेपाली' },
      ];
    }
    
    return languages;
  }

  // ✅ Fallback translations
  private loadDefaultTranslations(): void {
    console.log('📚 Loading default translations');
    this.translations = {
      en: {
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
      },
      ne: {
        'nav.home': 'गृहपृष्ठ',
        'nav.properties': 'सम्पत्तिहरू',
        'nav.list_property': 'सम्पत्ति सूचीबद्ध गर्नुहोस्',
        'nav.dashboard': 'ड्यासबोर्ड',
        'nav.login': 'लगइन',
        'nav.register': 'दर्ता',
        'nav.logout': 'लगआउट',
        'nav.profile': 'प्रोफाइल',
        'nav.find_match': 'मिल्दो खोज्नुहोस्',
        'nav.ai_match': 'एआई मिलान',
        'nav.map_search': 'नक्सा खोज',
        'nav.admin_panel': 'प्रशासक प्यानल',
        'nav.my_properties': 'मेरो सम्पत्तिहरू',
        'nav.favorites': 'मनपर्नेहरू',
        'nav.analytics': 'विश्लेषण',
        'nav.messages': 'सन्देशहरू',
        'nav.profile_settings': 'प्रोफाइल सेटिङहरू',
        'nav.refer_earn': 'सिफारिस गर्नुहोस् र कमाउनुहोस्',
        'nav.upgrade_premium': 'प्रिमियममा अपग्रेड गर्नुहोस्',
        'nav.premium': 'प्रिमियम',
        'nav.premium_member': 'प्रिमियम सदस्य',
        'nav.admin': 'प्रशासक',
        'nav.seller': 'विक्रेता',
        'nav.buyer': 'खरिदकर्ता',
        'nav.real_estate_platform': 'घरजग्गा प्लेटफर्म',
        'nav.menu': 'मेनु',
        'nav.language': 'भाषा',
      },
    };
  }
}