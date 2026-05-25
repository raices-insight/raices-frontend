import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    if (skip) {
      setEvents([]);
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

  return { events, isLoading, error, refetch: fetchEvents };
}
