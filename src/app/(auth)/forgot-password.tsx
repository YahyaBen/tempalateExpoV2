import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthErrorMessage } from '@/components/auth/auth-error-message';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { OtpSheet } from '@/components/auth/otp-sheet';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/resolvers/forgot-password.resolver';
import { getApiErrorMessage } from '@/services/api.error';
import { authService } from '@/services/auth/auth.service';

type PasswordResetChallenge = {
  challengeId: string;
  email: string;
};

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [isOtpPresented, setIsOtpPresented] = useState(false);
  const [challenge, setChallenge] = useState<PasswordResetChallenge | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const forgotMutation = useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: async ({ email }: ForgotPasswordFormValues) => {
      const response = await authService.forgotPassword(email);
      if (!response.challengeId) {
        throw new Error('The recovery response did not include a challenge.');
      }
      return { challengeId: response.challengeId, email } satisfies PasswordResetChallenge;
    },
    onSuccess: (nextChallenge) => {
      setChallenge(nextChallenge);
      setIsOtpPresented(true);
    },
  });

  const resendMutation = useMutation({
    mutationKey: ['auth', 'forgot-password', 'resend'],
    mutationFn: async () => {
      if (!challenge) throw new Error('The recovery challenge has expired.');
      const response = await authService.forgotPassword(challenge.email);
      if (!response.challengeId) {
        throw new Error('The recovery response did not include a challenge.');
      }
      setChallenge({ ...challenge, challengeId: response.challengeId });
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    forgotMutation.mutate(data);
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
              onSubmitEditing={() => void handleSubmit(onSubmit)()}
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

        <AuthErrorMessage
          message={
            forgotMutation.error
              ? getApiErrorMessage(forgotMutation.error)
              : null
          }
        />

        <AuthButton
          label={t('auth.sendVerificationCode')}
          disabled={forgotMutation.isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </AuthScreen>

      <OtpSheet
        isPresented={isOtpPresented}
        email={challenge?.email ?? getValues('email')}
        purpose="password-reset"
        isResending={resendMutation.isPending}
        errorMessage={
          resendMutation.error ? getApiErrorMessage(resendMutation.error) : null
        }
        onDismiss={() => {
          setIsOtpPresented(false);
          setChallenge(null);
          resendMutation.reset();
        }}
        onVerified={(code) => {
          if (!challenge) return;
          setIsOtpPresented(false);
          router.push({
            pathname: '/reset-password',
            params: {
              email: challenge.email,
              code,
              challengeId: challenge.challengeId,
            },
          });
        }}
        onResend={() => resendMutation.mutateAsync()}
      />
    </>
  );
}
