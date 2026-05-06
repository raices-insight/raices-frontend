import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useRouter } from 'expo-router';
import {useNavigation } from '@react-navigation/native';
export function CreateFamilyCard() {
	const navigate = useNavigation();
  return (
    <Pressable
      style={styles.card}
      onPress={() => navigate.navigate('family/create') }
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name="users.2" size={20} color="#9B4431" />
        </View>
        <View>
          <Text style={styles.title}>Crear mi propia familia</Text>
          <Text style={styles.subtitle}>Empieza un nuevo círculo familiar</Text>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={16} color="#1F1B15" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: 'rgba(155, 68, 49, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#1F1B15',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 12,
    color: '#474747',
  },
});
