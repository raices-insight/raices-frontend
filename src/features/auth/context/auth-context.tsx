import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useGoogleAuth, type GoogleUser } from '@/features/auth/hooks/use-google-auth';
import { useLocalAuth } from '@/features/auth/hooks/use-local-auth';
import { setSessionToken as setGlobalSessionToken } from '@/core/session';

const LOGIN_MODE = process.env.EXPO_PUBLIC_LOGIN_MODE;

interface AuthContextValue {
  user: GoogleUser | null;
  sessionToken: string | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean | null;
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

  const isLocalMode = LOGIN_MODE === 'LOCAL_DEVELOPMENT';

  const activeUser = googleAuth.user ?? localAuth.user;
  const activeToken = googleAuth.sessionToken ?? localAuth.sessionToken;
  const activeIsNewUser = googleAuth.isNewUser ?? localAuth.isNewUser;

  useEffect(() => {
    setGlobalSessionToken(activeToken ?? null);
  }, [activeToken]);

  const handleSignOut = () => {
    googleAuth.signOut();
    localAuth.signOut();
  };

  const value: AuthContextValue = {
    user: activeUser,
    sessionToken: activeToken,
    loading: googleAuth.loading || (isLocalMode ? localAuth.loading : false),
    error: googleAuth.error ?? (isLocalMode ? localAuth.error : null),
    isNewUser: activeIsNewUser,
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
