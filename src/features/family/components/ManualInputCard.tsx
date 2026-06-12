import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Button } from '@/core/ui/button';
import { useJoinFamily } from '../hooks/use-join-family';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function ManualInputCard() {
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  const { joinFamily, loading, error } = useJoinFamily();

  const successScale = useSharedValue(0.85);
  const successOpacity = useSharedValue(0);
  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  const handleJoin = async () => {
    const result = await joinFamily({ code });
    if (result) {
      setSuccess(true);
      successScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      successOpacity.value = withTiming(1, { duration: 200 });
      setTimeout(() => {
        setSuccess(false);
        setCode('');
        successOpacity.value = withTiming(0, { duration: 150 });
      }, 2500);
    }
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
          placeholder="EJ: BRC-7086"
          placeholderTextColor="rgba(31, 27, 21, 0.5)"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          accessibilityLabel="Código de invitación"
        />
      </View>

      {success ? (
        <Animated.View style={[styles.successBanner, successStyle]}>
          <IconSymbol name="checkmark.circle.fill" size={22} color="#FFFFFF" />
          <Text style={styles.successText}>¡Te uniste a la familia!</Text>
        </Animated.View>
      ) : (
        <Button
          label="Validar Código"
          onPress={handleJoin}
          disabled={code.trim().length === 0}
          loading={loading}
          fullWidth
          pill={false}
        />
      )}

      {error && !success && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
  successBanner: {
    backgroundColor: '#53815F',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  successText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    color: '#C53030',
    textAlign: 'center',
    marginTop: -8,
  },
});
