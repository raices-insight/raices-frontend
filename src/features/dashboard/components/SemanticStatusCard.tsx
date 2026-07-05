import React, { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol, type IconSymbolName } from '@/core/ui/icon-symbol';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';
import { ActivityPills } from './ActivityPills';

interface SemanticStatusCardProps {
  dailyScore: DashboardDailyScore | null;
  isMoodShared?: boolean;
  isActivityShared?: boolean;
  isHealthShared?: boolean;
}

export function SemanticStatusCard({ 
  dailyScore,
  isMoodShared = true,
  isActivityShared = true,
  isHealthShared = true
}: SemanticStatusCardProps) {
  const progressWidth = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({ width: `${progressWidth.value}%` as any }));

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!dailyScore) return;
    progressWidth.value = withDelay(200, withSpring(dailyScore.score, { damping: 18, stiffness: 60 }));

    const target = Math.round(dailyScore.score);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 28));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, [dailyScore?.score]);

  // Empty State
  if (!dailyScore) {
    return (
      <View className="w-full bg-raices-surface p-6 rounded-3xl shadow-sm justify-center items-center min-h-[160px]">
        <IconSymbol name="waveform.path.ecg" size={40} color="#53815F" />
        <Text className="font-headline font-semibold text-raices-text-muted mt-4">
          Esperando datos en tiempo real...
        </Text>
      </View>
    );
  }

  // Configuración reactiva según el color semántico (Green, Yellow, Red)
  const statusStyles = {
    green: {
      accent: 'bg-raices-status-green-accent',
      bar: 'bg-raices-status-green-accent',
      text: 'text-raices-status-green-text',
      iconName: 'checkmark.seal.fill' as IconSymbolName,
      iconColor: '#53815F',
      statusText: 'Salud Estable'
    },
    yellow: {
      accent: 'bg-raices-status-yellow-accent',
      bar: 'bg-raices-status-yellow-accent',
      text: 'text-raices-status-yellow-text',
      iconName: 'exclamationmark.triangle.fill' as IconSymbolName,
      iconColor: '#D69E2E',
      statusText: 'Atención Preventiva'
    },
    red: {
      accent: 'bg-raices-status-red-accent',
      bar: 'bg-raices-status-red-accent',
      text: 'text-raices-status-red-text',
      iconName: 'exclamationmark.octagon.fill' as IconSymbolName,
      iconColor: '#E53E3E',
      statusText: 'Atención Médica'
    }
  };

  const style = statusStyles[dailyScore.overall_status as keyof typeof statusStyles] || statusStyles.green;

  return (
    <View className="w-full bg-white border border-black/5 rounded-3xl shadow-md overflow-hidden flex-row">
      {/* Indicador Lateral de Estado */}
      <View 
        className={`w-2.5 ${style.accent}`} 
      />

      <View className="flex-1 p-6" style={{ gap: 16 }}>
        
        {/* ── Header: Icon + Title ── */}
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-2xl bg-black/5 items-center justify-center">
            <IconSymbol name={style.iconName} size={32} color={style.iconColor} />
          </View>
          <View>
            <Text className="font-headline text-xs font-bold text-raices-text-muted uppercase tracking-wider mb-0.5">
              Estado de Hoy • {dailyScore.date}
            </Text>
            <Text className={`font-headline font-bold text-xl text-black/80`}>
              {style.statusText}
            </Text>
          </View>
        </View>

        {/* ── Progress Bar (Bradburn Affect Score) ── */}
        <View className="w-full mt-2" style={{ gap: 8 }}>
          <View className="flex-row justify-between items-center">
            <Text className={`font-headline font-semibold text-xs uppercase tracking-widest text-raices-text-muted`}>
              Índice de Bienestar
            </Text>
            <Text className={`font-headline font-bold text-sm ${style.text}`}>
              {displayScore}/100
            </Text>
          </View>
          <View className="w-full h-3 rounded-full bg-black/5 overflow-hidden border border-black/5">
            <Animated.View
              className={`h-full rounded-full ${style.bar}`}
              style={barStyle}
            />
          </View>
        </View>

        {/* ── Sub-metrics (Health, Mood, Interactions) ── */}
        <View className="flex-row gap-4 mt-2 pt-4 border-t border-black/5">
          <View className="flex-1 pl-3" style={{ borderLeftWidth: 2, borderLeftColor: style.iconColor }}>
            <Text className={`font-headline text-[10px] text-raices-text-muted uppercase tracking-wider`}>Salud</Text>
            <Text className={`font-body font-semibold capitalize text-sm mt-1 text-black/80`}>
              {!isHealthShared ? '—' : dailyScore.health}
            </Text>
          </View>
          <View className="flex-1 pl-3" style={{ borderLeftWidth: 2, borderLeftColor: style.iconColor }}>
            <Text className={`font-headline text-[10px] text-raices-text-muted uppercase tracking-wider`}>Ánimo</Text>
            <Text className={`font-body font-semibold capitalize text-sm mt-1 text-black/80`}>
              {!isMoodShared ? '—' : dailyScore.mood}
            </Text>
          </View>
          <View className="flex-1 pl-3" style={{ borderLeftWidth: 2, borderLeftColor: style.iconColor }}>
            <Text className={`font-headline text-[10px] text-raices-text-muted uppercase tracking-wider`}>Eventos</Text>
            <Text className={`font-body font-semibold text-sm mt-1 text-black/80`}>
              {dailyScore.interaction_count} hoy
            </Text>
          </View>
        </View>

        {/* ── Activity Pills ── */}
        {(dailyScore.activity.length > 0 && isActivityShared) && (
          <View className="mt-2">
            <Text className={`font-headline text-[10px] text-raices-text-muted uppercase tracking-wider mb-2`}>
              Actividades Detectadas
            </Text>
            <ActivityPills activities={dailyScore.activity} />
          </View>
        )}
      </View>
    </View>
  );
}
