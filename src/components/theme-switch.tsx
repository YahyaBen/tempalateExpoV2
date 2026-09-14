import { useTranslation } from 'react-i18next';

import {
  Button,
  DARK_MODE_ICON,
  Icon,
  LIGHT_MODE_ICON,
  Text,
} from '@/components/ui/universal';
import { THEME_PREFERENCE } from '@/constants/theme.constant';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

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
          name={isDark ? DARK_MODE_ICON : LIGHT_MODE_ICON}
          size={22}
          color={theme.colors.foreground}
        />
      )}
    </Button>
  );
}
