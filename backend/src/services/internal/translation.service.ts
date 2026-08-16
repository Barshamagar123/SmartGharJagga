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
    // ✅ Use 'locals' instead of 'locales'
    this.translationsPath = path.join(__dirname, '../../locals');
    console.log('📂 Translations path:', this.translationsPath);
    this.loadTranslations();
  }

  private loadTranslations(): void {
    try {
      if (!fs.existsSync(this.translationsPath)) {
        console.warn(`⚠️ Translations directory not found: ${this.translationsPath}`);
        this.loadDefaultTranslations();
        return;
      }

      // ✅ Get all language folders (en, ne, etc.)
      const languageFolders = fs.readdirSync(this.translationsPath);
      console.log('📂 Found language folders:', languageFolders);
      
      languageFolders.forEach((folder) => {
        const folderPath = path.join(this.translationsPath, folder);
        if (fs.statSync(folderPath).isDirectory()) {
          // ✅ Initialize translations for this language
          this.translations[folder] = {};
          
          // ✅ Read all JSON files in the language folder
          const files = fs.readdirSync(folderPath);
          console.log(`📂 Files in ${folder}:`, files);
          
          files.forEach((file) => {
            if (file.endsWith('.json')) {
              const filePath = path.join(folderPath, file);
              try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const parsed = JSON.parse(content);
                // ✅ Merge into translations
                this.translations[folder] = {
                  ...this.translations[folder],
                  ...parsed,
                };
                console.log(`✅ Loaded ${Object.keys(parsed).length} keys from ${file} for ${folder}`);
              } catch (error) {
                console.error(`❌ Error parsing ${file}:`, error);
              }
            }
          });
        }
      });

      // ✅ Log summary
      Object.keys(this.translations).forEach((lang) => {
        console.log(`📚 ${lang}: ${Object.keys(this.translations[lang]).length} total keys`);
      });

    } catch (error) {
      console.error('❌ Error loading translations:', error);
      this.loadDefaultTranslations();
    }
  }

  // ✅ Get all translations for a language
  getAllTranslations(lang: string): Record<string, string> {
    const cleanLang = lang.trim();
    console.log(`🔍 Getting translations for: "${cleanLang}"`);
    
    if (!this.translations[cleanLang]) {
      console.warn(`⚠️ Language "${cleanLang}" not found, falling back to English`);
      return this.translations.en || {};
    }
    
    return this.translations[cleanLang];
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
        'nav.login_required': 'लगइन आवश्यक',
        'nav.login_to_access': 'तपाईंले पहुँच गर्न साइन इन गर्नुपर्छ',
        'nav.why_signin': 'किन साइन इन गर्ने?',
        'nav.why_signin_desc': 'मनपर्नेहरू सुरक्षित गर्नुहोस्, एआई मिलान पाउनुहोस्, र थप!',
        'nav.sign_in_now': 'अहिले साइन इन गर्नुहोस्',
        'nav.or': 'वा',
        'nav.create_account': 'नयाँ खाता सिर्जना गर्नुहोस्',
        'nav.maybe_later': 'पछि',
        'nav.premium_feature': 'प्रिमियम सुविधा',
        'nav.upgrade_to_access': 'पहुँच गर्न अपग्रेड गर्नुहोस्',
        'nav.premium_plan': 'प्रिमियम योजना',
        'nav.all_features_unlocked': 'सबै सुविधाहरू अनलक गरियो',
        'nav.per_month': '/ महिना',
        'nav.upgrade_now': 'अहिले अपग्रेड गर्नुहोस्',
        'nav.upgrade': 'अपग्रेड',
      },
    };
  }
}