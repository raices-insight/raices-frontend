import React, { createContext, useContext, type ReactNode } from 'react';
import { useAssistantCalendarEvents } from '../hooks/useAssistantCalendarEvents';
import type { CalendarEvent } from '../api/schemas';
import { useAuth } from '@/features/auth/context/auth-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OlderAdultCalendarEventsContextValue {
  events: CalendarEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  addEventOptimistically: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => Promise<void>;
  editEvent: (id: string, updates: { title?: string; due_date?: string }) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const OlderAdultCalendarEventsContext =
  createContext<OlderAdultCalendarEventsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Holds a single shared instance of the older adult calendar event state.
 * Mount this once in the tab layout so that both OlderAdultHomeScreen and
 * OlderAdultCalendarScreen read from the same list — optimistic events added
 * in the calendar tab are immediately visible in the home tab.
 */
export function OlderAdultCalendarEventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Skip fetching for non–older-adult users so caregivers don't fire a
  // spurious request for their own profile.
  const isOlderAdult = user?.role === 'older_adult';

  const value = useAssistantCalendarEvents({ skip: !isOlderAdult });

  return (
    <OlderAdultCalendarEventsContext.Provider value={value}>
      {children}
    </OlderAdultCalendarEventsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOlderAdultCalendarEvents(): OlderAdultCalendarEventsContextValue {
  const ctx = useContext(OlderAdultCalendarEventsContext);
  if (!ctx) {
    throw new Error(
      'useOlderAdultCalendarEvents must be used inside OlderAdultCalendarEventsProvider',
    );
  }
  return ctx;
}
