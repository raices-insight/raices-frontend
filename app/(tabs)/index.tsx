import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGoogleAuth } from '@/hooks/use-google-auth';

const TERMS_ROUTE = '/terms' as Href;
const PRIVACY_ROUTE = '/privacy' as Href;

export default function HomeScreen() {
  const { user, loading, error, signIn, signOut } = useGoogleAuth();

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <View style={styles.profileScreen}>
          <View style={styles.profileCard}>
            {user.photo && <Image source={{ uri: user.photo }} style={styles.avatar} />}
            <ThemedText type="title" style={styles.name}>{user.name ?? 'Usuario'}</ThemedText>
            <ThemedText style={styles.email}>{user.email}</ThemedText>
            <Pressable style={[styles.button, styles.signOutButton]} onPress={signOut}>
              <ThemedText style={styles.buttonText}>Cerrar sesión</ThemedText>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.authScreen}>
          <View style={styles.decorativeBlobTop} />
          <View style={styles.decorativeBlobBottom} />

          <View style={styles.logoWrapper}>
            <Image source={require('@/assets/images/raices-login-logo.png')} style={styles.logoImage} contentFit="cover" />
          </View>

          <View style={styles.brandingSection}>
            <ThemedText style={styles.brandName}>Raíces</ThemedText>
            <ThemedText style={styles.tagline}>
              Cuidando el bienestar de los que{`\n`}más quieres
            </ThemedText>
          </View>

          <View style={styles.actionSection}>
            <Pressable
              style={[styles.button, styles.googleButton, loading && styles.disabled]}
              onPress={signIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1F1B15" />
              ) : (
                <>
                  <Image
                    source={require('@/assets/images/google-g-logo.png')}
                    style={styles.googleIcon}
                    contentFit="contain"
                  />
                  <ThemedText style={styles.googleButtonText}>Iniciar sesión con Google</ThemedText>
                </>
              )}
            </Pressable>
          </View>

          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
          )}

          <View style={styles.legalWrapper}>
            <ThemedText style={styles.legalText}>Al continuar, aceptas nuestros </ThemedText>
            <Pressable onPress={() => router.push(TERMS_ROUTE)}>
              <ThemedText style={styles.legalLink}>Términos de Servicio</ThemedText>
            </Pressable>
            <ThemedText style={styles.legalText}> y </ThemedText>
            <Pressable onPress={() => router.push(PRIVACY_ROUTE)}>
              <ThemedText style={styles.legalLink}>Política de Privacidad</ThemedText>
            </Pressable>
            <ThemedText style={styles.legalText}>.</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5EC',
  },
  authScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorativeBlobTop: {
    position: 'absolute',
    top: -120,
    right: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(84, 129, 95, 0.08)',
  },
  decorativeBlobBottom: {
    position: 'absolute',
    bottom: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(84, 129, 95, 0.06)',
  },
  logoWrapper: {
    width: 195,
    height: 195,
    borderRadius: 98,
    backgroundColor: '#F0F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(83, 129, 95, 0.12)',
    shadowColor: '#5A5F40',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  logoImage: {
    width: 167,
    height: 166,
    borderRadius: 83,
  },
  brandingSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 16,
  },
  brandName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 72,
    lineHeight: 84,
    color: '#53815F',
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    color: 'rgba(31, 27, 21, 0.8)',
    maxWidth: 300,
  },
  actionSection: {
    marginTop: 64,
    width: '100%',
    maxWidth: 360,
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
    color: 'rgba(31, 27, 21, 0.72)',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 220, 196, 0.2)',
    shadowColor: '#5A5F40',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  googleButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1F1B15',
    fontSize: 18,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  signOutButton: {
    backgroundColor: '#53815F',
    marginTop: 16,
    maxWidth: 280,
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: '#e53e3e',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 340,
  },
  legalWrapper: {
    marginTop: 48,
    maxWidth: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legalText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#777777',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
  },
  legalLink: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#225031',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
  },
  profileScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  profileCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(84, 129, 95, 0.15)',
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: '#5A5F40',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
