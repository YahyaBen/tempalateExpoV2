import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  Button,
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Text,
  TextInput,
  UniversalHost,
  type TextInputRef,
} from '@/components/ui/universal';
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
              semantic="default"
              textStyle={{
                ...theme.typography.semantic.title,
                textAlign,
              }}>
              {t('auth.recoveryEmailSentTitle')}
            </Text>
            <Text
              semantic="muted"
              textStyle={{
                ...theme.typography.semantic.subhead,
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
            value={code}
            error={error ? t(error) : apiError || undefined}
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
            textAlign="center"
            textStyle={{
              ...theme.typography.semantic.title,
              textAlign: 'center',
              letterSpacing: theme.space(2),
            }}
          />

          {notice ? (
            <Text
              semantic="success"
              textStyle={{
                ...theme.typography.semantic.caption,
                textAlign,
              }}>
              {t(notice)}
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
              fullWidth
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
