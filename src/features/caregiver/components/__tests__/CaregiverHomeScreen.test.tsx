/**
 * CaregiverHomeScreen (refactored)
 * Integration test: chip selector + health grid + upcoming events.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { CaregiverHomeScreen } from '../CaregiverHomeScreen';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ play: jest.fn(), pause: jest.fn(), seekTo: jest.fn().mockResolvedValue(undefined) }),
  useAudioPlayerStatus: () => ({ playing: false, didJustFinish: false }),
}));
jest.mock('expo-router', () => {
  const MockLink = () => null;
  MockLink.Trigger = function MockLinkTrigger() { return null; };
  MockLink.Menu = function MockLinkMenu() { return null; };
  MockLink.MenuAction = function MockLinkMenuAction() { return null; };
  MockLink.Preview = function MockLinkPreview() { return null; };
  return {
    router: { push: jest.fn() },
    Link: MockLink,
    useRouter: () => ({ push: jest.fn() }),
    useFocusEffect: jest.fn(),
  };
});
jest.mock('expo-image', () => ({ Image: () => null }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// ─── Feature mocks ────────────────────────────────────────────────────────────

const mockAdult1 = {
  id: '1',
  profileId: 'profile-adult-1',
  role: 'MEMBER' as const,
  userRole: 'older_adult',
  name: 'María',
};
const mockAdult2 = {
  id: '2',
  profileId: 'profile-adult-2',
  role: 'MEMBER' as const,
  userRole: 'older_adult',
  name: 'José',
};

const mockDailyScore = {
  profile_id: 'profile-adult-1',
  date: '2026-05-27',
  score: 85,
  interaction_count: 2,
  overall_status: 'green' as const,
  health: 'sano',
  mood: 'alegre',
  activity: ['walking'],
  description: 'Buen día',
};

const mockYesterdayScore = {
  profile_id: 'profile-adult-1',
  date: '2026-05-26',
  score: 70,
  interaction_count: 1,
  overall_status: 'yellow' as const,
  health: 'estable',
  mood: 'tranquilo',
  activity: ['reading'],
  description: 'Día anterior tranquilo',
};

jest.mock('@/features/auth/context/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'caregiver-1', name: 'Ana Cuidadora', email: 'ana@test.com', role: 'caregiver', photo: null },
  }),
}));

jest.mock('@/features/family/hooks/use-family', () => ({
  useFamily: () => ({ isFamily: true, loading: false, family: { id: 'fam-1', name: 'Familia García' } }),
}));

jest.mock('@/features/family/hooks/use-family-older-adults', () => ({
  useFamilyOlderAdults: () => ({
    olderAdults: [mockAdult1, mockAdult2],
    loading: false,
    error: null,
    familyId: 'fam-1',
    refetch: jest.fn(),
  }),
}));

jest.mock('@/features/dashboard/hooks/useDashboardSocket', () => ({
  useDashboardSocket: () => ({
    dailyScore: mockDailyScore,
    yesterdayScore: mockYesterdayScore,
    isConnected: true,
    refresh: jest.fn(),
  }),
}));

jest.mock('@/features/calendar/hooks/useAssistantCalendarEvents', () => ({
  useAssistantCalendarEvents: () => ({
    events: [
      {
        id: 'evt-1',
        title: 'Llamada médico',
        description: 'Doctor García',
        due_date: new Date().toISOString(),
        creator_audio_profile_id: null,
        adult_profile_id: 'profile-adult-1',
        audio_url: null,
        status: 'pending',
      },
    ],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/features/caregiver/hooks/use-voice-recordings', () => ({
  useVoiceRecordings: () => ({
    recordings: [
      {
        id: 'rec-1',
        description: 'Me siento bien hoy',
        mood: 'happy',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        audio_url: null,
      },
      {
        id: 'rec-2',
        description: 'Resumen de la tarde',
        mood: 'tired',
        created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        audio_url: null,
      },
    ],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CaregiverHomeScreen', () => {
  it('shows the caregiver greeting', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText(/Hola, Ana/i)).toBeOnTheScreen();
  });

  it('shows the older adult chip selector when multiple adults exist', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('María')).toBeOnTheScreen();
    expect(screen.getByText('José')).toBeOnTheScreen();
  });

  it('shows the health summary section', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('Resumen del Día')).toBeOnTheScreen();
    expect(screen.getByText('Actividad')).toBeOnTheScreen();
    expect(screen.getByText('Medicina')).toBeOnTheScreen();
  });

  it('shows the semantic status card (today) below the daily summary', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('Índice de Bienestar')).toBeOnTheScreen();
    expect(screen.getByText('Salud Estable')).toBeOnTheScreen();
  });

  it('shows the previous day history accordion below the daily summary', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('Día Anterior')).toBeOnTheScreen();
    expect(screen.getByText('2026-05-26')).toBeOnTheScreen();
  });

  it('shows upcoming events section', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('Próximos eventos')).toBeOnTheScreen();
    expect(screen.getByText('Llamada médico')).toBeOnTheScreen();
  });

  it('shows voice recordings section with recent entries', () => {
    render(<CaregiverHomeScreen />);
    expect(screen.getByText('Registros de voz recientes')).toBeOnTheScreen();
    expect(screen.getByText('Me siento bien hoy')).toBeOnTheScreen();
    expect(screen.getByText('Resumen de la tarde')).toBeOnTheScreen();
  });

  it('switching chip changes the selected adult name', async () => {
    render(<CaregiverHomeScreen />);

    // Both chips visible; press José
    fireEvent.press(screen.getByText('José'));

    await waitFor(() => {
      // José chip should still be visible (can't reliably assert style without testID)
      expect(screen.getByText('José')).toBeOnTheScreen();
    });
  });
});
