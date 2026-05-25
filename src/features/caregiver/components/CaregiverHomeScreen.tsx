import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { View, ScrollView, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { CaregiverHeader } from './CaregiverHeader';
import { EmptyFamilyState } from './EmptyFamilyState';
import { useAuth } from '@/features/auth/context/auth-context';
import { useFamily } from '@/features/family/hooks/use-family';
import { useFamilyOlderAdults } from '@/features/family/hooks/use-family-older-adults';

function FamilyDashboard() {
  const { family } = useFamily();
  const { olderAdults, loading } = useFamilyOlderAdults();

  return (
    <View className="px-6 pt-4 gap-5">
      {/* Family summary card */}
      <Pressable
        onPress={() => router.push('/(tabs)/family')}
        className="rounded-3xl p-5 flex-row items-center gap-4"
        style={{ backgroundColor: 'rgba(188, 239, 197, 0.4)' }}
      >
        <View className="w-12 h-12 rounded-full items-center justify-center bg-raices-primary/15">
          <IconSymbol name="person.2.fill" size={24} color="#325F3F" />
        </View>
        <View className="flex-1">
          <Text className="font-headline font-bold text-raices-text text-lg">{family?.name}</Text>
          <Text className="font-body text-sm text-raices-text-muted">Tu familia activa</Text>
        </View>
        <IconSymbol name="chevron.right" size={18} color="#325F3F" />
      </Pressable>

      {/* Older adults */}
      <Text className="font-label font-bold text-xs uppercase tracking-widest text-raices-text-muted">
        Adultos mayores
      </Text>

      {loading ? (
        <View className="items-center py-8">
          <ActivityIndicator color="#325F3F" />
        </View>
      ) : olderAdults.length === 0 ? (
        <View className="rounded-3xl bg-white border border-raices-secondary/15 p-6 items-center gap-3">
          <IconSymbol name="person.2.fill" size={32} color="#A0A0A0" />
          <Text className="font-body text-raices-text-muted text-center text-sm">
            Aún no hay adultos mayores en la familia.{'\n'}Invítalos desde la sección Familia.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/family')}
            className="bg-raices-primary rounded-full px-5 py-2 mt-1"
          >
            <Text className="text-white font-headline font-bold text-sm">Invitar</Text>
          </Pressable>
        </View>
      ) : (
        olderAdults.map((adult) => (
          <Pressable
            key={adult.id}
            onPress={() => router.push('/(tabs)/calendario')}
            className="rounded-3xl bg-white border border-raices-secondary/10 p-4 flex-row items-center gap-4"
          >
            <View className="w-11 h-11 rounded-full items-center justify-center bg-raices-primary/10">
              <Text className="font-headline font-bold text-raices-primary">
                {adult.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-body font-bold text-raices-text">{adult.name}</Text>
              <Text className="font-body text-xs text-raices-text-muted">Adulto mayor</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="calendar" size={16} color="#325F3F" />
              <Text className="font-body text-xs text-raices-primary">Ver calendario</Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

export function CaregiverHomeScreen() {
  const { user } = useAuth();
  const { isFamily, loading: familyLoading } = useFamily();

  return (
    <View className="flex-1 bg-raices-bg">
      <CaregiverHeader user={user} onProfilePress={() => router.push('/(tabs)/settings')} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {familyLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator color="#325F3F" size="large" />
          </View>
        ) : isFamily ? (
          <FamilyDashboard />
        ) : (
          <EmptyFamilyState />
        )}
      </ScrollView>
    </View>
  );
}
