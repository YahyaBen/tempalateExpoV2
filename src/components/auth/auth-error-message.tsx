import { Text } from '@expo/ui';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function AuthErrorMessage({ message }: { message?: string | string[] | null }) {
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();

  if (!message) return null;

  return (
    <Text
      textStyle={{
        ...theme.typography.semantic.label,
        color: theme.colors.destructive,
        textAlign: isRTL ? 'right' : 'left',
      }}>
      {Array.isArray(message) ? message.join('\n') : message}
    </Text>
  );
}
