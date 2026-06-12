/**
 * HomeHealthSummaryGrid
 * Displays 4 compact status cards (Actividad, Salud, Estado, Medicina)
 * using data from the dashboard DailyScore.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeHealthSummaryGrid } from '../HomeHealthSummaryGrid';
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

describe('HomeHealthSummaryGrid', () => {
  it('shows the section title "Resumen del Día"', () => {
    render(<HomeHealthSummaryGrid dailyScore={mockScore} loading={false} />);
    expect(screen.getByText('Resumen del Día')).toBeOnTheScreen();
  });

  it('renders the Actividad card with activity status', () => {
    render(<HomeHealthSummaryGrid dailyScore={mockScore} loading={false} />);
    expect(screen.getByText('Actividad')).toBeOnTheScreen();
    expect(screen.getByText('Activo')).toBeOnTheScreen();
  });

  it('renders the Salud card with health value', () => {
    render(<HomeHealthSummaryGrid dailyScore={mockScore} loading={false} />);
    expect(screen.getByText('Salud')).toBeOnTheScreen();
    expect(screen.getByText('sano')).toBeOnTheScreen();
  });

  it('renders the Estado card with mood value', () => {
    render(<HomeHealthSummaryGrid dailyScore={mockScore} loading={false} />);
    expect(screen.getByText('Estado')).toBeOnTheScreen();
    expect(screen.getByText('alegre')).toBeOnTheScreen();
  });

  it('renders the Medicina card derived from overall_status', () => {
    render(<HomeHealthSummaryGrid dailyScore={mockScore} loading={false} />);
    expect(screen.getByText('Medicina')).toBeOnTheScreen();
    expect(screen.getByText('Al día')).toBeOnTheScreen();
  });

  it('shows "Inactivo" when activity list is empty', () => {
    const noActivity = { ...mockScore, activity: [] };
    render(<HomeHealthSummaryGrid dailyScore={noActivity} loading={false} />);
    expect(screen.getByText('Inactivo')).toBeOnTheScreen();
  });

  it('shows loading skeleton when loading=true and no score', () => {
    const { toJSON } = render(<HomeHealthSummaryGrid dailyScore={null} loading={true} />);
    // pure skeleton renders (no text content)
    expect(toJSON()).not.toBeNull();
    expect(screen.queryByText('Resumen del Día')).toBeNull();
    expect(screen.queryByText('Actividad')).toBeNull();
  });

  it('shows "—" placeholders when there is no score data', () => {
    render(<HomeHealthSummaryGrid dailyScore={null} loading={false} />);
    // Should show 4 dash placeholders (one per card)
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(4);
  });
});
