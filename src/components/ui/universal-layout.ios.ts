import type { UniversalStyle } from '@expo/ui';
import { frame } from '@expo/ui/swift-ui/modifiers';

export const fillWidthModifiers = [frame({ maxWidth: Infinity })];
export const fillHeightModifiers = [frame({ maxHeight: Infinity })];
export const fillSizeModifiers = [frame({ maxWidth: Infinity, maxHeight: Infinity })];

export function fillWidthStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}

export function fillHeightStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}

export function fillSizeStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}
