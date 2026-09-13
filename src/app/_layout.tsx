import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AUTH_STATUS } from '@/constants/auth.constant';
import { AuthProvider, useAuthContext } from '@/context/auth.context';
import { LanguageProvider, useLanguage } from '@/context/language-context';
import { ThemePreferenceProvider, useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';
import { queryClient } from '@/lib/react-query';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuthContext();
  const { colorScheme } = useThemePreference();
  const { direction } = useLanguage();
  const theme = useThemeTokens();

  useEffect(() => {
    if (status !== AUTH_STATUS.UNKNOWN) {
      void SplashScreen.hideAsync();
    }
  }, [status]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.background, direction },
            headerShown: false,
          }}>
          <Stack.Protected guard={status === AUTH_STATUS.UNKNOWN}>
            <Stack.Screen name="loading" />
          </Stack.Protected>
          <Stack.Protected guard={status === AUTH_STATUS.UNAUTHENTICATED}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={status === AUTH_STATUS.AUTHENTICATED}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
        </Stack>
      </>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemePreferenceProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ThemePreferenceProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
