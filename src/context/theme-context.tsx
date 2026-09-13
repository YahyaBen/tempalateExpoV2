import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

import {
    THEME_PREFERENCE,
    THEME_STORAGE_KEY,
    type ThemeMode,
    type ThemePreference,
} from '@/constants/theme.constant';

export interface ThemeContextType {
  preference: ThemePreference;
  colorScheme: ThemeMode;
  isDark: boolean;
  setPreference: (pref: ThemePreference) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(THEME_PREFERENCE.SYSTEM);

  // Load persisted theme preference from storage on mount
  useEffect(() => {
    let isMounted = true;
    async function loadStoredPreference() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          stored &&
          (stored === THEME_PREFERENCE.LIGHT ||
            stored === THEME_PREFERENCE.DARK ||
            stored === THEME_PREFERENCE.SYSTEM)
        ) {
          if (isMounted) {
            setPreferenceState(stored as ThemePreference);
            try {
              Appearance.setColorScheme(
                stored === THEME_PREFERENCE.SYSTEM
                  ? 'unspecified'
                  : (stored as ColorSchemeName)
              );
            } catch {
              // Appearance.setColorScheme might not be supported on all environments
            }
          }
        }
      } catch {
        // Fallback to default
      }
    }

    loadStoredPreference();
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
      Appearance.setColorScheme(
        pref === THEME_PREFERENCE.SYSTEM ? 'unspecified' : (pref as ColorSchemeName)
      );
    } catch {
      // Ignored
    }
  }, []);

  // Compute the active effective colorScheme
  const effectiveScheme: ThemeMode =
    preference === THEME_PREFERENCE.SYSTEM
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  return (
    <ThemeContext.Provider
      value={{
        preference,
        colorScheme: effectiveScheme,
        isDark: effectiveScheme === 'dark',
        setPreference,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return context;
}
