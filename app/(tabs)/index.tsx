import { Animated } from '@/core/ui/animated';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { useAuth } from '@/features/auth/context/auth-context';
import { CaregiverHomeScreen } from '@/features/caregiver/components/CaregiverHomeScreen';
import { LocationPermissionModal } from '@/features/location/components/LocationPermissionModal';
import { usePrivacy } from '@/features/older_adult/hooks/use-privacy';
import { OlderAdultHomeScreen } from '@/features/older_adult/components/OlderAdultHomeScreen';
import { useWebSocket } from '@/src/core/websocket/websocket-provider';
import { getCurrentLocation, startPsychoLocationTracking, startRelaxLocationTracking, stopTrackingLocation } from '@/src/features/location/services/tracking.service';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';



export default function HomeScreen() {
  const {
    user,
    loading,
    isNewUser,
    signOut,
    completeOnboarding,
  } = useAuth();

  const isLoggingOut = useRef(false);
  const socket = useWebSocket();
  const [showLocationModal, setShowLocationModal] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const screenStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      opacity.value = withTiming(1, { duration: 350 });
      translateY.value = withTiming(0, { duration: 350 });
      return () => {
        opacity.value = 0;
        translateY.value = 20;
      };
    }, [opacity, translateY])
  );

  const isOlderAdult = user?.role === 'older_adult';
  const isCaregiver = user?.role === 'caregiver';
  const needsOnboarding = !isOlderAdult && !isCaregiver;

  const { isActivityShared, setIsActivityShared, loading: privacyLoading, save: savePrivacy } = usePrivacy();

  useEffect(() => {
    if (isLoggingOut.current) {
      isLoggingOut.current = false;
    }
  }, [user]);

  const handleSignOut = () => {
    isLoggingOut.current = true;
    signOut();
  };

  useEffect(() => {
    if (!isOlderAdult || privacyLoading) return;

    if (!isActivityShared) {
      void stopTrackingLocation();
      return;
    }

    void (async () => {
      const result = await getCurrentLocation();
      if (result === 'permission-denied') {
        setShowLocationModal(true);
      }
    })();

    socket.subscribe("location.track.psycho", async () => {
      await startPsychoLocationTracking();
    });

    socket.subscribe("location.track.relax", async () => {
      await startRelaxLocationTracking();
    });
  }, [isOlderAdult, privacyLoading, isActivityShared, socket]);

  // If there's no user, we return null to prevent a flash of the profile screen
  // before the root layout guard redirects the user to the login screen.
  if (!user) return null;

  return (
    <Animated.View className="flex-1 bg-raices-bg" style={screenStyle}>
      {isOlderAdult ? (
        <OlderAdultHomeScreen />
      ) : isCaregiver ? (
        <CaregiverHomeScreen />
      ) : (
        <ProfileScreen
          user={user}
          isNewUser={needsOnboarding}
          onSignOut={handleSignOut}
          onCompleteOnboarding={completeOnboarding}
          loading={loading}
        />
      )}
      <LocationPermissionModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onDismiss={() => {
          setIsActivityShared(false);
          void savePrivacy({ isActivityShared: false });
        }}
      />
    </Animated.View>
  );
}
