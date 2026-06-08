import { View } from '@/core/ui/tw';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { useAuth } from '@/features/auth/context/auth-context';
import { CaregiverHomeScreen } from '@/features/caregiver/components/CaregiverHomeScreen';
import { OlderAdultHomeScreen } from '@/features/older_adult/components/OlderAdultHomeScreen';
import { useWebSocket } from '@/src/core/websocket/websocket-provider';
import { getCurrentLocation, startPsychoLocationTracking, startRelaxLocationTracking } from '@/src/features/location/services/tracking.service';
import { useEffect, useRef } from 'react';



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

  useEffect(() => {
    if (isLoggingOut.current) {
      isLoggingOut.current = false;
    }
  }, [user]);

  const handleSignOut = () => {
    isLoggingOut.current = true;
    signOut();
  };

  const isOlderAdult = user?.role === 'older_adult';
  const isCaregiver = user?.role === 'caregiver';
  const needsOnboarding = !isOlderAdult && !isCaregiver;

  useEffect(() => {
    if (isOlderAdult) {
      getCurrentLocation();
      
      socket.subscribe("location.track.psycho", async () => {
        await startPsychoLocationTracking();
      });

      socket.subscribe("location.track.relax", async () => {
        await startRelaxLocationTracking();
      });
    }
  }, [isOlderAdult, socket]);

  // If there's no user, we return null to prevent a flash of the profile screen
  // before the root layout guard redirects the user to the login screen.
  if (!user) return null;

  return (
    <View className="flex-1 bg-raices-bg">
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
    </View>
  );
}
