/**
 * HomeVoiceRecordings
 * List of recent voice recordings for the selected older adult.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HomeVoiceRecordings } from '../HomeVoiceRecordings';
import type { VoiceRecording } from '@/features/caregiver/api/schemas';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeekTo = jest.fn().mockResolvedValue(undefined);
jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({ play: mockPlay, pause: mockPause, seekTo: mockSeekTo })),
  useAudioPlayerStatus: jest.fn(() => ({ playing: false, didJustFinish: false })),
}));

const makeRecording = (id: string, description: string, mood: string | null, hoursAgo = 2): VoiceRecording => ({
  id,
  description,
  mood,
  created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
  audio_url: `https://s3.example.com/${id}.mp3`,
});

describe('HomeVoiceRecordings', () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockPause.mockClear();
    mockSeekTo.mockClear();
  });

  it('renders the section title', () => {
    const recordings = [makeRecording('r1', 'Me siento bien hoy', 'happy')];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);
    expect(screen.getByText('Registros de voz recientes')).toBeOnTheScreen();
  });

  it('renders each recording description', () => {
    const recordings = [
      makeRecording('r1', 'Me siento bien hoy', 'happy'),
      makeRecording('r2', 'Resumen de la tarde', 'tired', 24),
    ];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);
    expect(screen.getByText('Me siento bien hoy')).toBeOnTheScreen();
    expect(screen.getByText('Resumen de la tarde')).toBeOnTheScreen();
  });

  it('shows a translated mood badge', () => {
    const recordings = [makeRecording('r1', 'Estoy cansado', 'tired')];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);
    expect(screen.getByText('CANSANCIO')).toBeOnTheScreen();
  });

  it('shows POSITIVO badge for happy mood', () => {
    const recordings = [makeRecording('r1', 'Hoy fue un buen día', 'happy')];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);
    expect(screen.getByText('POSITIVO')).toBeOnTheScreen();
  });

  it('does not show a badge when mood is null', () => {
    const recordings = [{ ...makeRecording('r1', 'Sin análisis', null), mood: null }];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);
    expect(screen.queryByText('POSITIVO')).toBeNull();
    expect(screen.queryByText('CANSANCIO')).toBeNull();
  });

  it('shows a "Ver todos" button when onViewAll is provided', () => {
    const onViewAll = jest.fn();
    const recordings = [makeRecording('r1', 'Registro', 'happy')];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} onViewAll={onViewAll} />);

    const button = screen.getByText('Ver todos');
    expect(button).toBeOnTheScreen();
    fireEvent.press(button);
    expect(onViewAll).toHaveBeenCalled();
  });

  it('plays the recording when the play button is pressed', () => {
    const recordings = [makeRecording('r1', 'Audio de prueba', 'happy')];
    render(<HomeVoiceRecordings recordings={recordings} loading={false} />);

    fireEvent.press(screen.getByTestId('play-recording-r1'));

    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  it('does not render a play button when audio_url is missing', () => {
    const recording = { ...makeRecording('r1', 'Sin audio', 'happy'), audio_url: null };
    render(<HomeVoiceRecordings recordings={[recording]} loading={false} />);

    expect(screen.queryByTestId('play-recording-r1')).toBeNull();
  });

  it('returns null when recordings list is empty and not loading', () => {
    const { toJSON } = render(<HomeVoiceRecordings recordings={[]} loading={false} />);
    expect(toJSON()).toBeNull();
  });
});
