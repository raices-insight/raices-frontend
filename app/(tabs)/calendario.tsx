import { OlderAdultCalendarScreen } from '@/features/older_adult/components/OlderAdultCalendarScreen';
import { CaregiverCalendarScreen } from '@/features/caregiver/components/CaregiverCalendarScreen';
import { useAuth } from '@/features/auth/context/auth-context';

export default function CalendarioScreen() {
  const { user } = useAuth();

  if (user?.role === 'older_adult') {
    return <OlderAdultCalendarScreen />;
  }

  return <CaregiverCalendarScreen />;
}
