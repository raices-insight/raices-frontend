import { View, ScrollView, Text, Pressable } from '@/core/ui/tw';
import { useState } from 'react';
import { OlderAdultHeader } from './OlderAdultHeader';
import { WeeklyPerspective } from './WeeklyPerspective';
import { FilterTabs } from './FilterTabs';
import { EventCard, EventItem } from './EventCard';
import { IconSymbol } from '@/core/ui/icon-symbol';

const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    time: '10:00 AM',
    title: 'Medicamento Presión',
    icon: 'pill.fill',
    isCompleted: false,
  },
  {
    id: '2',
    time: '02:00 PM',
    title: 'Cita con el Doctor',
    icon: 'stethoscope',
    isCompleted: false,
  },
  {
    id: '3',
    time: '08:00 AM',
    title: 'Vitaminas',
    icon: 'pill.fill',
    isCompleted: true,
  }
];

export function OlderAdultHomeScreen() {
  const [activeTab, setActiveTab] = useState('Hoy');

  return (
    <View className="flex-1 bg-raices-bg">
      <OlderAdultHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <WeeklyPerspective />
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <View className="px-6 mt-8 pb-10">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-headline font-bold text-raices-primary">Próximos Eventos</Text>
            <Pressable className="bg-raices-secondary px-4 py-2 rounded-xl flex-row items-center gap-2 shadow-sm">
              <IconSymbol name="plus" size={16} color="white" />
              <Text className="text-white font-label font-bold text-sm">Crear Evento</Text>
            </Pressable>
          </View>

          {MOCK_EVENTS.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
