import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function FamilyHeader() {
  return (
    <View className="bg-raices-primary h-28 pt-8 px-6 flex-row items-center justify-between">
      <View>
        <Text className="text-white font-label font-bold text-lg">Familia</Text>
      </View>
      <View className="flex-row items-center gap-4">
        <IconSymbol name="magnifyingglass" size={24} color="white" weight="bold" />
        <IconSymbol name="bell" size={24} color="white" weight="bold" />
      </View>
    </View>
  );
}
