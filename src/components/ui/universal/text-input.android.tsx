import {
  Text,
  TextField,
  useNativeState,
  type TextFieldImeAction,
  type TextFieldKeyboardType,
  type TextFieldRef as NativeTextFieldRef,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  onSizeChanged,
  semantics,
  testID as testIDModifier,
} from '@expo/ui/jetpack-compose/modifiers';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';

import type { TextInputProps, TextInputRef } from './text-input.types';

function mapKeyboardType(value: KeyboardTypeOptions): TextFieldKeyboardType {
  switch (value) {
    case 'email-address':
      return 'email';
    case 'numeric':
    case 'decimal-pad':
      return 'decimal';
    case 'number-pad':
      return 'number';
    case 'phone-pad':
      return 'phone';
    case 'url':
      return 'uri';
    case 'ascii-capable':
      return 'ascii';
    default:
      return 'text';
  }
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

function mapReturnKeyType(value: ReturnKeyTypeOptions): TextFieldImeAction {
  if (value === 'google' || value === 'yahoo') return 'search';
  if (value === 'join' || value === 'route' || value === 'emergency-call') return 'default';
  return value as TextFieldImeAction;
}

function resolveReturnKeyType({
  enterKeyHint,
  returnKeyType,
}: Pick<TextInputProps, 'enterKeyHint' | 'returnKeyType'>): ReturnKeyTypeOptions | undefined {
  if (returnKeyType) return returnKeyType;
  if (!enterKeyHint) return undefined;
  return enterKeyHint === 'enter' ? 'default' : enterKeyHint;
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
    selectionHandleColor,
    selectTextOnFocus,
    style: _style,
    testID,
    textAlign,
    textStyle,
    value,
  },
  ref,
) {
  const initialValue = useRef(value ?? defaultValue).current;
  const nativeValue = useNativeState(initialValue);
  const nativeRef = useRef<NativeTextFieldRef>(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (value !== undefined && nativeValue.value !== (value ?? '')) {
      nativeValue.value = value ?? '';
    }
  }, [nativeValue, value]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => void nativeRef.current?.focus(),
      blur: () => void nativeRef.current?.blur(),
      clear: () => void nativeRef.current?.clear(),
      isFocused: () => isFocusedRef.current,
      setSelection: (start, end) =>
        nativeRef.current?.setSelection(start, end) ?? Promise.resolve(),
    }),
    [],
  );

  const resolvedKeyboardType = keyboardType ?? inputModeToKeyboardType(inputMode);
  const resolvedReturnKeyType = resolveReturnKeyType({ enterKeyHint, returnKeyType });
  const isEditable = editable ?? !readOnly;
  const lines = numberOfLines ?? rows;
  const message = error ?? helperText;
  const keyboardActions = onSubmitEditing
    ? {
        onDone: onSubmitEditing,
        onGo: onSubmitEditing,
        onNext: onSubmitEditing,
        onPrevious: onSubmitEditing,
        onSearch: onSubmitEditing,
        onSend: onSubmitEditing,
      }
    : undefined;

  return (
    <TextField
      ref={nativeRef}
      value={nativeValue}
      readOnly={!isEditable}
      autoFocus={autoFocus}
      singleLine={!multiline}
      minLines={multiline && lines ? lines : undefined}
      maxLines={multiline && lines ? lines : undefined}
      maxLength={maxLength}
      visualTransformation={secureTextEntry ? 'password' : undefined}
      isError={Boolean(error)}
      keyboardOptions={{
        capitalization: autoCapitalize,
        autoCorrectEnabled: autoCorrect,
        keyboardType: mapKeyboardType(resolvedKeyboardType),
        imeAction: resolvedReturnKeyType ? mapReturnKeyType(resolvedReturnKeyType) : undefined,
      }}
      keyboardActions={keyboardActions}
      onValueChange={onChangeText}
      onFocusChanged={(focused) => {
        isFocusedRef.current = focused;
        if (focused && selectTextOnFocus) {
          void nativeRef.current?.setSelection(0, nativeValue.value.length);
        }
        if (focused) onFocus?.();
        else onBlur?.();
      }}
      selection={selection as Parameters<typeof TextField>[0]['selection']}
      onSelectionChange={onSelectionChange}
      textSelectionColors={
        selectionColor || selectionHandleColor
          ? {
              handleColor: selectionHandleColor ?? selectionColor,
              backgroundColor: selectionColor,
            }
          : undefined
      }
      textStyle={{
        ...textStyle,
        ...(textAlign && textAlign !== 'auto' ? { textAlign } : null),
      }}
      colors={{
        cursorColor: caretHidden ? 'transparent' : (cursorColor ?? selectionColor),
        focusedPlaceholderColor: placeholderTextColor,
        unfocusedPlaceholderColor: placeholderTextColor,
      }}
      modifiers={[
        ...(fullWidth ? [fillMaxWidth()] : []),
        ...(modifiers ?? []),
        ...(testID ? [testIDModifier(testID)] : []),
        ...(autoComplete ? [semantics({ contentType: autoComplete })] : []),
        ...(onContentSizeChange ? [onSizeChanged(onContentSizeChange)] : []),
      ]}>
      {label ? (
        <TextField.Label>
          <Text>{label}</Text>
        </TextField.Label>
      ) : null}
      {placeholder ? (
        <TextField.Placeholder>
          <Text color={placeholderTextColor as string | undefined}>{placeholder}</Text>
        </TextField.Placeholder>
      ) : null}
      {message ? (
        <TextField.SupportingText>
          <Text>{message}</Text>
        </TextField.SupportingText>
      ) : null}
    </TextField>
  );
});

export type { TextInputProps, TextInputRef } from './text-input.types';
