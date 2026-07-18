// src/modules/language/language.types.ts

export interface LanguageResponse {
  currentLang: string;
  availableLanguages: {
    code: string;
    name: string;
  }[];
  translations: any;
}

export interface TranslationRequest {
  lang: string;
  keys: string[];
}