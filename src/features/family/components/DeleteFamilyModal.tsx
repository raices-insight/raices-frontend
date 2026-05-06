import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button } from '@/core/ui/button';

interface DeleteFamilyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteFamilyModal({
  visible,
  onClose,
  onConfirm,
  loading,
}: DeleteFamilyModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>¿Eliminar Familia?</Text>
          <Text style={styles.subtitle}>
            Esta acción es irreversible. Todos los miembros serán desvinculados y se perderá el acceso a la información compartida.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              label="Cancelar"
              onPress={onClose}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              label="Eliminar"
              onPress={onConfirm}
              variant="danger"
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    textAlign: 'center',
    marginBottom: 24,
    color: '#474747',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
