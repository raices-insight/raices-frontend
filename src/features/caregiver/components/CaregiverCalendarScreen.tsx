import { useEffect, useMemo, useState } from 'react';
import { ScrollView as RNScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { UserAvatar } from '@/core/ui/UserAvatar';
import { useAuth } from '@/features/auth/context/auth-context';
import { useAssistantCalendarEvents } from '@/features/calendar/hooks/useAssistantCalendarEvents';
import { CreateEventModal } from '@/features/calendar/components/CreateEventModal';
import { CalendarDayEventCard } from '@/features/calendar/components/CalendarDayEventCard';
import { CalendarMonthGrid, MONTH_NAMES } from '@/features/calendar/components/CalendarMonthGrid';
import { useFamilyOlderAdults } from '@/features/family/hooks/use-family-older-adults';
import { usePrivacyForProfile } from '@/features/older_adult/hooks/use-privacy-for-profile';
import type { FamilyMember } from '@/features/family/api/schemas';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

interface AdultSwitcherProps {
  adults: FamilyMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function AdultSwitcher({ adults, selectedId, onSelect }: AdultSwitcherProps) {
  return (
    <RNScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      className="mb-3"
    >
      {adults.map((a) => {
        const active = a.profileId === selectedId;
        return (
          <Pressable
            key={a.id}
            onPress={() => onSelect(a.profileId)}
            className="flex-row items-center rounded-full px-4 py-2"
            style={{
              backgroundColor: active ? '#325F3F' : '#FFFFFF',
              borderWidth: active ? 0 : 1,
              borderColor: 'rgba(50, 95, 63, 0.15)',
              gap: 8,
            }}
          >
            <View
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#E8EFE5' }}
            >
              <Text
                className="text-xs font-headline font-bold"
                style={{ color: active ? '#FFFFFF' : '#325F3F' }}
              >
                {getInitials(a.name)}
              </Text>
            </View>
            <Text
              className="font-headline font-semibold text-sm"
              style={{ color: active ? '#FFFFFF' : '#1F1B15' }}
              numberOfLines={1}
            >
              {a.name.split(' ')[0]}
            </Text>
          </Pressable>
        );
      })}
    </RNScrollView>
  );
}

export function CaregiverCalendarScreen() {
  const { user } = useAuth();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAdultId, setSelectedAdultId] = useState<string | null>(null);

  const { olderAdults, loading: adultsLoading, familyId } = useFamilyOlderAdults();

  useEffect(() => {
    if (!selectedAdultId && olderAdults.length > 0) {
      setSelectedAdultId(olderAdults[0].profileId);
    }
    if (selectedAdultId && !olderAdults.some((a) => a.profileId === selectedAdultId)) {
      setSelectedAdultId(olderAdults[0]?.profileId ?? null);
    }
  }, [olderAdults, selectedAdultId]);

  const { isActivityShared, loading: privacyLoading } = usePrivacyForProfile(selectedAdultId);

  const eventsEnabled = !!selectedAdultId && isActivityShared;

  const { events, isLoading: eventsLoading, refetch } = useAssistantCalendarEvents({
    profileId: selectedAdultId,
    skip: !eventsEnabled,
  });

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

  const selectedDayEvents = useMemo(
    () => events.filter((e) => {
      const d = new Date(e.due_date);
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    }),
    [events, selectedDate],
  );

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedIsPast = selectedDate < startOfToday;
  const canCreate = eventsEnabled && !selectedIsPast;

  const firstName = user?.name?.split(' ')[0] ?? 'Calendario';
  const selectedAdult = olderAdults.find((a) => a.profileId === selectedAdultId) ?? null;

  return (
    <View className="flex-1 bg-raices-bg">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-raices-bg">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            className="w-11 h-11 rounded-full overflow-hidden"
            hitSlop={8}
          >
            <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={44} />
          </Pressable>
          <View>
            <Text className="text-2xl font-headline font-bold text-raices-primary">{firstName}</Text>
            <Text className="text-xs font-label font-bold text-raices-primary uppercase tracking-widest opacity-70">
              Vista Cuidador
            </Text>
          </View>
        </View>
        <Pressable className="w-10 h-10 items-center justify-center" hitSlop={8}>
          <IconSymbol name="bell.fill" size={24} color="#325F3F" />
        </Pressable>
      </View>

      {/* ADULT SWITCHER */}
      {adultsLoading ? (
        <View className="px-6 py-4">
          <ActivityIndicator color="#325F3F" />
        </View>
      ) : olderAdults.length === 0 ? null : (
        <View className="pb-1">
          <Text className="px-6 mb-2 font-label font-bold text-xs uppercase tracking-widest text-raices-text-muted">
            Mostrando calendario de
          </Text>
          <AdultSwitcher
            adults={olderAdults}
            selectedId={selectedAdultId}
            onSelect={(id) => setSelectedAdultId(id)}
          />
        </View>
      )}

      <RNScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* EMPTY: NO FAMILY OR NO ADULTS */}
        {!familyId ? (
          <View className="bg-white rounded-3xl p-8 items-center mt-4" style={{ gap: 12 }}>
            <IconSymbol name="person.2.fill" size={36} color="#325F3F" />
            <Text className="font-headline font-bold text-raices-text text-lg text-center">
              Aún no estás en una familia
            </Text>
            <Text className="font-body text-sm text-raices-text-muted text-center">
              Crea o únete a una familia para gestionar el calendario de un adulto mayor.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/family')}
              className="bg-raices-primary rounded-full px-5 py-3 mt-2"
            >
              <Text className="text-white font-headline font-bold">Ir a Familia</Text>
            </Pressable>
          </View>
        ) : !adultsLoading && olderAdults.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 items-center mt-4" style={{ gap: 12 }}>
            <IconSymbol name="person.2.fill" size={36} color="#325F3F" />
            <Text className="font-headline font-bold text-raices-text text-lg text-center">
              Aún no hay adultos mayores en tu familia
            </Text>
            <Text className="font-body text-sm text-raices-text-muted text-center">
              Invita a un adulto mayor para empezar a coordinar su calendario.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/family')}
              className="bg-raices-primary rounded-full px-5 py-3 mt-2"
            >
              <Text className="text-white font-headline font-bold">Gestionar Familia</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CalendarMonthGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDate={selectedDate}
              eventDays={eventDays}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
              onSelectDay={setSelectedDate}
            />

            {/* CREATE EVENT */}
            <Pressable
              onPress={() => { if (canCreate) setCreateModalVisible(true); }}
              disabled={!canCreate}
              className="bg-raices-primary rounded-2xl py-4 flex-row items-center justify-center mb-2"
              style={{ gap: 10, opacity: canCreate ? 1 : 0.4 }}
            >
              <IconSymbol name="plus" size={20} color="white" />
              <Text className="text-white font-headline font-bold text-base">Crear Evento</Text>
            </Pressable>
            {!canCreate ? (
              <Text className="text-xs font-body text-raices-text-muted text-center mb-4">
                {!eventsEnabled
                  ? 'No puedes crear eventos hasta que el adulto mayor comparta su calendario.'
                  : 'No puedes crear eventos en días pasados.'}
              </Text>
            ) : (
              <View className="mb-4" />
            )}

            <Text className="text-xl font-headline font-bold text-raices-text mb-4">
              Eventos para el {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}
            </Text>

            {/* PRIVACY GATE */}
            {privacyLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator color="#325F3F" />
              </View>
            ) : !isActivityShared ? (
              <View
                className="rounded-3xl p-8 items-center"
                style={{ backgroundColor: 'rgba(216, 230, 166, 0.4)', gap: 12 }}
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <IconSymbol name="lock.fill" size={26} color="#5c6834" />
                </View>
                <Text className="font-headline font-bold text-base text-center" style={{ color: '#5c6834' }}>
                  {selectedAdult?.name?.split(' ')[0] ?? 'Este adulto mayor'} aún no comparte su actividad
                </Text>
                <Text className="font-body text-sm text-center leading-5" style={{ color: '#5c6834' }}>
                  Por privacidad, los eventos de su calendario no son visibles. Pídele que active el permiso de actividad desde su perfil.
                </Text>
              </View>
            ) : eventsLoading ? (
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
                <CalendarDayEventCard key={event.id} event={event} />
              ))
            )}
          </>
        )}
      </RNScrollView>

      <CreateEventModal
        selectedDate={selectedDate}
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        addEvent={() => { void refetch(); }}
        targetProfileId={selectedAdultId ?? undefined}
      />
    </View>
  );
}
