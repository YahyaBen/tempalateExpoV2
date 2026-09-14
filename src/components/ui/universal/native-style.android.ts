import type { UniversalBaseProps, UniversalStyle } from '@expo/ui';
import {
  alpha,
  background,
  border,
  clickable,
  clip,
  height,
  padding,
  paddingAll,
  Shapes,
  size,
  testID as testIDModifier,
  width,
  type ModifierConfig,
} from '@expo/ui/jetpack-compose/modifiers';

function omitUserOverrides(derived: ModifierConfig[], user?: readonly ModifierConfig[]) {
  if (!user?.length) return derived;
  const userTypes = new Set(user.map((modifier) => modifier.$type));
  return derived.filter((modifier) => !userTypes.has(modifier.$type));
}

export function androidStyleModifiers(
  style: UniversalStyle | undefined,
  props: Pick<UniversalBaseProps, 'onPress' | 'disabled' | 'testID'>,
  userModifiers?: ModifierConfig[],
) {
  let modifiers: ModifierConfig[] = [];

  if (style) {
    const styleWidth = typeof style.width === 'number' ? style.width : undefined;
    const styleHeight = typeof style.height === 'number' ? style.height : undefined;
    if (styleWidth !== undefined && styleHeight !== undefined) {
      modifiers.push(size(styleWidth, styleHeight));
    } else if (styleWidth !== undefined) {
      modifiers.push(width(styleWidth));
    } else if (styleHeight !== undefined) {
      modifiers.push(height(styleHeight));
    }

    const borderWidth = typeof style.borderWidth === 'number' ? style.borderWidth : undefined;
    const radius = typeof style.borderRadius === 'number' ? style.borderRadius : undefined;
    const hasBorder = borderWidth !== undefined && style.borderColor != null;

    if (hasBorder && radius !== undefined) {
      modifiers.push(clip(Shapes.RoundedCorner(radius)));
      modifiers.push(background(style.borderColor!));
      modifiers.push(paddingAll(borderWidth));
      modifiers.push(clip(Shapes.RoundedCorner(Math.max(0, radius - borderWidth))));
      if (style.backgroundColor) modifiers.push(background(style.backgroundColor));
    } else {
      if (hasBorder) modifiers.push(border(borderWidth, style.borderColor!));
      if (radius !== undefined) modifiers.push(clip(Shapes.RoundedCorner(radius)));
      if (style.backgroundColor) modifiers.push(background(style.backgroundColor));
    }

    const all = typeof style.padding === 'number' ? style.padding : 0;
    const vertical = typeof style.paddingVertical === 'number' ? style.paddingVertical : all;
    const horizontal = typeof style.paddingHorizontal === 'number' ? style.paddingHorizontal : all;
    const top = typeof style.paddingTop === 'number' ? style.paddingTop : vertical;
    const bottom = typeof style.paddingBottom === 'number' ? style.paddingBottom : vertical;
    const start = typeof style.paddingLeft === 'number' ? style.paddingLeft : horizontal;
    const end = typeof style.paddingRight === 'number' ? style.paddingRight : horizontal;
    if (top || bottom || start || end) {
      if (top === bottom && bottom === start && start === end) modifiers.push(paddingAll(top));
      else modifiers.push(padding(start, top, end, bottom));
    }

    if (typeof style.opacity === 'number') modifiers.push(alpha(style.opacity));
  }

  modifiers = omitUserOverrides(modifiers, userModifiers);
  if (props.onPress && !props.disabled) modifiers.push(clickable(props.onPress));
  if (props.testID) modifiers.push(testIDModifier(props.testID));
  if (userModifiers) modifiers.push(...userModifiers);
  return modifiers;
}
