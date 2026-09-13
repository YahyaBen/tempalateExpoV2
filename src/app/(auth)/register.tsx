import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Column, Row, Spacer, Text } from '@expo/ui';
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
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';
import { registerSchema, type RegisterFormValues } from '@/resolvers/register.resolver';
import { getApiErrorMessage } from '@/services/api.error';
import { authService } from '@/services/auth/auth.service';
import { setAuthSession } from '@/services/auth/auth.session';
import { getDeviceMetadata } from '@/services/auth/device-installation';
import {
  acquireGoogleIdToken,
  isGoogleConfigurationError,
  isGooglePlayServicesError,
} from '@/services/auth/google-sign-in';

type RegistrationChallenge = {
  challengeId: string;
  email: string;
};

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const theme = useThemeTokens();
  const [isOtpPresented, setIsOtpPresented] = useState(false);
  const [challenge, setChallenge] = useState<RegistrationChallenge | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: async (values: RegisterFormValues) => {
      const { confirmPassword: _confirmPassword, ...form } = values;
      const response = await authService.register({
        ...form,
        firstName: form.firstName ?? '',
        lastName: form.lastName ?? '',
        preferredLanguage: language,
      });

      if (response.loginResponse) {
        await setAuthSession(response.loginResponse);
        return null;
      }

      if (!response.challengeId) {
        throw new Error('The registration response did not include a verification challenge.');
      }

      return {
        challengeId: response.challengeId,
        email: values.email,
      } satisfies RegistrationChallenge;
    },
    onSuccess: (nextChallenge) => {
      if (!nextChallenge) return;
      setChallenge(nextChallenge);
      setIsOtpPresented(true);
    },
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
      if (!challenge) throw new Error('The verification challenge has expired.');
      const response = await authService.resendRegistration(challenge.email);
      if (!response.challengeId) {
        throw new Error('The resend response did not include a verification challenge.');
      }
      setChallenge({ challengeId: response.challengeId, email: challenge.email });
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

  function onSubmit(data: RegisterFormValues) {
    registerMutation.mutate(data);
  }

  const googleError = googleMutation.error
    ? isGoogleConfigurationError(googleMutation.error)
      ? t('auth.googleConfigurationError')
      : isGooglePlayServicesError(googleMutation.error)
        ? t('auth.googlePlayServicesUnavailable')
        : getApiErrorMessage(googleMutation.error)
    : null;

  const isSubmitting = registerMutation.isPending || googleMutation.isPending;

  return (
    <>
      <AuthScreen
        eyebrow={t('auth.registerEyebrow')}
        description={t('auth.signUpSubtitle')}>
        <GoogleButton
          label={t('auth.signUpWithGoogle')}
          disabled={isSubmitting}
          onPress={() => googleMutation.mutate()}
        />

        <Row
          spacing={theme.space(3)}
          alignment="center"
          modifiers={fillWidthModifiers}
          style={fillWidthStyle()}>
          <Spacer flexible />
          <Text textStyle={{ ...theme.typography.semantic.caption, color: theme.colors.mutedForeground }}>
            {t('auth.useEmail')}
          </Text>
          <Spacer flexible />
        </Row>

        <Column
          spacing={theme.space(4)}
          modifiers={fillWidthModifiers}
          style={fillWidthStyle()}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                label={t('auth.firstName')}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName ? t(errors.firstName.message!) : undefined}
                autoComplete="given-name"
                placeholder={t('auth.firstNamePlaceholder')}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { value, onChange, onBlur } }) => (
              <AuthField
                label={t('auth.lastName')}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName ? t(errors.lastName.message!) : undefined}
                autoComplete="family-name"
                placeholder={t('auth.lastNamePlaceholder')}
              />
            )}
          />
        </Column>

        <Controller
          control={control}
          name="userName"
          render={({ field: { value, onChange, onBlur } }) => (
            <AuthField
              label={t('auth.username')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.userName ? t(errors.userName.message!) : undefined}
              autoCapitalize="none"
              autoComplete="username-new"
              placeholder={t('auth.usernamePlaceholder')}
            />
          )}
        />

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
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

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
              autoComplete="new-password"
              placeholder={t('auth.passwordPlaceholder')}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <AuthField
              label={t('auth.confirmPassword')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword ? t(errors.confirmPassword.message!) : undefined}
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={() => void handleSubmit(onSubmit)()}
              placeholder={t('auth.repeatPasswordPlaceholder')}
            />
          )}
        />

        <AuthErrorMessage
          message={
            registerMutation.error
              ? getApiErrorMessage(registerMutation.error)
              : googleError
          }
        />

        <AuthButton
          label={isSubmitting ? t('auth.creatingAccount') : t('auth.signUp')}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Text
          textStyle={{
            ...theme.typography.semantic.legal,
            color: theme.colors.mutedForeground,
            textAlign: 'center',
          }}>
          {t('auth.termsNotice')}
        </Text>
      </AuthScreen>

      <OtpSheet
        isPresented={isOtpPresented}
        email={challenge?.email ?? getValues('email')}
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
          setIsOtpPresented(false);
          confirmMutation.reset();
          resendMutation.reset();
        }}
        onVerified={(code) => confirmMutation.mutateAsync(code)}
        onResend={() => resendMutation.mutateAsync()}
      />
    </>
  );
}
