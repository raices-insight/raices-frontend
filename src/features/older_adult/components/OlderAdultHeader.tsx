import { Image } from 'react-native';
import { View, Text, Pressable } from '@/core/ui/tw';
import { UserAvatar } from '@/core/ui/UserAvatar';
import type { GoogleUser } from '@/features/auth/hooks/use-google-auth';

interface OlderAdultHeaderProps {
  user?: GoogleUser | null;
  onProfilePress?: () => void;
}

export function OlderAdultHeader({ user, onProfilePress }: OlderAdultHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-raices-bg">
      <View className="flex-row items-center gap-3">
        <Image
          source={require('@/assets/images/raices-login-logo.png')}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-headline font-bold text-raices-primary">Raíces</Text>
      </View>
      <Pressable
        className="w-10 h-10 rounded-full overflow-hidden bg-raices-surface items-center justify-center shadow-sm"
        onPress={onProfilePress}
      >
        <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={40} />
      </Pressable>
    </View>
  );
}
