// src/services/api/language.ts

import apiClient from './client';

interface AvailableLanguage {
  code: string;
  name: string;
}

interface TranslationResponse {
  currentLang: string;
  availableLanguages: AvailableLanguage[];
  translations: Record<string, string>;
}

export const languageApi = {
  // ✅ Get all translations for a language
  getTranslations: async (lang: string = 'en'): Promise<TranslationResponse> => {
    try {
      console.log(`🌐 Fetching translations for: ${lang}`);
      const response = await apiClient.get(`/language/translations?lang=${lang}`);
      console.log('🌐 API Response:', response.data);
      
      const data = response.data.data;
      return {
        currentLang: data.currentLang || lang,
        availableLanguages: data.availableLanguages || [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ],
        translations: data.translations || {},
      };
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {
        currentLang: lang,
        availableLanguages: [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ],
        translations: {},
      };
    }
  },

  // ✅ Switch language
  switchLanguage: async (lang: string): Promise<TranslationResponse> => {
    try {
      console.log(`🔄 Switching to language: ${lang}`);
      const response = await apiClient.post('/language/switch', { lang });
      console.log('🔄 Switch response:', response.data);
      
      const data = response.data.data;
      return {
        currentLang: data.currentLang || lang,
        availableLanguages: data.availableLanguages || [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ],
        translations: data.translations || {},
      };
    } catch (error) {
      console.error('Error switching language:', error);
      return {
        currentLang: lang,
        availableLanguages: [
          { code: 'en', name: 'English' },
          { code: 'ne', name: 'नेपाली' },
        ],
        translations: {},
      };
    }
  },

  // ✅ Get specific translation keys
  getTranslationKeys: async (lang: string, keys: string[]): Promise<Record<string, string>> => {
    try {
      const response = await apiClient.post('/language/translations', { lang, keys });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching translation keys:', error);
      return {};
    }
  },

  // ✅ Get available languages
  getAvailableLanguages: async (): Promise<AvailableLanguage[]> => {
    try {
      const response = await apiClient.get('/language/languages');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [
        { code: 'en', name: 'English' },
        { code: 'ne', name: 'नेपाली' },
      ];
    }
  },
};