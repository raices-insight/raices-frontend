import { useEffect, useRef } from 'react';
import { View } from '@/core/ui/tw';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { OlderAdultHomeScreen } from '@/features/older_adult/components/OlderAdultHomeScreen';
import { CaregiverHomeScreen } from '@/features/caregiver/components/CaregiverHomeScreen';
import { useAuth } from '@/features/auth/context/auth-context';

export default function HomeScreen() {
  const {
    user,
    loading,
    isNewUser,
    signOut,
    completeOnboarding,
  } = useAuth();

  const isLoggingOut = useRef(false);

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
          isNewUser={Boolean(isNewUser)}
          onSignOut={handleSignOut}
          onCompleteOnboarding={completeOnboarding}
          loading={loading}
        />
      )}
    </View>
  );
}
