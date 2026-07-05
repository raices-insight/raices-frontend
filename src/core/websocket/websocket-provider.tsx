import { CONFIG } from '@/core/config';
import { logger } from '@/core/logger';
import { useAuth } from '@/features/auth/context/auth-context';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { io } from 'socket.io-client';
import type {
  WebSocketContextValue,
  WebSocketEventMap,
  WebSocketEventType,
} from './websocket.types';

// ─── Context ──────────────────────────────────────────────────────────────────

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Global Socket.IO provider — mount once at the app root (inside AuthProvider).
 *
 * Creates a single persistent connection that survives navigation. All modules
 * subscribe to events via the `useWebSocket()` hook instead of managing their
 * own socket instances.
 */
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { sessionToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Handler registry: event name → set of subscriber callbacks.
   * Decoupled from the socket lifecycle — handlers can be registered before
   * the socket connects (e.g. child effects running before parent effects).
   */
  const handlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  // ─── Socket lifecycle ────────────────────────────────────────────────────────

  useEffect(() => {
    // Do not connect until we have an authenticated session
    if (!sessionToken) return;

    const socket = io(CONFIG.API_URL, {
      auth: { token: sessionToken },
      transports: ['websocket'],
    });

    // Track connection state for consumers
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', (err) => logger.warn('[WebSocket] connect_error', err.message));

    // Single routing point: forward every incoming event to registered handlers.
    // Using onAny avoids per-event socket.on() registrations and keeps the
    // provider agnostic to the event catalogue.
    (socket as any).onAny((event: string, data: unknown) => {
      handlersRef.current.get(event)?.forEach(h => h(data));
    });

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, [sessionToken]);

  // ─── subscribe ───────────────────────────────────────────────────────────────

  /**
   * Subscribe to a typed WebSocket event.
   *
   * Stable reference (useCallback with no deps) so callers can safely add it
   * to useEffect dependency arrays without causing infinite loops.
   */
  const subscribe = useCallback(
    <K extends WebSocketEventType>(
      event: K,
      handler: (data: WebSocketEventMap[K]) => void,
    ): (() => void) => {
      const map = handlersRef.current;
      if (!map.has(event)) map.set(event, new Set());
      map.get(event)!.add(handler as any);

      // Return cleanup — call this in useEffect return to avoid memory leaks
      return () => {
        map.get(event)?.delete(handler as any);
      };
    },
    [],
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <WebSocketContext.Provider value={{ subscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the global WebSocket context.
 *
 * @throws if called outside a `<WebSocketProvider>` ancestor.
 */
export function useWebSocket(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used inside WebSocketProvider');
  return ctx;
}
