// src/middleware/language.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { TranslationService } from '@/services/internal/translation.service';

const translationService = new TranslationService();

export const languageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get language from query parameter
  let lang = req.query.lang as string;

  // If not in query, check header
  if (!lang) {
    lang = req.headers['accept-language'] as string;
  }

  // If still not, check cookie
  if (!lang) {
    lang = req.cookies?.lang;
  }

  // Default to English
  if (!lang || !['en', 'ne'].includes(lang)) {
    lang = 'en';
  }

  // Set language in request
  req.lang = lang;

  // Add translate function to response locals
  res.locals.t = (key: string, params?: Record<string, string>) => {
    return translationService.translate(lang, key, params);
  };

  // Add languages list to response
  res.locals.languages = translationService.getAvailableLanguages();
  res.locals.currentLang = lang;

  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      lang: string;
    }
  }
}