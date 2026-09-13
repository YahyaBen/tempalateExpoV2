import { BottomSheet, Button, Column, Host, Row, Text } from '@expo/ui';

import { fillWidthModifiers, fillWidthStyle } from '@/components/ui/universal-layout';
import { useLanguage } from '@/context/language-context';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

export interface AlertAction {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'cancel';
}

export interface AlertDialogProps {
  readonly isPresented: boolean;
  readonly title: string;
  readonly message?: string;
  readonly actions?: AlertAction[];
  readonly onDismiss: () => void;
}

export function AlertDialog({
  isPresented,
  title,
  message,
  actions = [{ label: 'OK', variant: 'primary' }],
  onDismiss,
}: AlertDialogProps) {
  const { direction, isRTL } = useLanguage();
  const { colorScheme } = useThemePreference();
  const theme = useThemeTokens();

  return (
    <Host
      matchContents
      colorScheme={colorScheme}
      seedColor={theme.colors.primary}
      layoutDirection={isRTL ? 'rightToLeft' : 'leftToRight'}>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={onDismiss}
        containerColor={theme.colors.card}
        contentPadding={{
          top: theme.space(4),
          left: theme.space(6),
          right: theme.space(6),
          bottom: theme.space(8),
        }}>
        <Column spacing={theme.space(4)} alignment={isRTL ? 'end' : 'start'}>
          <Column spacing={theme.space(1.5)} alignment={isRTL ? 'end' : 'start'}>
            <Text
              textStyle={{
                ...theme.typography.semantic.subhead,
                color: theme.colors.foreground,
                fontWeight: '700',
                textAlign: direction === 'rtl' ? 'right' : 'left',
              }}>
              {title}
            </Text>
            {message ? (
              <Text
                textStyle={{
                  ...theme.typography.semantic.caption,
                  color: theme.colors.mutedForeground,
                  textAlign: direction === 'rtl' ? 'right' : 'left',
                }}>
                {message}
              </Text>
            ) : null}
          </Column>

          <Row spacing={theme.space(2)} alignment="end">
            {actions.map((action) => (
              <Button
                key={`${action.variant ?? 'primary'}-${action.label}`}
                label={action.label}
                variant={action.variant === 'cancel' ? 'text' : 'filled'}
                style={
                  action.variant === 'destructive'
                    ? { backgroundColor: theme.colors.destructive }
                    : undefined
                }
                onPress={() => {
                  action.onPress?.();
                  onDismiss();
                }}
              />
            ))}
          </Row>
        </Column>
      </BottomSheet>
    </Host>
  );
}

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AlertBannerProps {
  readonly title?: string;
  readonly description: string;
  readonly variant?: AlertBannerVariant;
  readonly action?: {
  readonly label: string;
  readonly onPress: () => void;
  };
}

export function AlertBanner({
  title,
  description,
  variant = 'info',
  action,
}: AlertBannerProps) {
  const { direction, isRTL } = useLanguage();
  const { colorScheme } = useThemePreference();
  const theme = useThemeTokens();
  const borderColor = {
    info: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    destructive: theme.colors.destructive,
  }[variant];

  return (
    <Host
      matchContents
      colorScheme={colorScheme}
      seedColor={theme.colors.primary}
      layoutDirection={isRTL ? 'rightToLeft' : 'leftToRight'}>
      <Column
        spacing={theme.space(2)}
        alignment={isRTL ? 'end' : 'start'}
        modifiers={fillWidthModifiers}
        style={fillWidthStyle({
          padding: theme.space(3.5),
          borderRadius: theme.radius.large,
          borderWidth: theme.borderWidth.small,
          borderColor,
          backgroundColor: theme.colors.content2,
        })}>
        {title ? (
          <Text
            textStyle={{
              ...theme.typography.semantic.label,
              color: variant === 'destructive' ? theme.colors.destructive : theme.colors.foreground,
              fontWeight: '600',
              textAlign: direction === 'rtl' ? 'right' : 'left',
            }}>
            {title}
          </Text>
        ) : null}
        <Text
          textStyle={{
            ...theme.typography.semantic.caption,
            color: theme.colors.mutedForeground,
            textAlign: direction === 'rtl' ? 'right' : 'left',
          }}>
          {description}
        </Text>
        {action ? <Button label={action.label} variant="text" onPress={action.onPress} /> : null}
      </Column>
    </Host>
  );
}

export const Alert = {
  Dialog: AlertDialog,
  Banner: AlertBanner,
};
