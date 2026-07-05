/**
 * HistoryAccordionCard
 * Collapsible previous-day summary. When the older adult disables every privacy
 * option the header score/colour must go neutral instead of showing a number.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HistoryAccordionCard } from '../HistoryAccordionCard';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const mockScore: DashboardDailyScore = {
  profile_id: 'profile-1',
  date: '2026-05-26',
  score: 72,
  interaction_count: 2,
  overall_status: 'green',
  health: 'sano',
  mood: 'alegre',
  activity: ['walking'],
  description: 'Día tranquilo',
};

describe('HistoryAccordionCard', () => {
  it('shows the score when privacy is shared', () => {
    render(<HistoryAccordionCard data={mockScore} />);
    expect(screen.getByText('72')).toBeOnTheScreen();
  });

  it('hides the score behind a dash when all privacy flags are off', () => {
    render(
      <HistoryAccordionCard
        data={mockScore}
        isMoodShared={false}
        isActivityShared={false}
        isHealthShared={false}
      />,
    );
    expect(screen.queryByText('72')).toBeNull();
    // score + Salud + Ánimo all collapse to a dash
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1);
  });

  it('keeps the score when only health is private', () => {
    render(<HistoryAccordionCard data={mockScore} isHealthShared={false} />);
    expect(screen.getByText('72')).toBeOnTheScreen();
  });

  it('renders nothing when there is no data', () => {
    const { toJSON } = render(<HistoryAccordionCard data={null} />);
    expect(toJSON()).toBeNull();
  });
});
