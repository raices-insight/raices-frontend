import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useToast } from '@/core/toast/use-toast';

interface QrCodeModalProps {
  visible: boolean;
  onClose: () => void;
  invitationCode: string | undefined;
}

export function QrCodeModal({ visible, onClose, invitationCode }: QrCodeModalProps) {
  const toast = useToast();
  const [helpVisible, setHelpVisible] = useState(false);
  const joinRouteUrl = `/family/join?code=${invitationCode}`;

  const handleShare = async () => {
    if (!invitationCode) return;
    try {
      await Share.share({
        message: `Únete a mi familia en Raíces con el código:\n${invitationCode}`,
      });
    } catch {
      toast.error('No se pudo compartir el código');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.circleDecoration} />

          <View style={styles.header}>
            <Pressable
              style={styles.helpButton}
              onPress={() => setHelpVisible((v) => !v)}
              hitSlop={6}
            >
              <IconSymbol name="questionmark.circle.fill" size={16} color="#325F3F" />
              <Text style={styles.helpButtonText}>¿Cómo funciona?</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <IconSymbol name="xmark" size={15} color="#474747" />
            </Pressable>
          </View>

          {helpVisible && (
            <View style={styles.helpBanner}>
              <IconSymbol name="info.circle.fill" size={15} color="#325F3F" />
              <Text style={styles.helpText}>
                Muéstrale este QR a un familiar para que lo escanee con la cámara
                de su teléfono. También puede ingresar el código manualmente al
                unirse a la familia.
              </Text>
            </View>
          )}

          <Text style={styles.title}>Código QR de Invitación</Text>
          <Text style={styles.subtitle}>
            Muéstrale este código a quien quieras sumar a tu familia.
          </Text>

          {invitationCode ? (
            <>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={joinRouteUrl}
                  size={200}
                  backgroundColor="#FFFFFF"
                  color="#1F3A2E"
                />
              </View>

              <View style={styles.codePill}>
                <Text style={styles.codeText}>{invitationCode}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.actions}>
            <Button label="Compartir código" onPress={handleShare} fullWidth />
            <Pressable onPress={onClose} style={styles.closeLink} hitSlop={6}>
              <Text style={styles.closeLinkText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 40,
    alignItems: 'center',
    overflow: 'hidden',
    gap: 0,
  },
  circleDecoration: {
    position: 'absolute',
    top: -56,
    right: -56,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(123, 168, 125, 0.15)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0F5EC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  helpButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#325F3F',
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0F5EC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    width: '100%',
  },
  helpText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: '#1F3A2E',
    lineHeight: 19,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 22,
    color: '#1F3A2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#474747',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  qrWrapper: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(28, 28, 23, 0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },
  codePill: {
    borderWidth: 2,
    borderColor: '#C6C6C6',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 28,
  },
  codeText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: '#1F1B15',
    letterSpacing: 4,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 14,
    alignItems: 'center',
  },
  closeLink: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeLinkText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#474747',
  },
});
