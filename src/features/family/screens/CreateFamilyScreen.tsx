import { View, Text, StyleSheet, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useCreateFamily } from '../hooks/use-family';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const heroImage = require('../../../../assets/images/create-family-hero.png');

export default function CreateFamilyScreen() {
  const [familyName, setFamilyName] = useState('');
  const { createFamily, loading } = useCreateFamily();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const trimmedName = familyName.trim();

  const handleCreate = async () => {
    const result = await createFamily({ name: trimmedName });
    if (result) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Hide the default Stack header */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.heroContainer}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />

          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <IconSymbol name="chevron.left" size={20} color="#1F1B15" />
          </Pressable>

          {/* "NUEVO CÍRCULO" badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NUEVO CÍRCULO</Text>
          </View>
        </View>

        {/* TITLE + SUBTITLE */}
        <View style={styles.intro}>
          <Text style={styles.title}>Crea tu Círculo Familiar</Text>
          <Text style={styles.subtitle}>
            Al crear una familia, te convertirás en el administrador y podrás invitar a otros.
          </Text>
        </View>

        {/* INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la Familia</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={familyName}
              onChangeText={setFamilyName}
              style={styles.input}
              placeholder="Ej: Familia García López"
              placeholderTextColor="rgba(255,255,255,0.85)"
            />
            <IconSymbol name="person.3.fill" size={20} color="#FFFFFF" />
          </View>
        </View>

        {/* FEATURE CARDS */}
        <View style={styles.cardsGroup}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <IconSymbol name="shield.checkered" size={20} color="#586330" />
            </View>
            <View style={styles.infoCardTextContainer}>
              <Text style={styles.infoCardTitle}>Rol de Administrador</Text>
              <Text style={styles.infoCardText}>
                Gestiona permisos, invita miembros y coordina los calendarios de cuidado.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardIcon}>
              <IconSymbol name="person.badge.plus" size={20} color="#325F3F" />
            </View>
            <View style={styles.infoCardTextContainer}>
              <Text style={styles.infoCardTitle}>Invitaciones</Text>
              <Text style={styles.infoCardText}>
                Envía códigos de acceso seguros para que otros se unan a tu red de apoyo.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BUTTON */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(24, insets.bottom + 12) }]}>
        <Button
          label="Crear Familia"
          onPress={handleCreate}
          disabled={!trimmedName}
          loading={loading}
          fullWidth
          pill={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8EE',
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // HERO
  heroContainer: {
    height: 240,
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#F4ECDF',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#325F3F',
    letterSpacing: 0.5,
  },

  // INTRO
  intro: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    color: '#1F1B15',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: '#474747',
    lineHeight: 22,
  },

  // INPUT
  inputGroup: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 10,
  },
  label: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#325F3F',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9BBE9F',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },

  // CARDS
  cardsGroup: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    alignItems: 'flex-start',
    shadowColor: 'rgba(28, 28, 23, 0.04)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 1,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(50, 95, 63, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#1F1B15',
  },
  infoCardText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#474747',
    lineHeight: 20,
  },

  // BOTTOM BAR
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FBF8EE',
    borderTopWidth: 1,
    borderTopColor: 'rgba(28, 28, 23, 0.04)',
  },
});
