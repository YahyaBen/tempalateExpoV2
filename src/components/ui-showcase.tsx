import {
    BottomSheet,
    Button,
    Checkbox,
    Collapsible,
    Column,
    FieldGroup,
    Host,
    Icon,
    List,
    ListItem,
    Picker,
    RNHostView,
    Row,
    ScrollView,
    Slider,
    Spacer,
    Switch,
    Text,
    TextInput,
    useNativeState,
} from '@expo/ui';
import { useCallback, useState, type ReactNode } from 'react';
import { Platform, ScrollView as RNScrollView, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Alert } from '@/components/ui/alert';
import { DARK_COLORS, LIGHT_COLORS } from '@/constants/theme.colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

const STAR = Icon.select({
  ios: 'star.fill',
  android: import('@expo/material-symbols/star.xml'),
});
const HEART = Icon.select({
  ios: 'heart.fill',
  android: import('@expo/material-symbols/favorite.xml'),
});
const CHECK = Icon.select({
  ios: 'checkmark.circle.fill',
  android: import('@expo/material-symbols/check_circle.xml'),
});

function useShowcaseTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS } as const;
}

function Example({
  title,
  description,
  height,
  children,
}: {
  title: string;
  description: string;
  height?: number;
  children: ReactNode;
}) {
  const { colors, scheme } = useShowcaseTheme();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <RNText accessibilityRole="header" style={{ color: colors.foreground, fontSize: 19, fontWeight: '600' }}>
          {title}
        </RNText>
        <RNText style={{ color: colors.mutedForeground, fontSize: 14, lineHeight: 21 }}>
          {description}
        </RNText>
      </View>
      <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }}>
        <Host
          colorScheme={scheme}
          seedColor={colors.primary}
          ignoreSafeArea="all"
          matchContents={height === undefined ? { vertical: true } : false}
          style={{ ...(height === undefined ? {} : { height }) }}>
          {children}
        </Host>
      </View>
    </View>
  );
}

