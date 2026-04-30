import { View } from '@/core/ui/tw';
import { LoginScreen } from '@/features/auth/components/LoginScreen';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { useGoogleAuth } from '@/features/auth/hooks/use-google-auth';

export default function HomeScreen() {
  const {
    user,
    loading,
    error,
    isNewUser,
    signIn,
    signOut,
    completeOnboarding,
  } = useGoogleAuth();

  return (
    <View className="flex-1 bg-raices-bg">
      {user ? (
        <ProfileScreen
          user={user}
          isNewUser={Boolean(isNewUser)}
          onSignOut={signOut}
          onCompleteOnboarding={completeOnboarding}
        />
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
