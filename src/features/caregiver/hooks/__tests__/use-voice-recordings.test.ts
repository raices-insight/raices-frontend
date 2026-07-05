/**
 * useVoiceRecordings
 * Fetches recent voice recordings for a specific older adult profile.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useVoiceRecordings } from '../use-voice-recordings';

import { apiClient } from '@/core/api/client';

// Mock apiClient
jest.mock('@/core/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock WebSocket provider — severs the GoogleSignin native-module import chain
// (websocket-provider → auth-context → use-google-auth → @react-native-google-signin)
jest.mock('@/core/websocket/websocket-provider', () => ({
  useWebSocket: () => ({ subscribe: jest.fn(() => jest.fn()) }),
}));
const mockGet = apiClient.get as jest.Mock;

const MOCK_RECORDINGS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    description: 'Me siento bien hoy',
    mood: 'happy',
    created_at: '2026-05-27T08:00:00Z',
    audio_url: 'https://s3.example.com/audio1.mp3',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    description: 'Resumen de la tarde',
    mood: 'tired',
    created_at: '2026-05-26T17:00:00Z',
    audio_url: null,
  },
];

describe('useVoiceRecordings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array and no loading when profileId is null', () => {
    const { result } = renderHook(() => useVoiceRecordings(null));
    expect(result.current.recordings).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches recordings for a given profileId', async () => {
    mockGet.mockResolvedValueOnce({ data: MOCK_RECORDINGS });

    const { result } = renderHook(() => useVoiceRecordings('profile-adult-1'));

    // Wait for data to arrive (isLoading starts true for a non-null profileId)
    await waitFor(() => expect(result.current.recordings).toHaveLength(2));

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/assistant/voice-recordings'),
      expect.anything(),
    );
    expect(result.current.recordings[0].description).toBe('Me siento bien hoy');
    expect(result.current.isLoading).toBe(false);
  });

  it('returns empty array when the API responds with 404', async () => {
    const error = Object.assign(new Error('Not found'), { response: { status: 404 } });
    mockGet.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useVoiceRecordings('profile-no-data'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.recordings).toEqual([]);
    expect(result.current.error).toBeNull(); // 404 is not an error, just no data
  });

  it('sets error when API fails with non-404', async () => {
    const error = Object.assign(new Error('Server error'), { response: { status: 500 } });
    mockGet.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useVoiceRecordings('profile-adult-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).not.toBeNull();
  });

  it('re-fetches when profileId changes', async () => {
    mockGet.mockResolvedValue({ data: MOCK_RECORDINGS });

    const { result, rerender } = renderHook(
      ({ id }) => useVoiceRecordings(id),
      { initialProps: { id: 'profile-1' } },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGet).toHaveBeenCalledTimes(1);

    rerender({ id: 'profile-2' });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGet).toHaveBeenCalledTimes(2);
  });
});
