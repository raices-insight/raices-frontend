import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import type { EventSubscription } from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuth } from '@/features/auth/context/auth-context';
import { apiClient } from '@/core/api/client';
import { logger } from '@/core/logger';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#53815F',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      logger.warn('Failed to get push token for push notification!');
      return;
    }
    
    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId,
        })
      ).data;
    } catch (e) {
      logger.warn('Could not get push token (normal in dev emulator without FCM)', e);
    }
  } else {
    logger.warn('Must use physical device for Push Notifications');
  }

  return token;
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Register for push notifications and send token to backend when user is logged in
    if (user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setExpoPushToken(token);
          // Send token to backend
          apiClient.post('/assistant/push-token', { token })
            .then(() => logger.info('Push token registered with backend successfully'))
            .catch(e => logger.error('Failed to register push token with backend', e));
        }
      });
    }
  }, [user]);

  useEffect(() => {
    // Listen for notification responses (e.g. user taps on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.eventId) {
        logger.info(`Notification tapped for eventId: ${data.eventId}, type: ${data.type}`);
        
        if (data.type === 'caretaker_missing_audio') {
          // Deep link to Caregiver Calendar to record audio
          router.push(`/(tabs)/calendario?editEventId=${data.eventId}` as any);
        } else {
          // Default: Deep link to IncomingEventView for the older adult
          router.push(`/(tabs)/incoming-event?eventId=${data.eventId}` as any);
        }
      }
    });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  return { expoPushToken };
}
