import { View, ScrollView } from '@/core/ui/tw';
import { CaregiverHeader } from './CaregiverHeader';
import { EmptyFamilyState } from './EmptyFamilyState';

export function CaregiverHomeScreen() {
  return (
    <View className="flex-1 bg-raices-bg">
      <CaregiverHeader />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <EmptyFamilyState />
      </ScrollView>
    </View>
  );
}
