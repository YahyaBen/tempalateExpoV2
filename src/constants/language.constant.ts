export const APP_LANGUAGE = {
  ENGLISH: 'en',
  FRENCH: 'fr',
  ARABIC: 'ar',
} as const;

export type AppLanguage = (typeof APP_LANGUAGE)[keyof typeof APP_LANGUAGE];

export const LANGUAGE_STORAGE_KEY = '@language_preference';

export const DEFAULT_LANGUAGE: AppLanguage = APP_LANGUAGE.ENGLISH;

export const LANGUAGE_DIRECTION = {
  LTR: 'ltr',
  RTL: 'rtl',
} as const;

export type LanguageDirection = (typeof LANGUAGE_DIRECTION)[keyof typeof LANGUAGE_DIRECTION];

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value === APP_LANGUAGE.ENGLISH || value === APP_LANGUAGE.FRENCH || value === APP_LANGUAGE.ARABIC;
}
