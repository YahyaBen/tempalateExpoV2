import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function GoogleButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const { direction } = useLanguage();
  const theme = useThemeTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.controlHeight.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(3),
        borderRadius: theme.radius.xlarge,
        borderCurve: 'continuous',
        borderWidth: theme.components.button.borderWidth,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}>
      <View
        style={{
          width: theme.components.googleButton.iconSize,
          height: theme.components.googleButton.iconSize,
          borderRadius: theme.components.googleButton.iconRadius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.components.googleButton.color.iconBackground,
          borderWidth: theme.components.googleButton.iconBorderWidth,
          borderColor: theme.components.googleButton.color.iconBorder,
        }}>
        <Text
          style={[
            theme.typography.semantic.subhead,
            { color: theme.components.googleButton.color.glyph, fontWeight: theme.typography.semantic.button.fontWeight },
          ]}>
          G
        </Text>
      </View>
      <Text
        style={[
          theme.typography.semantic.label,
          { color: theme.colors.foreground, writingDirection: direction },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}
