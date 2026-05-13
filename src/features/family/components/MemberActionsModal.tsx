import { Modal, View, Text, StyleSheet } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { Button } from '@/core/ui/button';

type MemberActionsModalProps = {
  member: FamilyMember | null;
  visible: boolean;
  onClose: () => void;
  onSetRole: (role: FamilyMember['role']) => void;
  onRemove: () => void;
  loading?: boolean;
};

export function MemberActionsModal({
  member,
  visible,
  onClose,
  onSetRole,
  onRemove,
  loading,
}: MemberActionsModalProps) {
  if (!member) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.memberName}>{member.profileId}</Text>
          <View style={styles.roleButtons}>
            <Button
              label="Administrador"
              onPress={() => onSetRole('ADMINISTRATOR')}
              variant={member.role === 'ADMINISTRATOR' ? 'primary' : 'outline'}
            />
            <Button
              label="Miembro"
              onPress={() => onSetRole('MEMBER')}
              variant={member.role === 'MEMBER' ? 'primary' : 'outline'}
            />
            <Button
              label="Cuidador"
              onPress={() => onSetRole('CAREGIVER')}
              variant={member.role === 'CAREGIVER' ? 'primary' : 'outline'}
            />
          </View>
          <Button label="Eliminar Miembro" onPress={onRemove} variant="danger" loading={loading} />
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
  roleButtons: {
    gap: 8,
  },
});
