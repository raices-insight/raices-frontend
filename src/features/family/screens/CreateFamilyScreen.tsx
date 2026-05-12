import { View, Text, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useCreateFamily } from '../hooks/use-family';

const heroImage = require('../../../../assets/images/create-family-hero.png');

export default function CreateFamilyScreen() {
  const [familyName, setFamilyName] = useState('');
  const { createFamily, loading } = useCreateFamily();
  const router = useRouter();

  const trimmedName = familyName.trim();

  const handleCreate = async () => {
    const result = await createFamily({ name: trimmedName });
    if (result) {
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image
          source={heroImage}
          style={styles.headerImage}
        />
        <View style={styles.headerImageGradient} />
        <View style={styles.headerImageOverlay}>
          <Text style={styles.headerImageText}>NUEVO CÍRCULO</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.progressText}>PASO 1 DE 3 • CONFIGURACIÓN DE RED</Text>
        <Text style={styles.title}>Crea tu Círculo Familiar</Text>
        <Text style={styles.subtitle}>
          Al crear una familia, te convertirás en el administrador y podrás invitar a otros.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la Familia</Text>
          <TextInput
            value={familyName}
            onChangeText={setFamilyName}
            style={styles.input}
            placeholder="Ej: Familia García López"
            placeholderTextColor="rgba(255,255,255,0.8)"
          />
        </View>

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
             <IconSymbol name="envelope.fill" size={20} color="#3E6842" />
          </View>
          <View style={styles.infoCardTextContainer}>
            <Text style={styles.infoCardTitle}>Invitaciones</Text>
            <Text style={styles.infoCardText}>
              Envía códigos de acceso seguros para que otros se unan a tu red de apoyo.
            </Text>
          </View>
        </View>

        <Button
          label="Crear Familia"
          onPress={handleCreate}
          disabled={!trimmedName}
          loading={loading}
          fullWidth
          style={{ marginTop: 24 }}
        />
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF3',
  },
  headerImageContainer: {
    height: 256,
    borderRadius: 32,
    marginHorizontal: 24,
    marginTop: 80,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerImageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 248, 243, 0)',
  },
  headerImageOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: 'rgba(146, 76, 0, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  headerImageText: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: '#225031',
  },
  formContainer: {
    padding: 24,
    gap: 32,
  },
  progressText: {
    textAlign: 'center',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 12,
    color: 'rgba(71, 71, 71, 0.6)',
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: 'BeVietnamPro-ExtraBold',
    fontSize: 30,
    textAlign: 'center',
    color: '#1F1B15',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: '#474747',
    marginTop: -20,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    color: '#225031',
  },
  input: {
    backgroundColor: '#7BA87D',
    borderRadius: 16,
    padding: 20,
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 18,
    color: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(88, 99, 48, 0.1)',
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
  },
});
