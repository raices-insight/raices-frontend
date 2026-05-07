import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from '@/core/ui/tw';
import { GlobalMockHeader } from '@/core/ui/GlobalMockHeader';
import { SemanticStatusCard } from './SemanticStatusCard';
import { HistoryAccordionCard } from './HistoryAccordionCard';
import { useDashboardSocket } from '../hooks/useDashboardSocket';
import { useAuth } from '@/features/auth/context/auth-context';

export function CaretakerDashboardScreen() {
  const { user } = useAuth();
  
  // Usamos el ID del usuario logueado para todo el flujo
  const profileId = user?.id || '';

  const { dailyScore, yesterdayScore, isConnected } = useDashboardSocket(profileId);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-raices-bg">
      <ScrollView 
        className="flex-1"
        // insets.top obtiene el tamaño del notch. Sumamos 16px para darle un margen bonito.
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 16, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Mock Header ── */}
      <GlobalMockHeader userName="Camila" subtitle="Resumen de Bienestar" />

      {/* ── Connection Status Indicator ── */}
      <View className="flex-row items-center justify-end mb-4 gap-2">
        <View 
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#53815F]' : 'bg-raices-error'}`} 
        />
        <Text className="font-body text-xs text-raices-text-muted">
          {isConnected ? 'Sincronizado' : 'Conectando WebSocket...'}
        </Text>
      </View>

      {/* ── Historial (Ayer) ── */}
      <HistoryAccordionCard data={yesterdayScore} />

      {/* ── Semantic Traffic Light Card (Hoy) ── */}
      <SemanticStatusCard dailyScore={dailyScore} />

      {/* ── Placeholder para el Futuro ── */}
      {/* Como pediste, este layout es extensible verticalmente para colocar
          más contenido abajo en los próximos sprints. */}
      <View className="mt-8 p-6 border-2 border-dashed border-raices-secondary/30 rounded-3xl items-center justify-center min-h-[150px]">
        <Text className="font-headline font-semibold text-raices-secondary/60 text-center">
          + Más elementos y reportes se añadirán aquí abajo.
        </Text>
      </View>

      </ScrollView>
    </View>
  );
}
