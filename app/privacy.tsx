import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PrivacyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>Política de Privacidad</ThemedText>
        <ThemedText style={styles.updatedAt}>Última actualización: abril 2026</ThemedText>

        <ThemedText style={styles.heading}>1. Información que recopilamos</ThemedText>
        <ThemedText style={styles.paragraph}>
          Podemos recopilar datos básicos de perfil y uso para permitir el acceso seguro y mejorar la experiencia
          dentro de Raíces.
        </ThemedText>

        <ThemedText style={styles.heading}>2. Cómo usamos la información</ThemedText>
        <ThemedText style={styles.paragraph}>
          Usamos la información para autenticarte, habilitar funciones principales y ofrecer soporte técnico.
        </ThemedText>

        <ThemedText style={styles.heading}>3. Compartición de datos</ThemedText>
        <ThemedText style={styles.paragraph}>
          No vendemos tus datos personales. Solo compartimos información cuando es necesario para operar el
          servicio o cumplir obligaciones legales.
        </ThemedText>

        <ThemedText style={styles.heading}>4. Tus derechos</ThemedText>
        <ThemedText style={styles.paragraph}>
          Puedes solicitar actualización o eliminación de tu información personal conforme a la normativa vigente.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 28,
    lineHeight: 34,
    color: '#225031',
  },
  updatedAt: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.7,
    marginBottom: 8,
  },
  heading: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  paragraph: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
});
