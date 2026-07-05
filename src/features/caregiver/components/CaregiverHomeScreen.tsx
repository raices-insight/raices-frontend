import { ScrollView, View } from '@/core/ui/tw';
import { useAuth } from '@/features/auth/context/auth-context';
import { useAssistantCalendarEvents } from '@/features/calendar/hooks/useAssistantCalendarEvents';
import { HistoryAccordionCard } from '@/features/dashboard/components/HistoryAccordionCard';
import { SemanticStatusCard } from '@/features/dashboard/components/SemanticStatusCard';
import { useDashboardSocket } from '@/features/dashboard/hooks/useDashboardSocket';
import { useFamily } from '@/features/family/hooks/use-family';
import { useFamilyOlderAdults } from '@/features/family/hooks/use-family-older-adults';
import { usePrivacyForProfile } from '@/features/older_adult/hooks/use-privacy-for-profile';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { LocationIndicator } from '../../location/components/LocationIndicator';
import { useSelectedOlderAdult } from '../hooks/use-selected-older-adult';
import { useVoiceRecordings } from '../hooks/use-voice-recordings';
import { CaregiverHeader } from './CaregiverHeader';
import { EmptyFamilyState } from './EmptyFamilyState';
import { HomeHealthSummaryGrid } from './HomeHealthSummaryGrid';
import { HomeUpcomingEvents } from './HomeUpcomingEvents';
import { HomeVoiceRecordings } from './HomeVoiceRecordings';
import { OlderAdultChipSelector } from './OlderAdultChipSelector';

function HomeContent() {
  const { olderAdults, loading } = useFamilyOlderAdults();
  const { selected, selectOlderAdult } = useSelectedOlderAdult(olderAdults);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard data for the selected older adult
  const { dailyScore, yesterdayScore, refresh } = useDashboardSocket(selected?.profileId);

  // Privacy flags for the selected older adult
  const { isMoodShared, isActivityShared, isHealthShared } = usePrivacyForProfile(selected?.profileId);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1500);
  }, [refresh]);

  // Upcoming calendar events for the selected older adult (today → +7 days)
  // Memoised so the ISO strings don't change on every render and cause excessive fetches
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    return {
      startDate: today.toISOString(),
      endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }, []);

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

  //hack para ux del mapa

  

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#325F3F" colors={['#325F3F']} />
        }
      >
        {/* Health summary: Actividad, Salud, Estado, Medicina */}
        <HomeHealthSummaryGrid
          dailyScore={dailyScore}
          loading={loading}
          isMoodShared={isMoodShared}
          isActivityShared={isActivityShared}
          isHealthShared={isHealthShared}
        />

        {/* Today's semantic status + previous day history */}
        <View className="px-5 mb-6">
          <SemanticStatusCard 
            dailyScore={dailyScore} 
            isMoodShared={isMoodShared}
            isActivityShared={isActivityShared}
            isHealthShared={isHealthShared}
          />
          <View className="h-4" />
          <HistoryAccordionCard 
            data={yesterdayScore} 
            isMoodShared={isMoodShared}
            isActivityShared={isActivityShared}
            isHealthShared={isHealthShared}
          />
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

        {/* Location map */}
        <View className="mx-5 mb-5 bg-raices-surface rounded-[24px] border border-raices-secondary/15 overflow-hidden shadow-sm elevation-2">
          <LocationIndicator />
        </View>
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
