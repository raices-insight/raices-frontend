import { View, StyleSheet, FlatList } from 'react-native';
import { MOCK_MEMBERS, FamilyMember } from './managment/mock-data';
import { MemberListItem } from './MemberListItem';

type MemberListProps = {
  onShowActions: (member: FamilyMember) => void;
};

export function MemberList({ onShowActions }: MemberListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_MEMBERS}
        renderItem={({ item }) => (
          <MemberListItem member={item} onShowActions={onShowActions} />
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
