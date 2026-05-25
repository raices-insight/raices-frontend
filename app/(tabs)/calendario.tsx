import { ScrollView as RNScrollView } from 'react-native';
import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { UserAvatar } from '@/core/ui/UserAvatar';
import { useAuth } from '@/features/auth/context/auth-context';
import { useAssistantCalendarEvents } from '@/features/calendar/hooks/useAssistantCalendarEvents';
import { CreateEventModal } from '@/features/calendar/components/CreateEventModal';
import { CalendarDayEventCard } from '@/features/calendar/components/CalendarDayEventCard';
import { useState } from 'react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_INITIALS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

type CellType = { day: number; type: 'prev' | 'current' | 'next' };

export default function CalendarioScreen() {
  const { user } = useAuth();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const { events, isLoading, refetch } = useAssistantCalendarEvents();

  // ── calendar helpers ────────────────────────────────────────────────
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const cells: CellType[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--)
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, type: 'current' });
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++)
    cells.push({ day: d, type: 'next' });

  // set of day-numbers in the current month that have at least one event
  const eventDays = new Set(
    events
      .map(e => new Date(e.due_date))
      .filter(d => d.getMonth() === currentMonth && d.getFullYear() === currentYear)
      .map(d => d.getDate())
  );

  const isToday = (day: number, type: CellType['type']) =>
    type === 'current' &&
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isSelected = (day: number, type: CellType['type']) =>
    type === 'current' &&
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  // ── events for selected day ─────────────────────────────────────────
  const selectedDayEvents = events.filter(e => {
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
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-raices-bg">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full overflow-hidden">
            <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={44} />
          </View>
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
        {/* ── CALENDAR CARD ──────────────────────────────────────── */}
        <View className="bg-white rounded-3xl shadow-sm p-4 mb-4">
          {/* Month navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable onPress={prevMonth} className="p-2" hitSlop={8}>
              <IconSymbol name="chevron.left" size={20} color="#325F3F" />
            </Pressable>
            <Text className="text-lg font-headline font-bold text-raices-text">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <Pressable onPress={nextMonth} className="p-2" hitSlop={8}>
              <IconSymbol name="chevron.right" size={20} color="#325F3F" />
            </Pressable>
          </View>

          {/* Day-of-week headers */}
          <View className="flex-row mb-1">
            {DAY_INITIALS.map((d, i) => (
              <View key={i} className="flex-1 items-center py-1">
                <Text className="text-xs font-semibold text-zinc-400">{d}</Text>
              </View>
            ))}
          </View>

          {/* Day cells */}
          <View className="flex-row flex-wrap">
            {cells.map((cell, idx) => {
              const todayCell = isToday(cell.day, cell.type);
              const selectedCell = isSelected(cell.day, cell.type);
              const hasDot = cell.type === 'current' && eventDays.has(cell.day);
              const isCurrent = cell.type === 'current';

              return (
                <Pressable
                  key={idx}
                  className="w-[14.28%] items-center py-1"
                  onPress={() => {
                    if (isCurrent)
                      setSelectedDate(new Date(currentYear, currentMonth, cell.day));
                  }}
                  disabled={!isCurrent}
                >
                  <View
                    className={[
                      'w-9 h-9 items-center justify-center rounded-full',
                      todayCell ? 'bg-raices-primary' : '',
                      selectedCell && !todayCell ? 'bg-raices-primary/15' : '',
                    ].join(' ')}
                  >
                    <Text
                      className={[
                        'text-sm font-semibold',
                        !isCurrent ? 'text-zinc-300' : 'text-raices-text',
                        todayCell ? 'text-white' : '',
                      ].join(' ')}
                    >
                      {cell.day}
                    </Text>
                  </View>
                  {/* event dot */}
                  <View
                    className={[
                      'w-1.5 h-1.5 rounded-full mt-0.5',
                      hasDot ? 'bg-raices-secondary' : 'bg-transparent',
                    ].join(' ')}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── CREAR EVENTO ───────────────────────────────────────── */}
        <Pressable
          onPress={() => setCreateModalVisible(true)}
          className="bg-raices-primary rounded-2xl py-4 flex-row items-center justify-center mb-6"
          style={{ gap: 10 }}
        >
          <IconSymbol name="plus" size={20} color="white" />
          <Text className="text-white font-headline font-bold text-base">Crear Evento</Text>
        </Pressable>

        {/* ── EVENTS LIST ────────────────────────────────────────── */}
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
          selectedDayEvents.map(event => (
            <CalendarDayEventCard key={event.id} event={event} />
          ))
        )}
      </RNScrollView>

      <CreateEventModal
        selectedDate={selectedDate}
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        addEvent={() => { void refetch(); }}
      />
    </View>
  );
}
