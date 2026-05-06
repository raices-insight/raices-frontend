import JoinFamilyScreen from '@/features/family/screens/JoinFamilyScreen';

import {useFamily} from "@/features/family/hooks/use-family";
import FamilyManagementScreen from "@/features/family/screens/FamilyManagementScreen";

export default function FamilyRoute() {
	const {isFamily } = useFamily();

  if (!isFamily) {
    return <JoinFamilyScreen />;
  }

  return <FamilyManagementScreen />;
}
