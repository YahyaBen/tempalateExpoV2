import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { DARK_COLORS, LIGHT_COLORS } from '@/constants/theme.colors';
import { THEME_PREFERENCE, type ThemePreference } from '@/constants/theme.constant';
import { useThemePreference } from '@/hooks/use-color-scheme';

interface ThemeOption {
  key: ThemePreference;
  label: string;
  icon: string;
}

export interface ThemePickerProps {
  style?: StyleProp<ViewStyle>;
  showDescription?: boolean;
}

export function ThemePicker({ style, showDescription = true }: ThemePickerProps) {
  const { t } = useTranslation();
  const { preference, colorScheme, setPreference } = useThemePreference();
  const colors = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const themeOptions: readonly ThemeOption[] = [
    {
      key: THEME_PREFERENCE.LIGHT,
      label: t('common.light'),
      icon: '☀️',
    },
    {
      key: THEME_PREFERENCE.DARK,
      label: t('common.dark'),
      icon: '🌙',
    },
    {
      key: THEME_PREFERENCE.SYSTEM,
      label: t('common.system'),
      icon: '⚙️',
    },
  ];

  const getSubtitle = () => {
    const activeMode = colorScheme === 'dark' ? t('common.dark') : t('common.light');
    if (preference === THEME_PREFERENCE.SYSTEM) {
      return t('common.systemTheme', { mode: activeMode });
    }
    const selectedMode = preference === THEME_PREFERENCE.DARK ? t('common.dark') : t('common.light');
    return t('common.themeEnabled', { mode: selectedMode });
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.segmentTrack,
          {
            backgroundColor: colors.content2,
            borderColor: colors.border,
          },
        ]}>
        {themeOptions.map((option) => {
          const isSelected = preference === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setPreference(option.key)}
              accessibilityRole="button"
              accessibilityLabel={t('common.themeDescription', { name: option.label })}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.segmentItem,
                isSelected && [
                  styles.segmentItemSelected,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ],
                pressed && styles.pressed,
              ]}>
              <Text style={styles.segmentIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.segmentLabel,
                  {
                    color: isSelected ? colors.foreground : colors.mutedForeground,
                    fontWeight: isSelected ? '600' : '500',
                  },
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showDescription && (
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {getSubtitle()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  segmentTrack: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 6,
  },
  segmentItemSelected: {
    borderWidth: 1,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
  },
  segmentIcon: {
    fontSize: 16,
  },
  segmentLabel: {
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
