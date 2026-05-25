import { OlderAdultProfileScreen } from '@/features/older_adult/components/OlderAdultProfileScreen';
import { CaregiverProfileScreen } from '@/features/caregiver/components/CaregiverProfileScreen';
import { useAuth } from '@/features/auth/context/auth-context';

export default function SettingsScreen() {
  const { user } = useAuth();

  if (user?.role === 'older_adult') {
    return <OlderAdultProfileScreen />;
  }

  return <CaregiverProfileScreen />;
}
