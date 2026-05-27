/**
 * WebSocketProvider — TDD test suite
 *
 * Slices covered:
 *  1. Provider connects to the server when user is authenticated
 *  2. Provider does NOT connect when sessionToken is null
 *  3. subscribe() delivers matching events to registered handlers
 *  4. subscribe() returns a cleanup that removes the handler
 *  5. isConnected reflects the live socket connection state
 *  6. Socket is disconnected when the component unmounts
 *  7. useWebSocket() throws when used outside the provider
 */

// ─── Module mocks (must come before any imports) ─────────────────────────────

jest.mock('socket.io-client');
jest.mock('@/features/auth/context/auth-context', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/core/config', () => ({
  CONFIG: { API_URL: 'http://test-server:3000', IS_PROD: false, ENV: 'test' },
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import React from 'react';
import { View } from 'react-native';
import { renderHook, act, render } from '@testing-library/react-native';
import { io } from 'socket.io-client';
import { useAuth } from '@/features/auth/context/auth-context';
import { WebSocketProvider, useWebSocket } from '../websocket-provider';

// ─── Typed mock accessors ─────────────────────────────────────────────────────

const mockIo = jest.mocked(io);
const mockUseAuth = jest.mocked(useAuth);

// ─── Mock socket infrastructure ──────────────────────────────────────────────

/** Tracks handlers registered via socket.on() */
const socketListeners: Map<string, Set<Function>> = new Map();

/** Captures the onAny routing callback set by the provider */
let onAnyCallback: ((event: string, data: unknown) => void) | null = null;

/** Tracks whether the socket was disconnected */
let mockSocketDisconnect: jest.Mock;

function buildMockSocket() {
  socketListeners.clear();
  onAnyCallback = null;
  mockSocketDisconnect = jest.fn();

  return {
    on: jest.fn((event: string, handler: Function) => {
      if (!socketListeners.has(event)) socketListeners.set(event, new Set());
      socketListeners.get(event)!.add(handler);
    }),
    onAny: jest.fn((cb: (event: string, data: unknown) => void) => {
      onAnyCallback = cb;
    }),
    off: jest.fn(),
    disconnect: mockSocketDisconnect,
  };
}

// ─── Helpers to simulate socket lifecycle ────────────────────────────────────

function simulateConnect() {
  act(() => {
    socketListeners.get('connect')?.forEach(h => h());
  });
}

function simulateDisconnect() {
  act(() => {
    socketListeners.get('disconnect')?.forEach(h => h());
  });
}

function simulateServerEvent(event: string, data?: unknown) {
  act(() => {
    onAnyCallback?.(event, data);
  });
}

// ─── Auth mock helper ─────────────────────────────────────────────────────────

function mockSessionToken(token: string | null) {
  mockUseAuth.mockReturnValue({
    sessionToken: token,
    user: token
      ? { id: 'profile-1', email: 'user@test.com', name: 'Test User', roles: [] }
      : null,
    loading: false,
    error: null,
    isNewUser: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    completeOnboarding: jest.fn(),
    localEmail: '',
    localPassword: '',
    onLocalEmailChange: jest.fn(),
    onLocalPasswordChange: jest.fn(),
    localSignIn: jest.fn(),
  } as any);
}

// ─── Wrapper for renderHook ───────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WebSocketProvider>{children}</WebSocketProvider>
);

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockIo.mockReturnValue(buildMockSocket() as any);
  mockSessionToken('test-token-abc');
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('WebSocketProvider', () => {

  // ── Slice 1: Connects when authenticated ────────────────────────────────────

  describe('Slice 1 — connects to the server when authenticated', () => {
    it('calls io() with the API URL when sessionToken is set', () => {
      renderHook(() => useWebSocket(), { wrapper });

      expect(mockIo).toHaveBeenCalledTimes(1);
      expect(mockIo).toHaveBeenCalledWith(
        'http://test-server:3000',
        expect.objectContaining({
          auth: { token: 'test-token-abc' },
          transports: ['websocket'],
        }),
      );
    });

    it('passes the exact session token from AuthContext', () => {
      mockSessionToken('specific-token-xyz');
      mockIo.mockReturnValue(buildMockSocket() as any);

      renderHook(() => useWebSocket(), { wrapper });

      expect(mockIo).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ auth: { token: 'specific-token-xyz' } }),
      );
    });
  });

  // ── Slice 2: Does NOT connect without a token ────────────────────────────────

  describe('Slice 2 — does NOT connect when sessionToken is null', () => {
    it('does not call io() when sessionToken is null', () => {
      mockSessionToken(null);
      mockIo.mockReturnValue(buildMockSocket() as any);

      renderHook(() => useWebSocket(), { wrapper });

      expect(mockIo).not.toHaveBeenCalled();
    });
  });

  // ── Slice 3: subscribe() delivers matching events ───────────────────────────

  describe('Slice 3 — subscribe() delivers matching events', () => {
    it('calls the handler when the socket emits the subscribed event', () => {
      const handler = jest.fn();
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      result.current.subscribe('daily_score_update', handler);
      simulateServerEvent('daily_score_update', { score: 90, profile_id: 'p1' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ score: 90, profile_id: 'p1' });
    });

    it('does NOT call the handler for a different event type', () => {
      const handler = jest.fn();
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      result.current.subscribe('daily_score_update', handler);
      simulateServerEvent('assistant:analysis_complete', { profile_id: 'p1' });

      expect(handler).not.toHaveBeenCalled();
    });

    it('delivers events to multiple independent subscribers', () => {
      const handlerA = jest.fn();
      const handlerB = jest.fn();
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      result.current.subscribe('daily_score_update', handlerA);
      result.current.subscribe('daily_score_update', handlerB);
      simulateServerEvent('daily_score_update', { score: 75, profile_id: 'p1' });

      expect(handlerA).toHaveBeenCalledTimes(1);
      expect(handlerB).toHaveBeenCalledTimes(1);
    });
  });

  // ── Slice 4: subscribe() cleanup removes the handler ───────────────────────

  describe('Slice 4 — subscribe() cleanup removes the handler', () => {
    it('stops calling the handler after the returned cleanup is invoked', () => {
      const handler = jest.fn();
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const unsubscribe = result.current.subscribe('daily_score_update', handler);
      unsubscribe(); // remove handler
      simulateServerEvent('daily_score_update', { score: 50, profile_id: 'p1' });

      expect(handler).not.toHaveBeenCalled();
    });

    it('only removes the specific handler, leaving others intact', () => {
      const handlerA = jest.fn();
      const handlerB = jest.fn();
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      const unsubA = result.current.subscribe('daily_score_update', handlerA);
      result.current.subscribe('daily_score_update', handlerB);

      unsubA(); // only remove A
      simulateServerEvent('daily_score_update', { score: 50, profile_id: 'p1' });

      expect(handlerA).not.toHaveBeenCalled();
      expect(handlerB).toHaveBeenCalledTimes(1);
    });
  });

  // ── Slice 5: isConnected reflects socket state ───────────────────────────────

  describe('Slice 5 — isConnected reflects socket connection state', () => {
    it('starts as false before the socket connects', () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      expect(result.current.isConnected).toBe(false);
    });

    it('becomes true when the socket emits connect', () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      simulateConnect();

      expect(result.current.isConnected).toBe(true);
    });

    it('becomes false again when the socket emits disconnect', () => {
      const { result } = renderHook(() => useWebSocket(), { wrapper });

      simulateConnect();
      simulateDisconnect();

      expect(result.current.isConnected).toBe(false);
    });
  });

  // ── Slice 6: disconnects on unmount ──────────────────────────────────────────

  describe('Slice 6 — disconnects socket when provider unmounts', () => {
    it('calls socket.disconnect() when the provider unmounts', () => {
      const { unmount } = renderHook(() => useWebSocket(), { wrapper });

      unmount();

      expect(mockSocketDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  // ── Slice 7: throws when used outside provider ────────────────────────────────

  describe('Slice 7 — useWebSocket throws when used outside provider', () => {
    it('throws an error if useWebSocket is called without a WebSocketProvider ancestor', () => {
      // Suppress console.error from React's error boundary
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWebSocket());
      }).toThrow('useWebSocket must be used inside WebSocketProvider');

      spy.mockRestore();
    });
  });

});
