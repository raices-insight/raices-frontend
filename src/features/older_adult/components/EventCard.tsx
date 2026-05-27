import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { AudioPlayButton } from '@/core/ui/audio-play-button';
import type { CalendarEvent } from '../../calendar/api/schemas';

export function EventCard({ event }: { event: CalendarEvent }) {
  const date = new Date(event.due_date);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isCompleted = event.status === 'completed';

  return (
    <View className={`bg-raices-surface rounded-3xl p-5 mb-4 shadow-sm border-l-8 ${isCompleted ? 'border-gray-300 opacity-60' : 'border-raices-secondary'}`}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <IconSymbol name="calendar" size={20} color="#53815F" />
          <Text className="text-sm font-label font-medium text-raices-secondary">{timeString}</Text>
        </View>
      </View>
      <Text className="text-xl font-headline font-bold text-raices-text mb-4">
        {event.title}
      </Text>

      {event.audio_url ? (
        <AudioPlayButton audioUrl={event.audio_url} variant="pill-lg" />
      ) : (
        <View className="flex-row items-center gap-2 bg-gray-100 px-5 py-3 rounded-full self-start border border-gray-300 opacity-60">
          <IconSymbol name="mic.slash.fill" size={20} color="#9CA3AF" />
          <Text className="text-sm font-label font-semibold text-gray-500">
            Sin mensaje de voz
          </Text>
        </View>
      )}
    </View>
  );
}
