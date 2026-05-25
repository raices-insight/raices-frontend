import { AccountSetupScreen } from '@/core/ui/account-setup-screen';
import { Image } from '@/core/ui/image';
import { Pressable, Text, View } from '@/core/ui/tw';
import type { GoogleUser } from '@/features/auth/hooks/use-google-auth';
import { Modal } from 'react-native';
import { LocationIndicator } from '../../location/components/LocationIndicator';


interface ProfileScreenProps {
  user: GoogleUser;
  isNewUser: boolean;
  onSignOut: () => void;
  onCompleteOnboarding: (role: 'caregiver' | 'older_adult') => void;
  loading?: boolean;
}

export function ProfileScreen({
  user,
  isNewUser,
  onSignOut,
  onCompleteOnboarding,
  loading,
}: ProfileScreenProps) {

  return (
    <View className="flex-1 items-center justify-center p-6 bg-raices-bg">
      <Modal visible={isNewUser} presentationStyle="fullScreen" animationType="slide">
        <AccountSetupScreen
          user={user}
          onComplete={onCompleteOnboarding}
          loading={loading}
        />
      </Modal>
      <View className="w-full max-w-[360px] items-center gap-3 bg-raices-surface rounded-[24px] border border-raices-secondary/15 py-7 px-5 shadow-sm elevation-2">
        {user.photo && (
          <Image 
            source={{ uri: user.photo }} 
            className="w-24 h-24 rounded-full mb-2" 
          />
        )}
        <Text className="font-headline font-bold text-[22px] text-raices-text">
          {user.name ?? 'Usuario'}
        </Text>
        <Text className="font-body text-raices-text-muted">
          {user.email}
        </Text>
        <LocationIndicator></LocationIndicator>
        <Pressable 
          className="mt-4 py-4 px-8 rounded-full items-center justify-center w-full max-w-[280px] bg-raices-secondary" 
          onPress={onSignOut}
        >
          <Text className="font-headline font-bold text-white text-base">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
