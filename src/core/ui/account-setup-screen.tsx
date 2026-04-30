import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { GoogleUser } from '@/features/auth/hooks/use-google-auth';

type Role = 'caregiver' | 'elderly';

interface Props {
  user: GoogleUser;
  onComplete: (role: Role) => void;
}

export function AccountSetupScreen({ user, onComplete }: Props) {
  const [age, setAge] = useState(65);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const canBeElderly = age >= 65;

  const updateAge = (next: number) => {
    setAge(next);
    if (next < 65 && selectedRole === 'elderly') setSelectedRole(null);
  };

  const handleAgeText = (v: string) => {
    if (v === '') return;
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 1 && n <= 120) updateAge(n);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={styles.headerAvatar} />
            ) : (
              <View style={[styles.headerAvatar, styles.headerAvatarFallback]} />
            )}
            <Text style={styles.brandText}>Vínculo</Text>
          </View>
          <Pressable style={styles.bellButton} hitSlop={8}>
            <Ionicons name="notifications-outline" size={24} color="#225031" />
          </Pressable>
        </View>

        {/* Age section */}
        <View style={styles.ageSection}>
          <Text style={styles.ageSectionLabel}>¿Qué edad tienes?</Text>

          <View style={styles.ageStepperRow}>
            <Pressable
              style={styles.stepperButton}
              onPress={() => updateAge(Math.max(1, age - 1))}
              hitSlop={8}
            >
              <Text style={styles.stepperSymbol}>−</Text>
            </Pressable>

            <View style={styles.ageCircle}>
              <TextInput
                style={styles.ageNumber}
                value={String(age)}
                keyboardType="number-pad"
                maxLength={3}
                onChangeText={handleAgeText}
                selectTextOnFocus
              />
            </View>

            <Pressable
              style={styles.stepperButton}
              onPress={() => updateAge(Math.min(120, age + 1))}
              hitSlop={8}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.anosLabel}>AÑOS</Text>
          <Text style={styles.ageHint}>Esto nos ayuda a personalizar tu experiencia</Text>
        </View>

        {/* Role section */}
        <View style={styles.roleSection}>
          <Text style={styles.roleSectionTitle}>Selecciona tu perfil</Text>
          <Text style={styles.roleSectionSubtitle}>
            ¿Cuál es tu rol en la comunidad Vínculo?
          </Text>

          <View style={styles.cardsContainer}>
            <Pressable
              style={[styles.roleCard, selectedRole === 'caregiver' && styles.roleCardActive]}
              onPress={() => setSelectedRole('caregiver')}
            >
              <View style={[styles.roleIconWrap, styles.caregiverIconBg]}>
                <Ionicons name="medical-outline" size={28} color="#53815F" />
              </View>
              <Text style={styles.roleCardTitle}>Soy Cuidador</Text>
              <Text style={styles.roleCardDesc}>
                Acompaño y apoyo a un adulto mayor cercano
              </Text>
            </Pressable>

            {canBeElderly && (
              <Pressable
                style={[styles.roleCard, selectedRole === 'elderly' && styles.roleCardActive]}
                onPress={() => setSelectedRole('elderly')}
              >
                <View style={[styles.roleIconWrap, styles.elderlyIconBg]}>
                  <Ionicons name="sunny-outline" size={28} color="#7BA87D" />
                </View>
                <Text style={styles.roleCardTitle}>Soy Persona Mayor</Text>
                <Text style={styles.roleCardDesc}>
                  Busco mantener mi bienestar y conexión
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={() => onComplete('caregiver')}>
          <Text style={styles.primaryButtonText}>Comenzar como Cuidador</Text>
        </Pressable>
        {canBeElderly && (
          <Pressable style={styles.outlinedButton} onPress={() => onComplete('elderly')}>
            <Text style={styles.outlinedButtonText}>Comenzar como Adulto Mayor</Text>
          </Pressable>
        )}
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F5EC',
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#225031',
  },
  headerAvatarFallback: {
    backgroundColor: '#C8DFC9',
  },
  brandText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 30,
    color: '#225031',
    lineHeight: 36,
  },
  bellButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(34,80,49,0.06)',
  },

  // Age section
  ageSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  ageSectionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#1F1B15',
    textAlign: 'center',
  },
  ageStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A5F40',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stepperSymbol: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#225031',
    lineHeight: 30,
    includeFontPadding: false,
  },
  ageCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A5F40',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ageNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 52,
    color: '#1F1B15',
    textAlign: 'center',
    width: 110,
    includeFontPadding: false,
  },
  anosLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#225031',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  ageHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: 'rgba(31,27,21,0.55)',
    textAlign: 'center',
    maxWidth: 240,
  },

  // Role section
  roleSection: {
    paddingHorizontal: 24,
    paddingTop: 36,
    gap: 8,
  },
  roleSectionTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    color: '#1F1B15',
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  roleSectionSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: 'rgba(31,27,21,0.60)',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(235,225,215,0.5)',
    paddingHorizontal: 25,
    paddingVertical: 25,
    shadowColor: '#5A5F40',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 8,
  },
  roleCardActive: {
    borderColor: '#53815F',
    borderWidth: 2,
  },
  roleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caregiverIconBg: {
    backgroundColor: 'rgba(83,129,95,0.10)',
  },
  elderlyIconBg: {
    backgroundColor: 'rgba(123,168,125,0.10)',
  },
  roleCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#1F1B15',
    lineHeight: 24,
  },
  roleCardDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: 'rgba(31,27,21,0.60)',
    lineHeight: 18,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#53815F',
    paddingTop: 25,
    paddingHorizontal: 40,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: '#F0F5EC',
  },
  primaryButton: {
    backgroundColor: '#325F3F',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  outlinedButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#1F3A2E',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#1F3A2E',
  },
  homeIndicator: {
    width: 130,
    height: 4,
    backgroundColor: '#EBE1D7',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 4,
  },
});
