import { View, ScrollView } from '@/core/ui/tw';
import { CaregiverHeader } from './CaregiverHeader';
import { EmptyFamilyState } from './EmptyFamilyState';
import { useAuth } from '@/features/auth/context/auth-context';

export function CaregiverHomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-raices-bg">
      <CaregiverHeader user={user} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <EmptyFamilyState />
      </ScrollView>
    </View>
  );
}
