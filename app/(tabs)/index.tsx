import { useGoogleAuth } from '@/features/auth/hooks/use-google-auth';
import { LoginScreen } from '@/features/auth/components/LoginScreen';
import { ProfileScreen } from '@/features/auth/components/ProfileScreen';
import { View } from '@/core/ui/tw';

export default function HomeScreen() {
  const { user } = useGoogleAuth();

  return (
    <View className="flex-1 bg-raices-bg">
      {user ? <ProfileScreen /> : <LoginScreen />}
    </View>
  );
}
