import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LanguageProvider, useLanguage } from '@/context/language-context';
import { ThemePreferenceProvider, useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

function RootNavigator() {
  const { colorScheme } = useThemePreference();
  const { direction } = useLanguage();
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, direction }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
            options={{ title: t('auth.signIn'), headerBackVisible: false, headerLeft: () => null }}
          />
          <Stack.Screen name="register" options={{ title: t('auth.signUpTitle') }} />
          <Stack.Screen name="forgot-password" options={{ title: t('auth.forgotPasswordTitle') }} />
          <Stack.Screen name="reset-password" options={{ title: t('auth.resetPasswordTitle') }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemePreferenceProvider>
        <RootNavigator />
      </ThemePreferenceProvider>
    </LanguageProvider>
  );
}
