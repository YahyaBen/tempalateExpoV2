import { AuthButton } from '@/components/auth/auth-button';
import { AuthErrorMessage } from '@/components/auth/auth-error-message';
import { AuthField } from '@/components/auth/auth-field';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useThemeTokens } from '@/hooks/use-theme';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/resolvers/reset-password.resolver';
import type { ResetPasswordRequest } from '@/types/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Text } from '@/components/ui/universal';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/services/api.error';
import { authService } from '@/services/auth/auth.service';

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

  const resetMutation = useMutation({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: async ({ newPassword }: ResetPasswordFormValues) => {
      if (!params.challengeId || !params.code) {
        throw new Error(t('auth.recoveryLinkMissing'));
      }

      await authService.resetPassword({
        challengeId: params.challengeId,
        code: params.code,
        newPassword,
      });
    },
    onSuccess: () => {
      router.dismissTo({ pathname: '/', params: { reset: '1' } });
    },
  });

  function onSubmit(data: ResetPasswordFormValues) {
    resetMutation.mutate(data);
  }

  return (
    <AuthScreen
      eyebrow={t('auth.secureStep')}
      description={t('auth.resetDescription')}>
      {params.email ? (
        <Text
          semantic="muted"
          textStyle={theme.typography.semantic.label}>
          {`${t('auth.resettingPasswordFor')} ${params.email}`}
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
            onSubmitEditing={() => void handleSubmit(onSubmit)()}
            placeholder={t('auth.repeatPasswordPlaceholder')}
          />
        )}
      />

      <AuthErrorMessage
        message={
          resetMutation.error ? getApiErrorMessage(resetMutation.error) : null
        }
      />

      <AuthButton
        label={t('auth.updatePassword')}
        disabled={resetMutation.isPending}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthScreen>
  );
}
