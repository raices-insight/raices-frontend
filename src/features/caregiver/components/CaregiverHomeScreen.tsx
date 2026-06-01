import React, { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { View, ScrollView, Text } from '@/core/ui/tw';
import { CaregiverHeader } from './CaregiverHeader';
import { EmptyFamilyState } from './EmptyFamilyState';
import { OlderAdultChipSelector } from './OlderAdultChipSelector';
import { HomeHealthSummaryGrid } from './HomeHealthSummaryGrid';
import { HomeUpcomingEvents } from './HomeUpcomingEvents';
import { HomeVoiceRecordings } from './HomeVoiceRecordings';
import { SemanticStatusCard } from '@/features/dashboard/components/SemanticStatusCard';
import { HistoryAccordionCard } from '@/features/dashboard/components/HistoryAccordionCard';
import { useAuth } from '@/features/auth/context/auth-context';
import { useFamily } from '@/features/family/hooks/use-family';
import { useFamilyOlderAdults } from '@/features/family/hooks/use-family-older-adults';
import { useSelectedOlderAdult } from '../hooks/use-selected-older-adult';
import { useDashboardSocket } from '@/features/dashboard/hooks/useDashboardSocket';
import { useAssistantCalendarEvents } from '@/features/calendar/hooks/useAssistantCalendarEvents';
import { useVoiceRecordings } from '../hooks/use-voice-recordings';

function HomeContent() {
  const { olderAdults, loading } = useFamilyOlderAdults();
  const { selected, selectOlderAdult } = useSelectedOlderAdult(olderAdults);

  // Dashboard data for the selected older adult
  const { dailyScore, yesterdayScore, refresh } = useDashboardSocket(selected?.profileId);

  // Upcoming calendar events for the selected older adult (today → +7 days)
  const today = new Date();
  const startDate = today.toISOString();
  const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { events, isLoading: eventsLoading } = useAssistantCalendarEvents({
    startDate,
    endDate,
    profileId: selected?.profileId,
    skip: !selected,
  });

  // Recent voice recordings for the selected older adult
  const { recordings, isLoading: recordingsLoading } = useVoiceRecordings(
    selected?.profileId ?? null,
  );

  // Refresh dashboard when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator color="#325F3F" size="large" />
      </View>
    );
  }

  if (olderAdults.length === 0) {
    return (
      <View className="px-6 pt-6">
        <EmptyFamilyState />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Older adult chip selector — only shown when family has 2+ adults */}
      <OlderAdultChipSelector
        olderAdults={olderAdults}
        selected={selected}
        onSelect={selectOlderAdult}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
      >
        {/* Health summary: Actividad, Salud, Estado, Medicina */}
        <HomeHealthSummaryGrid
          dailyScore={dailyScore}
          loading={loading}
        />

        {/* Today's semantic status + previous day history (moved from Dashboard tab) */}
        <View className="px-5 mb-6">
          <SemanticStatusCard dailyScore={dailyScore} />
          <View className="h-4" />
          <HistoryAccordionCard data={yesterdayScore} />
        </View>

        {/* Upcoming events horizontal strip */}
        <HomeUpcomingEvents
          events={events}
          loading={eventsLoading}
        />

        {/* Recent voice recordings */}
        <HomeVoiceRecordings
          recordings={recordings}
          loading={recordingsLoading}
        />
      </ScrollView>
    </View>
  );
}

export function CaregiverHomeScreen() {
  const { user } = useAuth();
  const { isFamily, loading: familyLoading } = useFamily();

  return (
    <View className="flex-1 bg-raices-bg">
      <CaregiverHeader
        user={user}
        onProfilePress={() => router.push('/(tabs)/settings')}
      />

      {familyLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#325F3F" size="large" />
        </View>
      ) : isFamily ? (
        <HomeContent />
      ) : (
        <EmptyFamilyState />
      )}
    </View>
  );
}
