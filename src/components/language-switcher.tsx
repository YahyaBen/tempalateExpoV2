import { BottomSheet, Host, Icon, RNHostView } from '@expo/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { APP_LANGUAGE, type AppLanguage } from '@/constants/language.constant';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGE_ICON = Icon.select({
  ios: 'character.bubble.fill.zh',
  android: import('@expo/material-symbols/translate.xml'),
});

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, direction, isRTL, setLanguage } = useLanguage();
  const theme = useThemeTokens();
  const [isOpen, setIsOpen] = useState(false);

  const languages: readonly LanguageOption[] = [
    {
      code: APP_LANGUAGE.ENGLISH,
      name: t('common.english'),
      nativeName: 'English',
      flag: '🇬🇧',
    },
    {
      code: APP_LANGUAGE.FRENCH,
      name: t('common.french'),
      nativeName: 'Français',
      flag: '🇫🇷',
    },
    {
      code: APP_LANGUAGE.ARABIC,
      name: t('common.arabic'),
      nativeName: 'العربية',
      flag: '🇸🇦',
    },
  ];

  async function handleSelect(code: AppLanguage) {
    try {
      await setLanguage(code);
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  }

  return (
    <>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.content2,
          borderWidth: theme.borderWidth.small,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
        <View
          pointerEvents="none"
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Host matchContents pointerEvents="none">
            <Icon name={LANGUAGE_ICON} size={22} color={theme.colors.foreground} />
          </Host>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.language')}
          accessibilityState={{ expanded: isOpen }}
          hitSlop={theme.space(0.5)}
          pressRetentionOffset={theme.space(4)}
          onPress={() => setIsOpen(true)}
          testID="language-switcher-button"
          style={({ pressed }) => ({
            cursor: 'pointer',
            position: 'absolute',
            inset: 0,
            backgroundColor: pressed ? theme.colors.overlay : 'transparent',
          })}
        />
      </View>

      <BottomSheet
        isPresented={isOpen}
        onDismiss={() => setIsOpen(false)}
        snapPoints={['half', 'full']}
        contentPadding={{
          top: theme.space(4),
          left: theme.space(6),
          right: theme.space(6),
          bottom: theme.space(8),
        }}
        containerColor={theme.colors.card}>
        <RNHostView>
          <View
            style={{
              width: '100%',
              maxWidth: theme.contentWidth.compact,
              alignSelf: 'center',
              direction,
              gap: theme.space(5),
            }}>
            <View style={{ gap: theme.space(1) }}>
              <Text
                style={[
                  theme.typography.semantic.title,
                  {
                    color: theme.colors.foreground,
                    textAlign: isRTL ? 'right' : 'left',
                    writingDirection: direction,
                  },
                ]}>
                {t('common.selectLanguage')}
              </Text>
              <Text
                style={[
                  theme.typography.semantic.caption,
                  {
                    color: theme.colors.mutedForeground,
                    textAlign: isRTL ? 'right' : 'left',
                    writingDirection: direction,
                  },
                ]}>
                {t('profile.languageHint')}
              </Text>
            </View>

            <View style={{ gap: theme.space(2.5) }}>
              {languages.map((item) => {
                const isSelected = item.code === language;
                return (
                  <Pressable
                    key={item.code}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => void handleSelect(item.code)}
                    style={({ pressed }) => ({
                      cursor: 'pointer',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: theme.space(3.5),
                      paddingHorizontal: theme.space(4),
                      borderRadius: theme.radius.xlarge,
                      borderCurve: 'continuous',
                      backgroundColor: isSelected ? theme.colors.content2 : theme.colors.background,
                      borderWidth: theme.borderWidth.small,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      opacity: pressed ? theme.opacity.pressed : 1,
                    })}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.space(3),
                      }}>
                      <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                      <View style={{ gap: theme.space(0.5) }}>
                        <Text
                          style={[
                            theme.typography.semantic.subhead,
                            {
                              color: theme.colors.foreground,
                              fontWeight: isSelected ? '700' : '500',
                              textAlign: isRTL ? 'right' : 'left',
                            },
                          ]}>
                          {item.nativeName}
                        </Text>
                        <Text
                          style={[
                            theme.typography.semantic.caption,
                            {
                              color: theme.colors.mutedForeground,
                              textAlign: isRTL ? 'right' : 'left',
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    </View>

                    {isSelected ? (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: theme.colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: theme.colors.primaryForeground,
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}>
                          ✓
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </RNHostView>
      </BottomSheet>
    </>
  );
}
