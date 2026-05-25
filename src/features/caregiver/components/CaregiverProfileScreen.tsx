import { ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { View, ScrollView, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { UserAvatar } from '@/core/ui/UserAvatar';
import { useAuth } from '@/features/auth/context/auth-context';
import { useFamily } from '@/features/family/hooks/use-family';

export function CaregiverProfileScreen() {
  const { user, signOut } = useAuth();
  const { family, isFamily, loading: familyLoading } = useFamily();

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

  const firstName = user?.name?.split(' ')[0] ?? 'Cuidador';

  return (
    <View className="flex-1 bg-raices-bg">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-10 gap-5">

          {/* ── HERO ─────────────────────────────────────────── */}
          <View className="gap-3 mb-2">
            <View className="bg-raices-primary/10 px-3 py-1 rounded-full self-start">
              <Text className="text-xs font-label font-bold text-raices-primary uppercase tracking-widest">
                Cuidador
              </Text>
            </View>
            <Text className="text-5xl font-headline font-bold text-raices-primary" style={{ lineHeight: 52 }}>
              Mi Perfil
            </Text>
            <Text className="font-body text-lg leading-7" style={{ color: '#544438' }}>
              Hola {firstName}, gestiona tu cuenta y la familia que cuidas desde aquí.
            </Text>
          </View>

          {/* ── ACCOUNT CARD ────────────────────────────────── */}
          <View
            className="rounded-3xl p-6 gap-4"
            style={{ backgroundColor: 'rgba(188, 239, 197, 0.4)' }}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-20 h-20 rounded-full overflow-hidden">
                <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={80} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-headline font-bold text-raices-text">
                  {user?.name ?? 'Usuario'}
                </Text>
                <Text className="font-body text-sm mt-0.5" style={{ color: '#544438' }}>
                  {user?.email ?? '—'}
                </Text>
              </View>
            </View>

            <View className="h-px bg-raices-primary/15" />

            <View className="flex-row items-center gap-2">
              <IconSymbol name="shield.checkered" size={18} color="#325F3F" />
              <Text className="font-body text-sm text-raices-text">
                Rol verificado:{' '}
                <Text className="font-body font-bold text-raices-primary">Cuidador</Text>
              </Text>
            </View>
          </View>

          {/* ── FAMILY CARD ─────────────────────────────────── */}
          <Pressable
            onPress={() => router.push('/(tabs)/family')}
            className="rounded-3xl p-6 gap-3"
            style={{ backgroundColor: '#d8e6a6' }}
          >
            <View className="flex-row items-center gap-3">
              <IconSymbol name="person.2.fill" size={26} color="#5c6834" />
              <Text className="text-2xl font-headline font-bold" style={{ color: '#5c6834' }}>
                Mi Familia
              </Text>
            </View>

            {familyLoading ? (
              <ActivityIndicator color="#5c6834" />
            ) : isFamily && family ? (
              <>
                <Text className="font-body text-lg" style={{ color: '#5c6834' }}>
                  {family.name}
                </Text>
                <Text className="font-body text-sm" style={{ color: '#5c6834' }}>
                  Toca para ver miembros e invitaciones.
                </Text>
              </>
            ) : (
              <Text className="font-body text-base leading-6" style={{ color: '#5c6834' }}>
                Aún no estás en una familia. Toca aquí para crear o unirte a una.
              </Text>
            )}

            <View className="flex-row items-center justify-end mt-1">
              <Text className="font-label font-bold text-sm mr-1" style={{ color: '#5c6834' }}>
                Gestionar
              </Text>
              <IconSymbol name="chevron.right" size={18} color="#5c6834" />
            </View>
          </Pressable>

          {/* ── PREFERENCES (placeholders, link out) ─────────── */}
          <View className="rounded-3xl bg-white border border-raices-secondary/15 overflow-hidden">
            <ProfileRow
              icon="bell.fill"
              label="Notificaciones"
              hint="Recordatorios y alertas"
              onPress={() => Alert.alert('Próximamente', 'Las preferencias de notificaciones estarán disponibles muy pronto.')}
            />
            <View className="h-px bg-raices-secondary/15 mx-5" />
            <ProfileRow
              icon="lock.fill"
              label="Privacidad y seguridad"
              hint="Controla tus datos"
              onPress={() => Alert.alert('Próximamente', 'La configuración de privacidad estará disponible muy pronto.')}
            />
            <View className="h-px bg-raices-secondary/15 mx-5" />
            <ProfileRow
              icon="questionmark.circle.fill"
              label="Ayuda y soporte"
              hint="Resuelve tus dudas"
              onPress={() => Alert.alert('Próximamente', 'Estamos preparando nuestro centro de ayuda.')}
            />
          </View>

          {/* ── ABOUT ───────────────────────────────────────── */}
          <View className="rounded-2xl bg-raices-surface border border-raices-secondary/15 p-5">
            <Text className="font-headline font-bold text-raices-text mb-1">Raíces</Text>
            <Text className="font-body text-sm text-raices-text-muted">
              Versión 1.0.0 — Cuidando el bienestar de los que más quieres.
            </Text>
          </View>

          {/* ── SIGN OUT ────────────────────────────────────── */}
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

function ProfileRow({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: 'bell.fill' | 'lock.fill' | 'questionmark.circle.fill';
  label: string;
  hint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 gap-4"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center bg-raices-primary/10">
        <IconSymbol name={icon} size={20} color="#325F3F" />
      </View>
      <View className="flex-1">
        <Text className="font-body font-bold text-raices-text">{label}</Text>
        <Text className="font-body text-xs text-raices-text-muted">{hint}</Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color="#A0A0A0" />
    </Pressable>
  );
}
