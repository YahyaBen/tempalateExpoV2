import { Icon } from '@expo/ui';

export const LANGUAGE_ICON = Icon.select({
  ios: 'character.bubble.fill.zh',
  android: import('@expo/material-symbols/translate.xml'),
});

export const LIGHT_MODE_ICON = Icon.select({
  ios: 'sun.max.fill',
  android: import('@expo/material-symbols/light_mode.xml'),
});

export const DARK_MODE_ICON = Icon.select({
  ios: 'moon.fill',
  android: import('@expo/material-symbols/dark_mode.xml'),
});
