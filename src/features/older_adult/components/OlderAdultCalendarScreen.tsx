import { useMemo, useState } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { router } from 'expo-router';
import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { UserAvatar } from '@/core/ui/UserAvatar';
import { useAuth } from '@/features/auth/context/auth-context';
import { useOlderAdultCalendarEvents } from '@/features/calendar/context/OlderAdultCalendarEventsContext';
import { CreateEventModal } from '@/features/calendar/components/CreateEventModal';
import { EditEventModal } from '@/features/calendar/components/EditEventModal';
import { CalendarDayEventCard } from '@/features/calendar/components/CalendarDayEventCard';
import type { CalendarEvent } from '@/features/calendar/api/schemas';
import { CalendarMonthGrid, MONTH_NAMES } from '@/features/calendar/components/CalendarMonthGrid';

export function OlderAdultCalendarScreen() {
  const { user } = useAuth();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const { events, isLoading, refetch, addEventOptimistically, deleteEvent, editEvent } = useOlderAdultCalendarEvents();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const eventDays = useMemo(
    () => new Set(
      events
        .map((e) => new Date(e.due_date))
        .filter((d) => d.getMonth() === currentMonth && d.getFullYear() === currentYear)
        .map((d) => d.getDate()),
    ),
    [events, currentMonth, currentYear],
  );

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedIsPast = selectedDate < startOfToday;

  const selectedDayEvents = events.filter((e) => {
    const d = new Date(e.due_date);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  const firstName = user?.name?.split(' ')[0] ?? 'Calendario';

  return (
    <View className="flex-1 bg-raices-bg">
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-raices-bg">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            className="w-11 h-11 rounded-full overflow-hidden"
            hitSlop={8}
          >
            <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={44} />
          </Pressable>
          <Text className="text-2xl font-headline font-bold text-raices-primary">
            {firstName}
          </Text>
        </View>
        <Pressable className="w-10 h-10 items-center justify-center" hitSlop={8}>
          <IconSymbol name="bell.fill" size={24} color="#325F3F" />
        </Pressable>
      </View>

      <RNScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        <CalendarMonthGrid
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedDate={selectedDate}
          eventDays={eventDays}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onSelectDay={setSelectedDate}
        />

        <Pressable
          onPress={() => { if (!selectedIsPast) setCreateModalVisible(true); }}
          disabled={selectedIsPast}
          className="bg-raices-primary rounded-2xl py-4 flex-row items-center justify-center mb-6"
          style={{ gap: 10, opacity: selectedIsPast ? 0.4 : 1 }}
        >
          <IconSymbol name="plus" size={20} color="white" />
          <Text className="text-white font-headline font-bold text-base">Crear Evento</Text>
        </Pressable>
        {selectedIsPast ? (
          <Text className="text-xs font-body text-raices-text-muted text-center -mt-4 mb-4">
            No puedes crear eventos en días pasados.
          </Text>
        ) : null}

        <Text className="text-xl font-headline font-bold text-raices-text mb-4">
          Eventos para el {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}
        </Text>

        {isLoading ? (
          <View className="items-center py-10">
            <Text className="text-raices-text-muted font-body">Cargando eventos...</Text>
          </View>
        ) : selectedDayEvents.length === 0 ? (
          <View className="items-center py-10 bg-white rounded-3xl">
            <IconSymbol name="calendar.badge.minus" size={40} color="#A0A0A0" />
            <Text className="text-raices-text-muted font-body mt-3 text-center">
              No hay eventos para este día.
            </Text>
          </View>
        ) : (
          selectedDayEvents.map((event) => (
            <CalendarDayEventCard
              key={event.id}
              event={event}
              onDelete={deleteEvent}
              onEdit={setEditingEvent}
            />
          ))
        )}
      </RNScrollView>

      <EditEventModal
        event={editingEvent}
        visible={editingEvent !== null}
        onClose={() => setEditingEvent(null)}
        onSave={editEvent}
      />

      <CreateEventModal
        selectedDate={selectedDate}
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        addEvent={(dto) => {
          // Show the event immediately — don't wait for NATS async processing
          addEventOptimistically({
            id: `optimistic-${Date.now()}`,
            title: dto.title,
            due_date: dto.date.toISOString(),
            status: 'pending',
            description: null,
            creator_audio_profile_id: null,
            adult_profile_id: null,
            audio_url: null,
          });
          // Background sync: give the assistant service time to persist the event
          // via NATS before we refetch, then replace the optimistic entry with
          // the real server record.
          setTimeout(() => { void refetch(); }, 3000);
        }}
      />
    </View>
  );
}
