import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { QrScanner } from '../components/QrScanner';
import { ManualInputCard } from '../components/ManualInputCard';
import { CreateFamilyCard } from '../components/CreateFamilyCard';
import { QrScannerCard } from '../components/QrScannerCard';
import { UserAvatar } from '@/core/ui/UserAvatar';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useAuth } from '@/features/auth/context/auth-context';

export default function JoinFamilyScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();

  if (isScanning) {
    return <QrScanner onBack={() => setIsScanning(false)} />;
  }

  const firstName = user?.name?.split(' ')[0] ?? 'Familia';

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.avatarWrapper}>
            <UserAvatar name={user?.name ?? null} photo={user?.photo ?? null} size={44} />
          </View>
          <Text style={styles.topBarTitle}>{firstName}</Text>
        </View>
        <Pressable style={styles.bellButton} hitSlop={8}>
          <IconSymbol name="bell.fill" size={24} color="#325F3F" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5EC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  topBarTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 22,
    fontWeight: '800',
    color: '#325F3F',
  },
  bellButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1B15',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#474747',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'BeVietnamPro-Regular',
    lineHeight: 22,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 16,
  },
});
