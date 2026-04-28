import React, { useCallback, useEffect } from 'react';
import { Modal, View as RNView, Platform } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { type ToastItem, type ToastVariant } from './types';

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

  const dismiss = useCallback(() => {
    runOnJS(onDismiss)(item.id);
  }, [item.id, onDismiss]);

  useEffect(() => {
    // 1. Slide in immediately
    translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.back(1.2)) });
    opacity.value    = withTiming(1, { duration: 250 });

    // 2. Use a standard timer for the dismissal sequence
    // This is much more reliable on Web than Reanimated's withDelay
    const timer = setTimeout(() => {
      // Slide out
      translateY.value = withTiming(-120, { duration: 300, easing: Easing.in(Easing.ease) });
      opacity.value    = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(dismiss)();
      });
    }, item.duration - 300);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, dismiss]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const { container, text, icon } = VARIANT_STYLES[item.variant];

  return (
    <Reanimated.View style={animStyle}>
      <View className={`flex-row items-center gap-3 px-4 py-3 rounded-2xl shadow-lg elevation-6 ${container}`}>
        <IconSymbol name={icon as any} size={20} color="#FFFFFF" />
        <Text className={`font-body text-sm flex-1 ${text}`}>{item.message}</Text>
      </View>
    </Reanimated.View>
  );
}

// --- Toast Renderer -----------------------------------------------------------
// Uses Modal so it renders above all navigation stacks regardless of z-index.
// On web, absolute positioning inside a Stack view is buried by the stacking
// context — Modal is the only reliable way to guarantee top-layer rendering.

interface ToastRendererProps {
  toasts: ToastItem[];
  /** Top offset in px (pass safe-area top inset from the provider) */
  topInset: number;
  onDismiss: (id: string) => void;
}

export function ToastRenderer({ toasts, topInset, onDismiss }: ToastRendererProps) {
  if (toasts.length === 0) return null;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      {/* Full-screen pass-through so taps reach the app beneath */}
      <RNView pointerEvents="box-none" style={{ flex: 1 }}>
        <RNView
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: topInset + 8,
            left: 16,
            right: 16,
            gap: 8,
          }}
        >
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
          ))}
        </RNView>
      </RNView>
    </Modal>
  );
}
