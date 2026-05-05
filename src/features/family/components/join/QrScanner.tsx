import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, Linking, Alert, Pressable } from 'react-native';
import { IconSymbol } from '@/core/ui/icon-symbol';

type QrScannerProps = {
    onBack: () => void;
};

export function QrScanner({ onBack }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'Código QR Escaneado',
      `El código QR contiene la siguiente información: ${data}. ¿Deseas abrir este enlace?`,
      [
        {
          text: 'Cancelar',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
        {
          text: 'Abrir',
          onPress: () => {
            Linking.openURL(data).catch(err => {
                Alert.alert('Error', 'No se pudo abrir el enlace.');
                console.error('Failed to open URL:', err)
            });
            setScanned(false);
          },
        },
      ]
    );
  };
  
  return (
    <View style={StyleSheet.absoluteFillObject} className="flex-1 justify-center items-center bg-black">
        <Pressable onPress={onBack} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={24} color="white" />
        </Pressable>
      <CameraView
        className="flex-1 w-full h-full"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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