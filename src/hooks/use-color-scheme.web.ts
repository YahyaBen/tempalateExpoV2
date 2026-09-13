import { useContext, useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemeContext } from '@/context/theme-context';

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): 'light' | 'dark' {
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const context = useContext(ThemeContext);
  const rnScheme = useRNColorScheme();

  if (context) {
    return context.colorScheme;
  }

  if (hasHydrated) {
    return rnScheme === 'dark' ? 'dark' : 'light';
  }

  return 'light';
}
