import type { UniversalStyle } from '@expo/ui';
import {
  fillMaxHeight,
  fillMaxSize,
  fillMaxWidth,
} from '@expo/ui/jetpack-compose/modifiers';

export const fillWidthModifiers = [fillMaxWidth()];
export const fillHeightModifiers = [fillMaxHeight()];
export const fillSizeModifiers = [fillMaxSize()];

export function fillWidthStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}

export function fillHeightStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}

export function fillSizeStyle(style: UniversalStyle = {}): UniversalStyle {
  return style;
}
