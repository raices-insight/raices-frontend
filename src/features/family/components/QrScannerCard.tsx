import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';

type QrScannerCardProps = {
  onScanPress: () => void;
};

const BRACKET_SIZE = 28;
const BRACKET_THICKNESS = 4;
const BRACKET_COLOR = '#325F3F';

export function QrScannerCard({ onScanPress }: QrScannerCardProps) {
  return (
    <Pressable style={styles.card} onPress={onScanPress}>
      <View style={styles.qrFrame}>
        {/* Corner brackets */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Centered QR icon */}
        <IconSymbol name="qrcode.viewfinder" size={72} color="#325F3F" />
      </View>

      <Text style={styles.title}>Escanear código QR</Text>
      <Text style={styles.subtitle}>
        Apunta tu cámara al código mostrado en el dispositivo de tu familiar.
      </Text>

      <View style={styles.buttonWrapper}>
        <Button
          label="Abrir Cámara"
          onPress={onScanPress}
          icon="camera.fill"
          fullWidth
          pill={false}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(28, 28, 23, 0.06)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 2,
    gap: 8,
  },
  qrFrame: {
    width: 192,
    height: 192,
    backgroundColor: '#F4ECDF',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(50, 95, 63, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  // Corner brackets — two solid borders per corner make the L shape
  corner: {
    position: 'absolute',
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderColor: BRACKET_COLOR,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderBottomRightRadius: 16,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#1F1B15',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#474747',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonWrapper: {
    width: '100%',
  },
});
