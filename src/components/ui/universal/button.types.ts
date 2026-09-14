import type { ButtonProps as ExpoButtonProps, UniversalStyle } from '@expo/ui';
import type { ButtonColorTokens } from '@/constants/theme.tokens';

export type ButtonSemantic = keyof ButtonColorTokens['semantic'];

export interface ButtonProps extends Omit<ExpoButtonProps, 'style'> {
  fullWidth?: boolean;
  /** Applies the matching semantic theme token to the native button chrome. */
  semantic?: ButtonSemantic;
  style?: UniversalStyle;
}
