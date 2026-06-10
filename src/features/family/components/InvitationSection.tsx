import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { Button } from '@/core/ui/button';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useToast } from '@/core/toast/use-toast';

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
  const toast = useToast();

  const handleCopyCode = async () => {
    if (!invitationCode) return;
    try {
      const message = `Únete a mi familia en Raíces con el código:\n${invitationCode}`;
      await Share.share({ message });
    } catch {
      toast.error('No se pudo compartir el código');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleDecoration} />

      <Text style={styles.title}>Invitar nuevos miembros</Text>
      <Text style={styles.subtitle}>
        Comparte este código con los familiares o cuidadores que desees agregar
        a tu círculo de confianza.
      </Text>

      <Pressable style={styles.codeContainer} onPress={handleCopyCode}>
        <Text style={styles.codeText}>{invitationCode ?? '--------'}</Text>
        <View style={styles.copyButton}>
          <IconSymbol name="square.and.arrow.up" size={20} color="#6B6B6B" />
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Button label="Mostrar QR" onPress={onShowQr} fullWidth pill={false} />
        <Pressable
          onPress={onRegenerateCode}
          disabled={isRegenerating}
          style={styles.regenerateButton}
          hitSlop={6}
        >
          <IconSymbol name="arrow.clockwise" size={14} color="#325F3F" />
          <Text style={styles.regenerateText}>
            {isRegenerating ? 'Regenerando…' : 'Regenerar código'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(28, 28, 23, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 2,
  },
  circleDecoration: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(123, 168, 125, 0.18)',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 22,
    color: '#1F3A2E',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    color: '#474747',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 2,
    borderColor: '#C6C6C6',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 22,
    marginVertical: 12,
    width: '100%',
  },
  codeText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 28,
    color: '#1F1B15',
    letterSpacing: 4,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    padding: 4,
  },
  actions: {
    width: '100%',
    gap: 14,
    alignItems: 'center',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  regenerateText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 13,
    color: '#325F3F',
  },
});
