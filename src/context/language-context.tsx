import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  APP_LANGUAGE,
  DEFAULT_LANGUAGE,
  LANGUAGE_DIRECTION,
  LANGUAGE_STORAGE_KEY,
  isAppLanguage,
  type AppLanguage,
  type LanguageDirection,
} from '@/constants/language.constant';
import { i18n } from '@/shared/i18n';

interface LanguageContextValue {
  language: AppLanguage;
  direction: LanguageDirection;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  const applyLanguage = useCallback(async (nextLanguage: AppLanguage, persist: boolean) => {
    await i18n.changeLanguage(nextLanguage);
    setLanguageState(nextLanguage);
    if (persist) await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadLanguage() {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (!isMounted || !isAppLanguage(storedLanguage)) return;
      await applyLanguage(storedLanguage, false);
    }

    void loadLanguage();
    return () => {
      isMounted = false;
    };
  }, [applyLanguage]);

  const isRTL = language === APP_LANGUAGE.ARABIC;
  const direction = isRTL ? LANGUAGE_DIRECTION.RTL : LANGUAGE_DIRECTION.LTR;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        setLanguage: (nextLanguage) => applyLanguage(nextLanguage, true),
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
