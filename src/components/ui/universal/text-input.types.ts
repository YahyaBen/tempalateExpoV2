import type {
  TextInputProps as ExpoTextInputProps,
  TextInputRef as ExpoTextInputRef,
  UniversalStyle,
} from '@expo/ui';

export interface TextInputProps
  extends Omit<ExpoTextInputProps, 'defaultValue' | 'style' | 'value'> {
  value?: string | null;
  defaultValue?: string;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  style?: UniversalStyle;
}

export type TextInputRef = ExpoTextInputRef;
