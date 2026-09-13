import { BottomSheet, RNHostView } from '@expo/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function OtpSheet({
  isPresented,
  email,
  purpose,
  onDismiss,
  onVerified,
}: {
  isPresented: boolean;
  email: string;
  purpose: 'registration' | 'password-reset';
  onDismiss: () => void;
  onVerified: (code: string) => void;
}) {
  const { t } = useTranslation();
  const { direction, isRTL } = useLanguage();
  const theme = useThemeTokens();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isPresented) return;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), theme.components.otpInput.focusDelay);
    return () => clearTimeout(focusTimer);
  }, [isPresented, theme.components.otpInput.focusDelay]);

  function dismiss() {
    setCode('');
    setError('');
    setNotice('');
    onDismiss();
  }

  function verify() {
    if (code.length !== theme.components.otpInput.length) {
      setError('auth.codeInvalid');
      return;
    }
    const verifiedCode = code;
    setCode('');
    setError('');
    setNotice('');
    onVerified(verifiedCode);
  }

  return (
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
      <RNHostView matchContents>
        <View
          style={{
            minHeight: theme.components.otpInput.sheetMinHeight,
            width: '100%',
            maxWidth: theme.contentWidth.compact,
            alignSelf: 'center',
            marginHorizontal: 'auto',
            direction,
            gap: theme.space(6),
          }}>
          <View style={{ gap: theme.space(2) }}>
            <Text
              style={[
                theme.typography.semantic.title,
                {
                  color: theme.colors.foreground,
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: direction,
                },
              ]}>
              {t('auth.recoveryEmailSentTitle')}
            </Text>
            <Text
              selectable
              style={[
                theme.typography.semantic.subhead,
                {
                  color: theme.colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: direction,
                },
              ]}>
              {t(
                purpose === 'registration'
                  ? 'auth.otpRegistrationDescription'
                  : 'auth.otpResetDescription',
                { email },
              )}
            </Text>
          </View>

          <Pressable accessibilityRole="none" onPress={() => inputRef.current?.focus()} style={{ position: 'relative' }}>
            <View style={{ flexDirection: 'row', gap: theme.space(2), justifyContent: 'space-between' }}>
              {Array.from({ length: theme.components.otpInput.length }, (_, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    maxWidth: theme.components.otpInput.cellMaxWidth,
                    aspectRatio: theme.components.otpInput.cellAspectRatio,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: theme.components.otpInput.cellRadius,
                    borderCurve: 'continuous',
                    borderWidth: theme.components.otpInput.borderWidth,
                    borderColor: error
                      ? theme.colors.destructive
                      : code.length === index
                        ? theme.colors.primary
                        : theme.colors.border,
                    backgroundColor: theme.colors.content2,
                  }}>
                  <Text
                    style={[
                      theme.typography.semantic.title,
                      { color: theme.colors.foreground, fontVariant: ['tabular-nums'] },
                    ]}>
                    {code[index] ?? ''}
                  </Text>
                </View>
              ))}
            </View>
            <TextInput
              ref={inputRef}
              accessibilityLabel={t('auth.verificationCode')}
              value={code}
              onChangeText={(value) => {
                setCode(value.replace(/\D/g, '').slice(0, theme.components.otpInput.length));
                setError('');
                setNotice('');
              }}
              onSubmitEditing={verify}
              keyboardType="number-pad"
              returnKeyType="done"
              textContentType="oneTimeCode"
              maxLength={theme.components.otpInput.length}
              caretHidden
              style={{ position: 'absolute', inset: 0, opacity: theme.opacity.hiddenInput }}
            />
          </Pressable>

          {error || notice ? (
            <Text
              selectable
              accessibilityLiveRegion="polite"
              style={[
                theme.typography.semantic.caption,
                {
                  color: error ? theme.colors.destructive : theme.colors.success,
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: direction,
                },
              ]}>
              {t(error || notice)}
            </Text>
          ) : null}

          <View style={{ gap: theme.space(3) }}>
            <AuthButton
              label={t('auth.verifyCode')}
              onPress={verify}
              disabled={code.length !== theme.components.otpInput.length}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setCode('');
                setError('');
                setNotice('auth.resendUnavailable');
                inputRef.current?.focus();
              }}
              style={({ pressed }) => ({
                alignSelf: 'center',
                padding: theme.space(2),
                opacity: pressed ? theme.opacity.pressed : 1,
              })}>
              <Text style={[theme.typography.semantic.link, { color: theme.colors.primary }]}>
                {t('auth.resendCode')}
              </Text>
            </Pressable>
          </View>
        </View>
      </RNHostView>
    </BottomSheet>
  );
}
