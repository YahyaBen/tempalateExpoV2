import { Text as ComposeText } from '@expo/ui/jetpack-compose';
import type { ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';

import { useThemeTokens } from '@/hooks/use-theme';

import { useNativeLifecycle } from './native-lifecycle';
import { androidStyleModifiers } from './native-style.android';
import type { TextProps } from './text.types';

const TEXT_ALIGN = {
  left: 'start',
  center: 'center',
  right: 'end',
} as const;

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
  useNativeLifecycle(onAppear, onDisappear);
  if (hidden) return null;

  const nativeTextStyle = {
    fontFamily: textStyle?.fontFamily,
    fontSize: textStyle?.fontSize,
    fontWeight: textStyle?.fontWeight,
    letterSpacing: textStyle?.letterSpacing,
    lineHeight: textStyle?.lineHeight,
    textAlign: textStyle?.textAlign ? TEXT_ALIGN[textStyle.textAlign] : undefined,
  };

  return (
    <ComposeText
      color={textStyle?.color ?? theme.components.text.color[semantic]}
      maxLines={numberOfLines}
      overflow={numberOfLines ? 'ellipsis' : undefined}
      style={nativeTextStyle}
      modifiers={androidStyleModifiers(
        style,
        { onPress, disabled, testID },
        modifiers as ModifierConfig[] | undefined,
      )}>
      {children}
    </ComposeText>
  );
}

export type { TextProps, TextSemantic } from './text.types';
