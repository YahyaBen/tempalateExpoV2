import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

type AuthFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AuthField({ label, error, containerStyle, secureTextEntry, ...props }: AuthFieldProps) {
  const { t } = useTranslation();
  const { direction, isRTL } = useLanguage();
  const theme = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[{ gap: theme.space(2) }, containerStyle]}>
      <Text
        style={[
          theme.typography.semantic.label,
          {
            color: theme.colors.foreground,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: direction,
          },
        ]}>
        {label}
      </Text>
      <View
        style={{
          minHeight: theme.controlHeight.lg,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.content2,
          borderColor: error ? theme.colors.destructive : focused ? theme.colors.primary : 'transparent',
          borderWidth: theme.components.textInput.borderWidth,
          borderRadius: theme.radius.xlarge,
          borderCurve: 'continuous',
          paddingHorizontal: theme.space(4),
        }}>
        <TextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel ?? label}
          secureTextEntry={isSecure}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          placeholderTextColor={theme.colors.mutedForeground}
          cursorColor={theme.colors.primary}
          selectionColor={theme.colors.primary}
          style={{
            flex: 1,
            minHeight: theme.components.textInput.contentHeight,
            color: theme.colors.foreground,
            ...theme.typography.semantic.body,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: direction,
            paddingVertical: 0,
          }}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSecure ? t('auth.showPassword') : t('auth.hidePassword')}
            hitSlop={theme.space(2.5)}
            onPress={() => setIsSecure((current) => !current)}>
            {({ pressed }) => (
              <Text
                style={[
                  theme.typography.semantic.link,
                  { color: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 },
                ]}>
                {isSecure ? t('auth.show') : t('auth.hide')}
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text
          selectable
          accessibilityLiveRegion="polite"
          style={[
            theme.typography.semantic.caption,
            {
              color: theme.colors.destructive,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: direction,
            },
          ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
