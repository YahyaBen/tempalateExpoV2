import {
  Button,
  Column,
  fillWidthModifiers,
  fillWidthStyle,
  Row,
  Spacer,
  Text,
  TextInput,
  type TextInputProps,
} from '@/components/ui/universal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/context/language-context';
import { useThemeTokens } from '@/hooks/use-theme';

type AuthFieldProps = Omit<TextInputProps, 'error' | 'label'> & {
  label: string;
  error?: string;
};

export function AuthField({
  label,
  value = '',
  error,
  secureTextEntry,
  onChangeText,
  ...props
}: AuthFieldProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const theme = useThemeTokens();
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <Column
      spacing={theme.space(2)}
      alignment={isRTL ? 'end' : 'start'}
      modifiers={fillWidthModifiers}
      style={fillWidthStyle()}>
      <Row alignment="center" modifiers={fillWidthModifiers} style={fillWidthStyle()}>
        <Text
          textStyle={{
            ...theme.typography.semantic.label,
            textAlign: isRTL ? 'right' : 'left',
          }}>
          {label}
        </Text>
        {secureTextEntry ? (
          <>
            <Spacer flexible />
            <Button
              variant="text"
              label={isSecure ? t('auth.showPassword') : t('auth.hidePassword')}
              onPress={() => setIsSecure((current) => !current)}
            />
          </>
        ) : null}
      </Row>

      <TextInput
        {...props}
        value={value}
        error={error}
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
        textAlign={isRTL ? 'right' : 'left'}
        textStyle={{
          ...theme.typography.semantic.body,
          textAlign: isRTL ? 'right' : 'left',
        }}
      />
    </Column>
  );
}
