import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from '@/core/ui/button';

export function ManualInputCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {/* Placeholder for icon */}
        </View>
        <Text style={styles.title}>Código manual</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="INGRESA EL CÓDIGO DE 6 DÍGITOS"
          placeholderTextColor="#6B7280"
          maxLength={6}
          keyboardType="number-pad"
        />
      </View>
      <Button label="Validar Código" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: 'rgba(28, 28, 23, 0.04)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#DBE9A9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#1F1B15',
  },
  inputContainer: {
    backgroundColor: '#E8FCE9',
    borderRadius: 12,
    paddingVertical: 23,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#1F1B15',
    letterSpacing: 2, // Approximate the tracking
    textAlign: 'center',
  },
});
