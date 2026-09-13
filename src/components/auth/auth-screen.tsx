import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme-switch';
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
  const textDirection = {
    textAlign: isRTL ? ('right' as const) : ('left' as const),
    writingDirection: direction,
  };

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
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: theme.contentWidth.compact,
            alignSelf: 'center',
            gap: theme.space(7),
          }}>
          <View style={{ paddingTop: theme.space(4), gap: theme.space(3) }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: theme.space(3),
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2.5) }}>
                <View
                  style={{
                    width: theme.components.brandMark.size,
                    height: theme.components.brandMark.size,
                    borderRadius: theme.components.brandMark.radius,
                    borderCurve: 'continuous',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.primary,
                  }}>
                  <Text style={[theme.components.brandMark.letter, { color: theme.colors.primaryForeground }]}>
                    {t('common.appInitial')}
                  </Text>
                </View>
                <Text
                  style={[
                    theme.typography.semantic.heading,
                    { color: theme.colors.foreground, letterSpacing: theme.letterSpacing.brand },
                  ]}>
                  {t('common.appName')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
                <LanguageSwitcher />
                <ThemeSwitch />
              </View>
            </View>
            <View style={{ gap: theme.space(1.5) }}>
              <Text
                style={[
                  theme.typography.semantic.overline,
                  {
                    color: theme.colors.primary,
                    letterSpacing: theme.letterSpacing.overline,
                    ...textDirection,
                  },
                ]}>
                {eyebrow}
              </Text>
              <Text
                selectable
                style={[
                  theme.typography.semantic.body,
                  { color: theme.colors.mutedForeground, ...textDirection },
                ]}>
                {description}
              </Text>
            </View>
          </View>

          <View style={{ gap: theme.space(5) }}>{children}</View>
          {footer ? <View style={{ paddingTop: theme.space(1) }}>{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
