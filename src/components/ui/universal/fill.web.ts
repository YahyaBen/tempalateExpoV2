import type { UniversalStyle } from '@expo/ui';

export const fillWidthModifiers = [];
export const fillSizeModifiers = [];

export function fillWidthStyle(style: UniversalStyle = {}): UniversalStyle {
  return { width: '100%', ...style };
}

export function fillSizeStyle(style: UniversalStyle = {}): UniversalStyle {
  return { width: '100%', height: '100%', ...style };
}
