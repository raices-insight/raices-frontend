import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useAudioUpload } from '@/hooks/use-audio-upload';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function IncomingEventScreen() {
  const { status, error, startRecording, stopAndUpload, cancelRecording, isRecording } = useAudioUpload();

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0);
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    };
  });

  // Mocking the incoming event data
  const eventTitle = "Toma de pastillas";
  const caretakerName = "María (Cuidadora)";

  const handlePress = () => {
    if (isRecording) {
      // Pass the profile ID and role for the adult responding
      stopAndUpload('11111111-1111-1111-1111-111111111111', 'adulto_mayor');
    } else {
      startRecording();
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Decorative Background */}
      <View style={styles.decorativeBlobTop} />
      <View style={styles.decorativeBlobBottom} />

      {/* Header Info */}
      <View style={styles.header}>
        <ThemedText style={styles.subtitle}>Evento Entrante</ThemedText>
        <ThemedText style={styles.title}>{eventTitle}</ThemedText>
      </View>

      {/* Caretaker's Prompt Audio (Mocked Visual) */}
      <View style={styles.promptCard}>
        <View style={styles.caretakerInfo}>
          <View style={styles.avatarPlaceholder}>
            <IconSymbol name="person.fill" size={24} color="#53815F" />
          </View>
          <View>
            <ThemedText style={styles.caretakerName}>{caretakerName}</ThemedText>
            <ThemedText style={styles.caretakerAction}>te ha dejado un mensaje de voz</ThemedText>
          </View>
        </View>
        <Pressable style={styles.playButton}>
          <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
          <ThemedText style={styles.playText}>Escuchar Mensaje</ThemedText>
        </Pressable>
      </View>

      {/* Recording Area */}
      <View style={styles.recordingSection}>
        <ThemedText style={styles.instructionText}>
          {isRecording 
            ? "Grabando tu respuesta..." 
            : status === 'uploading' 
              ? "Enviando respuesta..." 
              : status === 'success'
                ? "¡Respuesta enviada!"
                : "Toca el micrófono para responder"}
        </ThemedText>

        <View style={styles.micContainer}>
          {/* Animated Pulse Ring */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          
          <Pressable 
            style={[
              styles.micButton, 
              isRecording && styles.micButtonRecording,
              (status === 'uploading' || status === 'processing') && styles.micButtonDisabled
            ]} 
            onPress={handlePress}
            disabled={status === 'uploading' || status === 'processing'}
          >
            {status === 'uploading' || status === 'processing' ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : status === 'success' ? (
              <IconSymbol name="checkmark" size={48} color="#FFFFFF" />
            ) : (
              <IconSymbol name={isRecording ? "stop.fill" : "mic.fill"} size={48} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        {isRecording && (
          <Pressable style={styles.cancelButton} onPress={cancelRecording}>
            <ThemedText style={styles.cancelText}>Cancelar grabación</ThemedText>
          </Pressable>
        )}
        
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5EC',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  header: {
    marginTop: 64,
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#7BA87D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 32,
    color: '#1F1B15',
    textAlign: 'center',
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0px 8px 16px rgba(90, 95, 64, 0.08)',
    elevation: 4,
    marginVertical: 32,
  },
  caretakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(83, 129, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caretakerName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#1F1B15',
  },
  caretakerAction: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: 'rgba(31, 27, 21, 0.6)',
  },
  playButton: {
    backgroundColor: '#53815F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 99,
  },
  playText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  recordingSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 40,
  },
  instructionText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 18,
    color: '#1F1B15',
    marginBottom: 48,
    textAlign: 'center',
  },
  micContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#325F3F',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#325F3F',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 12px rgba(50, 95, 63, 0.3)',
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: '#E53E3E',
    boxShadow: '0px 8px 12px rgba(229, 62, 62, 0.3)',
  },
  micButtonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#E53E3E',
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#E53E3E',
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});
