import React, { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useDerivedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { View, Text } from '@/core/ui/tw';
import { Ionicons } from '@expo/vector-icons';
import { DashboardDailyScore } from '../api/schemas';
import { ActivityPills } from './ActivityPills';

interface HistoryAccordionCardProps {
  data: DashboardDailyScore | null;
  isMoodShared?: boolean;
  isActivityShared?: boolean;
  isHealthShared?: boolean;
}

export function HistoryAccordionCard({ 
  data,
  isMoodShared = true,
  isActivityShared = true,
  isHealthShared = true
}: HistoryAccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Animación de rotación del chevron
  const rotation = useDerivedValue(() => {
    return withTiming(isOpen ? 180 : 0, { duration: 300 });
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Usamos un enfoque de altura máxima para evitar el problema de 'auto' en Reanimated
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
      maxHeight: withTiming(isOpen ? 500 : 0, { duration: 300 }),
      marginTop: withTiming(isOpen ? 16 : 0, { duration: 300 }),
    };
  });

  // --- EARLY RETURN MOVED AFTER HOOKS ---
  if (!data) return null;

  // Mapeo de colores según el estado (referenciando global.css)
  const statusStyles = {
    green: {
      bg: 'bg-white',
      border: 'border-black/5',
      text: 'text-raices-status-green-text',
      accent: 'bg-raices-status-green-accent',
      iconBg: 'bg-raices-status-green-accent/10',
      iconColor: '#53815F'
    },
    yellow: {
      bg: 'bg-white',
      border: 'border-black/5',
      text: 'text-raices-status-yellow-text',
      accent: 'bg-raices-status-yellow-accent',
      iconBg: 'bg-raices-status-yellow-accent/10',
      iconColor: '#D69E2E'
    },
    red: {
      bg: 'bg-white',
      border: 'border-black/5',
      text: 'text-raices-status-red-text',
      accent: 'bg-raices-status-red-accent',
      iconBg: 'bg-raices-status-red-accent/10',
      iconColor: '#E53E3E'
    },
    private: {
      bg: 'bg-white',
      border: 'border-black/5',
      text: 'text-raices-text-muted',
      accent: 'bg-black/10',
      iconBg: 'bg-black/5',
      iconColor: '#9CA3AF'
    }
  };

  const allShared = isMoodShared && isActivityShared && isHealthShared;
  // Every privacy option off → the score/colour are health-derived, so neutralise
  // them instead of showing a number that implies data that isn't being shared.
  const allPrivate = !isMoodShared && !isActivityShared && !isHealthShared;

  const style = allPrivate
    ? statusStyles.private
    : (statusStyles[data.overall_status as keyof typeof statusStyles] || statusStyles.green);

  return (
    <View className={`${style.bg} border ${style.border} rounded-3xl mb-4 overflow-hidden shadow-md flex-row`}>
      {/* Indicador Lateral de Estado - Más grueso y sólido */}
      <View 
        className="w-2.5" 
        style={{ backgroundColor: style.iconColor }} 
      />

      <View className="flex-1 p-4">
        <Pressable 
          onPress={() => setIsOpen(!isOpen)}
          style={{ width: '100%' }}
        >
          <View className="flex-row items-center justify-between w-full">
            {/* Lado Izquierdo: Icono + Texto */}
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-2xl ${style.iconBg} items-center justify-center`}>
                <Ionicons name="calendar-outline" size={20} color={style.iconColor} />
              </View>
              <View>
                <Text className="font-headline text-sm font-bold text-black/80">Día Anterior</Text>
                <Text className="font-body text-xs text-raices-text-muted">{data.date}</Text>
              </View>
            </View>

            {/* Lado Derecho: Puntaje + Chevron */}
            <View className="flex-row items-center gap-3">
              <View className="items-end">
                <Text className={`font-headline text-sm font-bold ${style.text}`}>{allPrivate ? '—' : data.score.toFixed(0)}</Text>
                <Text className="font-body text-[10px] text-raices-text-muted">Puntaje</Text>
              </View>
              <Animated.View style={animatedChevronStyle}>
                <Ionicons name="chevron-down" size={18} color="#00000040" />
              </Animated.View>
            </View>
          </View>
        </Pressable>

        <Animated.View style={[contentStyle, { overflow: 'hidden' }]}>
          <View className="h-[1px] bg-black/5 mb-4" />
          
          <Text className="font-body text-sm text-black/70 mb-4 leading-5">
            {allShared ? data.description : "La descripción no está disponible por privacidad."}
          </Text>

          {/* Métricas Ultra-Compactas */}
          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-headline text-[10px] text-raices-text-muted uppercase tracking-wider">Salud:</Text>
              <Text className="font-body font-bold text-xs text-black/70 capitalize">{!isHealthShared ? '—' : data.health}</Text>
            </View>
            <Text className="text-black/10 text-xs">•</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-headline text-[10px] text-raices-text-muted uppercase tracking-wider">Ánimo:</Text>
              <Text className="font-body font-bold text-xs text-black/70 capitalize">{!isMoodShared ? '—' : data.mood}</Text>
            </View>
          </View>

          {isActivityShared && (
            <View>
              <Text className="font-headline text-[10px] font-bold text-raices-text-muted uppercase mb-2 tracking-wider">
                Actividades detectadas
              </Text>
              <ActivityPills activities={data.activity} />
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
