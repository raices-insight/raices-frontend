/**
 * HomeUpcomingEvents
 * Horizontal scrolling strip of upcoming calendar events for the selected older adult.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeUpcomingEvents } from '../HomeUpcomingEvents';
import type { CalendarEvent } from '@/features/calendar/api/schemas';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const makeEvent = (id: string, title: string, dueDate: string, description?: string): CalendarEvent => ({
  id,
  title,
  description: description ?? null,
  due_date: dueDate,
  creator_audio_profile_id: null,
  adult_profile_id: null,
  audio_url: null,
  status: 'pending',
});

describe('HomeUpcomingEvents', () => {
  it('shows the section title "Próximos eventos"', () => {
    const events = [makeEvent('1', 'Llamada', '2026-05-27T10:30:00Z')];
    render(<HomeUpcomingEvents events={events} loading={false} />);
    expect(screen.getByText('Próximos eventos')).toBeOnTheScreen();
  });

  it('renders a card for each event with its title', () => {
    const events = [
      makeEvent('1', 'Llamada', '2026-05-27T10:30:00Z', 'Llamar a Clara'),
      makeEvent('2', 'Pastilla', '2026-05-27T14:30:00Z', 'Aspirina'),
    ];
    render(<HomeUpcomingEvents events={events} loading={false} />);
    expect(screen.getByText('Llamada')).toBeOnTheScreen();
    expect(screen.getByText('Pastilla')).toBeOnTheScreen();
  });

  it('renders the event description when present', () => {
    const events = [makeEvent('1', 'Llamada', '2026-05-27T10:30:00Z', 'Llamar a Clara')];
    render(<HomeUpcomingEvents events={events} loading={false} />);
    expect(screen.getByText('Llamar a Clara')).toBeOnTheScreen();
  });

  it('does not render when the event list is empty and not loading', () => {
    const { toJSON } = render(<HomeUpcomingEvents events={[]} loading={false} />);
    expect(toJSON()).toBeNull();
  });

  it('does not render when loading and no events', () => {
    const { toJSON } = render(<HomeUpcomingEvents events={[]} loading={true} />);
    expect(toJSON()).toBeNull();
  });
});
