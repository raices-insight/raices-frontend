import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

export interface EventItem {
  id: string;
  time: string;
  title: string;
  icon: string;
  isCompleted?: boolean;
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <View className={`bg-raices-surface rounded-3xl p-5 mb-4 shadow-sm border-l-8 ${event.isCompleted ? 'border-gray-300 opacity-60' : 'border-raices-secondary'}`}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <IconSymbol name={event.icon as any} size={20} color="#53815F" />
          <Text className="text-sm font-label font-medium text-raices-secondary">{event.time}</Text>
        </View>
      </View>
      <Text className="text-xl font-headline font-bold text-raices-text mb-4">
        {event.title}
      </Text>
      <Pressable className="flex-row items-center gap-2 bg-raices-bg px-5 py-3 rounded-full self-start border border-raices-secondary">
        <IconSymbol name="play.fill" size={20} color="#325F3F" />
        <Text className="text-sm font-label font-semibold text-raices-primary">
          Tocar para escuchar
        </Text>
      </Pressable>
    </View>
  );
}
