import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TermsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>Términos de Servicio</ThemedText>
        <ThemedText style={styles.updatedAt}>Última actualización: abril 2026</ThemedText>

        <ThemedText style={styles.heading}>1. Uso de la aplicación</ThemedText>
        <ThemedText style={styles.paragraph}>
          Raíces está diseñada para acompañar la comunicación y el bienestar familiar. Al usarla, aceptas
          utilizarla de forma responsable y respetuosa.
        </ThemedText>

        <ThemedText style={styles.heading}>2. Cuenta y acceso</ThemedText>
        <ThemedText style={styles.paragraph}>
          Eres responsable de mantener el control de tu sesión y de la información compartida desde tu cuenta.
        </ThemedText>

        <ThemedText style={styles.heading}>3. Contenido compartido</ThemedText>
        <ThemedText style={styles.paragraph}>
          El contenido que subas o envíes dentro de la app debe respetar a otros usuarios y cumplir con la ley
          aplicable.
        </ThemedText>

        <ThemedText style={styles.heading}>4. Cambios al servicio</ThemedText>
        <ThemedText style={styles.paragraph}>
          Podemos mejorar o actualizar funciones para ofrecer una experiencia más segura y estable.
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
