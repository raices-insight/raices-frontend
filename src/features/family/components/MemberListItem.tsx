import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, withSpring } from 'react-native-reanimated';
import type { FamilyMember } from '../api/schemas';
import { IconSymbol } from '@/core/ui/icon-symbol';

type MemberListItemProps = {
  member: FamilyMember;
  index?: number;
  currentUserId: string | null;
  currentUserName: string | null;
  isAdmin: boolean;
  onShowActions: (member: FamilyMember) => void;
};

const ROLE_LABEL: Record<FamilyMember['role'], string> = {
  ADMINISTRATOR: 'ADMINISTRADOR',
  MEMBER: 'Familiar',
  CAREGIVER: 'Cuidador',
};

// Subtle deterministic background color for the initials avatar
const AVATAR_BG_PALETTE = ['#F4DDD0', '#E8D7C2', '#D9E2C7', '#E2D6E8', '#D6E2E8'];

function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_BG_PALETTE[Math.abs(hash) % AVATAR_BG_PALETTE.length];
}

export function MemberListItem({
  member,
  index = 0,
  currentUserId,
  isAdmin,
  onShowActions,
}: MemberListItemProps) {
  const displayName = member.name;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);
  useEffect(() => {
    const delay = index * 60;
    opacity.value = withDelay(delay, withTiming(1, { duration: 260 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 260 }));
  }, []);
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isAdminRole = member.role === 'ADMINISTRATOR';
  const avatarBg = pickColor(member.id);

  return (
    <Animated.View style={animStyle}>
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
        <Text style={[styles.role, isAdminRole ? styles.roleAdmin : styles.roleMember]}>
          {ROLE_LABEL[member.role]}
        </Text>
      </View>

      {isAdmin && member.profileId !== currentUserId && (
        <Pressable
          onPress={() => onShowActions(member)}
          hitSlop={8}
          style={styles.actionsButton}
        >
          <IconSymbol name="ellipsis" size={20} color="#474747" />
        </Pressable>
      )}
    </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: 'rgba(28, 28, 23, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
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
    fontSize: 13,
    marginTop: 2,
  },
  roleAdmin: {
    fontFamily: 'BeVietnamPro-SemiBold',
    color: '#586330',
    letterSpacing: 0.5,
  },
  roleMember: {
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6B6B6B',
  },
  actionsButton: {
    padding: 4,
  },
});
