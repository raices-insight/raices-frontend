import { View, StyleSheet, FlatList } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { MemberListItem } from './MemberListItem';

type MemberListProps = {
  members: FamilyMember[];
  currentUserId: string | null;
  currentUserName: string | null;
  isAdmin: boolean;
  onShowActions: (member: FamilyMember) => void;
};

export function MemberList({
  members,
  currentUserId,
  currentUserName,
  isAdmin,
  onShowActions,
}: MemberListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberListItem
            member={item}
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
    paddingHorizontal: 24,
  },
  listContent: {
    gap: 16,
  },
});
