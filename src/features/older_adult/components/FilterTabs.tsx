import { View, Text, Pressable } from '@/core/ui/tw';

const TABS = ['Hoy', 'Mañana', 'Semana'];

export function FilterTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <View className="flex-row px-6 mt-6" style={{ gap: 10 }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className="flex-1 py-4 rounded-2xl items-center justify-center"
            style={{ backgroundColor: isActive ? '#325F3F' : '#4a7a56' }}
          >
            <Text className="font-label font-bold text-base text-white">
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
