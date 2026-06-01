import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useNavigation } from '@react-navigation/native';

export function CreateFamilyCard() {
  const navigate = useNavigation();
  return (
    <Pressable
      style={styles.card}
      onPress={() => navigate.navigate('family/create')}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name="house.badge.plus" size={22} color="#C97B5F" />
        </View>
        <View style={styles.textContainer}>
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
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: 'rgba(28, 28, 23, 0.04)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: 'rgba(201, 123, 95, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
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
    marginTop: 2,
  },
});
