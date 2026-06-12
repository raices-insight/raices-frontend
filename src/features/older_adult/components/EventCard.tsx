import { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from "react-native-reanimated";
import { View, Text } from "@/core/ui/tw";
import { IconSymbol } from "@/core/ui/icon-symbol";
import { AudioPlayButton } from "@/core/ui/audio-play-button";
import { getRelativeTimeLabel } from "@/core/utils/relative-date";
import type { CalendarEvent } from "../../calendar/api/schemas";

export function EventCard({ event, index = 0 }: { event: CalendarEvent; index?: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    const delay = index * 60;
    opacity.value = withDelay(delay, withTiming(1, { duration: 280 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 250 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const date = new Date(event.due_date);
  const timeString = getRelativeTimeLabel(date);
  const isCompleted = event.status === "completed";

  return (
    <Animated.View style={animStyle}>
    <View
      className={`bg-raices-surface rounded-3xl p-5 mb-4 shadow-sm border-l-8 ${isCompleted ? "border-gray-300" : "border-raices-secondary"}`}
      style={isCompleted ? { opacity: 0.7 } : undefined}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <IconSymbol name="calendar" size={20} color="#53815F" />
          <Text className="text-sm font-label font-medium text-raices-secondary">
            {timeString}
          </Text>
        </View>
        {isCompleted && (
          <View className="flex-row items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
            <IconSymbol name="checkmark.circle.fill" size={14} color="#4CAF50" />
            <Text className="text-xs font-label font-bold" style={{ color: '#4CAF50' }}>
              Completado
            </Text>
          </View>
        )}
      </View>
      <Text
        className="text-xl font-headline font-bold mb-4"
        style={isCompleted ? { textDecorationLine: 'line-through', color: '#9CA3AF' } : { color: '#1a1a1a' }}
      >
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
    </Animated.View>
  );
}
