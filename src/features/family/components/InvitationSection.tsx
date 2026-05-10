import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';

interface InvitationSectionProps {
  invitationCode: string | undefined;
  onRegenerateCode: () => void;
  isRegenerating: boolean;
  onShowQr: () => void;
}

export function InvitationSection({
  invitationCode,
  onRegenerateCode,
  isRegenerating,
  onShowQr,
}: InvitationSectionProps) {
  const handleCopyCode = () => {
    // Implement copy to clipboard
  };


  return (
    <View style={styles.container}>
      <View style={styles.circleDecoration} />
      <Text style={styles.title}>Invitar nuevos miembros</Text>
      <Text style={styles.subtitle}>
        Comparte este código con los familiares o cuidadores que desees agregar
        a tu círculo de confianza.
      </Text>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>{invitationCode ?? '--------'}</Text>
        <Pressable onPress={handleCopyCode} style={styles.copyButton}>
          <IconSymbol name="doc.on.doc" size={24} color="#777777" />
        </Pressable>
      </View>
      <View style={styles.actions}>
        <Button label="Mostrar QR" onPress={onShowQr} fullWidth />
        <Button
          label="Regenerar Código"
          onPress={onRegenerateCode}
          loading={isRegenerating}
          variant="outline"
          size="sm"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  circleDecoration: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(34, 80, 49, 0.1)',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 24,
    color: '#1F3A2E',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: '#474747',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#C6C6C6',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginVertical: 16,
  },
  codeText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 30,
    color: '#1F1B15',
    letterSpacing: 4,
  },
  copyButton: {
    padding: 8,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
