import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useJoinFamily } from '../hooks/use-join-family';

type QrScannerProps = {
  onBack: () => void;
};

export function QrScanner({ onBack }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const { joinFamily, loading } = useJoinFamily();

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#325F3F" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Raíces necesita acceso a la cámara para escanear códigos QR de invitación.
        </Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
        <Button onPress={onBack} title="Volver" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const url = new URL(data, 'http://dummybase');
      const path = url.pathname;
      const code = url.searchParams.get('code');

      if (path === '/family/join' && code) {
        await joinFamily({ code });
        onBack();
      } else {
        throw new Error('Código QR no válido para unirse a una familia.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert(
        'Error al escanear',
        message,
        [{ text: 'OK', onPress: () => setScanned(false) }],
        { cancelable: false }
      );
    }
  };

  if (mountError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>{mountError}</Text>
        <Button onPress={onBack} title="Volver" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        facing="back"
        onMountError={(e) => setMountError(e.message ?? 'No se pudo iniciar la cámara.')}
        onCameraReady={() => setMountError(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      <Pressable onPress={onBack} style={styles.backButton}>
        <IconSymbol name="arrow.left" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 256,
    height: 256,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F5EC',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    textAlign: 'center',
    color: '#474747',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});
