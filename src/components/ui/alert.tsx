import { Button, Column, Host, Row } from '@expo/ui';
import type { ReactNode } from 'react';
import {
    Modal,
    Pressable,
    Alert as RNAlert,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

import { useLanguage } from '@/context/language-context';
import { useThemePreference } from '@/context/theme-context';
import { useThemeTokens } from '@/hooks/use-theme';

export interface AlertAction {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'cancel';
}

export interface AlertDialogProps {
  isPresented: boolean;
  title: string;
  message?: string;
  actions?: AlertAction[];
  onDismiss: () => void;
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
    <Modal
      transparent
      animationType="fade"
      visible={isPresented}
      onRequestClose={onDismiss}
      statusBarTranslucent>
      <Pressable
        accessibilityRole="none"
        onPress={onDismiss}
        style={styles.backdrop}>
        <Pressable
          accessibilityRole="none"
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.dialogContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              direction,
            },
          ]}>
          <Host
            matchContents
            colorScheme={colorScheme}
            seedColor={theme.colors.primary}
            layoutDirection={direction === 'rtl' ? 'rightToLeft' : 'leftToRight'}>
            <Column spacing={16} alignment={isRTL ? 'end' : 'start'}>
              <View style={{ gap: theme.space(1.5), width: '100%' }}>
                <Text
                  style={[
                    theme.typography.semantic.subhead,
                    {
                      color: theme.colors.foreground,
                      fontWeight: '700',
                      textAlign: isRTL ? 'right' : 'left',
                      writingDirection: direction,
                    },
                  ]}>
                  {title}
                </Text>
                {message ? (
                  <Text
                    style={[
                      theme.typography.semantic.caption,
                      {
                        color: theme.colors.mutedForeground,
                        lineHeight: 18,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: direction,
                      },
                    ]}>
                    {message}
                  </Text>
                ) : null}
              </View>

              <Row spacing={8} alignment="end" style={{ width: '100%' }}>
                {actions.map((action, index) => {
                  const isDestructive = action.variant === 'destructive';
                  const isCancel = action.variant === 'cancel';
                  const buttonVariant = isCancel ? 'text' : isDestructive ? 'outlined' : 'filled';

                  return (
                    <Button
                      key={index}
                      label={action.label}
                      variant={buttonVariant}
                      onPress={() => {
                        action.onPress?.();
                        onDismiss();
                      }}
                    />
                  );
                })}
              </Row>
            </Column>
          </Host>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AlertBannerProps {
  title?: string;
  description: ReactNode;
  variant?: AlertBannerVariant;
  style?: StyleProp<ViewStyle>;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function AlertBanner({
  title,
  description,
  variant = 'info',
  style,
  action,
}: AlertBannerProps) {
  const { direction, isRTL } = useLanguage();
  const theme = useThemeTokens();

  const variantColors = {
    info: {
      bg: theme.colors.content2,
      border: theme.colors.primary,
      text: theme.colors.foreground,
      icon: 'ℹ️',
    },
    success: {
      bg: theme.colors.content2,
      border: theme.colors.success,
      text: theme.colors.foreground,
      icon: '✅',
    },
    warning: {
      bg: theme.colors.content2,
      border: theme.colors.warning,
      text: theme.colors.foreground,
      icon: '⚠️',
    },
    destructive: {
      bg: theme.colors.content2,
      border: theme.colors.destructive,
      text: theme.colors.destructive,
      icon: '⛔',
    },
  }[variant];

  return (
    <View
      style={[
        styles.bannerContainer,
        {
          backgroundColor: variantColors.bg,
          borderColor: variantColors.border,
          direction,
        },
        style,
      ]}>
      <Text style={{ fontSize: 16 }}>{variantColors.icon}</Text>
      <View style={{ flex: 1, gap: theme.space(0.5) }}>
        {title ? (
          <Text
            style={[
              theme.typography.semantic.label,
              {
                color: variantColors.text,
                fontWeight: '600',
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: direction,
              },
            ]}>
            {title}
          </Text>
        ) : null}
        <Text
          style={[
            theme.typography.semantic.caption,
            {
              color: theme.colors.mutedForeground,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: direction,
            },
          ]}>
          {description}
        </Text>
      </View>
      {action ? (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          hitSlop={theme.space(2)}
          style={({ pressed }) => ({
            paddingHorizontal: theme.space(2),
            paddingVertical: theme.space(1),
            opacity: pressed ? theme.opacity.pressed : 1,
          })}>
          <Text style={[theme.typography.semantic.link, { color: theme.colors.primary }]}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const Alert = {
  Dialog: AlertDialog,
  Banner: AlertBanner,
  alert: RNAlert.alert,
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});

