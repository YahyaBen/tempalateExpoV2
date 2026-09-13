import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { queryClient } from '@/lib/react-query';
import type { AuthSession } from '@/types/auth-session.types';
import type { TokenResponse } from '@/types/auth.types';

export type { AuthSession } from '@/types/auth-session.types';

const STORAGE_KEY = 'auth.session';
const listeners = new Set<(session: AuthSession | null) => void>();

let currentSession: AuthSession | null | undefined;
let loadingSession: Promise<AuthSession | null> | null = null;

async function getStoredSession() {
  if (Platform.OS === 'web') {
    return typeof sessionStorage === 'undefined'
      ? null
      : sessionStorage.getItem(STORAGE_KEY);
  }
  return SecureStore.getItemAsync(STORAGE_KEY);
}

async function storeSession(session: string) {
  if (Platform.OS === 'web') {
    sessionStorage.setItem(STORAGE_KEY, session);
    return;
  }
  await SecureStore.setItemAsync(STORAGE_KEY, session);
}

async function removeStoredSession() {
  if (Platform.OS === 'web') {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}

function toAuthSession(token: TokenResponse): AuthSession {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAtUtc: token.accessTokenExpiresAtUtc,
    user: {
      uuid: token.userId,
      email: token.email,
      firstName: token.firstName,
      lastName: token.lastName,
      role: token.roles[0] ?? null,
      isChef: token.roles.some((role) => role.toUpperCase() === 'CHEF'),
    },
  };
}

function publish() {
  for (const listener of listeners) listener(currentSession ?? null);
}

export function subscribeAuthSession(listener: (session: AuthSession | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (currentSession !== undefined) return currentSession;

  loadingSession ??= getStoredSession()
    .then((storedSession) => {
      currentSession = storedSession
        ? (JSON.parse(storedSession) as AuthSession)
        : null;
      return currentSession;
    })
    .catch(async () => {
      currentSession = null;
      await removeStoredSession().catch(() => undefined);
      return null;
    })
    .finally(() => {
      loadingSession = null;
    });

  return loadingSession;
}

export async function getAccessToken() {
  return (await getAuthSession())?.accessToken ?? null;
}

export async function setAuthSession(token: TokenResponse) {
  const session = toAuthSession(token);
  await storeSession(JSON.stringify(session));
  currentSession = session;
  queryClient.clear();
  publish();
  return session;
}

export async function clearAuthSession() {
  await removeStoredSession();
  currentSession = null;
  queryClient.clear();
  publish();
}
