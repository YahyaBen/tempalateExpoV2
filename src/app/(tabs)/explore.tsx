import { Image } from 'expo-image';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemePicker } from '@/components/theme-picker';
import {
  Button,
  Collapsible,
  Column,
  fillSizeModifiers,
  fillSizeStyle,
  fillWidthModifiers,
  fillWidthStyle,
  RNHostView,
  ScrollView,
  Spacer,
  Text,
  UniversalHost,
} from '@/components/ui/universal';
import { useThemeTokens } from '@/hooks/use-theme';

async function openExternalLink(url: string) {
  await openBrowserAsync(url, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC });
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeTokens();

  return (
    <UniversalHost style={{ flex: 1 }} useViewportSizeMeasurement>
      <ScrollView
        showsIndicators
        modifiers={fillSizeModifiers}
        style={fillSizeStyle({
          backgroundColor: theme.colors.background,
        })}>
        <Column
          spacing={theme.space(5)}
          alignment="center"
          modifiers={fillWidthModifiers}
          style={fillWidthStyle({
            paddingTop: insets.top + theme.space(6),
            paddingBottom: insets.bottom + theme.space(6),
            paddingHorizontal: theme.space(4),
          })}>
          <Column
            spacing={theme.space(3)}
            alignment="center"
            modifiers={fillWidthModifiers}
            style={fillWidthStyle()}>
            <Text
              textStyle={{
                ...theme.typography.semantic.display,
                textAlign: 'center',
              }}>
              Explore
            </Text>
            <Text
              semantic="muted"
              textStyle={{
                ...theme.typography.semantic.body,
                textAlign: 'center',
              }}>
              {'This starter app includes example code to help you get started.'}
            </Text>
            <Button
              variant="outlined"
              label="Expo documentation"
              onPress={() => void openExternalLink('https://docs.expo.dev')}
            />
          </Column>

          <Column
            spacing={theme.space(5)}
            modifiers={fillWidthModifiers}
            style={fillWidthStyle()}>
            <Collapsible title="File-based routing">
              <Column
                spacing={theme.space(2)}
                modifiers={fillWidthModifiers}
                style={fillWidthStyle({ padding: theme.space(4) })}>
                <Text
                  textStyle={theme.typography.text.small}>
                  {'This app has two tab screens: src/app/(tabs)/index.tsx and src/app/(tabs)/explore.tsx.'}
                </Text>
                <Text
                  textStyle={theme.typography.text.small}>
                  {'The layout files configure protected authentication routes and native tabs.'}
                </Text>
                <Button
                  variant="text"
                  label="Learn more"
                  onPress={() => void openExternalLink('https://docs.expo.dev/router/introduction')}
                />
              </Column>
            </Collapsible>

            <Collapsible title="Android and iOS support">
              <Column
                spacing={theme.space(2)}
                alignment="center"
                modifiers={fillWidthModifiers}
                style={fillWidthStyle({ padding: theme.space(4) })}>
                <Text
                  textStyle={{
                    ...theme.typography.text.small,
                    textAlign: 'center',
                  }}>
                  {'The universal Expo UI components in this app render through Jetpack Compose on Android and SwiftUI on iOS.'}
                </Text>
              </Column>
            </Collapsible>

            <Collapsible title="Images">
              <Column
                spacing={theme.space(2)}
                alignment="center"
                modifiers={fillWidthModifiers}
                style={fillWidthStyle({ padding: theme.space(4) })}>
                <Text
                  textStyle={theme.typography.text.small}>
                  {'Expo Image remains the right component for bitmap assets because the universal Expo UI layer does not provide an image component.'}
                </Text>
                <RNHostView matchContents>
                  <Image
                    source={require('@/assets/images/react-logo.png')}
                    style={{ width: 100, height: 100 }}
                  />
                </RNHostView>
                <Button
                  variant="text"
                  label="Learn more"
                  onPress={() => void openExternalLink('https://docs.expo.dev/versions/v57.0.0/sdk/image/')}
                />
              </Column>
            </Collapsible>

            <Collapsible title="Light and dark mode">
              <Column
                spacing={theme.space(3)}
                modifiers={fillWidthModifiers}
                style={fillWidthStyle({ padding: theme.space(4) })}>
                <Text
                  textStyle={theme.typography.text.small}>
                  {'Choose a theme using the universal Expo UI picker.'}
                </Text>
                <ThemePicker />
              </Column>
            </Collapsible>

            <Collapsible title="Universal components">
              <Column
                spacing={theme.space(2)}
                modifiers={fillWidthModifiers}
                style={fillWidthStyle({ padding: theme.space(4) })}>
                <Text
                  textStyle={theme.typography.text.small}>
                  {'Forms, buttons, text, sheets, pickers, scrolling, and disclosure controls now use the universal @expo/ui API.'}
                </Text>
              </Column>
            </Collapsible>
          </Column>
          <Spacer size={theme.space(4)} />
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}
