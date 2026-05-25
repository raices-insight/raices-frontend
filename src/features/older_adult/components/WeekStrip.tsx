import { useEffect, useRef } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { View, Text } from '@/core/ui/tw';

const DAY_ABBR = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const CELL_WIDTH = 80;
const DAYS_BEFORE = 3;
const TOTAL_DAYS = 30;

export function WeekStrip() {
  const today = new Date();
  const scrollRef = useRef<RNScrollView>(null);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - DAYS_BEFORE);

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  useEffect(() => {
    // scroll so today is visible near the left with some context
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: DAYS_BEFORE * (CELL_WIDTH + 10), animated: false });
    }, 80);
  }, []);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <View className="pt-4 pb-2">
      {/* Month + year heading */}
      <Text className="text-4xl font-headline font-extrabold text-raices-primary px-6 mb-1">
        {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
      </Text>

      {/* Indicator dots */}
      <View className="flex-row px-6 mb-5" style={{ gap: 6 }}>
        <View className="w-3 h-3 rounded-full bg-raices-primary" />
        <View className="w-3 h-3 rounded-full bg-raices-secondary opacity-60" />
      </View>

      {/* Horizontal day strip */}
      <RNScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 24, paddingVertical: 4 }}
      >
        {days.map((day, idx) => {
          const todayCell = isToday(day);
          return (
            <View
              key={idx}
              className={[
                'items-center justify-center py-4 rounded-3xl',
                todayCell ? 'bg-raices-primary' : 'bg-white shadow-sm',
              ].join(' ')}
              style={{ width: CELL_WIDTH, elevation: todayCell ? 0 : 2 }}
            >
              <Text
                className={[
                  'text-xs font-label font-semibold uppercase mb-2',
                  todayCell ? 'text-white/70' : 'text-zinc-400',
                ].join(' ')}
              >
                {DAY_ABBR[day.getDay()]}
              </Text>
              <Text
                className={[
                  'text-4xl font-headline font-extrabold',
                  todayCell ? 'text-white' : 'text-raices-text',
                ].join(' ')}
              >
                {day.getDate()}
              </Text>
            </View>
          );
        })}
      </RNScrollView>
    </View>
  );
}
