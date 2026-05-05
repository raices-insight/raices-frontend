import { useState } from 'react';
import JoinFamilyScreen from '@/features/family/components/join';
import FamilyScreen from '@/features/family/components/created/FamilyScreen';

export default function FamilyTabScreen() {
  const [familyExists, setFamilyExists] = useState(false);

  // This is a placeholder for logic that checks if a family exists.
  // In a real app, this would come from an API call or global state.

  return familyExists ? <FamilyScreen /> : <JoinFamilyScreen />;
}
