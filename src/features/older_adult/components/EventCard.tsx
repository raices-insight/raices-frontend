import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useAudioPlayer } from 'expo-audio';

import { useState, useEffect } from 'react';

import { CalendarEvent } from '../../calendar/api/schemas';

function AudioPlayButton({ source }: { source: any }) {
  const player = useAudioPlayer(source);
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <View className="flex-row items-center gap-2 bg-red-100 px-5 py-3 rounded-full self-start border border-red-300">
        <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#EF4444" />
        <Text className="text-sm font-label font-semibold text-red-600">
          Audio expirado
        </Text>
      </View>
    );
  }

  const [isPlaying, setIsPlaying] = useState(false);

  // Sync state if audio finishes naturally
  useEffect(() => {
    // If the player object supports listening to playback status (optional enhancement)
    // For now, we rely on the manual toggle.
    if (!player.playing && isPlaying) {
        setIsPlaying(false);
    }
  }, [player.playing]);

  return (
    <View className="self-start rounded-full">
      <Pressable 
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
            setHasError(true);
          }
        }}
        className={`flex-row items-center justify-center gap-2 px-5 py-3 rounded-full border ${isPlaying ? 'bg-[#E8F3EB] border-[#325F3F]' : 'bg-raices-bg border-raices-secondary'}`}
        style={{ minWidth: 220 }}
      >
        <IconSymbol name={isPlaying ? "pause.fill" : "play.fill"} size={20} color="#325F3F" />
        <Text className="text-sm font-label font-semibold text-raices-primary">
          {isPlaying ? "Pausar mensaje" : "Tocar para escuchar"}
        </Text>
      </Pressable>
    </View>
  );
}

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
        <AudioPlayButton source={{ uri: event.audio_url }} />
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
