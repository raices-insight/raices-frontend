import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import { Button } from '@/core/ui/button';
import { useJoinFamily } from '../hooks/use-join-family';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function ManualInputCard() {
  const [code, setCode] = useState('');
  const { joinFamily, loading } = useJoinFamily();

  const handleJoin = () => {
    joinFamily({ code });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconSymbol name="keyboard" color="#325F3F" size={22} />
        </View>
        <Text style={styles.title}>Código manual</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="INGRESA EL CÓDIGO DE 6 DÍGITOS"
          placeholderTextColor="rgba(31, 27, 21, 0.5)"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={6}
        />
      </View>

      <Button
        label="Validar Código"
        onPress={handleJoin}
        disabled={code.length < 6}
        loading={loading}
        fullWidth
        pill={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: 'rgba(28, 28, 23, 0.04)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 2,
    gap: 20,
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#1F1B15',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
  },
});
