import { Text } from '@/components/ui/universal';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function AuthErrorMessage({ message }: { message?: string | string[] | null }) {
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();

  if (!message) return null;

  return (
    <Text
      semantic="destructive"
      textStyle={{
        ...theme.typography.semantic.label,
        textAlign: isRTL ? 'right' : 'left',
      }}>
      {Array.isArray(message) ? message.join('\n') : message}
    </Text>
  );
}
