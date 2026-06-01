import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { AudioPlayButton } from '@/core/ui/audio-play-button';
import type { CalendarEvent } from '../api/schemas';

interface CalendarDayEventCardProps {
  event: CalendarEvent;
  onDelete?: (id: string) => void;
  onEdit?: (event: CalendarEvent) => void;
}

export function CalendarDayEventCard({ event, onDelete, onEdit }: CalendarDayEventCardProps) {
  const time = new Date(event.due_date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
      style={{ gap: 4 }}
    >
      <View className="flex-row items-center" style={{ gap: 12 }}>
        {/* Icon circle */}
        <View className="w-12 h-12 rounded-full bg-raices-primary/15 items-center justify-center flex-shrink-0">
          <IconSymbol name="calendar" size={22} color="#325F3F" />
        </View>

        {/* Title + description */}
        <View className="flex-1">
          <Text className="font-headline font-bold text-raices-text text-base" numberOfLines={2}>
            {event.title}
          </Text>
          {event.description ? (
            <Text className="font-body text-raices-text-muted text-sm mt-0.5" numberOfLines={2}>
              {event.description}
            </Text>
          ) : null}
        </View>

        {/* Time + actions */}
        <View className="items-end flex-shrink-0" style={{ gap: 6 }}>
          <Text className="font-headline font-bold text-raices-text text-lg">{time}</Text>
          <View className="flex-row" style={{ gap: 10 }}>
            <Pressable
              hitSlop={8}
              onPress={() => onEdit?.(event)}
              testID={`edit-event-${event.id}`}
              disabled={event.id.startsWith('optimistic')}
              className={event.id.startsWith('optimistic') ? 'opacity-30' : ''}
            >
              <IconSymbol name="pencil" size={18} color="#325F3F" />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => onDelete?.(event.id)}
              testID={`delete-event-${event.id}`}
              disabled={event.id.startsWith('optimistic')}
              className={event.id.startsWith('optimistic') ? 'opacity-30' : ''}
            >
              <IconSymbol name="trash.fill" size={18} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Audio play button — only shown when there is a voice message */}
      {event.audio_url ? (
        <View className="ml-[60px]">
          <AudioPlayButton audioUrl={event.audio_url} variant="pill-sm" />
        </View>
      ) : null}
    </View>
  );
}
