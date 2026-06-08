import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';

// ─── Event Map ────────────────────────────────────────────────────────────────
// Add new real-time events here. The map is the single source of truth for all
// typed WebSocket communication in the app.

export type WebSocketEventMap = {
  /** Real-time daily score pushed by the assistant service after analysis */
  daily_score_update: DashboardDailyScore;

  /** Fired when the assistant finishes processing an audio recording */
  'assistant:analysis_complete': {
    profile_id: string;
    audio_profile_id: string;
    status: 'completed' | 'skipped' | 'failed';
    description: string | null;
  };

  "location.track.update":{
    latitude:number,
    longitude:number
  }

  "location.track.psycho":void

  "location.track.relax":void
};

export type WebSocketEventType = keyof WebSocketEventMap;

// ─── Context interface ────────────────────────────────────────────────────────

export interface WebSocketContextValue {
  /**
   * Subscribe to a typed WebSocket event.
   * Returns a cleanup function that removes the handler.
   *
   * @example
   * useEffect(() => subscribe('daily_score_update', setScore), [subscribe]);
   */
  subscribe: <K extends WebSocketEventType>(
    event: K,
    handler: (data: WebSocketEventMap[K]) => void,
  ) => () => void;

  /** True while the socket is connected to the server */
  isConnected: boolean;
}
