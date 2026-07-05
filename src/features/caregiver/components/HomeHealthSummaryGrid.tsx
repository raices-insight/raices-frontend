import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from 'react-native-reanimated';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol, type IconSymbolName } from '@/core/ui/icon-symbol';
import { SkeletonBox } from '@/core/ui/SkeletonBox';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';

interface HomeHealthSummaryGridProps {
  dailyScore: DashboardDailyScore | null;
  loading: boolean;
  isMoodShared?: boolean;
  isActivityShared?: boolean;
  isHealthShared?: boolean;
}

interface StatusCardProps {
  label: string;
  value: string;
  iconName: IconSymbolName;
  iconColor?: string;
  index?: number;
}

function StatusCard({ label, value, iconName, iconColor = '#325F3F', index = 0 }: StatusCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const delay = index * 80;
    opacity.value = withDelay(delay, withTiming(1, { duration: 260 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 280 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animStyle]}>
      <View className="bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-raices-primary/10 items-center justify-center">
          <IconSymbol name={iconName} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="font-label text-xs text-raices-text-muted uppercase tracking-wide" numberOfLines={1}>
            {label}
          </Text>
          <Text className="font-headline font-bold text-raices-text text-base capitalize mt-0.5" numberOfLines={1}>
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function deriveMedicina(status: DashboardDailyScore['overall_status']): string {
  if (status === 'green') return 'Al día';
  if (status === 'yellow') return 'Pendiente';
  return 'Atrasada';
}

/**
 * Displays a 2+2 grid of compact health status cards:
 * Row 1 (2 cols): Actividad | Salud
 * Row 2 (full):   Estado
 * Row 3 (full):   Medicina
 *
 * Data comes from the dashboard DailyScore for the selected older adult.
 */
export function HomeHealthSummaryGrid({ 
  dailyScore, 
  loading,
  isMoodShared = true,
  isActivityShared = true,
  isHealthShared = true
}: HomeHealthSummaryGridProps) {
  // Derive card values — show "—" when no data, regardless of loading state
  const actividadValue = !dailyScore || !isActivityShared
    ? '—'
    : dailyScore.activity.length > 0
    ? 'Activo'
    : 'Inactivo';

  const saludValue = !isHealthShared ? '—' : (dailyScore?.health ?? '—');
  const estadoValue = !isMoodShared ? '—' : (dailyScore?.mood ?? '—');
  const medicinaValue = !isHealthShared ? '—' : (dailyScore ? deriveMedicina(dailyScore.overall_status) : '—');

  // Today's date label
  const today = new Date();
  const dateLabel = today.toLocaleDateString('es-ES', {
    weekday: undefined,
    day: 'numeric',
    month: 'long',
  });

  if (loading) {
    return (
      <View className="px-5 mb-6">
        <SkeletonBox height={28} width="55%" borderRadius={8} style={{ marginBottom: 6 }} />
        <SkeletonBox height={16} width="40%" borderRadius={6} style={{ marginBottom: 16 }} />
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3">
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <View className="gap-2 flex-1">
              <SkeletonBox height={10} width="50%" borderRadius={5} />
              <SkeletonBox height={14} width="70%" borderRadius={5} />
            </View>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3">
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <View className="gap-2 flex-1">
              <SkeletonBox height={10} width="50%" borderRadius={5} />
              <SkeletonBox height={14} width="70%" borderRadius={5} />
            </View>
          </View>
        </View>
        <View className="bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3 mb-3">
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View className="gap-2 flex-1">
            <SkeletonBox height={10} width="30%" borderRadius={5} />
            <SkeletonBox height={14} width="50%" borderRadius={5} />
          </View>
        </View>
        <View className="bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3">
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View className="gap-2 flex-1">
            <SkeletonBox height={10} width="35%" borderRadius={5} />
            <SkeletonBox height={14} width="45%" borderRadius={5} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="px-5 mb-6">
      {/* Section header */}
      <Text className="font-headline font-bold text-2xl text-raices-text mb-0.5">
        Resumen del Día
      </Text>
      <Text className="font-body text-sm text-raices-text-muted mb-4">
        Hoy, {dateLabel}
      </Text>

      {/* Row 1: Actividad | Salud (2 cols) */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1">
          <StatusCard
            label="Actividad"
            value={actividadValue}
            iconName="sun.max.fill"
            iconColor="#325F3F"
            index={0}
          />
        </View>
        <View className="flex-1">
          <StatusCard
            label="Salud"
            value={saludValue}
            iconName="heart.fill"
            iconColor="#325F3F"
            index={1}
          />
        </View>
      </View>

      {/* Row 2: Estado (full width) */}
      <View className="mb-3">
        <StatusCard
          label="Estado"
          value={estadoValue}
          iconName="face.smiling.inverse"
          iconColor="#325F3F"
          index={2}
        />
      </View>

      {/* Row 3: Medicina (full width) */}
      <View>
        <StatusCard
          label="Medicina"
          value={medicinaValue}
          iconName="pills.fill"
          iconColor="#325F3F"
          index={3}
        />
      </View>
    </View>
  );
}
