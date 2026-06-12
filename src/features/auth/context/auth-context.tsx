import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useGoogleAuth, type GoogleUser } from '@/features/auth/hooks/use-google-auth';
import { useLocalAuth } from '@/features/auth/hooks/use-local-auth';
import { setSessionToken as setGlobalSessionToken } from '@/core/session';
import { clearAppState } from '@/core/clear-app-state';
import { globalEvents } from '@/src/core/events';
import { stopTrackingLocation } from '@/features/location/services/tracking.service';
import { CONFIG } from '@/core/config';
import { logger } from '@/core/logger';

const LOGIN_MODE = process.env.EXPO_PUBLIC_LOGIN_MODE;

interface AuthContextValue {
  user: GoogleUser | null;
  sessionToken: string | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean | null;
  isRestoring: boolean;
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: (role: 'caregiver' | 'older_adult') => Promise<void>;
  localEmail: string;
  localPassword: string;
  onLocalEmailChange: (value: string) => void;
  onLocalPasswordChange: (value: string) => void;
  localSignIn: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const googleAuth = useGoogleAuth();
  const localAuth = useLocalAuth();
  const [isRestoring, setIsRestoring] = useState(true);
  const pendingPushTokenDeleteRef = useRef<AbortController | null>(null);
  const isSigningOutRef = useRef(false);

  const isLocalMode = LOGIN_MODE === 'LOCAL_DEVELOPMENT';

  const activeUser = googleAuth.user ?? localAuth.user;
  const activeToken = googleAuth.sessionToken ?? localAuth.sessionToken;
  const activeIsNewUser = googleAuth.isNewUser ?? localAuth.isNewUser;

  useEffect(() => {
    setGlobalSessionToken(activeToken ?? null);
  }, [activeToken]);

  // When a new user signs in: cancel any in-flight push token delete (race
  // condition guard) and reset the signing-out flag so future sign-outs work.
  useEffect(() => {
    if (activeUser) {
      isSigningOutRef.current = false;
      if (pendingPushTokenDeleteRef.current) {
        pendingPushTokenDeleteRef.current.abort();
        pendingPushTokenDeleteRef.current = null;
      }
    }
  }, [activeUser]);

  const handleSignOut = () => {
    // Prevent re-entrant calls: the push token DELETE below can return 401,
    // which would fire auth:unauthorized again → infinite loop without this guard.
    if (isSigningOutRef.current) return;
    isSigningOutRef.current = true;

    // Use raw fetch instead of apiClient so that a 401 response does NOT
    // re-trigger the auth:unauthorized interceptor and loop back here.
    const tokenSnapshot = activeToken;
    if (tokenSnapshot) {
      const controller = new AbortController();
      pendingPushTokenDeleteRef.current = controller;
      void fetch(`${CONFIG.API_URL}/assistant/push-token`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenSnapshot}` },
        signal: controller.signal,
      }).catch(() => {});
    }

    void stopTrackingLocation().catch((e) =>
      logger.warn('[SignOut] Could not stop location tracking', e),
    );

    clearAppState();
    googleAuth.signOut();
    localAuth.signOut();
  };

  useEffect(() => {
    const unsub = globalEvents.on('auth:unauthorized', () => {
      handleSignOut();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function restore() {
      if (isLocalMode) {
        await localAuth.restoreSession();
      } else {
        await googleAuth.restoreSession();
      }
      setIsRestoring(false);
    }
    void restore();
  }, []);

  const value: AuthContextValue = {
    user: activeUser,
    sessionToken: activeToken,
    loading: googleAuth.loading || (isLocalMode ? localAuth.loading : false),
    error: googleAuth.error ?? (isLocalMode ? localAuth.error : null),
    isNewUser: activeIsNewUser,
    isRestoring,
    signIn: googleAuth.signIn,
    signOut: handleSignOut,
    completeOnboarding: googleAuth.completeOnboarding,
    localEmail: localAuth.email,
    localPassword: localAuth.password,
    onLocalEmailChange: localAuth.onEmailChange,
    onLocalPasswordChange: localAuth.onPasswordChange,
    localSignIn: localAuth.signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
