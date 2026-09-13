import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AUTH_STATUS, type AuthStatus } from '@/constants/auth.constant';
import {
  getAuthSession,
  subscribeAuthSession,
  type AuthSession,
} from '@/services/auth/auth.session';

type AuthContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AUTH_STATUS.UNKNOWN);

  useEffect(() => {
    let active = true;

    const unsubscribe = subscribeAuthSession((nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setStatus(
        nextSession ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
      );
    });

    void getAuthSession()
      .then((restoredSession) => {
        if (!active) return;
        setSession(restoredSession);
        setStatus(
          restoredSession
            ? AUTH_STATUS.AUTHENTICATED
            : AUTH_STATUS.UNAUTHENTICATED,
        );
      })
      .catch(() => {
        if (!active) return;
        setSession(null);
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ session, status }), [session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuthContext must be used inside AuthProvider.');
  }

  return value;
}
