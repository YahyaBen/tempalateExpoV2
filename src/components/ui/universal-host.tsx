import { Host, type UniversalHostProps } from '@expo/ui';

import { useLanguage } from '@/context/language-context';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function UniversalHost({ children, ...props }: UniversalHostProps) {
  const { isRTL } = useLanguage();
  const { colorScheme } = useThemePreference();
  const theme = useThemeTokens();

  return (
    <Host
      colorScheme={colorScheme}
      seedColor={theme.colors.primary}
      layoutDirection={isRTL ? 'rightToLeft' : 'leftToRight'}
      {...props}>
      {children}
    </Host>
  );
}
