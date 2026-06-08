/**
 * useAssistantCalendarEvents — behavior tests
 *
 * System boundary mocked: @/src/core/api/client (network)
 * Internal logic exercised through the public hook interface.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAssistantCalendarEvents } from '../useAssistantCalendarEvents';
import type { CalendarEvent } from '../../api/schemas';

import { apiClient } from '@/src/core/api/client';

// ─── Mock the network boundary ────────────────────────────────────────────────

jest.mock('@/src/core/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockGet = jest.mocked(apiClient.get);
const mockDelete = jest.mocked(apiClient.delete);
const mockPatch = jest.mocked(apiClient.patch);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// Using valid UUID v4 format (version = 4, variant = 8-b)
const ID_A = '550e8400-e29b-4d14-a716-446655440000';
const ID_B = '6ba7b810-9dad-4ad1-8ab4-00c04fd430c8';

function makeEvent(id: string, overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id,
    title: `Event ${id.slice(0, 8)}`,
    due_date: new Date('2025-06-01T10:00:00Z').toISOString(),
    status: 'pending',
    description: null,
    creator_audio_profile_id: null,
    adult_profile_id: null,
    audio_url: null,
    ...overrides,
  };
}

const EVENT_A = makeEvent(ID_A);
const EVENT_B = makeEvent(ID_B);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFetchReturns(events: CalendarEvent[]) {
  mockGet.mockResolvedValue({ data: events });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('useAssistantCalendarEvents', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockDelete.mockResolvedValue({ data: {} });
    mockPatch.mockResolvedValue({ data: {} });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Slice 1 — deleteEvent removes event from list immediately (optimistic)
  // ────────────────────────────────────────────────────────────────────────────

  describe('deleteEvent', () => {
    it('removes the event from the list immediately without waiting for the server', async () => {
      mockFetchReturns([EVENT_A, EVENT_B]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));

      // Wait for initial fetch
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.events).toHaveLength(2);

      act(() => { result.current.deleteEvent(EVENT_A.id); });

      // Event A should be gone immediately — before any server round-trip
      expect(result.current.events.find(e => e.id === EVENT_A.id)).toBeUndefined();
      expect(result.current.events).toHaveLength(1);
    });

    it('keeps the remaining events after deleting one', async () => {
      mockFetchReturns([EVENT_A, EVENT_B]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => { result.current.deleteEvent(EVENT_A.id); });

      expect(result.current.events[0].id).toBe(EVENT_B.id);
    });

    // ── Slice 2 — deleteEvent calls DELETE /assistant/calendar-events/:id ──────

    it('calls DELETE /assistant/calendar-events/:id', async () => {
      mockFetchReturns([EVENT_A]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => { await result.current.deleteEvent(EVENT_A.id); });

      expect(mockDelete).toHaveBeenCalledWith(
        `/assistant/calendar-events/${EVENT_A.id}`,
      );
    });

    it('does not call the server API when the id is not in the event list', async () => {
      mockFetchReturns([EVENT_A]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.deleteEvent('non-existent-id');
      });

      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  // ── Slice 3 — editEvent ──────────────────────────────────────────────────────

  describe('editEvent', () => {
    const UPDATED_TITLE = 'Updated title';
    const UPDATED_DUE_DATE = new Date('2025-07-01T14:00:00Z').toISOString();

    it('updates the event in the list immediately (optimistic)', async () => {
      mockFetchReturns([EVENT_A, EVENT_B]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => { result.current.editEvent(EVENT_A.id, { title: UPDATED_TITLE }); });

      const updated = result.current.events.find(e => e.id === EVENT_A.id);
      expect(updated?.title).toBe(UPDATED_TITLE);
    });

    it('calls PATCH /assistant/calendar-events/:id with the updated fields', async () => {
      mockFetchReturns([EVENT_A]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.editEvent(EVENT_A.id, { title: UPDATED_TITLE, due_date: UPDATED_DUE_DATE });
      });

      expect(mockPatch).toHaveBeenCalledWith(
        `/assistant/calendar-events/${EVENT_A.id}`,
        { title: UPDATED_TITLE, due_date: UPDATED_DUE_DATE },
      );
    });

    it('does not call the server when the event id is not in the list', async () => {
      mockFetchReturns([EVENT_A]);

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.editEvent('non-existent-id', { title: UPDATED_TITLE });
      });

      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('refetches (reverts) when PATCH fails', async () => {
      mockFetchReturns([EVENT_A]);
      mockPatch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAssistantCalendarEvents({ skip: false }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.editEvent(EVENT_A.id, { title: UPDATED_TITLE });
      });

      // After failure, refetch is called — mockGet should be called a second time
      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });
});
