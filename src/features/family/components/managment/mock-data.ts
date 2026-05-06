export type FamilyMember = {
  id: string;
  name: string;
  role: 'ADMINISTRATOR' | 'MEMBER' | 'CAREGIVER';
  avatarUrl: string;
};

export const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Carlos G.',
    role: 'ADMINISTRATOR',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: '2',
    name: 'Elena R.',
    role: 'MEMBER',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  },
  {
    id: '3',
    name: 'Javier S.',
    role: 'MEMBER',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
  },
  {
    id: '4',
    name: 'Marta L.',
    role: 'CAREGIVER',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
  },
];
