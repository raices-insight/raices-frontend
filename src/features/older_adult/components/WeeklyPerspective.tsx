import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

const DAYS = [
  { day: 'LUN', date: '13', active: false },
  { day: 'MAR', date: '14', active: false },
  { day: 'MIE', date: '15', active: true },
  { day: 'JUE', date: '16', active: false },
  { day: 'VIE', date: '17', active: false },
];

export function WeeklyPerspective() {
  return (
    <View className="px-6 mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-headline font-bold text-raices-primary">Mayo 2024</Text>
        <IconSymbol name="calendar" size={24} color="#325F3F" />
      </View>
      <View className="flex-row justify-between bg-raices-surface p-4 rounded-3xl shadow-sm">
        {DAYS.map((item, index) => (
          <Pressable key={index} className="items-center gap-2">
            <Text className={`text-xs font-label font-medium ${item.active ? 'text-raices-primary' : 'text-raices-text-muted'}`}>
              {item.day}
            </Text>
            <View className={`w-12 h-14 rounded-2xl items-center justify-center ${item.active ? 'bg-raices-primary shadow-md' : 'bg-transparent border border-gray-100'}`}>
              <Text className={`text-lg font-bold font-headline ${item.active ? 'text-white' : 'text-raices-text'}`}>
                {item.date}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
