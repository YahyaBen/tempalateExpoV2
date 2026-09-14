import { useTranslation } from 'react-i18next';

import {
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Picker,
  Text,
  type UniversalStyle,
} from '@/components/ui/universal';
import { THEME_PREFERENCE, type ThemePreference } from '@/constants/theme.constant';
import { useThemePreference } from '@/hooks/use-color-scheme';
import { useThemeTokens } from '@/hooks/use-theme';

export interface ThemePickerProps {
  style?: UniversalStyle;
  showDescription?: boolean;
}

export function ThemePicker({ style, showDescription = true }: ThemePickerProps) {
  const { t } = useTranslation();
  const { preference, colorScheme, setPreference } = useThemePreference();
  const theme = useThemeTokens();

  const activeMode = colorScheme === 'dark' ? t('common.dark') : t('common.light');
  const selectedMode = preference === THEME_PREFERENCE.DARK ? t('common.dark') : t('common.light');
  const description =
    preference === THEME_PREFERENCE.SYSTEM
      ? t('common.systemTheme', { mode: activeMode })
      : t('common.themeEnabled', { mode: selectedMode });

  return (
    <Column
      spacing={theme.space(2)}
      alignment="center"
      modifiers={fillWidthModifiers}
      style={fillWidthStyle(style)}>
      <Picker<ThemePreference>
        selectedValue={preference}
        onValueChange={(value) => void setPreference(value)}
        appearance="menu"
        testID="theme-picker">
        <Picker.Item label={`☀️ ${t('common.light')}`} value={THEME_PREFERENCE.LIGHT} />
        <Picker.Item label={`🌙 ${t('common.dark')}`} value={THEME_PREFERENCE.DARK} />
        <Picker.Item label={`⚙️ ${t('common.system')}`} value={THEME_PREFERENCE.SYSTEM} />
      </Picker>
      {showDescription ? (
        <Text
          semantic="muted"
          textStyle={{
            ...theme.typography.semantic.caption,
            textAlign: 'center',
          }}>
          {description}
        </Text>
      ) : null}
    </Column>
  );
}
