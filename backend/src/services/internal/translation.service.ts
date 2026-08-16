// src/services/internal/translation.service.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ✅ Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TranslationService {
  private translations: Record<string, Record<string, string>> = {};
  private translationsPath: string;

  constructor() {
    // ✅ Now __dirname works
    this.translationsPath = path.join(__dirname, '../../locales');
    console.log('📂 Translations path:', this.translationsPath);
    this.loadTranslations();
  }

  // ✅ Load all translation files
  private loadTranslations(): void {
    try {
      // ✅ Check if directory exists
      if (!fs.existsSync(this.translationsPath)) {
        console.warn(`⚠️ Translations directory not found: ${this.translationsPath}`);
        console.warn('⚠️ Using default translations');
        this.loadDefaultTranslations();
        return;
      }

      const files = fs.readdirSync(this.translationsPath);
      
      if (files.length === 0) {
        console.warn(`⚠️ No translation files found in: ${this.translationsPath}`);
        this.loadDefaultTranslations();
        return;
      }
      
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const langCode = path.basename(file, '.json');
          const filePath = path.join(this.translationsPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          try {
            this.translations[langCode] = JSON.parse(content);
            console.log(`✅ Loaded translations for: ${langCode} (${Object.keys(this.translations[langCode]).length} keys)`);
          } catch (error) {
            console.error(`❌ Error parsing ${file}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('❌ Error loading translations:', error);
      // ✅ Fallback to default translations if files can't be loaded
      this.loadDefaultTranslations();
    }
  }

  // ✅ Fallback translations if files are missing
  private loadDefaultTranslations(): void {
    console.log('📚 Loading default translations');
    this.translations = {
      en: {
        'loginTitle': 'Login to Your Account',
        'registerTitle': 'Create New Account',
        'email': 'Email Address',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'name': 'Full Name',
        'phone': 'Phone Number',
        'role': 'I am a',
        'buyer': 'Buyer',
        'seller': 'Seller',
        'admin': 'Admin',
        'forgotPassword': 'Forgot Password?',
        'rememberMe': 'Remember Me',
        'dontHaveAccount': "Don't have an account?",
        'alreadyHaveAccount': 'Already have an account?',
        'registerNow': 'Register Now',
        'loginNow': 'Login Now',
        'logoutSuccess': 'Logout successful',
        'loginSuccess': 'Login successful',
        'registerSuccess': 'Registration successful',
        'invalidCredentials': 'Invalid email or password',
        'emailRequired': 'Email is required',
        'passwordRequired': 'Password is required',
        'passwordMinLength': 'Password must be at least 8 characters',
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
        'notFound': 'Resource not found',
        'unauthorized': 'Unauthorized access',
        'forbidden': 'Access denied',
        'validationError': 'Validation error',
        'serverError': 'Internal server error',
        'invalidToken': 'Invalid or expired token',
        'emailExists': 'Email already registered',
        'invalidPropertyType': 'Invalid property type',
        'listProperty': 'List Property',
        'editProperty': 'Edit Property',
        'deleteProperty': 'Delete Property',
        'propertyTitle': 'Property Title',
        'description': 'Description',
        'price': 'Price',
        'location': 'Location',
        'bedrooms': 'Bedrooms',
        'bathrooms': 'Bathrooms',
        'area': 'Area (sq ft)',
        'propertyType': 'Property Type',
        'purpose': 'Purpose',
        'amenities': 'Amenities',
        'parking': 'Parking',
        'floor': 'Floor',
        'yearBuilt': 'Year Built',
        'status': 'Status',
        'pending': 'Pending',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'sold': 'Sold',
        'house': 'House',
        'apartment': 'Apartment',
        'land': 'Land',
        'commercial': 'Commercial',
        'sale': 'For Sale',
        'rent': 'For Rent',
        'featured': 'Featured',
        'verified': 'Verified',
        // Navbar translations
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
        'loginTitle': 'आफ्नो खातामा लगइन गर्नुहोस्',
        'registerTitle': 'नयाँ खाता खोल्नुहोस्',
        'email': 'इमेल ठेगाना',
        'password': 'पासवर्ड',
        'confirmPassword': 'पासवर्ड पुष्टि गर्नुहोस्',
        'name': 'पुरा नाम',
        'phone': 'फोन नम्बर',
        'role': 'म हुँ',
        'buyer': 'किन्ने',
        'seller': 'बेच्ने',
        'admin': 'प्रशासक',
        'forgotPassword': 'पासवर्ड बिर्सनुभयो?',
        'rememberMe': 'मलाई सम्झनुहोस्',
        'dontHaveAccount': 'खाता छैन?',
        'alreadyHaveAccount': 'पहिले नै खाता छ?',
        'registerNow': 'अहिले दर्ता हुनुहोस्',
        'loginNow': 'अहिले लगइन गर्नुहोस्',
        'logoutSuccess': 'सफलतापूर्वक लगआउट भयो',
        'loginSuccess': 'सफलतापूर्वक लगइन भयो',
        'registerSuccess': 'सफलतापूर्वक दर्ता भयो',
        'invalidCredentials': 'अमान्य इमेल वा पासवर्ड',
        'emailRequired': 'इमेल आवश्यक छ',
        'passwordRequired': 'पासवर्ड आवश्यक छ',
        'passwordMinLength': 'पासवर्ड कम्तिमा ८ वर्णको हुनुपर्छ',
        'welcome': 'स्मार्ट घरजग्गामा स्वागतम्',
        'search': 'खोजी गर्नुहोस्',
        'login': 'लगइन',
        'register': 'दर्ता हुनुहोस्',
        'logout': 'लगआउट',
        'profile': 'प्रोफाइल',
        'dashboard': 'ड्यासबोर्ड',
        'properties': 'सम्पत्तिहरू',
        'favorites': 'मनपर्नेहरू',
        'messages': 'सन्देशहरू',
        'settings': 'सेटिङ्गहरू',
        'language': 'भाषा',
        'selectLanguage': 'भाषा छान्नुहोस्',
        'nepali': 'नेपाली',
        'english': 'अङ्ग्रेजी',
        'submit': 'पेश गर्नुहोस्',
        'cancel': 'रद्द गर्नुहोस्',
        'save': 'सुरक्षित गर्नुहोस्',
        'delete': 'मेटाउनुहोस्',
        'edit': 'सम्पादन गर्नुहोस्',
        'view': 'हेर्नुहोस्',
        'loading': 'लोड भइरहेको छ...',
        'noResults': 'कुनै परिणाम छैन',
        'error': 'त्रुटि',
        'success': 'सफल',
        'home': 'गृह पृष्ठ',
        'about': 'हाम्रो बारेमा',
        'contact': 'सम्पर्क',
        'terms': 'नियम र सर्तहरू',
        'privacy': 'गोपनीयता नीति',
        'copyright': 'सबै अधिकार सुरक्षित',
        'notFound': 'स्रोत फेला परेन',
        'unauthorized': 'अनाधिकृत पहुँच',
        'forbidden': 'पहुँच अस्वीकार',
        'validationError': 'मान्यता त्रुटि',
        'serverError': 'आन्तरिक सर्भर त्रुटि',
        'invalidToken': 'अमान्य वा म्याद सकिएको टोकन',
        'emailExists': 'इमेल पहिले नै दर्ता भएको छ',
        'invalidPropertyType': 'अमान्य सम्पत्ति प्रकार',
        'listProperty': 'सम्पत्ति सूचीकरण',
        'editProperty': 'सम्पत्ति सम्पादन',
        'deleteProperty': 'सम्पत्ति मेटाउनुहोस्',
        'propertyTitle': 'सम्पत्ति शीर्षक',
        'description': 'विवरण',
        'price': 'मूल्य',
        'location': 'स्थान',
        'bedrooms': 'सुत्ने कोठा',
        'bathrooms': 'नुहाउने कोठा',
        'area': 'क्षेत्रफल (वर्ग फिट)',
        'propertyType': 'सम्पत्ति प्रकार',
        'purpose': 'उद्देश्य',
        'amenities': 'सुविधाहरू',
        'parking': 'पार्किङ्ग',
        'floor': 'तला',
        'yearBuilt': 'निर्माण वर्ष',
        'status': 'अवस्था',
        'pending': 'विचाराधीन',
        'approved': 'स्वीकृत',
        'rejected': 'अस्वीकृत',
        'sold': 'बिक्री भयो',
        'house': 'घर',
        'apartment': 'अपार्टमेन्ट',
        'land': 'जग्गा',
        'commercial': 'व्यावसायिक',
        'sale': 'बिक्रीको लागि',
        'rent': 'भाडाको लागि',
        'featured': 'विशेष',
        'verified': 'प्रमाणित',
        // Navbar translations - Nepali
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

  // ✅ Get all translations for a language
  getAllTranslations(lang: string): Record<string, string> {
    return this.translations[lang] || this.translations.en;
  }

  // ✅ Translate a single key
  translate(lang: string, key: string): string {
    const translations = this.translations[lang] || this.translations.en;
    return translations[key] || key;
  }

  // ✅ Get available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'ne', name: 'नेपाली' },
    ];
  }
}