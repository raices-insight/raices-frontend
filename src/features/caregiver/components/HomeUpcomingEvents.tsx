import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text } from '@/core/ui/tw';
import { SkeletonBox } from '@/core/ui/SkeletonBox';
import type { CalendarEvent } from '@/features/calendar/api/schemas';

interface HomeUpcomingEventsProps {
  events: CalendarEvent[];
  loading: boolean;
}

function EventChip({ event }: { event: CalendarEvent }) {
  const date = new Date(event.due_date);
  const timeString = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      className="bg-white border border-raices-secondary/20 rounded-2xl p-4 mr-3"
      style={{ width: 160, borderLeftWidth: 4, borderLeftColor: '#325F3F' }}
    >
      <Text className="font-headline font-bold text-raices-primary text-base mb-1">
        {timeString}
      </Text>
      <Text className="font-headline font-bold text-raices-text text-sm mb-1">
        {event.title}
      </Text>
      {event.description ? (
        <Text className="font-body text-xs text-raices-text-muted" numberOfLines={1}>
          {event.description}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Horizontal scroll strip of upcoming calendar events for the selected older adult.
 * Returns null when there are no events (avoids rendering an empty section header).
 */
export function HomeUpcomingEvents({ events, loading }: HomeUpcomingEventsProps) {
  if (loading) {
    return (
      <View className="mb-6">
        <SkeletonBox height={20} width="45%" borderRadius={8} style={{ marginHorizontal: 20, marginBottom: 12 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} className="bg-white border border-raices-secondary/20 rounded-2xl p-4 mr-3" style={{ width: 160 }}>
              <SkeletonBox height={16} width="60%" borderRadius={6} style={{ marginBottom: 8 }} />
              <SkeletonBox height={14} width="85%" borderRadius={5} style={{ marginBottom: 6 }} />
              <SkeletonBox height={11} width="70%" borderRadius={5} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (events.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="font-headline font-bold text-raices-text text-lg px-5 mb-3">
        Próximos eventos
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {events.map((event) => (
          <EventChip key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}
