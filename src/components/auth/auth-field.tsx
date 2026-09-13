import {
  Button,
  Column,
  Row,
  Spacer,
  Text,
  TextInput,
  useNativeState,
  type TextInputProps,
  type UniversalStyle,
} from '@expo/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

type AuthFieldProps = Omit<TextInputProps, 'value' | 'style' | 'textStyle'> & {
  label: string;
  value?: string;
  error?: string;
  containerStyle?: UniversalStyle;
};

export function AuthField({
  label,
  value = '',
  error,
  containerStyle,
  secureTextEntry,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}: AuthFieldProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();
  const nativeValue = useNativeState(value);
  const [focused, setFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <Column
      spacing={theme.space(2)}
      alignment={isRTL ? 'end' : 'start'}
      modifiers={fillWidthModifiers}
      style={fillWidthStyle(containerStyle)}>
      <Row alignment="center" modifiers={fillWidthModifiers} style={fillWidthStyle()}>
        <Text
          textStyle={{
            ...theme.typography.semantic.label,
            color: theme.colors.foreground,
            textAlign: isRTL ? 'right' : 'left',
          }}>
          {label}
        </Text>
        {secureTextEntry ? (
          <>
            <Spacer flexible />
            <Button
              variant="text"
              label={isSecure ? t('auth.showPassword') : t('auth.hidePassword')}
              onPress={() => setIsSecure((current) => !current)}>
              <Text
                textStyle={{
                  ...theme.typography.semantic.link,
                  color: theme.colors.primary,
                }}>
                {isSecure ? t('auth.show') : t('auth.hide')}
              </Text>
            </Button>
          </>
        ) : null}
      </Row>

      <TextInput
        {...props}
        value={nativeValue}
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        placeholderTextColor={theme.colors.mutedForeground}
        cursorColor={theme.colors.primary}
        selectionColor={theme.colors.primary}
        textAlign={isRTL ? 'right' : 'left'}
        modifiers={fillWidthModifiers}
        style={fillWidthStyle({
          height: theme.controlHeight.lg,
          paddingHorizontal: theme.space(4),
          backgroundColor: theme.colors.content2,
          borderColor: error
            ? theme.colors.destructive
            : focused
              ? theme.colors.primary
              : theme.colors.border,
          borderWidth: theme.components.textInput.borderWidth,
          borderRadius: theme.radius.xlarge,
        })}
        textStyle={{
          ...theme.typography.semantic.body,
          color: theme.colors.foreground,
          textAlign: isRTL ? 'right' : 'left',
        }}
      />

      {error ? (
        <Text
          textStyle={{
            ...theme.typography.semantic.caption,
            color: theme.colors.destructive,
            textAlign: isRTL ? 'right' : 'left',
          }}>
          {error}
        </Text>
      ) : null}
    </Column>
  );
}
