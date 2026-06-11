import { useEffect, useState } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width = '100%', height = 20, borderRadius = 10, style }: SkeletonBoxProps) {
  const [containerWidth, setContainerWidth] = useState(300);
  const shimmerX = useSharedValue(-120);

  useEffect(() => {
    const travel = containerWidth + 120;
    shimmerX.value = withRepeat(
      withSequence(
        withTiming(-120, { duration: 0 }),
        withTiming(travel, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [containerWidth]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <View
      style={[{ width, height, borderRadius, backgroundColor: '#D8E0D5', overflow: 'hidden' }, style]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Shimmer beam: three stacked views simulate a soft gradient effect */}
      <Animated.View
        style={[shimmerStyle, { position: 'absolute', top: 0, bottom: 0, flexDirection: 'row', width: 120 }]}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.0)' }} />
        <View style={{ width: 50, backgroundColor: 'rgba(255,255,255,0.52)' }} />
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.0)' }} />
      </Animated.View>
    </View>
  );
}
