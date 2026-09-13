import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '@/constants/language.constant';
import ar from '@/shared/locales/ar.json';
import en from '@/shared/locales/en.json';
import fr from '@/shared/locales/fr.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ['en', 'fr', 'ar'],
  load: 'languageOnly',
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { i18n };
