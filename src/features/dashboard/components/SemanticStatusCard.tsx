import React from 'react';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol, type IconSymbolName } from '@/core/ui/icon-symbol';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';
import { ActivityPills } from './ActivityPills';

interface SemanticStatusCardProps {
  dailyScore: DashboardDailyScore | null;
}

export function SemanticStatusCard({ dailyScore }: SemanticStatusCardProps) {
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
  let bgColorClass   = 'bg-raices-surface';
  let textColorClass = 'text-raices-text';
  let iconName: IconSymbolName = 'checkmark.circle.fill';
  let iconColor      = '#53815F';
  let statusText     = 'Estado Óptimo';

  if (dailyScore.overall_status === 'green') {
    bgColorClass   = 'bg-raices-status-green';
    textColorClass = 'text-[#1F3A2E]'; // Oscuro contrastante
    iconName       = 'checkmark.seal.fill';
    iconColor      = '#1F3A2E';
    statusText     = 'Salud Estable';
  } else if (dailyScore.overall_status === 'yellow') {
    bgColorClass   = 'bg-raices-status-yellow';
    textColorClass = 'text-[#78350F]'; // Ambar oscuro
    iconName       = 'exclamationmark.triangle.fill';
    iconColor      = '#78350F';
    statusText     = 'Atención Preventiva';
  } else if (dailyScore.overall_status === 'red') {
    bgColorClass   = 'bg-raices-status-red';
    textColorClass = 'text-[#7C2D1C]'; // Rojo oscuro
    iconName       = 'exclamationmark.octagon.fill';
    iconColor      = '#7C2D1C';
    statusText     = 'Atención Médica Requerida';
  }

  return (
    <View className={`w-full p-6 rounded-3xl shadow-sm ${bgColorClass}`} style={{ gap: 16 }}>
      
      {/* ── Header: Icon + Title ── */}
      <View className="flex-row items-center gap-3">
        <IconSymbol name={iconName} size={28} color={iconColor} />
        <Text className={`font-headline font-bold text-xl ${textColorClass}`}>
          {statusText}
        </Text>
      </View>

      {/* ── AI Description ── */}
      <Text className={`font-body text-base opacity-90 ${textColorClass} leading-relaxed`}>
        {dailyScore.description}
      </Text>

      {/* ── Progress Bar (Bradburn Affect Score) ── */}
      <View className="w-full mt-2" style={{ gap: 8 }}>
        <View className="flex-row justify-between items-center">
          <Text className={`font-headline font-semibold text-xs uppercase tracking-widest ${textColorClass}`}>
            Índice de Bienestar (Afecto)
          </Text>
          <Text className={`font-headline font-bold text-sm ${textColorClass}`}>
            {dailyScore.score}/100
          </Text>
        </View>
        <View className="w-full h-3 rounded-full bg-black/5 overflow-hidden border border-black/5">
          <View 
            className="h-full bg-black/30 rounded-full" 
            style={{ width: `${dailyScore.score}%` }} 
          />
        </View>
      </View>

      {/* ── Sub-metrics (Health, Mood, Interactions) ── */}
      <View className="flex-row justify-between mt-2 pt-4 border-t border-black/10">
        <View className="flex-1">
          <Text className={`font-headline text-[10px] opacity-70 uppercase tracking-wider ${textColorClass}`}>Salud</Text>
          <Text className={`font-body font-semibold capitalize text-sm mt-1 ${textColorClass}`}>
            {dailyScore.health.replace('_', ' ')}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className={`font-headline text-[10px] opacity-70 uppercase tracking-wider ${textColorClass}`}>Ánimo</Text>
          <Text className={`font-body font-semibold capitalize text-sm mt-1 ${textColorClass}`}>
            {dailyScore.mood.replace('_', ' ')}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className={`font-headline text-[10px] opacity-70 uppercase tracking-wider ${textColorClass}`}>Eventos</Text>
          <Text className={`font-body font-semibold text-sm mt-1 ${textColorClass}`}>
            {dailyScore.interaction_count} hoy
          </Text>
        </View>
      </View>

      {/* ── Activity Pills ── */}
      {dailyScore.activity.length > 0 && (
        <View className="mt-2">
          <Text className={`font-headline text-[10px] opacity-70 uppercase tracking-wider mb-2 ${textColorClass}`}>
            Actividades Detectadas
          </Text>
          <ActivityPills activities={dailyScore.activity} />
        </View>
      )}

    </View>
  );
}
