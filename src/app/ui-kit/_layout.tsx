import { Stack } from 'expo-router/stack';
import { Platform, View } from 'react-native';

export default function UIKitLayout() {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'web' ? 72 : 0 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Expo UI Kit' }} />
      </Stack>
    </View>
  );
}
