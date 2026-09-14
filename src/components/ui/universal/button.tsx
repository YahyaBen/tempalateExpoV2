import {
  Button as ExpoButton,
} from '@expo/ui';

import { useThemeTokens } from '@/hooks/use-theme';

import { fillWidthModifiers, fillWidthStyle } from './fill';
import type { ButtonProps } from './button.types';

export function Button({
  fullWidth = false,
  modifiers,
  semantic,
  style,
  variant = 'filled',
  ...props
}: ButtonProps) {
  const theme = useThemeTokens();
  const buttonModifiers = fullWidth
    ? [...fillWidthModifiers, ...(modifiers ?? [])]
    : modifiers;
  const semanticColors = semantic
    ? theme.components.button.color.semantic[semantic]
    : undefined;
  const semanticStyle = semanticColors && variant === 'filled'
    ? { backgroundColor: semanticColors.background }
    : undefined;
  const buttonStyle = { ...semanticStyle, ...style };

  return (
    <ExpoButton
      {...props}
      modifiers={buttonModifiers}
      variant={variant}
      style={fullWidth ? fillWidthStyle(buttonStyle) : buttonStyle}
    />
  );
}

export type { ButtonProps, ButtonSemantic } from './button.types';
