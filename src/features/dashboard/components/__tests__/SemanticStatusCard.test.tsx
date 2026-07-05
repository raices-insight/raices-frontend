/**
 * SemanticStatusCard
 * Shows today's overall health status derived from the DailyScore.
 * When the older adult disables every privacy option the card must render a
 * neutral "private" state instead of health-derived status/score.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SemanticStatusCard } from '../SemanticStatusCard';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const mockScore: DashboardDailyScore = {
  profile_id: 'profile-1',
  date: '2026-05-27',
  score: 80,
  interaction_count: 3,
  overall_status: 'green',
  health: 'sano',
  mood: 'alegre',
  activity: ['walking', 'reading'],
  description: 'Buen día',
};

describe('SemanticStatusCard', () => {
  it('shows the health status headline when privacy is shared', () => {
    render(<SemanticStatusCard dailyScore={mockScore} />);
    expect(screen.getByText('Salud Estable')).toBeOnTheScreen();
    expect(screen.getByText('sano')).toBeOnTheScreen();
  });

  it('renders the neutral "private" state when all privacy flags are off', () => {
    render(
      <SemanticStatusCard
        dailyScore={mockScore}
        isMoodShared={false}
        isActivityShared={false}
        isHealthShared={false}
      />,
    );
    expect(screen.getByText('Datos privados')).toBeOnTheScreen();
    expect(screen.queryByText('Salud Estable')).toBeNull();
    // score readout and events are hidden behind a dash
    expect(screen.queryByText('80/100')).toBeNull();
    expect(screen.queryByText('3 hoy')).toBeNull();
  });

  it('keeps the normal card when only health is private', () => {
    render(<SemanticStatusCard dailyScore={mockScore} isHealthShared={false} />);
    // headline stays coloured/normal — greying the whole card would hide still-shared data
    expect(screen.getByText('Salud Estable')).toBeOnTheScreen();
    expect(screen.queryByText('Datos privados')).toBeNull();
  });
});
