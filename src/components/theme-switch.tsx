import { Button, Icon, Text } from '@expo/ui';
import { useTranslation } from 'react-i18next';

import { THEME_PREFERENCE } from '@/constants/theme.constant';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

const LIGHT_ICON = Icon.select({
  ios: 'sun.max.fill',
  android: import('@expo/material-symbols/light_mode.xml'),
});

const DARK_ICON = Icon.select({
  ios: 'moon.fill',
  android: import('@expo/material-symbols/dark_mode.xml'),
});

export function ThemeSwitch() {
  const { t } = useTranslation();
  const { colorScheme, setPreference } = useThemePreference();
  const theme = useThemeTokens();
  const isDark = colorScheme === THEME_PREFERENCE.DARK;

  return (
    <Button
      variant="text"
      label={t('common.darkMode')}
      onPress={() =>
        void setPreference(isDark ? THEME_PREFERENCE.LIGHT : THEME_PREFERENCE.DARK)
      }
      testID="theme-switch"
      style={{
        width: 44,
        height: 44,
        padding: 0,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.content2,
        borderWidth: theme.borderWidth.small,
        borderColor: theme.colors.border,
      }}>
      {process.env.EXPO_OS === 'web' ? (
        <Text textStyle={{ color: theme.colors.foreground, fontSize: 20, lineHeight: 22 }}>
          {isDark ? '☾' : '☀'}
        </Text>
      ) : (
        <Icon
          name={isDark ? DARK_ICON : LIGHT_ICON}
          size={22}
          color={theme.colors.foreground}
        />
      )}
    </Button>
  );
}
