import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/core/ui/haptic-tab';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/core/hooks/use-color-scheme';
import { CONFIG } from '@/core/config';
import { OlderAdultCalendarEventsProvider } from '@/features/calendar/context/OlderAdultCalendarEventsContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <OlderAdultCalendarEventsProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
			<Tabs.Screen
        name="family"
        options={{
          title: 'Familia',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="incoming-event"
        options={{
          title: 'Evento',
          href: CONFIG.IS_PROD ? null : undefined,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          href: CONFIG.IS_PROD ? null : undefined,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
    </OlderAdultCalendarEventsProvider>
  );
}
