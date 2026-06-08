import { ActivityIndicator , Alert } from 'react-native';
import { View, ScrollView, Text, Pressable } from '@/core/ui/tw';
import { OlderAdultHeader } from './OlderAdultHeader';
import { PrivacyToggleCard } from './PrivacyToggleCard';
import { useAuth } from '@/features/auth/context/auth-context';
import { usePrivacy } from '../hooks/use-privacy';

export function OlderAdultProfileScreen() {
  const { user, signOut } = useAuth();
  const {
    isMoodShared, setIsMoodShared,
    isActivityShared, setIsActivityShared,
    isHealthShared, setIsHealthShared,
    loading, saving, save,
  } = usePrivacy();

  const handleSave = async () => {
    try {
      await save();
      Alert.alert('Guardado', 'Tus preferencias de privacidad han sido actualizadas.');
    } catch {
      Alert.alert('Error', 'No se pudieron guardar tus preferencias. Intenta de nuevo.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <View className="flex-1 bg-raices-bg">
      <OlderAdultHeader user={user} onProfilePress={handleSignOut} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-10 gap-5">

          {/* Title */}
          <View className="gap-3">
            <Text className="text-5xl font-headline font-bold text-raices-primary" style={{ lineHeight: 52 }}>
              Mi Privacidad
            </Text>
            <Text className="font-body text-lg leading-7" style={{ color: '#544438' }}>
              Controla qué información compartes con tus seres queridos para que se sientan tranquilos.
            </Text>
          </View>

          {/* Privacy toggles */}
          {loading && (
            <ActivityIndicator size="large" color="#325F3F" />
          )}
          <PrivacyToggleCard
            icon="heart.fill"
            title="Compartir Ánimo"
            description="Permite que tus hijos y seres queridos sepan como te sientes hoy emocionalmente."
            value={isMoodShared}
            onToggle={setIsMoodShared}
          />
          <PrivacyToggleCard
            icon="figure.walk"
            title="Compartir Actividad"
            description="Tus familiares podrán ver tus paseos y si estás en casa descansando."
            value={isActivityShared}
            onToggle={setIsActivityShared}
          />
          <PrivacyToggleCard
            icon="face.smiling"
            title="Compartir Salud"
            description="Permite que tus seres queridos estén al tanto de tu salud."
            value={isHealthShared}
            onToggle={setIsHealthShared}
          />

          {/* Info card */}
          <View className="rounded-2xl px-8 py-10 gap-1" style={{ backgroundColor: '#d8e6a6' }}>
            <Text className="font-headline font-bold text-xl" style={{ color: '#5c6834' }}>
              Privacidad Segura
            </Text>
            <Text className="font-body text-base leading-6" style={{ color: '#5c6834' }}>
              Tus datos están protegidos y solo las personas que tú elijas podrán verlos. Puedes cambiar esto cuando quieras.
            </Text>
          </View>

          {/* Save button */}
          <Pressable
            className="w-full h-14 rounded-xl items-center justify-center"
            style={{ backgroundColor: saving ? '#6b9e78' : '#325F3F' }}
            onPress={() => { void handleSave(); }}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-label font-bold text-white text-base">
                Guardar
              </Text>
            )}
          </Pressable>

          {/* Sign out */}
          <Pressable
            className="w-full py-4 rounded-full items-center justify-center border border-red-200 bg-red-50"
            onPress={handleSignOut}
          >
            <Text className="font-headline font-bold text-red-600">
              Cerrar sesión
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
}
