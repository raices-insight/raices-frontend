import { ActivityIndicator, View } from 'react-native';
import JoinFamilyScreen from '@/features/family/screens/JoinFamilyScreen';
import { useFamily } from "@/features/family/hooks/use-family";
import FamilyManagementScreen from "@/features/family/screens/FamilyManagementScreen";

export default function FamilyRoute() {
  const { isFamily, loading } = useFamily();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F5EC' }}>
        <ActivityIndicator color="#325F3F" size="large" />
      </View>
    );
  }

  if (!isFamily) {
    return <JoinFamilyScreen />;
  }

  return <FamilyManagementScreen />;
}
