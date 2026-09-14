import {
  SecureField,
  Text,
  TextField,
  VStack,
  useNativeState,
  type SecureFieldRef,
  type TextFieldRef as NativeTextFieldRef,
} from '@expo/ui/swift-ui';
import {
  autocorrectionDisabled,
  disabled,
  font,
  foregroundStyle,
  frame,
  keyboardType as keyboardTypeModifier,
  kerning,
  lineLimit,
  multilineTextAlignment,
  onGeometryChange,
  onSubmit,
  opacity,
  submitLabel,
  textContentType,
  textFieldStyle,
  textInputAutocapitalization,
  tint,
  type ModifierConfig,
} from '@expo/ui/swift-ui/modifiers';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';

import { useThemeTokens } from '@/hooks/use-theme';

import type { TextInputProps, TextInputRef } from './text-input.types';

type SwiftUIKeyboardType = Parameters<typeof keyboardTypeModifier>[0];
type SwiftUISubmitLabel = Parameters<typeof submitLabel>[0];
type SwiftUITextContentType = Parameters<typeof textContentType>[0];

function mapKeyboardType(value: KeyboardTypeOptions): SwiftUIKeyboardType {
  if (value === 'numeric') return 'decimal-pad';
  if (value === 'number-pad') return 'numeric';
  if (value === 'visible-password') return 'default';
  return value as SwiftUIKeyboardType;
}

function inputModeToKeyboardType(inputMode: TextInputProps['inputMode']): KeyboardTypeOptions {
  switch (inputMode) {
    case 'decimal':
      return 'decimal-pad';
    case 'numeric':
      return 'number-pad';
    case 'tel':
      return 'phone-pad';
    case 'email':
      return 'email-address';
    case 'url':
      return 'url';
    default:
      return 'default';
  }
}

function mapReturnKeyType(value: ReturnKeyTypeOptions): SwiftUISubmitLabel {
  if (value === 'google' || value === 'yahoo') return 'search';
  if (value === 'default' || value === 'none' || value === 'previous' || value === 'emergency-call') {
    return 'return';
  }
  return value as SwiftUISubmitLabel;
}

function resolveReturnKeyType({
  enterKeyHint,
  returnKeyType,
}: Pick<TextInputProps, 'enterKeyHint' | 'returnKeyType'>): ReturnKeyTypeOptions | undefined {
  if (returnKeyType) return returnKeyType;
  if (!enterKeyHint) return undefined;
  return enterKeyHint === 'enter' ? 'default' : enterKeyHint;
}

const AUTO_COMPLETE_TO_TEXT_CONTENT_TYPE: Partial<
  Record<NonNullable<TextInputProps['autoComplete']>, SwiftUITextContentType>
> = {
  'current-password': 'password',
  email: 'emailAddress',
  'family-name': 'familyName',
  'given-name': 'givenName',
  'new-password': 'newPassword',
  'one-time-code': 'oneTimeCode',
  tel: 'telephoneNumber',
  url: 'URL',
  username: 'username',
  'username-new': 'username',
};

function mapFontWeight(weight: NonNullable<TextInputProps['textStyle']>['fontWeight']) {
  switch (weight) {
    case '100':
    case '200':
      return 'ultraLight' as const;
    case '300':
      return 'light' as const;
    case '500':
      return 'medium' as const;
    case '600':
      return 'semibold' as const;
    case '700':
    case 'bold':
      return 'bold' as const;
    case '800':
      return 'heavy' as const;
    case '900':
      return 'black' as const;
    default:
      return 'regular' as const;
  }
}

