import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, Alert, Pressable } from 'react-native';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useJoinFamily } from '../hooks/use-join-family';

type QrScannerProps = {
  onBack: () => void;
};

export function QrScanner({ onBack }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { joinFamily, loading } = useJoinFamily();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-raices-bg">
        <Text className="text-center text-raices-dark-gray mb-4">
          Necesitamos tu permiso para mostrar la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
        <Button onPress={onBack} title="Volver" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const url = new URL(data, 'http://dummybase'); // Base dummy para parsear URLs relativas
      const path = url.pathname;
      const code = url.searchParams.get('code');

      if (path === '/family/join' && code) {
        await joinFamily({ code });
        // El hook ya muestra el toast. Si es exitoso, el estado global
        // cambiará y la pantalla de family-route mostrará la vista de gestión.
        // Solo necesitamos volver.
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

  return (
    <View style={StyleSheet.absoluteFillObject} className="flex-1 justify-center items-center bg-black">
      <Pressable onPress={onBack} style={styles.backButton}>
        <IconSymbol name="arrow.left" size={24} color="white" />
      </Pressable>
      <CameraView
        className="flex-1 w-full h-full"
        onBarcodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        facing="back"
      >
        <View className="flex-1 justify-center items-center">
          <View className="w-64 h-64 border-4 border-white rounded-lg" />
        </View>
      </CameraView>
    </View>
  );
}


const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  }
})