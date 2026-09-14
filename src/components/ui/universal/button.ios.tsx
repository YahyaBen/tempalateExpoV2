import { Button as SwiftUIButton } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  frame,
  tint,
  type ModifierConfig,
} from '@expo/ui/swift-ui/modifiers';
import type { ReactElement } from 'react';

import { useThemeTokens } from '@/hooks/use-theme';

import { iosStyleModifiers } from './native-style.ios';
import type { ButtonProps } from './button.types';

const BUTTON_STYLES = {
  filled: 'borderedProminent',
  outlined: 'bordered',
  text: 'plain',
} as const;

export function Button({
  children,
  disabled,
  fullWidth = false,
  hidden,
  label,
  modifiers,
  onAppear,
  onDisappear,
  onPress,
  semantic,
  style,
  testID,
  variant = 'filled',
}: ButtonProps) {
  const theme = useThemeTokens();
  const semanticColors = semantic
    ? theme.components.button.color.semantic[semantic]
    : undefined;
  const userModifiers = modifiers as ModifierConfig[] | undefined;
  const nativeModifiers = [
    buttonStyle(BUTTON_STYLES[variant]),
    ...(semanticColors ? [tint(semanticColors.background)] : []),
    ...(fullWidth ? [frame({ maxWidth: Infinity })] : []),
    ...iosStyleModifiers(
      style,
      { onAppear, onDisappear, disabled, hidden },
      userModifiers,
    ),
  ];

  return (
    <SwiftUIButton
      onPress={disabled ? undefined : onPress}
      label={children ? undefined : label}
      modifiers={nativeModifiers}
      testID={testID}>
      {children as ReactElement | undefined}
    </SwiftUIButton>
  );
}

export type { ButtonProps, ButtonSemantic } from './button.types';
