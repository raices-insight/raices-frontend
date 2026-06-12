import { useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import type { FamilyMember } from '../api/schemas';
import { Button } from '@/core/ui/button';

type TransferAdminModalProps = {
  visible: boolean;
  members: FamilyMember[];
  currentUserId: string;
  onConfirm: (newAdminProfileId: string) => void;
  onClose: () => void;
  loading?: boolean;
};

export function TransferAdminModal({
  visible,
  members,
  currentUserId,
  onConfirm,
  onClose,
  loading,
}: TransferAdminModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const candidates = members.filter((m) => m.profileId !== currentUserId);

  const handleConfirm = () => {
    if (selectedId) onConfirm(selectedId);
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Transferir administrador</Text>
          <Text style={styles.subtitle}>
            Elige quién será el nuevo administrador de la familia antes de salir.
          </Text>

          <FlatList
            data={candidates}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => {
              const isSelected = selectedId === item.profileId;
              return (
                <Pressable
                  onPress={() => setSelectedId(item.profileId)}
                  style={[styles.memberRow, isSelected && styles.memberRowSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={item.name}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]} />
                  <Text style={styles.memberName}>{item.name}</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay otros miembros en la familia.</Text>
            }
          />

          <Button
            label="Confirmar y salir"
            onPress={handleConfirm}
            variant="danger"
            disabled={!selectedId}
            loading={loading}
          />
          <Button label="Cancelar" onPress={handleClose} variant="ghost" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
    maxHeight: '80%',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#1F1B15',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  list: {
    flexGrow: 0,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  memberRowSelected: {
    backgroundColor: '#F0F5EC',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B0B0B0',
  },
  radioSelected: {
    borderColor: '#586330',
    backgroundColor: '#586330',
  },
  memberName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#1F1B15',
  },
  empty: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
