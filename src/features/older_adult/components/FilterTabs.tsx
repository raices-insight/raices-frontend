import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from '@/core/ui/tw';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const TABS = ['Hoy', 'Mañana', 'Semana'];
const GAP = 10;

export function FilterTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const [tabWidth, setTabWidth] = useState(0);
  const tabWidthRef = useRef(0);
  const indicatorX = useSharedValue(0);
  const activeIndex = TABS.indexOf(activeTab);

  // On layout, set the initial position immediately (no animation)
  const onContainerLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const w = (e.nativeEvent.layout.width - GAP * (TABS.length - 1)) / TABS.length;
    tabWidthRef.current = w;
    setTabWidth(w);
    indicatorX.value = activeIndex * (w + GAP);
  };

  // Animate when the active tab changes
  useEffect(() => {
    if (tabWidthRef.current > 0) {
      indicatorX.value = withSpring(activeIndex * (tabWidthRef.current + GAP), {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View className="px-6 mt-6">
      <View
        className="flex-row"
        style={{ gap: GAP }}
        onLayout={onContainerLayout}
      >
        {/* Sliding active indicator */}
        <Animated.View
          pointerEvents="none"
          style={[
            indicatorStyle,
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: tabWidth,
              borderRadius: 16,
              backgroundColor: '#325F3F',
            },
          ]}
        />

        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className="flex-1 py-4 rounded-2xl items-center justify-center"
            style={{ backgroundColor: '#4a7a56' }}
          >
            <Text className="font-label font-bold text-base text-white">
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
