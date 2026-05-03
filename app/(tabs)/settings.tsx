import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Image } from '@/core/ui/image';
import { Pressable, Text, View } from '@/core/ui/tw';
import { useAuth } from '@/features/auth/context/auth-context';
import { OlderAdultProfileScreen } from '@/features/older_adult/components/OlderAdultProfileScreen';

export default function SettingsScreen() {
  const { user, signOut, sessionToken } = useAuth();

  if (user?.role === 'older_adult') {
    return <OlderAdultProfileScreen />;
  }

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const roleLabel = user?.role === 'user' ? 'Sin definir' : user?.role === 'caregiver' ? 'Cuidador' : user?.role === 'older_adult' ? 'Adulto Mayor' : user?.role;

  return (
    <View className="flex-1 bg-raices-bg p-6">
      <View className="mt-8">
        <Text className="font-headline text-xl text-raices-text mb-4">Cuenta</Text>
        <View className="bg-raices-surface rounded-2xl p-4 border border-raices-secondary/15">
          <View className="flex-row items-center gap-3 mb-4">
            {user?.photo ? (
              <Image
                source={{ uri: user.photo }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-raices-secondary/20" />
            )}
            <View>
              <Text className="font-body font-bold text-raices-text">
                {user?.name ?? 'Usuario'}
              </Text>
              <Text className="font-body text-sm text-raices-text-muted">
                {user?.email}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="px-3 py-1 rounded-full bg-raices-secondary/10">
              <Text className="font-body text-sm text-raices-secondary capitalize">
                {roleLabel}
              </Text>
            </View>
          </View>
          <Text className="font-body text-xs text-raices-text-muted mt-4">
            Token: {sessionToken ? 'Sí' : 'No'}
          </Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="font-headline text-xl text-raices-text mb-4">Acerca de</Text>
        <View className="bg-raices-surface rounded-2xl p-4 border border-raices-secondary/15">
          <Text className="font-body text-raices-text-muted">
            Raíces v1.0.0
          </Text>
          <Text className="font-body text-sm text-raices-text-muted mt-1">
            Cuidando el bienestar de los que más quieres
          </Text>
        </View>
      </View>

      <View className="mt-auto">
        <Pressable
          className="py-4 px-6 rounded-full bg-red-50 border border-red-200 items-center justify-center"
          onPress={handleSignOut}
        >
          <Text className="font-headline font-bold text-red-600">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}