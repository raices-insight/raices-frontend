import { View, StyleSheet, FlatList } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { MemberListItem } from './MemberListItem';
import { SkeletonBox } from '@/core/ui/SkeletonBox';

type MemberListProps = {
  members: FamilyMember[];
  currentUserId: string | null;
  currentUserName: string | null;
  isAdmin: boolean;
  loading?: boolean;
  onShowActions: (member: FamilyMember) => void;
};

function MemberSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <SkeletonBox width={48} height={48} borderRadius={24} />
      <View style={skeletonStyles.info}>
        <SkeletonBox height={14} width="55%" borderRadius={6} style={{ marginBottom: 6 }} />
        <SkeletonBox height={11} width="35%" borderRadius={5} />
      </View>
    </View>
  );
}

export function MemberList({
  members,
  currentUserId,
  currentUserName,
  isAdmin,
  loading = false,
  onShowActions,
}: MemberListProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.listContent}>
          {[0, 1, 2].map((i) => <MemberSkeleton key={i} />)}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={({ item, index }) => (
          <MemberListItem
            member={item}
            index={index}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            isAdmin={isAdmin}
            onShowActions={onShowActions}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  listContent: {
    gap: 12,
  },
});

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  info: {
    flex: 1,
  },
});
