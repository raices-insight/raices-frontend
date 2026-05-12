import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { IconSymbol } from '@/core/ui/icon-symbol';

type MemberListItemProps = {
  member: FamilyMember;
  currentUserId: string | null;
  currentUserName: string | null;
  isAdmin: boolean;
  onShowActions: (member: FamilyMember) => void;
};

export function MemberListItem({
  member,
  currentUserId,
  currentUserName,
  isAdmin,
  onShowActions,
}: MemberListItemProps) {
  const roleText: Record<FamilyMember['role'], string> = {
    ADMINISTRATOR: 'Administrador',
    MEMBER: 'Familiar',
    CAREGIVER: 'Cuidador',
  };

  const displayName =
    member.name

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.role}>{roleText[member.role]}</Text>
      </View>

      {isAdmin && (
        <Pressable onPress={() => onShowActions(member)}>
          <IconSymbol name="ellipsis" size={24} color="#474747" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBE1D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#1F1B15',
  },
  memberInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#1F1B15',
  },
  role: {
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 14,
    color: '#586330',
    textTransform: 'uppercase',
  },
});
