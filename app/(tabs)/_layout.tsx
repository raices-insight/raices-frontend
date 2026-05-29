import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/core/ui/haptic-tab';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { CONFIG } from '@/core/config';
import { OlderAdultCalendarEventsProvider } from '@/features/calendar/context/OlderAdultCalendarEventsContext';
import { ToastRenderer } from '@/core/toast/toast-renderer';

import { View } from 'react-native';

const TabIcon = ({ name, color, focused }: { name: any, color: string, focused: boolean }) => (
  <View style={{
    backgroundColor: focused ? '#E8EFE5' : 'transparent',
    borderRadius: 16,
    width: 56,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <IconSymbol size={24} name={name} color={color} />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <OlderAdultCalendarEventsProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.light.navBg,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="house.fill" color={color} focused={focused} />,
        }}
      />
			<Tabs.Screen
        name="family"
        options={{
          title: 'Familia',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person.3.fill" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="incoming-event"
        options={{
          title: 'Evento',
          href: CONFIG.IS_PROD ? null : undefined,
          tabBarIcon: ({ color, focused }) => <TabIcon name="calendar" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, focused }) => <TabIcon name="calendar" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person.fill" color={color} focused={focused} />,
        }}
      />
      </Tabs>
      <ToastRenderer />
    </OlderAdultCalendarEventsProvider>
  );
}
