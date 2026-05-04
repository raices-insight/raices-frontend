import { View, Text } from '@/core/ui/tw';
import { FamilyHeader } from './FamilyHeader';

export function FamilyHomeScreen() {
  return (
    <View className="flex-1 bg-raices-bg">
      <FamilyHeader />
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-raices-primary">Pantalla de Familia</Text>
        <Text className="text-lg text-raices-dark-gray">Aquí se mostrará la información de la familia.</Text>
      </View>
    </View>
  );
}
