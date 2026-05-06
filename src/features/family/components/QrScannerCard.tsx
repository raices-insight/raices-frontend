import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button } from '@/core/ui/button';

type QrScannerCardProps = {
  onScanPress: () => void;
};

export function QrScannerCard({ onScanPress }: QrScannerCardProps) {
  return (
    <Pressable style={styles.card} onPress={onScanPress}>
      <View style={styles.qrCodeContainer}>
        {/* This is a placeholder for the QR code visual */}
        <View style={styles.qrCodePlaceholder} />
      </View>
      <Text style={styles.title}>Escanear código QR</Text>
      <Text style={styles.subtitle}>
        Apunta tu cámara al código mostrado en el dispositivo de tu familiar.
      </Text>
      <Button label="Abrir Cámara" onPress={onScanPress} icon="camera" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: 'rgba(28, 28, 23, 0.06)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    gap: 8,
  },
  qrCodeContainer: {
    width: 192,
    height: 192,
    padding: 16,
    backgroundColor: 'rgba(146, 76, 0, 0.2)', // Faded background
    borderRadius: 16, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCodePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6ECE2',
    // In a real scenario, you'd render an SVG or a library component here
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
    color: '#474747',
    textAlign: 'center',
    marginBottom: 16, // to create space before the button
  },
});
