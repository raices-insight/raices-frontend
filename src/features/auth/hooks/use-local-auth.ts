import { useCallback, useState } from 'react';
import { loginLocal } from '@/services/auth-api';
import type { GoogleUser } from './use-google-auth';

export interface LocalAuthState {
  user: GoogleUser | null;
  sessionToken: string | null;
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  isNewUser: boolean | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  signIn: () => void;
  signOut: () => void;
}

export function useLocalAuth(): LocalAuthState {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const handleSignIn = useCallback(async () => {
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const session = await loginLocal(email, password);
      console.log('[LocalAuth] session recibida:', JSON.stringify(session));
      setSessionToken(session.accessToken);
      setIsNewUser(session.isNewUser);
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
        photo: session.user.avatar ?? null,
        role: session.user.role,
      });
      console.log('[LocalAuth] user seteado, role:', session.user.role);
    } catch (e) {
      console.error('[LocalAuth] error en login:', e);
      setError(e instanceof Error ? e.message : `Error inesperado: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const handleSignOut = useCallback(() => {
    setUser(null);
    setSessionToken(null);
    setIsNewUser(null);
    setEmail('');
    setPassword('');
    setError(null);
  }, []);

  return {
    user,
    sessionToken,
    email,
    password,
    loading,
    error,
    isNewUser,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    signIn: () => { void handleSignIn(); },
    signOut: handleSignOut,
  };
}
