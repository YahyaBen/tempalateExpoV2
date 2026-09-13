import { Column, Row, Spacer, Text } from '@expo/ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme-switch';
import { UniversalHost } from '@/components/ui/universal-host';
import {
  fillWidthModifiers,
  fillWidthStyle,
} from '@/components/ui/universal-layout';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

export function AuthScreen({
  eyebrow,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useTranslation();
  const { direction, isRTL } = useLanguage();
  const theme = useThemeTokens();
  const alignment = isRTL ? ('end' as const) : ('start' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, direction, backgroundColor: theme.colors.background }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.space(6),
          paddingBottom: theme.space(8),
        }}>
        <UniversalHost
          matchContents={{ vertical: true }}
          style={{
            width: '100%',
            maxWidth: theme.contentWidth.compact,
            alignSelf: 'center',
          }}>
          <Column
            spacing={theme.space(7)}
            alignment={alignment}
            modifiers={fillWidthModifiers}
            style={fillWidthStyle()}>
            <Column
              spacing={theme.space(3)}
              alignment={alignment}
              modifiers={fillWidthModifiers}
              style={fillWidthStyle()}>
              <Row alignment="center" modifiers={fillWidthModifiers} style={fillWidthStyle()}>
                <Row spacing={theme.space(2.5)} alignment="center">
                  <Column
                    alignment="center"
                    style={{
                      width: theme.components.brandMark.size,
                      height: theme.components.brandMark.size,
                      borderRadius: theme.components.brandMark.radius,
                      backgroundColor: theme.colors.primary,
                    }}>
                    <Spacer flexible />
                    <Text
                      textStyle={{
                        ...theme.components.brandMark.letter,
                        color: theme.colors.primaryForeground,
                      }}>
                      {t('common.appInitial')}
                    </Text>
                    <Spacer flexible />
                  </Column>
                  <Text
                    textStyle={{
                      ...theme.typography.semantic.heading,
                      color: theme.colors.foreground,
                      letterSpacing: theme.letterSpacing.brand,
                    }}>
                    {t('common.appName')}
                  </Text>
                </Row>
                <Spacer flexible />
                <Row spacing={theme.space(2)} alignment="center">
                  <LanguageSwitcher />
                  <ThemeSwitch />
                </Row>
              </Row>

              <Column
                spacing={theme.space(1.5)}
                alignment={alignment}
                modifiers={fillWidthModifiers}
                style={fillWidthStyle()}>
                <Text
                  textStyle={{
                    ...theme.typography.semantic.overline,
                    color: theme.colors.primary,
                    letterSpacing: theme.letterSpacing.overline,
                    textAlign,
                  }}>
                  {eyebrow}
                </Text>
                <Text
                  textStyle={{
                    ...theme.typography.semantic.body,
                    color: theme.colors.mutedForeground,
                    textAlign,
                  }}>
                  {description}
                </Text>
              </Column>
            </Column>

            <Column
              spacing={theme.space(5)}
              alignment={alignment}
              modifiers={fillWidthModifiers}
              style={fillWidthStyle()}>
              {children}
            </Column>
            {footer ? (
              <Column modifiers={fillWidthModifiers} style={fillWidthStyle()}>
                {footer}
              </Column>
            ) : null}
          </Column>
        </UniversalHost>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
