import type { FamilyMember } from '../../api/schemas';

export type { FamilyMember };

export const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    profileId: 'profile-1',
    role: 'ADMINISTRATOR',
  },
  {
    id: '2',
    profileId: 'profile-2',
    role: 'MEMBER',
  },
  {
    id: '3',
    profileId: 'profile-3',
    role: 'MEMBER',
  },
  {
    id: '4',
    profileId: 'profile-4',
    role: 'CAREGIVER',
  },
];
