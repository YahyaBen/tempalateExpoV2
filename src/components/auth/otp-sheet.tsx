import { BottomSheet, Button, Column, Text, TextInput, useNativeState, type TextInputRef } from '@expo/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UniversalHost } from '@/components/ui/universal-host';
import {
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function OtpSheet({
  isPresented,
  email,
  purpose,
  onDismiss,
  onVerified,
  onResend,
  errorMessage,
  isVerifying = false,
  isResending = false,
}: {
  isPresented: boolean;
  email: string;
  purpose: 'registration' | 'password-reset';
  onDismiss: () => void;
  onVerified: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  errorMessage?: string | string[] | null;
  isVerifying?: boolean;
  isResending?: boolean;
}) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();
  const inputRef = useRef<TextInputRef>(null);
  const nativeCode = useNativeState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isPresented) return;
    const focusTimer = setTimeout(
      () => inputRef.current?.focus(),
      theme.components.otpInput.focusDelay,
    );
    return () => clearTimeout(focusTimer);
  }, [isPresented, theme.components.otpInput.focusDelay]);

  function clearCode() {
    inputRef.current?.clear();
    setCode('');
  }

  function dismiss() {
    clearCode();
    setError('');
    setNotice('');
    onDismiss();
  }

  async function verify() {
    if (code.length !== theme.components.otpInput.length) {
      setError('auth.codeInvalid');
      return;
    }
    try {
      await onVerified(code);
      clearCode();
      setError('');
      setNotice('');
    } catch {
      // The mutation error is displayed below and the code stays editable.
    }
  }

  async function resend() {
    if (!onResend) return;

    try {
      await onResend();
      clearCode();
      setError('');
      setNotice('auth.codeResent');
      inputRef.current?.focus();
    } catch {
      setNotice('');
    }
  }

  const apiError = Array.isArray(errorMessage) ? errorMessage.join('\n') : errorMessage;
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  return (
    <UniversalHost matchContents>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={dismiss}
        contentPadding={{
          top: theme.space(3),
          left: theme.space(6),
          right: theme.space(6),
          bottom: theme.space(8),
        }}
        containerColor={theme.colors.card}>
        <Column
          spacing={theme.space(6)}
          alignment={isRTL ? 'end' : 'start'}
          modifiers={fillWidthModifiers}
          style={fillWidthStyle({ paddingVertical: theme.space(2) })}>
          <Column spacing={theme.space(2)} alignment={isRTL ? 'end' : 'start'}>
            <Text
              textStyle={{
                ...theme.typography.semantic.title,
                color: theme.colors.foreground,
                textAlign,
              }}>
              {t('auth.recoveryEmailSentTitle')}
            </Text>
            <Text
              textStyle={{
                ...theme.typography.semantic.subhead,
                color: theme.colors.mutedForeground,
                textAlign,
              }}>
              {t(
                purpose === 'registration'
                  ? 'auth.otpRegistrationDescription'
                  : 'auth.otpResetDescription',
                { email },
              )}
            </Text>
          </Column>

          <TextInput
            ref={inputRef}
            value={nativeCode}
            onChangeText={(value) => {
              const nextCode = value.replace(/\D/g, '').slice(0, theme.components.otpInput.length);
              setCode(nextCode);
              setError('');
              setNotice('');
            }}
            onSubmitEditing={() => void verify()}
            keyboardType="number-pad"
            returnKeyType="done"
            autoComplete="one-time-code"
            maxLength={theme.components.otpInput.length}
            placeholder={t('auth.verificationCode')}
            placeholderTextColor={theme.colors.mutedForeground}
            cursorColor={theme.colors.primary}
            selectionColor={theme.colors.primary}
            textAlign="center"
            modifiers={fillWidthModifiers}
            style={fillWidthStyle({
              height: theme.controlHeight.lg,
              paddingHorizontal: theme.space(4),
              borderRadius: theme.radius.xlarge,
              borderWidth: theme.components.otpInput.borderWidth,
              borderColor: error ? theme.colors.destructive : theme.colors.primary,
              backgroundColor: theme.colors.content2,
            })}
            textStyle={{
              ...theme.typography.semantic.title,
              color: theme.colors.foreground,
              textAlign: 'center',
              letterSpacing: theme.space(2),
            }}
          />

          {error || apiError || notice ? (
            <Text
              textStyle={{
                ...theme.typography.semantic.caption,
                color: error || apiError ? theme.colors.destructive : theme.colors.success,
                textAlign,
              }}>
              {error ? t(error) : apiError || t(notice)}
            </Text>
          ) : null}

          <Column
            spacing={theme.space(3)}
            modifiers={fillWidthModifiers}
            style={fillWidthStyle()}>
            <Button
              label={isVerifying ? t('auth.checkingCode') : t('auth.verifyCode')}
              disabled={
                isVerifying || isResending || code.length !== theme.components.otpInput.length
              }
              onPress={() => void verify()}
              modifiers={fillWidthModifiers}
              style={fillWidthStyle({
                height: theme.controlHeight.lg,
                borderRadius: theme.radius.xlarge,
                backgroundColor: theme.colors.primary,
              })}
            />
            {onResend ? (
              <Button
                variant="text"
                label={t('auth.resendCode')}
                disabled={isVerifying || isResending}
                onPress={() => void resend()}
              />
            ) : null}
          </Column>
        </Column>
      </BottomSheet>
    </UniversalHost>
  );
}
