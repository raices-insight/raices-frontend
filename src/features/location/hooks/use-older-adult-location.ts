import { useEffect, useState } from 'react';
import { apiClient } from '@/src/core/api/client';
import { useWebSocket } from '@/src/core/websocket/websocket-provider';

export interface OlderAdultLocation {
  latitude: number;
  longitude: number;
}

const EMPTY_LOCATION: OlderAdultLocation = { latitude: 0, longitude: 0 };

/**
 * Latest location for a specific older adult, scoped by profileId.
 *
 * - Cold start: fetches `GET /location/:profileId` on mount / profileId change.
 * - Live updates: subscribes to `location.track.update` and filters by profile_id,
 *   mirroring the pattern in `useDashboardSocket`.
 *
 * Only older adults ever record location; this hook is read-only and never posts.
 */
export function useOlderAdultLocation(profileId: string | undefined) {
  const { subscribe } = useWebSocket();
  const [location, setLocation] = useState<OlderAdultLocation>(EMPTY_LOCATION);

  // ─── Cold start: fetch on mount / profileId change ───────────────────────────
  useEffect(() => {
    // Reset so the previous adult's pin doesn't linger while the new one loads.
    setLocation(EMPTY_LOCATION);

    if (!profileId) return;

    const abortController = new AbortController();

    async function fetchLocation() {
      try {
        const response = await apiClient.get(`/location/${profileId}`, {
          signal: abortController.signal,
        });
        const data = response.data;
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        if (error.response?.status === 404) return;
        console.warn('Failed to fetch older adult location', error);
      }
    }

    fetchLocation();
    return () => abortController.abort();
  }, [profileId]);

  // ─── Live updates: filter by profile_id ──────────────────────────────────────
  useEffect(() => {
    return subscribe('location.track.update', (data) => {
      if (profileId && data.profile_id !== profileId) return;
      if (data.latitude !== 0 && data.longitude !== 0) {
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      }
    });
  }, [subscribe, profileId]);

  return { location };
}
