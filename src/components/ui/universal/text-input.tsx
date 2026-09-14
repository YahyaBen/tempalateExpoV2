import {
  Column,
  TextInput as ExpoTextInput,
  useNativeState,
  type ObservableState,
  type UniversalStyle,
} from '@expo/ui';
import { useEffect } from 'react';

import { useThemeTokens } from '@/hooks/use-theme';

import { fillWidthModifiers, fillWidthStyle } from './fill';
import { Text } from './text';
import type { TextInputProps } from './text-input.types';

function setNativeValue(state: ObservableState<string>, value: string) {
  if (state.value !== value) state.value = value;
}

export function TextInput({
  defaultValue = '',
  error,
  fullWidth = true,
  helperText,
  label,
  cursorColor,
  onChangeText,
  selectionColor,
  selectionHandleColor,
  style,
  value,
  ...props
}: TextInputProps) {
  const theme = useThemeTokens();
  const nativeValue = useNativeState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setNativeValue(nativeValue, value ?? '');
  }, [nativeValue, value]);

  const validationColor = error ? theme.colors.destructive : undefined;
  const fieldStyle = validationColor
    ? ({
        ...style,
        borderColor: validationColor,
        borderWidth: theme.borderWidth.small,
      } satisfies UniversalStyle)
    : style;
  const message = error ?? helperText;

  return (
    <Column
      spacing={theme.space(1.5)}
      modifiers={fullWidth ? fillWidthModifiers : undefined}
      style={fullWidth ? fillWidthStyle() : undefined}>
      {label ? (
        <Text semantic="default" textStyle={theme.typography.semantic.label}>
          {label}
        </Text>
      ) : null}
      <ExpoTextInput
        {...props}
        value={nativeValue}
        onChangeText={(nextValue) => {
          onChangeText?.(nextValue);
        }}
        cursorColor={validationColor ?? cursorColor}
        selectionColor={validationColor ?? selectionColor}
        selectionHandleColor={validationColor ?? selectionHandleColor}
        modifiers={fullWidth ? fillWidthModifiers : undefined}
        style={fullWidth ? fillWidthStyle(fieldStyle) : fieldStyle}
      />
      {message ? (
        <Text
          semantic={error ? 'destructive' : 'muted'}
          textStyle={theme.typography.semantic.caption}>
          {message}
        </Text>
      ) : null}
    </Column>
  );
}

export type { TextInputProps, TextInputRef } from './text-input.types';
