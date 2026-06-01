import { View, Text, Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_INITIALS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

type CellType = { day: number; type: 'prev' | 'current' | 'next' };

interface CalendarMonthGridProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date;
  eventDays: Set<number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: Date) => void;
  allowPastSelection?: boolean;
}

export function CalendarMonthGrid({
  currentMonth,
  currentYear,
  selectedDate,
  eventDays,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  allowPastSelection = false,
}: CalendarMonthGridProps) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

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

  const isPastDay = (day: number, type: CellType['type']) => {
    if (type !== 'current') return false;
    const cellDate = new Date(currentYear, currentMonth, day);
    return cellDate < startOfToday;
  };

  return (
    <View className="bg-white rounded-3xl shadow-sm p-4 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={onPrevMonth} className="p-2" hitSlop={8}>
          <IconSymbol name="chevron.left" size={20} color="#325F3F" />
        </Pressable>
        <Text className="text-lg font-headline font-bold text-raices-text">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>
        <Pressable onPress={onNextMonth} className="p-2" hitSlop={8}>
          <IconSymbol name="chevron.right" size={20} color="#325F3F" />
        </Pressable>
      </View>

      <View className="flex-row mb-1">
        {DAY_INITIALS.map((d, i) => (
          <View key={i} className="flex-1 items-center py-1">
            <Text className="text-xs font-semibold text-zinc-400">{d}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, idx) => {
          const todayCell = isToday(cell.day, cell.type);
          const selectedCell = isSelected(cell.day, cell.type);
          const hasDot = cell.type === 'current' && eventDays.has(cell.day);
          const isCurrent = cell.type === 'current';
          const past = isPastDay(cell.day, cell.type);
          const selectable = isCurrent && (allowPastSelection || !past);

          return (
            <Pressable
              key={idx}
              className="w-[14.28%] items-center py-1"
              onPress={() => {
                if (selectable)
                  onSelectDay(new Date(currentYear, currentMonth, cell.day));
              }}
              disabled={!selectable}
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
                    !isCurrent ? 'text-zinc-300' : past && !allowPastSelection ? 'text-zinc-300' : 'text-raices-text',
                    todayCell ? 'text-white' : '',
                  ].join(' ')}
                >
                  {cell.day}
                </Text>
              </View>
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
  );
}

export { MONTH_NAMES };
