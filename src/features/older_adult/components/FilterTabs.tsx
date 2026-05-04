import { View, Text, Pressable } from '@/core/ui/tw';

const TABS = ['Hoy', 'Mañana', 'Semana'];

export function FilterTabs({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  return (
    <View className="flex-row gap-3 px-6 mt-6">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`px-6 py-3 rounded-full ${isActive ? 'bg-raices-primary shadow-md' : 'bg-raices-surface border border-gray-200'}`}
          >
            <Text className={`font-label font-bold text-base ${isActive ? 'text-white' : 'text-raices-text-muted'}`}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
