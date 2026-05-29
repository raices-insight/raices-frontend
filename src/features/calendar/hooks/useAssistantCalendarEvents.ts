import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/src/core/api/client';
import { CalendarEvent, CalendarEventSchema } from '../api/schemas';
import { z } from 'zod';
import { logger } from '@/src/core/logger';

interface UseAssistantCalendarEventsOptions {
  startDate?: string;
  endDate?: string;
  profileId?: string | null;
  skip?: boolean;
}

export function useAssistantCalendarEvents(
  optionsOrStart?: UseAssistantCalendarEventsOptions | string,
  endDate?: string,
) {
  const options: UseAssistantCalendarEventsOptions =
    typeof optionsOrStart === 'string' || optionsOrStart === undefined
      ? { startDate: optionsOrStart, endDate }
      : optionsOrStart;

  const { startDate, endDate: end, profileId, skip = false } = options;

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  /**
   * Optimistic events: added immediately after creation and cleared once the
   * server refetch returns (which has the real persisted event).
   */
  const [optimisticEvents, setOptimisticEvents] = useState<CalendarEvent[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    if (skip) {
      setEvents([]);
      setOptimisticEvents([]); // clear any pending optimistic state on skip
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (end) params.append('end_date', end);
      if (profileId) params.append('profile_id', profileId);

      const response = await apiClient.get(`/assistant/calendar-events?${params.toString()}`);

      const parsedData = z.array(CalendarEventSchema).parse(response.data);
      setEvents(parsedData || []);
      // Only remove optimistic events the server has already confirmed.
      // If the server doesn't have the event yet (NATS still processing),
      // keep the optimistic entry so the card doesn't flicker away.
      setOptimisticEvents(prev =>
        prev.filter(opt =>
          !parsedData.some(
            real =>
              real.title === opt.title &&
              new Date(real.due_date).toDateString() === new Date(opt.due_date).toDateString(),
          ),
        ),
      );
      logger.debug('[CALENDAR-FETCH-SUCCESS]:', parsedData);
    } catch (err: any) {
      logger.error('Error fetching assistant calendar events:', err);
      setError(err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, end, profileId, skip]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Optimistically add an event to the visible list immediately after creation.
   * The event will be replaced by the real server record on the next refetch.
   *
   * Use this to avoid the race condition between:
   *  - POST /calendar/date → NATS → assistant DB write (async, ~1-2s)
   *  - The user expecting to see the event instantly
   */
  const addEventOptimistically = useCallback((event: CalendarEvent) => {
    setOptimisticEvents(prev => [event, ...prev]);
  }, []);

  /**
   * Edit an event by ID.
   * Updates the local list immediately (optimistic), then calls the server.
   * Only fires the network request when the event actually exists in the current list.
   * On error, triggers a refetch to restore server state.
   */
  const editEvent = useCallback(async (id: string, updates: { title?: string; due_date?: string; category_id?: string }) => {
    const existsInServer = events.some(e => e.id === id);
    const existsInOptimistic = optimisticEvents.some(e => e.id === id);

    if (!existsInServer && !existsInOptimistic) return;

    // Optimistic update
    const applyUpdate = (prev: CalendarEvent[]) =>
      prev.map(e => e.id === id ? { ...e, ...updates } : e);
    setEvents(applyUpdate);
    setOptimisticEvents(applyUpdate);

    try {
      await apiClient.patch(`/assistant/calendar-events/${id}`, updates);
    } catch (err: any) {
      logger.error('[CALENDAR-EDIT-ERROR]:', err);
      void fetchEvents();
    }
  }, [events, optimisticEvents, fetchEvents]);

  /**
   * Delete an event by ID.
   * Removes it from the local list immediately (optimistic), then calls the server.
   * Only fires the network request when the event actually exists in the current list.
   */
  const deleteEvent = useCallback(async (id: string) => {
    // Optimistic removal — check both server events and optimistic events
    const existsInServer = events.some(e => e.id === id);
    const existsInOptimistic = optimisticEvents.some(e => e.id === id);

    if (!existsInServer && !existsInOptimistic) {
      // Nothing to delete
      return;
    }

    // Remove immediately from local state
    setEvents(prev => prev.filter(e => e.id !== id));
    setOptimisticEvents(prev => prev.filter(e => e.id !== id));

    try {
      await apiClient.delete(`/assistant/calendar-events/${id}`);
    } catch (err: any) {
      logger.error('[CALENDAR-DELETE-ERROR]:', err);
      // Refetch to restore server state if delete failed
      void fetchEvents();
    }
  }, [events, optimisticEvents, fetchEvents]);

  /**
   * Merged view: server events first, then any pending optimistic ones.
   * Once refetch runs, optimisticEvents is cleared so there are no duplicates.
   */
  const allEvents = useMemo(
    () => [...events, ...optimisticEvents],
    [events, optimisticEvents],
  );

  return {
    events: allEvents,
    isLoading,
    error,
    refetch: fetchEvents,
    addEventOptimistically,
    deleteEvent,
    editEvent,
  };
}
