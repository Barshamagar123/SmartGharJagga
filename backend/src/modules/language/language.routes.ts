// src/modules/language/language.routes.ts

import { Router } from 'express';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

const languageService = new LanguageService();
const languageController = new LanguageController(languageService);

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route GET /api/v1/language/translations
 * @desc Get all translations for a language
 * @access Public
 */
router.get('/translations', languageController.getTranslations);

/**
 * @route POST /api/v1/language/translations
 * @desc Get specific translation keys
 * @access Public
 */
router.post('/translations', languageController.getTranslationKeys);

/**
 * @route GET /api/v1/language/languages
 * @desc Get available languages
 * @access Public
 */
router.get('/languages', languageController.getAvailableLanguages);

/**
 * @route POST /api/v1/language/switch
 * @desc Switch language
 * @access Public
 */
router.post('/switch', languageController.switchLanguage);

export default router;