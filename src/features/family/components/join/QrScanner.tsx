import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, Linking, Alert } from 'react-native';

export function QrScanner() {
  const [facing, setFacing] = useState('back');
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
      <CameraView
        className="flex-1 w-full h-full"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        facing={facing}
      >
        <View className="flex-1 justify-center items-center">
            <View className="w-64 h-64 border-4 border-white rounded-lg" />
        </View>
      </CameraView>
    </View>
  );
}
