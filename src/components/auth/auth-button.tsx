import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function AuthButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}) {
  const { direction } = useLanguage();
  const theme = useThemeTokens();
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: theme.controlHeight.lg,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radius.xlarge,
          borderCurve: 'continuous',
          backgroundColor: primary ? theme.colors.primary : theme.colors.content2,
          opacity: disabled ? theme.opacity.disabled : pressed ? theme.opacity.pressed : 1,
        },
        style,
      ]}>
      <Text
        style={[
          theme.typography.semantic.button,
          {
            color: primary ? theme.colors.primaryForeground : theme.colors.foreground,
            writingDirection: direction,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}
