import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemeContext } from '@/context/theme-context';

export function useColorScheme(): 'light' | 'dark' {
  const context = useContext(ThemeContext);
  const rnScheme = useRNColorScheme();
  if (context) {
    return context.colorScheme;
  }
  return rnScheme === 'dark' ? 'dark' : 'light';
}

export { useThemePreference } from '@/context/theme-context';
