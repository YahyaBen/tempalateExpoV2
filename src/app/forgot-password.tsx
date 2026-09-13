import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { OtpSheet } from '@/components/auth/otp-sheet';
import { useThemeTokens } from '@/hooks/use-theme';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/resolvers/forgot-password.resolver';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [isOtpPresented, setIsOtpPresented] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(_data: ForgotPasswordFormValues) {
    setIsOtpPresented(true);
  }

  return (
    <>
      <AuthScreen
        eyebrow={t('auth.recoveryEyebrow')}
        description={t('auth.forgotPasswordSubtitle')}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <AuthField
              label={t('auth.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email ? t(errors.email.message!) : undefined}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

        <AuthButton label={t('auth.sendVerificationCode')} onPress={handleSubmit(onSubmit)} />

        <Text
          style={[
            theme.typography.semantic.label,
            { color: theme.colors.mutedForeground, textAlign: 'center' },
          ]}>
          {t('auth.localOtpNotice')}
        </Text>
      </AuthScreen>

      <OtpSheet
        isPresented={isOtpPresented}
        email={getValues('email')}
        purpose="password-reset"
        onDismiss={() => setIsOtpPresented(false)}
        onVerified={(code) => {
          setIsOtpPresented(false);
          router.push({
            pathname: '/reset-password',
            params: { email: getValues('email'), code, challengeId: 'local-challenge' },
          });
        }}
      />
    </>
  );
}
