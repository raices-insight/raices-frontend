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
jest.mock('expo-audio', () => ({ useAudioPlayer: () => ({ play: jest.fn(), pause: jest.fn(), playing: false }) }));

const makeRecording = (id: string, description: string, mood: string | null, hoursAgo = 2): VoiceRecording => ({
  id,
  description,
  mood,
  created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
  audio_url: `https://s3.example.com/${id}.mp3`,
});

describe('HomeVoiceRecordings', () => {
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

  it('returns null when recordings list is empty and not loading', () => {
    const { toJSON } = render(<HomeVoiceRecordings recordings={[]} loading={false} />);
    expect(toJSON()).toBeNull();
  });
});
