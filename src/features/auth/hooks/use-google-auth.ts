import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

GoogleSignin.configure({
  ...(googleWebClientId ? { webClientId: googleWebClientId } : {}),
  ...(googleIosClientId ? { iosClientId: googleIosClientId } : {}),
  offlineAccess: false,
  profileImageSize: 150,
});

export interface GoogleUser {
  id: string;
  email: string;
  name: string | null;
  photo: string | null;
}

interface GoogleAuthState {
  user: GoogleUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => void;
  signOut: () => void;
}

export function useGoogleAuth(): GoogleAuthState {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    setError(null);

    if (!googleWebClientId) {
      setError('Falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en .env');
      return;
    }

    if (Platform.OS === 'ios' && !googleIosClientId) {
      setError('Falta EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID en .env para iOS');
      return;
    }

    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUser(response.data.user);
      }
    } catch (e) {
      if (isErrorWithCode(e)) {
        const code = String(e.code);
        const message = e.message ? ` (${e.message})` : '';

        switch (e.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            break;
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError('Google Play Services no disponible.');
            break;
          default:
            if (code === '10' || code === 'DEVELOPER_ERROR') {
              setError(
                'Google DEVELOPER_ERROR (code 10). Revisa package/bundle id, SHA-1 Android y que no estés usando Expo Go.'
              );
              break;
            }

            setError(`Error Google: ${code}${message}`);
        }
      } else {
        setError(`Error inesperado: ${String(e)}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } finally {
      setUser(null);
      setError(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn: () => { void handleSignIn(); },
    signOut: () => { void handleSignOut(); },
  };
}
