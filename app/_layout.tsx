import '../src/core/patch-warnings';
import { BeVietnamPro_600SemiBold, BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../src/global.css';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { ToastProvider } from '@/core/toast/toast-provider';
import { AuthProvider, useAuth } from '@/features/auth/context/auth-context';
import { WebSocketProvider } from '@/core/websocket/websocket-provider';
import { usePushNotifications } from '@/core/hooks/use-push-notifications';

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading, isRestoring } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  // Initialize push notifications
  usePushNotifications();

  useEffect(() => {
    // Prevent navigation until the navigation state is ready and auth is restored
    if (loading || isRestoring || !navigationState?.key) return;

    // Type assertion because Expo Router hasn't regenerated typed routes for 'login' yet
    const currentSegment = segments[0] as string | undefined;
    const inAuthGroup = currentSegment === 'login';

    // Force navigation with a timeout to fix render order issues
    const timeout = setTimeout(() => {
      if (!user && !inAuthGroup) {
        // @ts-ignore: bypass strict typing until expo-env.d.ts is updated
        router.replace('/login');
      } else if (user && inAuthGroup) {
        router.replace('/');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [user, loading, isRestoring, segments, router, navigationState?.key]);

  return (
    <ToastProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="terms" options={{ presentation: 'modal', title: 'Términos de Servicio' }} />
          <Stack.Screen name="privacy" options={{ presentation: 'modal', title: 'Política de Privacidad' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ToastProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutInner fontsLoaded={fontsLoaded} fontError={fontError} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutInner({ fontsLoaded, fontError }: { fontsLoaded: boolean, fontError: Error | null }) {
  const { isRestoring } = useAuth();

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isRestoring) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isRestoring]);

  if ((!fontsLoaded && !fontError) || isRestoring) {
    return null;
  }

  return (
    <WebSocketProvider>
      <RootLayoutNav />
    </WebSocketProvider>
  );
}
