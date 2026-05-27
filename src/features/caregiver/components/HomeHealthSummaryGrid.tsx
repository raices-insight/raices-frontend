import React from 'react';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol, type IconSymbolName } from '@/core/ui/icon-symbol';
import type { DashboardDailyScore } from '@/features/dashboard/api/schemas';

interface HomeHealthSummaryGridProps {
  dailyScore: DashboardDailyScore | null;
  loading: boolean;
}

interface StatusCardProps {
  label: string;
  value: string;
  iconName: IconSymbolName;
  iconColor?: string;
}

function StatusCard({ label, value, iconName, iconColor = '#325F3F' }: StatusCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-black/5 flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-full bg-raices-primary/10 items-center justify-center">
        <IconSymbol name={iconName} size={20} color={iconColor} />
      </View>
      <View>
        <Text className="font-label text-xs text-raices-text-muted uppercase tracking-wide">
          {label}
        </Text>
        <Text className="font-headline font-bold text-raices-text text-base capitalize mt-0.5">
          {value}
        </Text>
      </View>
    </View>
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
export function HomeHealthSummaryGrid({ dailyScore, loading }: HomeHealthSummaryGridProps) {
  // Derive card values — show "—" when no data, regardless of loading state
  const actividadValue = !dailyScore
    ? '—'
    : dailyScore.activity.length > 0
    ? 'Activo'
    : 'Inactivo';

  const saludValue = dailyScore?.health ?? '—';
  const estadoValue = dailyScore?.mood ?? '—';
  const medicinaValue = dailyScore ? deriveMedicina(dailyScore.overall_status) : '—';

  // Today's date label
  const today = new Date();
  const dateLabel = today.toLocaleDateString('es-ES', {
    weekday: undefined,
    day: 'numeric',
    month: 'short',
  });

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
          />
        </View>
        <View className="flex-1">
          <StatusCard
            label="Salud"
            value={saludValue}
            iconName="heart.fill"
            iconColor="#325F3F"
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
        />
      </View>

      {/* Row 3: Medicina (full width) */}
      <View>
        <StatusCard
          label="Medicina"
          value={medicinaValue}
          iconName="pills.fill"
          iconColor="#325F3F"
        />
      </View>
    </View>
  );
}
