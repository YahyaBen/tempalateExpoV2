import { Text as ExpoText } from '@expo/ui';

import { useThemeTokens } from '@/hooks/use-theme';

import type { TextProps } from './text.types';

export function Text({ semantic = 'default', textStyle, ...props }: TextProps) {
  const theme = useThemeTokens();

  return (
    <ExpoText
      {...props}
      textStyle={{ color: theme.components.text.color[semantic], ...textStyle }}
    />
  );
}

export type { TextProps, TextSemantic } from './text.types';
