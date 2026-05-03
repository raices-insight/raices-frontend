import React from 'react';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

interface GlobalMockHeaderProps {
  /** Nombre a mostrar en el saludo. Ej: "Camila" */
  userName?: string;
  /** Título secundario o fecha. Ej: "Octubre 24, 2024" */
  subtitle?: string;
}

/**
 * [MOCK] Componente temporal de Header para el Dashboard.
 * 
 * TODO: Reemplazar este componente por el layout global definitivo cuando se
 * implemente el sistema de sesión de usuarios y navegación principal.
 */
export function GlobalMockHeader({ 
  userName = 'Usuario', 
  subtitle = 'Octubre 24, 2024' 
}: GlobalMockHeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1">
        <Text className="font-headline font-bold text-2xl text-raices-text">
          Hola, {userName}
        </Text>
        <Text className="font-body text-sm text-raices-text-muted mt-1">
          {subtitle}
        </Text>
      </View>
      
      {/* Mock Avatar */}
      <View className="w-12 h-12 rounded-full bg-raices-secondary/20 items-center justify-center border-2 border-white shadow-sm">
        <IconSymbol name="person.fill" size={24} color="#53815F" />
      </View>
    </View>
  );
}
