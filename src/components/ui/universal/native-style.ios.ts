import type {
  UniversalBaseProps,
  UniversalFontWeight,
  UniversalStyle,
  UniversalTextStyle,
} from '@expo/ui';
import {
  background,
  border,
  clipShape,
  disabled as disabledModifier,
  font,
  foregroundStyle,
  frame,
  hidden as hiddenModifier,
  kerning,
  lineSpacing,
  multilineTextAlignment,
  onAppear,
  onDisappear,
  onTapGesture,
  opacity,
  padding,
  type ModifierConfig,
} from '@expo/ui/swift-ui/modifiers';

const FONT_WEIGHT: Record<
  UniversalFontWeight,
  Parameters<typeof font>[0]['weight']
> = {
  normal: 'regular',
  bold: 'bold',
  '100': 'ultraLight',
  '200': 'thin',
  '300': 'light',
  '400': 'regular',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
  '800': 'heavy',
  '900': 'black',
};

function omitUserOverrides(derived: ModifierConfig[], user?: readonly ModifierConfig[]) {
  if (!user?.length) return derived;
  const userTypes = new Set(user.map((modifier) => modifier.$type));
  return derived.filter((modifier) => !userTypes.has(modifier.$type));
}

export function iosStyleModifiers(
  style: UniversalStyle | undefined,
  props: Pick<
    UniversalBaseProps,
    'onPress' | 'onAppear' | 'onDisappear' | 'disabled' | 'hidden'
  >,
  userModifiers?: ModifierConfig[],
  textStyle?: UniversalTextStyle,
) {
  let modifiers: ModifierConfig[] = [];

  if (textStyle) {
    if (textStyle.fontFamily || textStyle.fontSize || textStyle.fontWeight) {
      modifiers.push(
        font({
          family: textStyle.fontFamily,
          size: textStyle.fontSize,
          weight: textStyle.fontWeight ? FONT_WEIGHT[textStyle.fontWeight] : undefined,
        }),
      );
    }
    if (textStyle.color) modifiers.push(foregroundStyle(textStyle.color));
    if (typeof textStyle.letterSpacing === 'number') {
      modifiers.push(kerning(textStyle.letterSpacing));
    }
    if (typeof textStyle.lineHeight === 'number') {
      modifiers.push(lineSpacing(Math.max(0, textStyle.lineHeight - (textStyle.fontSize ?? 17))));
    }
    if (textStyle.textAlign === 'left') modifiers.push(multilineTextAlignment('leading'));
    else if (textStyle.textAlign === 'right') modifiers.push(multilineTextAlignment('trailing'));
    else if (textStyle.textAlign === 'center') modifiers.push(multilineTextAlignment('center'));
  }

  if (style) {
    const hasPadding =
      style.padding != null ||
      style.paddingHorizontal != null ||
      style.paddingVertical != null ||
      style.paddingTop != null ||
      style.paddingBottom != null ||
      style.paddingLeft != null ||
      style.paddingRight != null;
    if (hasPadding) {
      modifiers.push(
        padding({
          all: typeof style.padding === 'number' ? style.padding : undefined,
          horizontal:
            typeof style.paddingHorizontal === 'number' ? style.paddingHorizontal : undefined,
          vertical: typeof style.paddingVertical === 'number' ? style.paddingVertical : undefined,
          top: typeof style.paddingTop === 'number' ? style.paddingTop : undefined,
          bottom: typeof style.paddingBottom === 'number' ? style.paddingBottom : undefined,
          leading: typeof style.paddingLeft === 'number' ? style.paddingLeft : undefined,
          trailing: typeof style.paddingRight === 'number' ? style.paddingRight : undefined,
        }),
      );
    }

    const styleWidth = typeof style.width === 'number' ? style.width : undefined;
    const styleHeight = typeof style.height === 'number' ? style.height : undefined;
    if (styleWidth !== undefined || styleHeight !== undefined) {
      modifiers.push(frame({ width: styleWidth, height: styleHeight }));
    }
    if (style.backgroundColor) modifiers.push(background(style.backgroundColor));
    if (typeof style.borderWidth === 'number' && style.borderColor) {
      modifiers.push(border({ content: style.borderColor, width: style.borderWidth }));
    }
    if (typeof style.borderRadius === 'number') {
      modifiers.push(clipShape('roundedRectangle', style.borderRadius));
    }
    if (typeof style.opacity === 'number') modifiers.push(opacity(style.opacity));
  }

  modifiers = omitUserOverrides(modifiers, userModifiers);
  if (props.onPress) modifiers.push(onTapGesture(props.onPress));
  if (props.onAppear) modifiers.push(onAppear(props.onAppear));
  if (props.onDisappear) modifiers.push(onDisappear(props.onDisappear));
  if (props.disabled) modifiers.push(disabledModifier(true));
  if (props.hidden) modifiers.push(hiddenModifier(true));
  if (userModifiers) modifiers.push(...userModifiers);
  return modifiers;
}
