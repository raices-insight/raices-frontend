import React, { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { logger } from '@/core/logger';

interface AudioPlayButtonProps {
  audioUrl: string;
  testID?: string;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  className?: string;
}

export function AudioPlayButton({
  audioUrl,
  testID,
  iconSize = 18,
  iconColor = '#FF9800',
  className = 'w-11 h-11 rounded-full items-center justify-center bg-[#FFF3E0]',
}: AudioPlayButtonProps) {
  const player = useAudioPlayer({ uri: audioUrl });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0).catch((e) => logger.error('[AudioPlayButton] seekTo failed', e));
    }
  }, [status.didJustFinish, player]);

  const onPress = () => {
    try {
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (e) {
      logger.error('[AudioPlayButton] playback error', e);
    }
  };

  return (
    <Pressable testID={testID} hitSlop={8} onPress={onPress} className={className}>
      <IconSymbol
        name={status.playing ? 'pause.fill' : 'play.fill'}
        size={iconSize}
        color={iconColor}
      />
    </Pressable>
  );
}
