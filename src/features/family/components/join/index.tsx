import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { QrScanner } from './QrScanner';
import { IconSymbol } from '@/core/ui/icon-symbol';

export default function JoinFamilyScreen() {
  const [isScanning, setIsScanning] = useState(false);

  if (isScanning) {
    return <QrScanner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Únete a una Familia
      </Text>
      <Text style={styles.headerSubtitle}>
        Escanea el código QR de un miembro de la familia para unirte y empezar a colaborar.
      </Text>
      
      <Pressable 
        onPress={() => setIsScanning(true)}
        style={styles.qrButton}
      >
        <IconSymbol name="qrcode.viewfinder" size={40} color="white" />
      </Pressable>
      
      <Text style={styles.qrButtonText}>Toca el ícono para escanear</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F5EC',
        padding: 24,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1F1B15',
        textAlign: 'center',
        marginBottom: 12,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#474747',
        textAlign: 'center',
        marginBottom: 32,
    },
    qrButton: {
        backgroundColor: '#2E6346',
        padding: 20,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        elevation: 8,

    },
    qrButtonText: {
        color: '#474747',
        marginTop: 16
    }
})
