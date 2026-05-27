import { useCallback, useEffect, useRef, useState } from 'react';
import { DashboardDailyScoreSchema, type DashboardDailyScore } from '@/features/dashboard/api/schemas';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import { apiClient } from '@/core/api/client';
import { useWebSocket } from '@/core/websocket/websocket-provider';

import { z } from 'zod';

/**
 * Manages dashboard real-time data for a given profile.
 *
 * - Cold start: fetches the last 2 days' scores via HTTP on mount.
 * - Live updates: subscribes to `daily_score_update` via the global WebSocket.
 * - On-demand: exposes `refresh()` so callers can re-fetch (e.g. on screen focus).
 */
export const useDashboardSocket = (profileId: string | undefined) => {
  const [dailyScore, setDailyScore] = useState<DashboardDailyScore | null>(null);
  const [yesterdayScore, setYesterdayScore] = useState<DashboardDailyScore | null>(null);
  const toast = useToast();
  const { subscribe, isConnected } = useWebSocket();

  // Keep toast in a ref so fetchData doesn't need it as a dependency
  const toastRef = useRef(toast);
  useEffect(() => { toastRef.current = toast; }, [toast]);

  // ─── Fetch (stable reference, safe to call from useFocusEffect) ───────────────

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!profileId) return;
    try {
      logger.info('Fetching dashboard history', { profileId });

      const response = await apiClient.get<DashboardDailyScore[]>(
        `/assistant/dashboard/current/${profileId}`,
        { signal }
      );

      const HistorySchema = z.array(DashboardDailyScoreSchema);
      const parsed = HistorySchema.safeParse(response.data);

      if (parsed.success) {
        const history = parsed.data;
        if (history.length > 0) setDailyScore(history[0]);
        if (history.length > 1) setYesterdayScore(history[1]);
        logger.info(`Loaded dashboard history: ${history.length} records`);
      } else {
        logger.error('History data validation failed', parsed.error);
      }
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        logger.info('Fetch history aborted');
        return;
      }
      if (error.response?.status === 404) {
        logger.info('No history found (expected for new users)');
        return;
      }
      toastRef.current.error('Error al conectar con el servidor.');
      logger.error('Failed to fetch dashboard history', error);
    }
  }, [profileId]); // toast intentionally excluded — accessed via ref

  // ─── Cold Start: fetch on mount / profileId change ───────────────────────────

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    return () => abortController.abort();
  }, [fetchData]);

  // ─── Real-time: subscribe to daily score updates via global WebSocket ─────────

  useEffect(() => {
    return subscribe('daily_score_update', (data) => {
      logger.info('Received daily_score_update via global WebSocket');
      const parsed = DashboardDailyScoreSchema.safeParse(data);
      if (!parsed.success) {
        logger.error('Invalid daily_score_update payload', parsed.error);
        return;
      }
      setDailyScore(parsed.data);
    });
  }, [subscribe]);

  // ─── On-demand refresh (call from useFocusEffect in the screen) ───────────────

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { dailyScore, yesterdayScore, isConnected, refresh };
};
