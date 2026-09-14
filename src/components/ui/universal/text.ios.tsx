import { Text as SwiftUIText } from '@expo/ui/swift-ui';
import { lineLimit, type ModifierConfig } from '@expo/ui/swift-ui/modifiers';

import { useThemeTokens } from '@/hooks/use-theme';

import { iosStyleModifiers } from './native-style.ios';
import type { TextProps } from './text.types';

export function Text({
  children,
  disabled,
  hidden,
  modifiers,
  numberOfLines,
  onAppear,
  onDisappear,
  onPress,
  semantic = 'default',
  style,
  testID,
  textStyle,
}: TextProps) {
  const theme = useThemeTokens();
  const userModifiers = modifiers as ModifierConfig[] | undefined;
  const nativeModifiers = iosStyleModifiers(
    style,
    { onPress, onAppear, onDisappear, disabled, hidden },
    userModifiers,
    {
      color: theme.components.text.color[semantic],
      ...textStyle,
    },
  );
  if (typeof numberOfLines === 'number') nativeModifiers.unshift(lineLimit(numberOfLines));

  return (
    <SwiftUIText modifiers={nativeModifiers} testID={testID}>
      {children}
    </SwiftUIText>
  );
}

export type { TextProps, TextSemantic } from './text.types';
