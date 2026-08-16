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
    const response = await apiClient.get(`/language/translations?lang=${lang}`);
    return response.data.data;
  },

  // ✅ Get specific translation keys
  getTranslationKeys: async (lang: string, keys: string[]): Promise<Record<string, string>> => {
    const response = await apiClient.post('/language/translations', { lang, keys });
    return response.data.data;
  },

  // ✅ Get available languages
  getAvailableLanguages: async (): Promise<AvailableLanguage[]> => {
    const response = await apiClient.get('/language/languages');
    return response.data.data;
  },

  // ✅ Switch language
  switchLanguage: async (lang: string): Promise<TranslationResponse> => {
    const response = await apiClient.post('/language/switch', { lang });
    return response.data.data;
  },
};