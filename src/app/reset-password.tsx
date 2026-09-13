import { AuthButton } from '@/components/auth/auth-button';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useThemeTokens } from '@/hooks/use-theme';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/resolvers/reset-password.resolver';
import type { ResetPasswordRequest } from '@/types/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<
    Pick<ResetPasswordRequest, 'challengeId' | 'code'> & { email?: string }
  >();
  const theme = useThemeTokens();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  function onSubmit(_data: ResetPasswordFormValues) {
    // TODO: call the reset-password mutation after the backend is connected.
    router.dismissTo({ pathname: '/', params: { reset: '1' } });
  }

  return (
    <AuthScreen
      eyebrow={t('auth.secureStep')}
      description={t('auth.resetDescription')}>
      {params.email ? (
        <Text selectable style={[theme.typography.semantic.label, { color: theme.colors.mutedForeground }]}>
          {t('auth.resettingPasswordFor')}{' '}
          <Text style={[theme.typography.semantic.label, { color: theme.colors.foreground }]}>
            {params.email}
          </Text>
        </Text>
      ) : null}

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <AuthField
            label={t('auth.newPassword')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.newPassword ? t(errors.newPassword.message!) : undefined}
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
            label={t('auth.confirmNewPassword')}
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

      <AuthButton label={t('auth.updatePassword')} onPress={handleSubmit(onSubmit)} />
    </AuthScreen>
  );
}
