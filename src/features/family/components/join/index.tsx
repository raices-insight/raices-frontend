import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { QrScanner } from './QrScanner';
import { ManualInputCard } from './ManualInputCard';
import { CreateFamilyCard } from './CreateFamilyCard';
import { QrScannerCard } from './QrScannerCard';

export default function JoinFamilyScreen() {
  const [isScanning, setIsScanning] = useState(false);

  if (isScanning) {
    return <QrScanner onBack={() => setIsScanning(false)} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Unirse a Familia</Text>
        <Text style={styles.headerSubtitle}>
          Conéctate con tus seres queridos escaneando su código o ingresándolo
          manualmente.
        </Text>
      </View>
      <View style={styles.grid}>
        <QrScannerCard onScanPress={() => setIsScanning(true)} />
        <ManualInputCard />
        <CreateFamilyCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDF6', // A slightly off-white like in the design
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F1B15',
    textAlign: 'center',
    fontFamily: 'BeVietnamPro-ExtraBold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#474747',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  grid: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 36,
  },
});

