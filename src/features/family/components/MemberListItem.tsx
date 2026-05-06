import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { FamilyMember } from './mock-data';
import { IconSymbol } from '@/core/ui/icon-symbol';

type MemberListItemProps = {
  member: FamilyMember;
  onShowActions: (member: FamilyMember) => void;
};

export function MemberListItem({ member, onShowActions }: MemberListItemProps) {
  const roleText = {
    ADMINISTRATOR: 'ADMINISTRADOR',
    MEMBER: 'Familiar',
    CAREGIVER: 'Cuidador',
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: member.avatarUrl }} style={styles.avatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.role}>{roleText[member.role]}</Text>
      </View>
      <Pressable onPress={() => onShowActions(member)}>
        <IconSymbol name="ellipsis" size={24} color="#474747" />
      </Pressable>
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
