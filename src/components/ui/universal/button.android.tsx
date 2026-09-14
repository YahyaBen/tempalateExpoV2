import {
  Button as ComposeButton,
  OutlinedButton,
  Text,
  TextButton,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth, type ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';

import { useThemeTokens } from '@/hooks/use-theme';

import { useNativeLifecycle } from './native-lifecycle';
import { androidStyleModifiers } from './native-style.android';
import type { ButtonProps } from './button.types';

const BUTTONS = {
  filled: ComposeButton,
  outlined: OutlinedButton,
  text: TextButton,
};

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
  useNativeLifecycle(onAppear, onDisappear);
  if (hidden) return null;

  const ButtonComponent = BUTTONS[variant];
  const semanticColors = semantic
    ? theme.components.button.color.semantic[semantic]
    : undefined;
  const colors = semanticColors
    ? variant === 'filled'
      ? {
          containerColor: semanticColors.background,
          contentColor: semanticColors.foreground,
          disabledContainerColor: theme.components.button.color.disabled.background,
          disabledContentColor: theme.components.button.color.disabled.foreground,
        }
      : {
          contentColor: semanticColors.background,
          disabledContentColor: theme.components.button.color.disabled.foreground,
        }
    : undefined;
  const nativeModifiers = androidStyleModifiers(
    style,
    { disabled, testID },
    modifiers as ModifierConfig[] | undefined,
  );
  if (fullWidth) nativeModifiers.unshift(fillMaxWidth());

  return (
    <ButtonComponent
      colors={colors}
      onClick={disabled ? undefined : onPress}
      enabled={!disabled}
      modifiers={nativeModifiers}>
      {children ?? <Text>{label ?? ''}</Text>}
    </ButtonComponent>
  );
}

export type { ButtonProps, ButtonSemantic } from './button.types';
