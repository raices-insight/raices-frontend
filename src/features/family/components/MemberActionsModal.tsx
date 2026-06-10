import { Modal, View, Text, StyleSheet } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { Button } from '@/core/ui/button';

type MemberActionsModalProps = {
  member: FamilyMember | null;
  visible: boolean;
  onClose: () => void;
  onRemove: () => void;
  loading?: boolean;
};

export function MemberActionsModal({
  member,
  visible,
  onClose,
  onRemove,
  loading,
}: MemberActionsModalProps) {
  if (!member) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Button label="Expulsar Miembro" onPress={onRemove} variant="danger" loading={loading} />
          <Button label="Cancelar" onPress={onClose} variant="ghost" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  memberName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
});
