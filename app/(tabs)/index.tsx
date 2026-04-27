import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGoogleAuth } from '@/hooks/use-google-auth';

export default function HomeScreen() {
  const { user, loading, error, signIn, signOut } = useGoogleAuth();

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <View style={styles.profile}>
          {user.photo && <Image source={{ uri: user.photo }} style={styles.avatar} />}
          <ThemedText type="title" style={styles.name}>{user.name}</ThemedText>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
          <Pressable style={[styles.button, styles.signOutButton]} onPress={signOut}>
            <ThemedText style={styles.buttonText}>Cerrar sesión</ThemedText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.login}>
          <ThemedText type="title" style={styles.title}>Raíces</ThemedText>
          <ThemedText style={styles.subtitle}>Inicia sesión para continuar</ThemedText>

          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
          )}

          <Pressable
            style={[styles.button, styles.googleButton, loading && styles.disabled]}
            onPress={signIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Continuar con Google</ThemedText>
            )}
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  login: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  profile: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 40,
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
  },
  email: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  signOutButton: {
    backgroundColor: '#888',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: '#e53e3e',
    textAlign: 'center',
  },
});
