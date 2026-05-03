import { useEffect, useRef } from 'react';
import { View } from '@/core/ui/tw';
import { LoginScreen } from '@/features/auth/components/LoginScreen';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { OlderAdultHomeScreen } from '@/features/older_adult/components/OlderAdultHomeScreen';
import { CaregiverHomeScreen } from '@/features/caregiver/components/CaregiverHomeScreen';
import { useAuth } from '@/features/auth/context/auth-context';

export default function HomeScreen() {
  const {
    user,
    loading,
    error,
    isNewUser,
    signIn,
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

  return (
    <View className="flex-1 bg-raices-bg">
      {user ? (
        isOlderAdult ? (
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
        )
      ) : (
        <LoginScreen
          loading={loading}
          error={error}
          onSignIn={signIn}
        />
      )}
    </View>
  );
}
