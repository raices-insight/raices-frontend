import { router } from 'expo-router';
import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function EmptyFamilyState() {
  return (
    <View className="flex-1 px-6 justify-center items-center mt-16">
      <View className="w-24 h-24 bg-raices-primary/10 rounded-full items-center justify-center mb-6">
        <IconSymbol name="person.3.fill" size={48} color="#325F3F" />
      </View>

      <Text className="text-2xl font-headline font-bold text-raices-primary text-center mb-3">
        Sin familia vinculada
      </Text>

      <Text className="text-base font-body text-raices-text-muted text-center mb-8 px-4 leading-relaxed">
        Aún no tienes ningún adulto mayor asociado a tu cuenta. Para comenzar a organizar los cuidados, vincula a un familiar.
      </Text>

      <Pressable
        onPress={() => router.push('/(tabs)/family')}
        className="bg-raices-primary w-full py-4 rounded-2xl flex-row justify-center items-center gap-2 shadow-sm"
      >
        <IconSymbol name="plus.circle.fill" size={20} color="white" />
        <Text className="text-white font-label font-bold text-lg">
          Vincular Adulto Mayor
        </Text>
      </Pressable>
    </View>
  );
}
