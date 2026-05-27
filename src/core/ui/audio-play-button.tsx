import React, { useEffect, useState } from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Pressable, View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { logger } from '@/core/logger';
import { CONFIG } from '@/core/config';

// ── Variants ──────────────────────────────────────────────────────────────────
//
//  'icon'     — small circular icon-only button (default)
//  'pill-lg'  — wide pill: "Tocar para escuchar" / "Pausar mensaje"
//  'pill-sm'  — compact pill: "Escuchar mensaje" / "Pausar"
//
export type AudioPlayButtonVariant = 'icon' | 'pill-lg' | 'pill-sm';

export interface AudioPlayButtonProps {
  audioUrl: string;
  variant?: AudioPlayButtonVariant;
  testID?: string;
  // 'icon' variant customisation
  iconSize?: number;
  iconColor?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveUrl(url: string): string {
  if (!url.includes('localhost')) return url;
  const apiUrl = CONFIG.API_URL || '';
  const m = apiUrl.match(/:\/\/([^\/:]+)/);
  if (m?.[1] && m[1] !== 'localhost') return url.replace('localhost', m[1]);
  return url;
}

// ── Sound wave bars ───────────────────────────────────────────────────────────
// Three bars that bounce at slightly different rhythms while playing,
// then smoothly settle to a flat line when paused.

interface SoundWaveBarsProps {
  playing: boolean;
  color: string;
  barHeight: number;
  barWidth?: number;
}

function SoundWaveBars({ playing, color, barHeight, barWidth = 2.5 }: SoundWaveBarsProps) {
  const b1 = useSharedValue(0.15);
  const b2 = useSharedValue(0.15);
  const b3 = useSharedValue(0.15);

  useEffect(() => {
    if (playing) {
      b1.value = withRepeat(
        withSequence(
          withTiming(1,    { duration: 380 }),
          withTiming(0.2,  { duration: 300 }),
        ),
        -1,
        false,
      );
      b2.value = withDelay(
        150,
        withRepeat(
          withSequence(
            withTiming(1,   { duration: 480 }),
            withTiming(0.2, { duration: 360 }),
          ),
          -1,
          false,
        ),
      );
      b3.value = withDelay(
        70,
        withRepeat(
          withSequence(
            withTiming(1,   { duration: 330 }),
            withTiming(0.2, { duration: 410 }),
          ),
          -1,
          false,
        ),
      );
    } else {
      // Smoothly shrink all bars when paused / finished
      b1.value = withTiming(0.15, { duration: 250 });
      b2.value = withTiming(0.15, { duration: 250 });
      b3.value = withTiming(0.15, { duration: 250 });
    }
  }, [playing, b1, b2, b3]);

  const s1 = useAnimatedStyle(() => ({ transform: [{ scaleY: b1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ scaleY: b2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ scaleY: b3.value }] }));

  const bar = {
    width: barWidth,
    height: barHeight,
    borderRadius: barWidth / 2,
    backgroundColor: color,
  };

  return (
    <RNView style={styles.waveContainer}>
      <Animated.View style={[bar, s1]} />
      <Animated.View style={[bar, s2]} />
      <Animated.View style={[bar, s3]} />
    </RNView>
  );
}

// ── Pulse ring ────────────────────────────────────────────────────────────────
// Expands and fades out behind the icon button while playing.

interface PulseRingProps {
  playing: boolean;
  size: number;
  color: string;
}

function PulseRing({ playing, size, color }: PulseRingProps) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (playing) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.65, { duration: 800 }),
          withTiming(1,    { duration: 0 }),
        ),
        -1,
        false,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 250 }),
          withTiming(0,    { duration: 550 }),
        ),
        -1,
        false,
      );
    } else {
      scale.value   = withTiming(1, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [playing, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AudioPlayButton({
  audioUrl,
  variant = 'icon',
  testID,
  iconSize = 18,
  iconColor = '#FF9800',
  className = 'w-11 h-11 rounded-full items-center justify-center bg-[#FFF3E0]',
}: AudioPlayButtonProps) {
  const player = useAudioPlayer({ uri: resolveUrl(audioUrl) });
  const status = useAudioPlayerStatus(player);
  const [hasError, setHasError] = useState(false);

  // When audio finishes: pause first, then rewind so it can be replayed.
  // seekTo(0) without pausing first causes the player to restart automatically.
  useEffect(() => {
    if (status.didJustFinish) {
      player.pause();
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
      setHasError(true);
    }
  };

  // ── Error states ─────────────────────────────────────────────────────────────

  if (hasError) {
    if (variant === 'pill-sm') {
      return (
        <View className="flex-row items-center gap-1 mt-2">
          <IconSymbol name="exclamationmark.triangle.fill" size={13} color="#EF4444" />
          <Text className="text-xs font-body text-red-500">Audio expirado</Text>
        </View>
      );
    }
    if (variant === 'pill-lg') {
      return (
        <View className="flex-row items-center gap-2 bg-red-100 px-5 py-3 rounded-full self-start border border-red-300">
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#EF4444" />
          <Text className="text-sm font-label font-semibold text-red-600">Audio expirado</Text>
        </View>
      );
    }
    return (
      <View className={className}>
        <IconSymbol name="exclamationmark.triangle.fill" size={iconSize} color="#EF4444" />
      </View>
    );
  }

  // ── pill-sm ───────────────────────────────────────────────────────────────────

  if (variant === 'pill-sm') {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        className="flex-row items-center gap-1.5 mt-2 self-start bg-raices-secondary/10 rounded-full px-3 py-1.5"
      >
        {status.playing ? (
          <SoundWaveBars playing color="#53815F" barHeight={13} />
        ) : (
          <IconSymbol name="play.fill" size={13} color="#53815F" />
        )}
        <Text className="text-xs font-label font-semibold text-raices-secondary">
          {status.playing ? 'Pausar' : 'Escuchar mensaje'}
        </Text>
      </Pressable>
    );
  }

  // ── pill-lg ───────────────────────────────────────────────────────────────────

  if (variant === 'pill-lg') {
    return (
      <View className="self-start rounded-full">
        <Pressable
          testID={testID}
          onPress={onPress}
          className={`flex-row items-center justify-center gap-2 px-5 py-3 rounded-full border ${
            status.playing
              ? 'bg-[#E8F3EB] border-[#325F3F]'
              : 'bg-raices-bg border-raices-secondary'
          }`}
          style={{ minWidth: 220 }}
        >
          {status.playing ? (
            <SoundWaveBars playing color="#325F3F" barHeight={20} barWidth={3} />
          ) : (
            <IconSymbol name="play.fill" size={20} color="#325F3F" />
          )}
          <Text className="text-sm font-label font-semibold text-raices-primary">
            {status.playing ? 'Pausar mensaje' : 'Tocar para escuchar'}
          </Text>
        </Pressable>
      </View>
    );
  }

  // ── icon (default) ────────────────────────────────────────────────────────────

  return (
    <RNView style={styles.iconWrapper}>
      <PulseRing playing={status.playing} size={44} color={iconColor} />
      <Pressable testID={testID} hitSlop={8} onPress={onPress} className={className}>
        <IconSymbol
          name={status.playing ? 'pause.fill' : 'play.fill'}
          size={iconSize}
          color={iconColor}
        />
      </Pressable>
    </RNView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
