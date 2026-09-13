import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { GoogleButton } from '@/components/auth/google-button';
import { OtpSheet } from '@/components/auth/otp-sheet';
import { useThemeTokens } from '@/hooks/use-theme';
import { registerSchema, type RegisterFormValues } from '@/resolvers/register.resolver';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [isOtpPresented, setIsOtpPresented] = useState(false);

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

  function onSubmit(_data: RegisterFormValues) {
    setIsOtpPresented(true);
  }

  return (
    <>
      <AuthScreen
        eyebrow={t('auth.registerEyebrow')}
        description={t('auth.signUpSubtitle')}>
        <GoogleButton label={t('auth.signUpWithGoogle')} onPress={() => undefined} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(3) }}>
          <View style={{ flex: 1, height: theme.borderWidth.small, backgroundColor: theme.colors.divider }} />
          <Text style={[theme.typography.semantic.caption, { color: theme.colors.mutedForeground }]}>
            {t('auth.useEmail')}
          </Text>
          <View style={{ flex: 1, height: theme.borderWidth.small, backgroundColor: theme.colors.divider }} />
        </View>

        <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
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
                containerStyle={{ flex: 1 }}
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
                containerStyle={{ flex: 1 }}
              />
            )}
          />
        </View>

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
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder={t('auth.repeatPasswordPlaceholder')}
            />
          )}
        />

        <AuthButton label={t('auth.signUp')} onPress={handleSubmit(onSubmit)} />

        <Text
          style={[
            theme.typography.semantic.legal,
            { color: theme.colors.mutedForeground, textAlign: 'center' },
          ]}>
          {t('auth.termsNotice')}
        </Text>
      </AuthScreen>

      <OtpSheet
        isPresented={isOtpPresented}
        email={getValues('email')}
        purpose="registration"
        onDismiss={() => setIsOtpPresented(false)}
        onVerified={() => {
          setIsOtpPresented(false);
          router.dismissTo({ pathname: '/', params: { registered: '1' } });
        }}
      />
    </>
  );
}
