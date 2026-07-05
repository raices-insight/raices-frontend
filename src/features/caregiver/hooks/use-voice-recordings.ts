import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { z } from 'zod';
import { apiClient } from '@/core/api/client';
import { useWebSocket } from '@/core/websocket/websocket-provider';
import { VoiceRecordingSchema, type VoiceRecording } from '../api/schemas';
import { logger } from '@/core/logger';

interface UseVoiceRecordingsReturn {
  recordings: VoiceRecording[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetches the most recent voice recordings for a specific older adult profile.
 * Returns immediately with empty data when profileId is null (no adult selected).
 */
export function useVoiceRecordings(
  profileId: string | null,
  limit = 5,
): UseVoiceRecordingsReturn {
  const { subscribe } = useWebSocket();
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  // Start in loading state if we have a profileId so consumers can show
  // a skeleton immediately without waiting for the first effect flush.
  const [isLoading, setIsLoading] = useState(!!profileId);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecordings = useCallback(
    async (signal?: AbortSignal) => {
      if (!profileId) {
        setRecordings([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          profile_id: profileId,
          limit: String(limit),
        });

        const response = await apiClient.get(
          `/assistant/voice-recordings?${params.toString()}`,
          { signal },
        );

        const parsed = z.array(VoiceRecordingSchema).safeParse(response.data);
        if (parsed.success) {
          setRecordings(parsed.data);
        } else {
          logger.error('[useVoiceRecordings] validation failed', parsed.error);
          setRecordings([]);
        }
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;

        if (err.response?.status === 404) {
          // No recordings yet — not an error
          setRecordings([]);
          return;
        }

        logger.error('[useVoiceRecordings] fetch failed', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setRecordings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [profileId, limit],
  );

  useFocusEffect(
    useCallback(() => {
      logger.debug(`[useVoiceRecordings] Focus gained: fetching recordings for profile ${profileId}`);
      const controller = new AbortController();
      fetchRecordings(controller.signal);
      return () => controller.abort();
    }, [fetchRecordings])
  );

  // Refetch when the assistant finishes processing a new recording
  useEffect(() => {
    return subscribe('assistant:analysis_complete', () => {
      logger.debug('[useVoiceRecordings] analysis_complete received — refetching');
      void fetchRecordings();
    });
  }, [subscribe, fetchRecordings]);

  return { recordings, isLoading, error, refetch: fetchRecordings };
}
