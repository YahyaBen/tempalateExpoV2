import { Column, Spacer, Text } from '@expo/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthButton } from '@/components/auth/auth-button';
import { UniversalHost } from '@/components/ui/universal-host';
import { fillSizeModifiers, fillSizeStyle } from '@/components/ui/universal-layout';
import { useAuthContext } from '@/context/auth.context';
import { useThemeTokens } from '@/hooks/use-theme';
import { authService } from '@/services/auth/auth.service';

export default function HomeScreen() {
  const { session } = useAuthContext();
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authService.logout();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <UniversalHost style={{ flex: 1 }} useViewportSizeMeasurement>
      <Column
        alignment="center"
        spacing={theme.space(4)}
        modifiers={fillSizeModifiers}
        style={fillSizeStyle({
          padding: theme.space(6),
          backgroundColor: theme.colors.background,
        })}>
        <Spacer flexible />
        <Text
          textStyle={{
            ...theme.typography.semantic.display,
            color: theme.colors.foreground,
            textAlign: 'center',
          }}>
          {t('auth.welcomeBack')}
        </Text>
        {session?.user?.email ? (
          <Text
            textStyle={{
              ...theme.typography.semantic.body,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
            }}>
            {session.user.email}
          </Text>
        ) : null}
        <AuthButton
          label={t('common.signOut')}
          disabled={isSigningOut}
          onPress={() => void handleSignOut()}
        />
        <Spacer flexible />
      </Column>
    </UniversalHost>
  );
}
