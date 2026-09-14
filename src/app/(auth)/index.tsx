import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthErrorMessage } from '@/components/auth/auth-error-message';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { GoogleButton } from '@/components/auth/google-button';
import { OtpSheet } from '@/components/auth/otp-sheet';
import {
  Button,
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Row,
  Spacer,
  Text,
} from '@/components/ui/universal';
import { useThemeTokens } from '@/hooks/use-theme';
import { loginSchema, type LoginFormValues } from '@/resolvers/login.resolver';
import { getApiErrorMessage } from '@/services/api.error';
import { authService } from '@/services/auth/auth.service';
import { setAuthSession } from '@/services/auth/auth.session';
import { getDeviceMetadata } from '@/services/auth/device-installation';
import {
  acquireGoogleIdToken,
  isGoogleConfigurationError,
  isGooglePlayServicesError,
} from '@/services/auth/google-sign-in';

type LoginChallenge = {
  challengeId: string;
  displayEmail: string;
  resendEmail: string | null;
};

export default function LoginScreen() {
  const { t } = useTranslation();
  const { registered, reset } = useLocalSearchParams<{ registered?: string; reset?: string }>();
  const theme = useThemeTokens();
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);

  const noticeKey = registered
    ? 'auth.accountReady'
    : reset
      ? 'auth.passwordUpdatedSignIn'
      : '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (values: LoginFormValues) => {
      const response = await authService.login({
        ...values,
        ...(await getDeviceMetadata()),
      });

      if (response.loginResponse) {
        await setAuthSession(response.loginResponse);
        return null;
      }

      if (!response.challengeId) {
        throw new Error('The login response did not include a session or verification challenge.');
      }

      return {
        challengeId: response.challengeId,
        displayEmail: response.maskedEmail || values.login,
        resendEmail: values.login.includes('@') ? values.login : null,
      } satisfies LoginChallenge;
    },
    onSuccess: setChallenge,
  });

  const confirmMutation = useMutation({
    mutationKey: ['auth', 'confirm-registration'],
    mutationFn: async (code: string) => {
      if (!challenge) throw new Error('The verification challenge has expired.');

      const response = await authService.confirmRegistration({
        challengeId: challenge.challengeId,
        code,
        ...(await getDeviceMetadata()),
      });

      if (!response.loginResponse) {
        throw new Error('Verification succeeded without returning a session.');
      }

      await setAuthSession(response.loginResponse);
    },
  });

  const resendMutation = useMutation({
    mutationKey: ['auth', 'resend-registration'],
    mutationFn: async () => {
      if (!challenge?.resendEmail) return;
      const response = await authService.resendRegistration(challenge.resendEmail);
      if (!response.challengeId) {
        throw new Error('The resend response did not include a verification challenge.');
      }
      setChallenge({
        ...challenge,
        challengeId: response.challengeId,
        displayEmail: response.maskedEmail || challenge.displayEmail,
      });
    },
  });

  const googleMutation = useMutation({
    mutationKey: ['auth', 'google'],
    mutationFn: async () => {
      const idToken = await acquireGoogleIdToken();
      if (!idToken) return;
      const token = await authService.googleSignIn({
        idToken,
        ...(await getDeviceMetadata()),
      });
      await setAuthSession(token);
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  const googleError = googleMutation.error
    ? isGoogleConfigurationError(googleMutation.error)
      ? t('auth.googleConfigurationError')
      : isGooglePlayServicesError(googleMutation.error)
        ? t('auth.googlePlayServicesUnavailable')
        : getApiErrorMessage(googleMutation.error)
    : null;

  const isSubmitting = loginMutation.isPending || googleMutation.isPending;

  return (
    <>
    <AuthScreen
      eyebrow={t('auth.loginEyebrow')}
      description={t('auth.loginDescription')}
      footer={
        <Row spacing={theme.space(1)} alignment="center">
          <Spacer flexible />
          <Text semantic="muted">
            {t('auth.noAccount')}
          </Text>
          <Button
            variant="text"
            label={t('auth.signUp')}
            onPress={() => router.push('/register')}
          />
          <Spacer flexible />
        </Row>
      }>
      <GoogleButton
        label={t('auth.continueWithGoogle')}
        disabled={isSubmitting}
        onPress={() => googleMutation.mutate()}
      />

      <Row
        spacing={theme.space(3)}
        alignment="center"
        modifiers={fillWidthModifiers}
        style={fillWidthStyle()}>
        <Spacer flexible />
        <Text semantic="muted" textStyle={theme.typography.semantic.caption}>
          {t('auth.continueWithEmail')}
        </Text>
        <Spacer flexible />
      </Row>

      <Column
        spacing={theme.space(4)}
        modifiers={fillWidthModifiers}
        style={fillWidthStyle()}>
        <Controller
          control={control}
          name="login"
          render={({ field: { value, onChange, onBlur } }) => (
            <AuthField
              label={t('auth.identity')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.login ? t(errors.login.message!) : undefined}
              autoCapitalize="none"
              autoComplete="username"
              returnKeyType="next"
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

        <Column
          spacing={theme.space(2)}
          alignment="end"
          modifiers={fillWidthModifiers}
          style={fillWidthStyle()}>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                label={t('auth.password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password ? t(errors.password.message!) : undefined}
                secureTextEntry
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                placeholder={t('auth.passwordPlaceholder')}
              />
            )}
          />
          <Button
            variant="text"
            label={t('auth.forgotPassword')}
            onPress={() => router.push('/forgot-password')}
          />
        </Column>
      </Column>

      {noticeKey ? (
        <Text
          semantic="success"
          textStyle={theme.typography.semantic.label}>
          {t(noticeKey)}
        </Text>
      ) : null}

      <AuthErrorMessage
        message={
          loginMutation.error
            ? getApiErrorMessage(loginMutation.error)
            : googleError
        }
      />

      <AuthButton
        label={isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthScreen>

    <OtpSheet
      isPresented={challenge !== null}
      email={challenge?.displayEmail ?? ''}
      purpose="registration"
      isVerifying={confirmMutation.isPending}
      isResending={resendMutation.isPending}
      errorMessage={
        confirmMutation.error
          ? getApiErrorMessage(confirmMutation.error)
          : resendMutation.error
            ? getApiErrorMessage(resendMutation.error)
            : null
      }
      onDismiss={() => {
        setChallenge(null);
        confirmMutation.reset();
        resendMutation.reset();
      }}
      onVerified={(code) => confirmMutation.mutateAsync(code)}
      onResend={challenge?.resendEmail ? () => resendMutation.mutateAsync() : undefined}
    />
    </>
  );
}
