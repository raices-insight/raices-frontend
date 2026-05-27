import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useAudioPlayer } from 'expo-audio';
import { useState, useEffect } from 'react';
import { logger } from '@/core/logger';
import { CONFIG } from '@/core/config';
import type { CalendarEvent } from '../api/schemas';

// ── Audio play button (same pattern as EventCard) ────────────────────────────

function AudioPlayButton({ audioUrl }: { audioUrl: string }) {
  // Fix localhost URIs for physical devices / emulators
  let finalUri = audioUrl;
  if (audioUrl.includes('localhost')) {
    const apiUrl = CONFIG.API_URL || '';
    const ipMatch = apiUrl.match(/:\/\/([^\/:]+)/);
    if (ipMatch && ipMatch[1] && ipMatch[1] !== 'localhost') {
      finalUri = audioUrl.replace('localhost', ipMatch[1]);
    }
  }

  const player = useAudioPlayer({ uri: finalUri });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!player.playing && isPlaying) {
      setIsPlaying(false);
    }
  }, [player.playing]);

  if (hasError) {
    return (
      <View className="flex-row items-center gap-1 mt-2">
        <IconSymbol name="exclamationmark.triangle.fill" size={13} color="#EF4444" />
        <Text className="text-xs font-body text-red-500">Audio expirado</Text>
      </View>
    );
  }

  return (
    <Pressable
      className="flex-row items-center gap-1.5 mt-2 self-start bg-raices-secondary/10 rounded-full px-3 py-1.5"
      onPress={() => {
        try {
          if (isPlaying) {
            player.pause();
            setIsPlaying(false);
          } else {
            player.play();
            setIsPlaying(true);
          }
        } catch (e) {
          logger.error('[CalendarDayEventCard] Audio error', e);
          setHasError(true);
        }
      }}
    >
      <IconSymbol
        name={isPlaying ? 'pause.fill' : 'play.fill'}
        size={13}
        color="#53815F"
      />
      <Text className="text-xs font-label font-semibold text-raices-secondary">
        {isPlaying ? 'Pausar' : 'Escuchar mensaje'}
      </Text>
    </Pressable>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

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
            >
              <IconSymbol name="pencil" size={18} color="#325F3F" />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => onDelete?.(event.id)}
              testID={`delete-event-${event.id}`}
            >
              <IconSymbol name="trash.fill" size={18} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Audio play button — only shown when there is a voice message */}
      {event.audio_url ? (
        <View className="ml-[60px]">
          <AudioPlayButton audioUrl={event.audio_url} />
        </View>
      ) : null}
    </View>
  );
}
