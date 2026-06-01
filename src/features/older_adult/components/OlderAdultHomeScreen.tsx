import { IconSymbol } from '@/core/ui/icon-symbol';
import { Pressable, ScrollView, Text, View } from '@/core/ui/tw';
import { useState } from 'react';
import { WeekStrip } from './WeekStrip';
import { EventCard } from './EventCard';
import { FilterTabs } from './FilterTabs';
import { OlderAdultHeader } from './OlderAdultHeader';

import { ActivityIndicator } from 'react-native';
import { useOlderAdultCalendarEvents } from '@/features/calendar/context/OlderAdultCalendarEventsContext';
import { useAuth } from '@/features/auth/context/auth-context';

export function OlderAdultHomeScreen() {
  const [activeTab, setActiveTab] = useState('Hoy');
  // Shared context — same instance as OlderAdultCalendarScreen.
  // Optimistic events added in the calendar tab are immediately visible here.
  const { events, isLoading, error } = useOlderAdultCalendarEvents();
  const { user } = useAuth();

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.due_date);
    const today = new Date();
    
    // Check if it's today
    const isToday = eventDate.getDate() === today.getDate() && 
                    eventDate.getMonth() === today.getMonth() && 
                    eventDate.getFullYear() === today.getFullYear();
    
    if (activeTab === 'Hoy') {
      return isToday;
    }
    if (activeTab === 'Mañana') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return eventDate.getDate() === tomorrow.getDate() && 
             eventDate.getMonth() === tomorrow.getMonth() && 
             eventDate.getFullYear() === tomorrow.getFullYear();
    }
    if (activeTab === 'Semana') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      // Start of today (midnight) for inclusive range
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return eventDate >= startOfToday && eventDate <= nextWeek;
    }
    return true;
  });

  return (
    <View className="flex-1 bg-raices-bg">
      <OlderAdultHeader user={user} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <WeekStrip />
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <View className="px-6 mt-8 pb-10">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-headline font-bold text-raices-primary">Próximos Eventos</Text>
            {/* 
            <Pressable className="bg-raices-secondary px-4 py-2 rounded-xl flex-row items-center gap-2 shadow-sm">
              <IconSymbol name="plus" size={16} color="white" />
              <Text className="text-white font-label font-bold text-sm">Crear Evento</Text>
            </Pressable>
            */}
          </View>

          <View className="h-[340px]">
            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#325F3F" size="large" />
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center bg-raices-surface rounded-3xl border-2 border-dashed border-red-300 p-6">
                <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#EF4444" />
                <Text className="text-red-500 font-body text-center mt-4">Error al cargar los eventos.</Text>
              </View>
            ) : filteredEvents.length === 0 ? (
              <View className="flex-1 items-center justify-center bg-raices-surface rounded-3xl border-2 border-dashed border-raices-secondary/30 p-6">
                <IconSymbol name="calendar.badge.minus" size={48} color="#A0A0A0" />
                <Text className="text-xl font-headline font-bold text-raices-text mt-4 text-center">
                  Todo despejado
                </Text>
                <Text className="text-zinc-500 font-body mt-2 text-center">
                  No tienes eventos programados para este período.
                </Text>
              </View>
            ) : (
              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
