import { Button, Row, Text } from '@expo/ui';

import {
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
import { useThemeTokens } from '@/hooks/use-theme';

export function GoogleButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const theme = useThemeTokens();

  return (
    <Button
      variant="outlined"
      disabled={disabled}
      onPress={onPress}
      modifiers={fillWidthModifiers}
      style={fillWidthStyle({
        height: theme.controlHeight.lg,
        paddingHorizontal: theme.space(4),
        borderRadius: theme.radius.xlarge,
        borderWidth: theme.components.button.borderWidth,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        opacity: disabled ? theme.opacity.disabled : 1,
      })}>
      <Row spacing={theme.space(3)} alignment="center">
        <Text
          textStyle={{
            ...theme.typography.semantic.subhead,
            color: theme.components.googleButton.color.glyph,
            fontWeight: '700',
          }}>
          G
        </Text>
        <Text
          textStyle={{
            ...theme.typography.semantic.label,
            color: theme.colors.foreground,
          }}>
          {label}
        </Text>
      </Row>
    </Button>
  );
}
