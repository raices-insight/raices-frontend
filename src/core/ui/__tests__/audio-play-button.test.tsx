/**
 * AudioPlayButton (shared) — plays a remote audio URL, surfaces finish state,
 * and can be re-played after finishing.
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { AudioPlayButton } from '../audio-play-button';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeekTo = jest.fn().mockResolvedValue(undefined);

let mockStatus = { playing: false, didJustFinish: false };

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: mockPlay,
    pause: mockPause,
    seekTo: mockSeekTo,
  })),
  useAudioPlayerStatus: jest.fn(() => mockStatus),
}));

function setStatus(next: Partial<typeof mockStatus>) {
  mockStatus = { ...mockStatus, ...next };
}

describe('AudioPlayButton', () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockPause.mockClear();
    mockSeekTo.mockClear();
    mockStatus = { playing: false, didJustFinish: false };
  });

  it('calls player.play() when pressed in idle state', () => {
    render(<AudioPlayButton audioUrl="https://x/y.mp3" testID="audio-btn" />);
    fireEvent.press(screen.getByTestId('audio-btn'));
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPause).not.toHaveBeenCalled();
  });

  it('calls player.pause() when pressed while playing', () => {
    setStatus({ playing: true });
    render(<AudioPlayButton audioUrl="https://x/y.mp3" testID="audio-btn" />);
    fireEvent.press(screen.getByTestId('audio-btn'));
    expect(mockPause).toHaveBeenCalledTimes(1);
    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('seeks back to 0 when the audio finishes so it can be replayed', () => {
    setStatus({ playing: false, didJustFinish: true });
    render(<AudioPlayButton audioUrl="https://x/y.mp3" testID="audio-btn" />);
    expect(mockSeekTo).toHaveBeenCalledWith(0);
  });

  it('plays again after finishing when pressed', () => {
    setStatus({ playing: false, didJustFinish: true });
    render(<AudioPlayButton audioUrl="https://x/y.mp3" testID="audio-btn" />);

    fireEvent.press(screen.getByTestId('audio-btn'));

    expect(mockSeekTo).toHaveBeenCalledWith(0);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPause).not.toHaveBeenCalled();
  });
});
