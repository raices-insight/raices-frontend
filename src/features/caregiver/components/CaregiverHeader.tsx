import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function CaregiverHeader() {
  return (
    <View className="px-6 pt-12 pb-6 bg-raices-bg border-b border-raices-tertiary/20">
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-raices-primary/10 px-3 py-1 rounded-full">
          <Text className="text-xs font-label font-bold text-raices-primary uppercase tracking-widest">
            Dashboard - Cuidador
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-raices-surface items-center justify-center shadow-sm">
          <IconSymbol name="person.crop.circle" size={24} color="#325F3F" />
        </View>
      </View>
      <Text className="text-3xl font-headline font-bold text-raices-primary mt-2">
        Bienvenido
      </Text>
      <Text className="text-base font-body text-raices-text-muted mt-1">
        Aquí podrás gestionar el cuidado de tus seres queridos.
      </Text>
    </View>
  );
}
