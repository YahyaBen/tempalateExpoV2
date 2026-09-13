import { Column, RNHostView, Spacer } from '@expo/ui';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { UniversalHost } from '@/components/ui/universal-host';
import { fillSizeModifiers, fillSizeStyle } from '@/components/ui/universal-layout';
import { useThemeTokens } from '@/hooks/use-theme';

export default function LoadingScreen() {
  const theme = useThemeTokens();

  return (
    <UniversalHost style={styles.container} useViewportSizeMeasurement>
      <Column
        alignment="center"
        modifiers={fillSizeModifiers}
        style={fillSizeStyle({ backgroundColor: theme.colors.background })}>
        <Spacer flexible />
        <RNHostView matchContents>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </RNHostView>
        <Spacer flexible />
      </Column>
    </UniversalHost>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
