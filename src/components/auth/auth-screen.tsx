import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme-switch';
import {
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Row,
  Spacer,
  Text,
  UniversalHost,
} from '@/components/ui/universal';
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
                  semantic="primary"
                  textStyle={{
                    ...theme.typography.semantic.overline,
                    letterSpacing: theme.letterSpacing.overline,
                    textAlign,
                  }}>
                  {eyebrow}
                </Text>
                <Text
                  semantic="muted"
                  textStyle={{
                    ...theme.typography.semantic.body,
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
