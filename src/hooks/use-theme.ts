/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { THEME_TOKENS } from '@/constants/theme.tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Preferred theme entry point for screens and components. */
export function useThemeTokens() {
  return THEME_TOKENS[useColorScheme()];
}

export function useTheme() {
  const { colors } = useThemeTokens();

  return {
    text: colors.foreground,
    background: colors.background,
    backgroundElement: colors.content2,
    backgroundSelected: colors.content3,
    textSecondary: colors.mutedForeground,
  };
}
