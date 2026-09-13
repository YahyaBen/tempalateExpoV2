import { Button, Text, type UniversalStyle } from '@expo/ui';

import {
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
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
  style?: UniversalStyle;
}) {
  const theme = useThemeTokens();
  const primary = variant === 'primary';

  return (
    <Button
      variant="filled"
      disabled={disabled}
      onPress={onPress}
      modifiers={fillWidthModifiers}
      style={fillWidthStyle({
        height: theme.controlHeight.lg,
        paddingHorizontal: theme.space(5.5),
        borderRadius: theme.radius.xlarge,
        backgroundColor: primary ? theme.colors.primary : theme.colors.content2,
        opacity: disabled ? theme.opacity.disabled : 1,
        ...style,
      })}>
      <Text
        textStyle={{
          ...theme.typography.semantic.button,
          color: primary ? theme.colors.primaryForeground : theme.colors.foreground,
        }}>
        {label}
      </Text>
    </Button>
  );
}
