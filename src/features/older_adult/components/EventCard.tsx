import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useAudioPlayer } from 'expo-audio';

import { useState } from 'react';

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

  return (
    <Pressable 
      onPress={() => {
        try {
          // Attempt to play/pause. If the source is invalid/expired, 
          // expo-audio might throw or player.error could be set.
          if (player.playing) {
            player.pause();
          } else {
            player.play();
          }
        } catch (e) {
          setHasError(true);
        }
      }}
      className="flex-row items-center gap-2 bg-raices-bg px-5 py-3 rounded-full self-start border border-raices-secondary"
    >
      <IconSymbol name={player.playing ? "pause.fill" : "play.fill"} size={20} color="#325F3F" />
      <Text className="text-sm font-label font-semibold text-raices-primary">
        {player.playing ? "Pausar mensaje" : "Tocar para escuchar"}
      </Text>
    </Pressable>
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
