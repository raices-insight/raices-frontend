import React, { useCallback, useEffect, useRef } from 'react';
import { View as RNView, Pressable } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { type ToastItem, type ToastVariant } from './types';
import { useToastContext } from './toast-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Variant config -----------------------------------------------------------

const VARIANT_STYLES: Record<ToastVariant, { container: string; text: string; icon: string }> = {
  info:    { container: 'bg-raices-primary',   text: 'text-white', icon: 'info.circle.fill' },
  success: { container: 'bg-raices-secondary', text: 'text-white', icon: 'checkmark.circle.fill' },
  warning: { container: 'bg-amber-500',        text: 'text-white', icon: 'exclamationmark.triangle.fill' },
  error:   { container: 'bg-raices-error',     text: 'text-white', icon: 'xmark.circle.fill' },
};

// --- Single Toast animation component ----------------------------------------

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const translateY = useSharedValue(-120);
  const opacity    = useSharedValue(0);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    runOnJS(onDismiss)(item.id);
  }, [item.id, onDismiss]);

  const animateOut = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(-120, { duration: 300, easing: Easing.in(Easing.ease) });
    opacity.value    = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) runOnJS(dismiss)();
    });
  }, [dismiss, translateY, opacity]);

  useEffect(() => {
    // Haptic feedback based on variant
    if (item.variant === 'success') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (item.variant === 'error') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (item.variant === 'warning') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // Slide in
    translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.back(1.2)) });
    opacity.value    = withTiming(1, { duration: 250 });

    // Auto-dismiss
    timerRef.current = setTimeout(animateOut, item.duration - 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, item.duration, item.variant, animateOut]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const { container, text, icon } = VARIANT_STYLES[item.variant];

  return (
    <Reanimated.View style={animStyle}>
      <Pressable onPress={animateOut}>
        <View className={`flex-row items-center gap-3 px-4 py-3 rounded-2xl shadow-lg elevation-6 ${container}`}>
          <IconSymbol name={icon as any} size={20} color="#FFFFFF" />
          <Text className={`font-body text-sm flex-1 ${text}`}>{item.message}</Text>
          <IconSymbol name="xmark" size={12} color="rgba(255,255,255,0.6)" />
        </View>
      </Pressable>
    </Reanimated.View>
  );
}

// --- Toast Renderer -----------------------------------------------------------

export function ToastRenderer() {
  const { toasts, dismiss } = useToastContext();
  const { top: topInset } = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <RNView
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: topInset + 8,
        left: 16,
        right: 16,
        gap: 8,
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </RNView>
  );
}
