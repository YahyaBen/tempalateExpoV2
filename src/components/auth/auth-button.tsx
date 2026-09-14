import { Button, type UniversalStyle } from '@/components/ui/universal';

export function AuthButton({
  label,
  onPress,
  disabled = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: UniversalStyle;
}) {
  return (
    <Button
      fullWidth
      variant="filled"
      label={label}
      disabled={disabled}
      onPress={onPress}
      style={style}
    />
  );
}
