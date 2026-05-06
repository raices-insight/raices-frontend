import { Modal, View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '@/core/ui/button';

interface QrCodeModalProps {
  visible: boolean;
  onClose: () => void;
  invitationCode: string | undefined;
}

export function QrCodeModal({
  visible,
  onClose,
  invitationCode,
}: QrCodeModalProps) {
  const ROUTE_JOIN_FAMILY = '/family/join';
  const joinRouteUrl = `${ROUTE_JOIN_FAMILY}?code=${invitationCode}`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Código QR de Invitación</Text>
          <Text style={styles.subtitle}>
            Escanea este código para unirte a la familia.
          </Text>

          {invitationCode ? (
            <View style={styles.qrContainer}>
              <QRCode
                value={joinRouteUrl}
                size={200}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>
          ) : null}

          <Button
            label="Cerrar"
            onPress={onClose}
            fullWidth
            style={{ marginTop: 24 }}
          />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    marginBottom: 24,
  },
});
