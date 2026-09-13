import type { UniversalStyle } from '@expo/ui';
import type { ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';

export const fillWidthModifiers: ModifierConfig[];
export const fillHeightModifiers: ModifierConfig[];
export const fillSizeModifiers: ModifierConfig[];

export function fillWidthStyle(style?: UniversalStyle): UniversalStyle;
export function fillHeightStyle(style?: UniversalStyle): UniversalStyle;
export function fillSizeStyle(style?: UniversalStyle): UniversalStyle;
