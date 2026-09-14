import { BottomSheet, Column, Row } from '@expo/ui';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

import { Button } from './button';
import { fillWidthModifiers, fillWidthStyle } from './fill';
import { Host } from './host';
import { Text } from './text';

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
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();

  return (
    <Host matchContents>
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
            <Text textStyle={{ ...theme.typography.semantic.subhead, fontWeight: '700' }}>
              {title}
            </Text>
            {message ? (
              <Text semantic="muted" textStyle={theme.typography.semantic.caption}>
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
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();
  const borderColor = theme.components.text.color[variant];

  return (
    <Host matchContents>
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
          <Text semantic={variant} textStyle={theme.typography.semantic.label}>
            {title}
          </Text>
        ) : null}
        <Text semantic="muted" textStyle={theme.typography.semantic.caption}>
          {description}
        </Text>
        {action ? (
          <Button label={action.label} variant="text" onPress={action.onPress} />
        ) : null}
      </Column>
    </Host>
  );
}

export const Alert = {
  Dialog: AlertDialog,
  Banner: AlertBanner,
};