export const TextInput = forwardRef<TextInputRef, TextInputProps>(function TextInput(
  {
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    caretHidden,
    cursorColor,
    defaultValue = '',
    editable,
    enterKeyHint,
    error,
    fullWidth = true,
    helperText,
    inputMode,
    keyboardType,
    label,
    maxLength,
    modifiers,
    multiline = false,
    numberOfLines,
    onBlur,
    onChangeText,
    onContentSizeChange,
    onFocus,
    onSelectionChange,
    onSubmitEditing,
    placeholder,
    placeholderTextColor,
    readOnly,
    returnKeyType,
    rows,
    secureTextEntry,
    selection,
    selectionColor,
    selectTextOnFocus,
    style,
    testID,
    textAlign,
    textStyle,
    value,
  },
  ref,
) {
  const theme = useThemeTokens();
  const initialValue = useRef(value ?? defaultValue).current;
  const nativeValue = useNativeState(initialValue);
  const textFieldRef = useRef<NativeTextFieldRef>(null);
  const secureFieldRef = useRef<SecureFieldRef>(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (value !== undefined && nativeValue.value !== (value ?? '')) {
      nativeValue.value = value ?? '';
    }
  }, [nativeValue, value]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => void (secureTextEntry ? secureFieldRef.current : textFieldRef.current)?.focus(),
      blur: () => void (secureTextEntry ? secureFieldRef.current : textFieldRef.current)?.blur(),
      clear: () => void (secureTextEntry ? secureFieldRef.current : textFieldRef.current)?.clear(),
      isFocused: () => isFocusedRef.current,
      setSelection: (start, end) => {
        if (secureTextEntry) return Promise.resolve();
        return textFieldRef.current?.setSelection(start, end) ?? Promise.resolve();
      },
    }),
    [secureTextEntry],
  );

  const resolvedKeyboardType = keyboardType ?? inputModeToKeyboardType(inputMode);
  const resolvedReturnKeyType = resolveReturnKeyType({ enterKeyHint, returnKeyType });
  const isEditable = editable ?? !readOnly;
  const lines = numberOfLines ?? rows;
  const fieldModifiers: ModifierConfig[] = [textFieldStyle('roundedBorder')];

  if (fullWidth || typeof style?.width === 'number' || typeof style?.height === 'number') {
    fieldModifiers.push(
      frame({
        width: typeof style?.width === 'number' ? style.width : undefined,
        maxWidth: fullWidth && typeof style?.width !== 'number' ? Infinity : undefined,
        height: typeof style?.height === 'number' ? style.height : undefined,
      }),
    );
  }
  if (typeof style?.opacity === 'number') fieldModifiers.push(opacity(style.opacity));
  if (!isEditable) fieldModifiers.push(disabled(true));
  fieldModifiers.push(keyboardTypeModifier(mapKeyboardType(resolvedKeyboardType)));
  if (autoCapitalize) {
    fieldModifiers.push(
      textInputAutocapitalization(autoCapitalize === 'none' ? 'never' : autoCapitalize),
    );
  }
  if (autoCorrect === false) fieldModifiers.push(autocorrectionDisabled(true));
  if (resolvedReturnKeyType) fieldModifiers.push(submitLabel(mapReturnKeyType(resolvedReturnKeyType)));
  if (onSubmitEditing) fieldModifiers.push(onSubmit(() => onSubmitEditing(nativeValue.value)));
  if (caretHidden) fieldModifiers.push(tint('transparent'));
  else if (selectionColor || cursorColor) fieldModifiers.push(tint(selectionColor ?? cursorColor!));
  if (textAlign === 'left') fieldModifiers.push(multilineTextAlignment('leading'));
  else if (textAlign === 'right') fieldModifiers.push(multilineTextAlignment('trailing'));
  else if (textAlign === 'center') fieldModifiers.push(multilineTextAlignment('center'));
  if (multiline && lines && lines > 0) fieldModifiers.push(lineLimit(lines, { reservesSpace: true }));
  if (autoComplete && AUTO_COMPLETE_TO_TEXT_CONTENT_TYPE[autoComplete]) {
    fieldModifiers.push(textContentType(AUTO_COMPLETE_TO_TEXT_CONTENT_TYPE[autoComplete]!));
  }
  if (onContentSizeChange) fieldModifiers.push(onGeometryChange(onContentSizeChange));
  if (textStyle?.color) fieldModifiers.push(foregroundStyle(textStyle.color));
  if (textStyle?.fontSize || textStyle?.fontFamily || textStyle?.fontWeight) {
    fieldModifiers.push(
      font({
        family: textStyle.fontFamily,
        size: textStyle.fontSize,
        weight: mapFontWeight(textStyle.fontWeight),
      }),
    );
  }
  if (textStyle?.letterSpacing !== undefined) fieldModifiers.push(kerning(textStyle.letterSpacing));
  fieldModifiers.push(...((modifiers ?? []) as ModifierConfig[]));

  const handleFocusChange = (focused: boolean) => {
    isFocusedRef.current = focused;
    if (focused && selectTextOnFocus && !secureTextEntry) {
      void textFieldRef.current?.setSelection(0, nativeValue.value.length);
    }
    if (focused) onFocus?.();
    else onBlur?.();
  };

  const field = secureTextEntry ? (
    <SecureField
      ref={secureFieldRef}
      text={nativeValue}
      placeholder={placeholder}
      autoFocus={autoFocus}
      maxLength={maxLength}
      onTextChange={onChangeText}
      onFocusChange={handleFocusChange}
      modifiers={fieldModifiers}
      testID={testID}>
      {placeholderTextColor && placeholder ? (
        <SecureField.Placeholder>
          <Text modifiers={[foregroundStyle(placeholderTextColor)]}>{placeholder}</Text>
        </SecureField.Placeholder>
      ) : null}
    </SecureField>
  ) : (
    <TextField
      ref={textFieldRef}
      text={nativeValue}
      placeholder={placeholder}
      autoFocus={autoFocus}
      maxLength={maxLength}
      axis={multiline ? 'vertical' : 'horizontal'}
      selection={selection as Parameters<typeof TextField>[0]['selection']}
      onSelectionChange={onSelectionChange}
      onTextChange={onChangeText}
      onFocusChange={handleFocusChange}
      modifiers={fieldModifiers}
      testID={testID}>
      {placeholderTextColor && placeholder ? (
        <TextField.Placeholder>
          <Text modifiers={[foregroundStyle(placeholderTextColor)]}>{placeholder}</Text>
        </TextField.Placeholder>
      ) : null}
    </TextField>
  );

  const message = error ?? helperText;
  return (
    <VStack
      spacing={theme.space(1.5)}
      alignment={textAlign === 'right' ? 'trailing' : 'leading'}
      modifiers={fullWidth ? [frame({ maxWidth: Infinity })] : undefined}>
      {label ? (
        <Text
          modifiers={[
            font({ textStyle: 'footnote', weight: 'semibold' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
          ]}>
          {label}
        </Text>
      ) : null}
      {field}
      {message ? (
        <Text
          modifiers={[
            font({ textStyle: 'caption' }),
            foregroundStyle(
              error
                ? theme.colors.destructive
                : { type: 'hierarchical', style: 'secondary' },
            ),
          ]}>
          {message}
        </Text>
      ) : null}
    </VStack>
  );
});

export type { TextInputProps, TextInputRef } from './text-input.types';