export default function UIShowcase() {
  const { colors, scheme } = useShowcaseTheme();
  const insets = useSafeAreaInsets();
  const [presses, setPresses] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [volume, setVolume] = useState(40);
  const [fruit, setFruit] = useState('Mango');
  const [expanded, setExpanded] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState('Design');
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [preview, setPreview] = useState('Hello, Expo!');
  const text = useNativeState('Hello, Expo!');
  const handleTextChange = useCallback((value: string) => {
    'worklet';
    text.value = value;
  }, [text]);
  const body = { color: colors.foreground, fontSize: 16 };
  const muted = { color: colors.mutedForeground, fontSize: 14 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RNScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: Math.max(insets.bottom, 24) + 24, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 680, gap: 28 }}>
          <View style={{ gap: 8 }}>
            <RNText style={{ color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 }}>
              SDK 57 · 19 UNIVERSAL COMPONENTS
            </RNText>
            <RNText style={{ color: colors.foreground, fontSize: 17, lineHeight: 25 }}>
              Tap, type, slide, and explore. A playground for every universal Expo UI component.
            </RNText>
          </View>

          <Example title="Host · Text" description="A themed native container with different text sizes and weights.">
            <Column spacing={10}>
              <Text textStyle={{ ...body, fontSize: 28, fontWeight: '700' }}>Hello, universal UI.</Text>
              <Text textStyle={body}>One component API. A native feel on each platform.</Text>
              <Text textStyle={muted}>This preview follows your device’s light or dark appearance.</Text>
            </Column>
          </Example>

          <Example title="Button" description="Filled, outlined, text, and disabled states. Tap to count.">
            <Column spacing={12}>
              <Button label="Filled button" onPress={() => setPresses((value) => value + 1)} />
              <Button label="Outlined button" variant="outlined" onPress={() => setPresses((value) => value + 1)} />
              <Button label="Reset counter" variant="text" onPress={() => setPresses(0)} />
              <Button label="Disabled button" disabled />
              <Text textStyle={body} testID="button-count">{`Pressed ${presses} ${presses === 1 ? 'time' : 'times'}`}</Text>
            </Column>
          </Example>

          <Example title="Switch · Checkbox" description="Toggle the controls and compare their disabled states.">
            <Column spacing={16}>
              <Switch label="Enable demo checkbox" value={enabled} onValueChange={setEnabled} />
              <Checkbox label="Try this checkbox" value={checked} onValueChange={setChecked} disabled={!enabled} />
              <Switch label="Disabled switch" value={false} onValueChange={setEnabled} disabled />
              <Text textStyle={muted}>{`Checkbox: ${checked ? 'checked' : 'unchecked'} · ${enabled ? 'enabled' : 'disabled'}`}</Text>
            </Column>
          </Example>

          <Example title="Slider" description="Drag the thumb through a stepped range from 0 to 100.">
            <Column spacing={12}>
              <Text textStyle={body}>{`Value: ${Math.round(volume)}%`}</Text>
              <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={5} testID="demo-slider" />
              <Text textStyle={muted}>Disabled slider</Text>
              <Slider value={25} onValueChange={setVolume} min={0} max={100} disabled />
            </Column>
          </Example>

          <Example title="TextInput" description="Edit the text, then press Preview or the keyboard’s Done key.">
            <Column spacing={12}>
              <Text textStyle={body}>Your message</Text>
              <TextInput
                value={text}
                onChangeText={handleTextChange}
                onSubmitEditing={setPreview}
                returnKeyType="done"
                placeholder="Write a message"
                maxLength={120}
                textStyle={body}
                placeholderTextColor={colors.mutedForeground}
                style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}
                testID="demo-text-input"
              />
              <Button label="Preview message" variant="outlined" onPress={() => setPreview(text.value)} />
              <Text textStyle={body} testID="message-preview">{preview || 'Your message is empty. Type something and try again.'}</Text>
            </Column>
          </Example>

          <Example title="Picker" description="Choose a fruit from the native menu. Both pickers share the selection.">
            <Column spacing={16}>
              <Text textStyle={body}>{`Selected fruit: ${fruit}`}</Text>
              <Picker selectedValue={fruit} onValueChange={setFruit} testID="demo-picker">
                {['Mango', 'Peach', 'Strawberry'].map((item) => <Picker.Item key={item} label={item} value={item} />)}
              </Picker>
              <Text textStyle={muted}>Wheel on iOS; menu on Android and web.</Text>
              <Picker selectedValue={fruit} onValueChange={setFruit} appearance="wheel">
                {['Mango', 'Peach', 'Strawberry'].map((item) => <Picker.Item key={item} label={item} value={item} />)}
              </Picker>
            </Column>
          </Example>

          <Example title="Icon" description="SF Symbols on iOS and Material Symbols on Android.">
            <Column spacing={12}>
              <Row spacing={28} alignment="center">
                <Icon name={STAR} size={28} color={colors.warning} accessibilityLabel="Star" />
                <Icon name={HEART} size={32} color={colors.destructive} accessibilityLabel="Heart" />
                <Icon name={CHECK} size={36} color={colors.success} accessibilityLabel="Checkmark" />
              </Row>
              <Text textStyle={muted}>{Platform.OS === 'web' ? 'Icon has no web renderer in this SDK. Open this example on iOS or Android to see the symbols.' : 'Star · Heart · Checkmark'}</Text>
            </Column>
          </Example>

          <Example title="Column · Row · Spacer" description="Vertical and horizontal layouts with fixed and flexible spacing.">
            <Column spacing={12}>
              <Row alignment="center" style={{ padding: 14, backgroundColor: colors.content2, borderRadius: 10 }}>
                <Text textStyle={body}>Start</Text>
                <Spacer flexible />
                <Text textStyle={body}>End</Text>
              </Row>
              <Row alignment="center">
                <Text textStyle={body}>Left</Text>
                <Spacer size={32} />
                <Text textStyle={body}>32pt gap</Text>
              </Row>
              <Text textStyle={muted}>These rows are stacked inside a Column.</Text>
            </Column>
          </Example>

          <Example title="ScrollView" description="Swipe horizontally to see all six tiles." height={100}>
            <ScrollView direction="horizontal" showsIndicators style={{ height: 100 }}>
              <Row spacing={12} alignment="center" style={{ paddingBottom: 12 }}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Column key={item} alignment="center" style={{ width: 100, padding: 24, borderRadius: 12, backgroundColor: colors.content2 }}>
                    <Text textStyle={{ ...body, fontSize: 22, fontWeight: '600' }}>{String(item).padStart(2, '0')}</Text>
                  </Column>
                ))}
              </Row>
            </ScrollView>
          </Example>

          <Example title="Collapsible" description="Tap the header to reveal or hide its content.">
            <Collapsible label="A little more detail" isOpen={expanded} onOpenChange={setExpanded} labelStyle={body}>
              <Column spacing={10} style={{ paddingVertical: 12 }}>
                <Text textStyle={body}>You found the hidden content.</Text>
                <Text textStyle={muted}>A useful place for supporting details and optional settings.</Text>
                <Button label="Collapse again" variant="text" onPress={() => setExpanded(false)} />
              </Column>
            </Collapsible>
          </Example>

          <Example title="List · ListItem" description={`Tap a row to select it. Current selection: ${selectedRow}.`} height={260}>
            <List>
              {['Design', 'Develop', 'Deliver'].map((item, index) => (
                <ListItem key={item} onPress={() => setSelectedRow(item)} supportingText={['Shape the experience', 'Build something useful', 'Share it with the world'][index]}>
                  <ListItem.Leading><Text textStyle={muted}>{`0${index + 1}`}</Text></ListItem.Leading>
                  <Text textStyle={body}>{item}</Text>
                  <ListItem.Trailing><Text textStyle={{ ...muted, color: colors.primary }}>{selectedRow === item ? 'Selected' : 'Select'}</Text></ListItem.Trailing>
                </ListItem>
              ))}
            </List>
          </Example>

          <Example title="FieldGroup" description="Grouped form rows with a section header and footer." height={250}>
            <FieldGroup>
              <FieldGroup.Section title="Preferences">
                <FieldGroup.SectionHeader><Text textStyle={muted}>Demo preferences</Text></FieldGroup.SectionHeader>
                <Switch label="Notifications" value={notifications} onValueChange={setNotifications} />
                <Checkbox label="Weekly newsletter" value={newsletter} onValueChange={setNewsletter} />
                <FieldGroup.SectionFooter>
                  <Text textStyle={muted}>{`Notifications ${notifications ? 'on' : 'off'} · Newsletter ${newsletter ? 'on' : 'off'}. Demo settings stay on this page.`}</Text>
                </FieldGroup.SectionFooter>
              </FieldGroup.Section>
            </FieldGroup>
          </Example>

          <Example title="RNHostView" description="Embed a React Native view inside a native Expo UI layout.">
            <Column spacing={12}>
              <Text textStyle={body}>Universal layout</Text>
              <RNHostView matchContents>
                <View style={{ padding: 16, borderRadius: 12, backgroundColor: colors.content2, gap: 6 }}>
                  <RNText style={{ color: colors.foreground, fontWeight: '600', fontSize: 16 }}>React Native content</RNText>
                  <RNText style={{ color: colors.mutedForeground, fontSize: 14 }}>This View and its text live inside RNHostView.</RNText>
                </View>
              </RNHostView>
              <Text textStyle={muted}>Back in universal Text.</Text>
            </Column>
          </Example>

          <Example title="BottomSheet" description="Open a sheet, drag between heights, then swipe down or close it.">
            <Button label="Open bottom sheet" onPress={() => setSheetVisible(true)} />
          </Example>

          <Example title="Alert" description="Cross-platform alert dialog and inline banners using Expo UI tokens.">
            <Column spacing={12}>
              <Alert.Banner
                variant="info"
                title="Info Alert"
                description="This is an inline informational alert banner."
              />
              <Row spacing={12}>
                <Button label="Open alert dialog" onPress={() => setAlertVisible(true)} />
                <Button
                  label="Native Alert"
                  variant="outlined"
                  onPress={() => Alert.alert('Native Alert', 'Triggered via Alert.alert()')}
                />
              </Row>
            </Column>
          </Example>
        </View>
      </RNScrollView>

      <Alert.Dialog
        isPresented={alertVisible}
        title="Discard changes?"
        message="Are you sure you want to discard your unsaved changes? This action cannot be undone."
        actions={[
          { label: 'Cancel', variant: 'cancel' },
          { label: 'Discard', variant: 'destructive', onPress: () => console.log('Discarded') },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />

      {/* BottomSheet provides its own native host; nest a Host for the demo controls. */}
      <BottomSheet isPresented={sheetVisible} onDismiss={() => setSheetVisible(false)} snapPoints={['half', 'full']} containerColor={colors.card} contentPadding={24}>
        <Host matchContents={{ vertical: true }} colorScheme={scheme} seedColor={colors.primary}>
          <Column spacing={20}>
            <Text textStyle={{ ...body, fontSize: 24, fontWeight: '700' }}>Hello from the sheet</Text>
            <Text textStyle={body}>Drag the handle to resize. Swipe down, tap outside, or use the button to dismiss.</Text>
            <Button label="Close sheet" onPress={() => setSheetVisible(false)} />
          </Column>
        </Host>
      </BottomSheet>
    </View>
  );
}
