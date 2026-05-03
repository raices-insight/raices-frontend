import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

interface OlderAdultHeaderProps {
  onProfilePress?: () => void;
}

export function OlderAdultHeader({ onProfilePress }: OlderAdultHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-raices-bg">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full border-2 border-raices-primary items-center justify-center bg-raices-surface">
          <Text className="text-raices-primary font-bold text-lg">R</Text>
        </View>
        <Text className="text-2xl font-headline font-bold text-raices-primary">Vínculo</Text>
      </View>
      <Pressable
        className="w-10 h-10 rounded-full bg-raices-surface items-center justify-center shadow-sm"
        onPress={onProfilePress}
      >
        <IconSymbol name="person.crop.circle" size={24} color="#325F3F" />
      </Pressable>
    </View>
  );
}
