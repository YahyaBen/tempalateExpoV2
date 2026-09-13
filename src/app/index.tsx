import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { GoogleButton } from '@/components/auth/google-button';
import { useThemeTokens } from '@/hooks/use-theme';
import { loginSchema, type LoginFormValues } from '@/resolvers/login.resolver';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { registered, reset } = useLocalSearchParams<{ registered?: string; reset?: string }>();
  const theme = useThemeTokens();

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

  function onSubmit(_data: LoginFormValues) {
    // TODO: call login mutation with _data
  }

  return (
    <AuthScreen
      eyebrow={t('auth.loginEyebrow')}
      description={t('auth.loginDescription')}
      footer={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.space(1),
          }}>
          <Text style={{ color: theme.colors.mutedForeground }}>{t('auth.noAccount')}</Text>
          <Link href="/register" asChild>
            <Pressable accessibilityRole="link" hitSlop={theme.space(2)}>
              {({ pressed }) => (
                <Text
                  style={[
                    theme.typography.semantic.link,
                    { color: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 },
                  ]}>
                  {t('auth.signUp')}
                </Text>
              )}
            </Pressable>
          </Link>
        </View>
      }>
      <GoogleButton label={t('auth.continueWithGoogle')} onPress={() => undefined} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(3) }}>
        <View style={{ flex: 1, height: theme.borderWidth.small, backgroundColor: theme.colors.divider }} />
        <Text style={[theme.typography.semantic.caption, { color: theme.colors.mutedForeground }]}>
          {t('auth.continueWithEmail')}
        </Text>
        <View style={{ flex: 1, height: theme.borderWidth.small, backgroundColor: theme.colors.divider }} />
      </View>

      <View style={{ gap: theme.space(4) }}>
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

        <View style={{ gap: theme.space(2) }}>
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
                onSubmitEditing={handleSubmit(onSubmit)}
                placeholder={t('auth.passwordPlaceholder')}
              />
            )}
          />
          <Link href="/forgot-password" asChild>
            <Pressable accessibilityRole="link" hitSlop={theme.space(2)} style={{ alignSelf: 'flex-end' }}>
              {({ pressed }) => (
                <Text
                  style={[
                    theme.typography.semantic.link,
                    { color: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 },
                  ]}>
                  {t('auth.forgotPassword')}
                </Text>
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      {noticeKey ? (
        <Text
          selectable
          accessibilityLiveRegion="polite"
          style={[theme.typography.semantic.label, { color: theme.colors.success }]}>
          {t(noticeKey)}
        </Text>
      ) : null}

      <AuthButton label={t('auth.signIn')} onPress={handleSubmit(onSubmit)} />
    </AuthScreen>
  );
}
