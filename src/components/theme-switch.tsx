import { Host, Icon } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

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

  function setDarkTheme(value: boolean) {
    void setPreference(value ? THEME_PREFERENCE.DARK : THEME_PREFERENCE.LIGHT);
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={t('common.darkMode')}
      accessibilityState={{ checked: isDark }}
      aria-checked={isDark}
      hitSlop={theme.space(0.5)}
      pressRetentionOffset={theme.space(4)}
      onPress={() => setDarkTheme(!isDark)}
      testID="theme-switch"
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: theme.radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.content2,
        borderWidth: theme.borderWidth.small,
        borderColor: theme.colors.border,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}>
      {process.env.EXPO_OS === 'web' ? (
        <Text style={{ color: theme.colors.foreground, fontSize: 20, lineHeight: 22 }}>
          {isDark ? '☾' : '☀'}
        </Text>
      ) : (
        <Host matchContents pointerEvents="none">
          <Icon
            name={isDark ? DARK_ICON : LIGHT_ICON}
            size={22}
            color={theme.colors.foreground}
          />
        </Host>
      )}
    </Pressable>
  );
}
