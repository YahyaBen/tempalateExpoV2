import type { TextProps as ExpoTextProps } from '@expo/ui';

export type TextSemantic =
  | 'default'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info';

export interface TextProps extends ExpoTextProps {
  semantic?: TextSemantic;
}
