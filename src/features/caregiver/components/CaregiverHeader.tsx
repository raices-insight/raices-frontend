import { Image } from 'react-native';
import { View, Text } from '@/core/ui/tw';
import { UserAvatar } from '@/core/ui/UserAvatar';
import type { GoogleUser } from '@/features/auth/hooks/use-google-auth';

interface CaregiverHeaderProps {
  user?: GoogleUser | null;
}

export function CaregiverHeader({ user }: CaregiverHeaderProps) {
  return (
    <View className="px-6 pt-12 pb-6 bg-raices-bg border-b border-raices-tertiary/20">
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-raices-primary/10 px-3 py-1 rounded-full">
          <Text className="text-xs font-label font-bold text-raices-primary uppercase tracking-widest">
            Dashboard - Cuidador
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full overflow-hidden bg-raices-surface items-center justify-center shadow-sm">
          <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={40} />
        </View>
      </View>
      <Text className="text-3xl font-headline font-bold text-raices-primary mt-2">
        {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido'}
      </Text>
      <Text className="text-base font-body text-raices-text-muted mt-1">
        Aquí podrás gestionar el cuidado de tus seres queridos.
      </Text>
    </View>
  );
}
