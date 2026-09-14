import { Button, Row, Text } from '@/components/ui/universal';
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
      fullWidth
      variant="outlined"
      disabled={disabled}
      onPress={onPress}>
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
          textStyle={theme.typography.semantic.label}>
          {label}
        </Text>
      </Row>
    </Button>
  );
}
