import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export default function AuthLayout() {
  const { direction } = useLanguage();
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background, direction },
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTintColor: theme.colors.foreground,
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: t('auth.signIn'),
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="register" options={{ title: t('auth.signUpTitle') }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: t('auth.forgotPasswordTitle') }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ title: t('auth.resetPasswordTitle') }}
      />
    </Stack>
  );
}
