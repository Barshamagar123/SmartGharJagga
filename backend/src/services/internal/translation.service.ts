// src/services/internal/translation.service.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TranslationService {
  private translations: Map<string, any> = new Map();

  constructor() {
    this.loadTranslations();
  }

  // ============================================
  // Load all translation files
  // ============================================
  private loadTranslations(): void {
    const localesPath = path.join(__dirname, '../../locales');
    const languages = ['en', 'ne'];

    languages.forEach((lang) => {
      const langPath = path.join(localesPath, lang);
      if (fs.existsSync(langPath)) {
        const files = fs.readdirSync(langPath);
        const translations: any = {};

        files.forEach((file) => {
          if (file.endsWith('.json')) {
            const filePath = path.join(langPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const key = file.replace('.json', '');
            translations[key] = content;
          }
        });

        this.translations.set(lang, translations);
      }
    });
  }

  // ============================================
  // Get translation
  // ============================================
  translate(lang: string, key: string, params?: Record<string, string>): string {
    const langData = this.translations.get(lang);
    if (!langData) {
      return key;
    }

    // Split key by dot (e.g., "auth.loginTitle")
    const parts = key.split('.');
    let value = langData;

    for (const part of parts) {
      if (value && value[part]) {
        value = value[part];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{{${param}}}`, params[param]);
      });
    }

    return value;
  }

  // ============================================
  // Get all translations for a language
  // ============================================
  getAllTranslations(lang: string): any {
    return this.translations.get(lang) || {};
  }

  // ============================================
  // Get available languages
  // ============================================
  getAvailableLanguages(): string[] {
    return ['en', 'ne'];
  }

  // ============================================
  // Get language name
  // ============================================
  getLanguageName(lang: string): string {
    const names: Record<string, string> = {
      en: 'English',
      ne: 'नेपाली',
    };
    return names[lang] || lang;
  }
}