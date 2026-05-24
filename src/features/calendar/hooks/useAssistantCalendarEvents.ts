import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/src/core/api/client';
import { CalendarEvent, CalendarEventSchema } from '../api/schemas';
import { z } from 'zod';
import { logger } from '@/src/core/logger';

export function useAssistantCalendarEvents(startDate?: string, endDate?: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await apiClient.get(`/assistant/calendar-events?${params.toString()}`);
      
      const parsedData = z.array(CalendarEventSchema).parse(response.data);
      setEvents(parsedData || []);
      logger.debug('[CALENDAR-FETCH-SUCCESS]:', parsedData);
    } catch (err: any) {
      logger.error('Error fetching assistant calendar events:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}
