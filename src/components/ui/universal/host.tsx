import { Host as ExpoHost } from '@expo/ui';
import type { ComponentProps } from 'react';

import { useLanguage } from '@/context/language-context';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

export type HostProps = ComponentProps<typeof ExpoHost>;
export type UniversalHostProps = HostProps;

export function Host({ children, ...props }: HostProps) {
  const { isRTL } = useLanguage();
  const { colorScheme } = useThemePreference();
  const theme = useThemeTokens();

  return (
    <ExpoHost
      colorScheme={colorScheme}
      seedColor={theme.colors.primary}
      layoutDirection={isRTL ? 'rightToLeft' : 'leftToRight'}
      {...props}>
      {children}
    </ExpoHost>
  );
}

export { Host as UniversalHost };
