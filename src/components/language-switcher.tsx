import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  Button,
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Icon,
  LANGUAGE_ICON,
  Row,
  Text
} from '@/components/ui/universal';
import { APP_LANGUAGE, type AppLanguage } from '@/constants/language.constant';
import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, isRTL, setLanguage } = useLanguage();
  const theme = useThemeTokens();
  const [isOpen, setIsOpen] = useState(false);

  const languages: readonly LanguageOption[] = [
    { code: APP_LANGUAGE.ENGLISH, name: t('common.english'), nativeName: 'English', flag: '🇬🇧' },
    { code: APP_LANGUAGE.FRENCH, name: t('common.french'), nativeName: 'Français', flag: '🇫🇷' },
    { code: APP_LANGUAGE.ARABIC, name: t('common.arabic'), nativeName: 'العربية', flag: '🇸🇦' },
  ];

  async function handleSelect(code: AppLanguage) {
    try {
      await setLanguage(code);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  }

  return (
    <>
      <Button
        variant="text"
        label={t('common.language')}
        onPress={() => setIsOpen(true)}
        testID="language-switcher-button"
        style={{
          width: 44,
          height: 44,
          padding: 0,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.content2,
          borderWidth: theme.borderWidth.small,
          borderColor: theme.colors.border,
        }}>
        <Icon
          name={LANGUAGE_ICON}
          size={22}
          color={theme.colors.foreground}
          accessibilityLabel={t('common.language')}
        />
      </Button>

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
        <Column
          spacing={theme.space(4)}
          alignment={isRTL ? 'end' : 'start'}
          modifiers={fillWidthModifiers}
          style={fillWidthStyle()}>
          <Column spacing={theme.space(1)} alignment={isRTL ? 'end' : 'start'}>
            <Text
              semantic="default"
              textStyle={{
                ...theme.typography.semantic.title,
                textAlign: isRTL ? 'right' : 'left',
              }}>
              {t('common.selectLanguage')}
            </Text>
            <Text
              semantic="muted"
              textStyle={{
                ...theme.typography.semantic.caption,
                textAlign: isRTL ? 'right' : 'left',
              }}>
              {t('profile.languageHint')}
            </Text>
          </Column>

          <Column
            spacing={theme.space(2.5)}
            modifiers={fillWidthModifiers}
            style={fillWidthStyle()}>
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <Button
                  key={item.code}
                  fullWidth
                  variant={isSelected ? 'filled' : 'outlined'}
                  semantic={isSelected ? 'primary' : undefined}
                  onPress={() => void handleSelect(item.code)}>
                  <Row
                    spacing={theme.space(3)}
                    alignment="center"
                    modifiers={fillWidthModifiers}
                    style={fillWidthStyle()}>
                    <Text textStyle={{ fontSize: 22 }}>{item.flag}</Text>
                    <Column spacing={theme.space(0.5)} alignment={isRTL ? 'end' : 'start'}>
                      <Text
                        textStyle={{
                          ...theme.typography.semantic.subhead,
                          color: isSelected
                            ? theme.colors.primaryForeground
                            : theme.colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                          textAlign: isRTL ? 'right' : 'left',
                        }}>
                        {item.nativeName}
                      </Text>
                      <Text
                        textStyle={{
                          ...theme.typography.semantic.caption,
                          color: isSelected
                            ? theme.colors.primaryForeground
                            : theme.colors.mutedForeground,
                          textAlign: isRTL ? 'right' : 'left',
                        }}>
                        {item.name}
                      </Text>
                    </Column>
                  </Row>
                </Button>
              );
            })}
          </Column>
        </Column>
      </BottomSheet>
    </>
  );
}
