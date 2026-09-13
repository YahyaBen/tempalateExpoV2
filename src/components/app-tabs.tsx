import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { DARK_COLORS, LIGHT_COLORS } from '@/constants/theme.colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <NativeTabs
      backgroundColor={colors.tabBarBackground}
      indicatorColor={colors.content2}
      tintColor={colors.foreground}
      iconColor={{
        default: colors.mutedForeground,
        selected: colors.foreground,
      }}
      labelStyle={{
        default: { color: colors.mutedForeground },
        selected: { color: colors.foreground },
      }}
      rippleColor={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}
      blurEffect={isDark ? 'systemMaterialDark' : 'systemMaterialLight'}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ui-kit">
        <NativeTabs.Trigger.Label>UI Kit</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="widgets" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
