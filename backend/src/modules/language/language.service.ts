// src/modules/language/language.service.ts

import { TranslationService } from '@/services/internal/translation.service';

export class LanguageService {
  private translationService: TranslationService;

  constructor() {
    this.translationService = new TranslationService();
  }

  // ============================================
  // Get all translations for a language
  // ============================================
  getTranslations(lang: string): any {
    const availableLanguages = [
      { code: 'en', name: 'English' },
      { code: 'ne', name: 'नेपाली' },
    ];

    const translations = this.translationService.getAllTranslations(lang);

    return {
      currentLang: lang,
      availableLanguages,
      translations,
    };
  }

  // ============================================
  // Get specific translation keys
  // ============================================
  getTranslationKeys(lang: string, keys: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    keys.forEach((key) => {
      result[key] = this.translationService.translate(lang, key);
    });

    return result;
  }

  // ============================================
  // Get available languages
  // ============================================
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'ne', name: 'नेपाली' },
    ];
  }
}