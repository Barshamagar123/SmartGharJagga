// src/modules/language/language.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { LanguageService } from './language.service';

export class LanguageController {
  constructor(private languageService: LanguageService) {}

  // ============================================
  // Get all translations
  // ============================================
  getTranslations = asyncHandler(async (req: Request, res: Response) => {
    const lang = (req.query.lang as string) || 'en';
    const translations = this.languageService.getTranslations(lang);
    ApiResponse.success(res, 200, 'Translations fetched successfully', translations);
  });

  // ============================================
  // Get specific translation keys
  // ============================================
  getTranslationKeys = asyncHandler(async (req: Request, res: Response) => {
    const lang = (req.query.lang as string) || 'en';
    const { keys } = req.body;

    if (!keys || !Array.isArray(keys)) {
      throw new Error('Keys array is required');
    }

    const translations = this.languageService.getTranslationKeys(lang, keys);
    ApiResponse.success(res, 200, 'Translation keys fetched successfully', translations);
  });

  // ============================================
  // Get available languages
  // ============================================
  getAvailableLanguages = asyncHandler(async (req: Request, res: Response) => {
    const languages = this.languageService.getAvailableLanguages();
    ApiResponse.success(res, 200, 'Languages fetched successfully', languages);
  });

  // ============================================
  // Switch language
  // ============================================
  switchLanguage = asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.body;

    if (!lang || !['en', 'ne'].includes(lang)) {
      throw new Error('Invalid language');
    }

    // Set cookie
    res.cookie('lang', lang, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    });

    const translations = this.languageService.getTranslations(lang);

    ApiResponse.success(res, 200, `Language switched to ${lang}`, {
      currentLang: lang,
      translations,
    });
  });
}