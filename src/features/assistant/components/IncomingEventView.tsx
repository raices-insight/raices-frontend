import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, ActivityIndicator } from 'react-native';
import {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence, Easing, cancelAnimation,
} from 'react-native-reanimated';
import { useAudioUpload } from '@/features/assistant/hooks/use-audio-upload';
import { View, Text, Pressable } from '@/core/ui/tw';
import { Animated } from '@/core/ui/animated';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { Button } from '@/core/ui/button';
import { Asset } from 'expo-asset';
import { useAuth } from '@/features/auth/context/auth-context';
import { useLocalSearchParams } from 'expo-router';
import { useAssistantCalendarEvents } from '@/features/calendar/hooks/useAssistantCalendarEvents';
import { useFamily, useFamilyDetails } from '@/features/family/hooks/use-family';
import { AudioPlayButton } from '@/core/ui/audio-play-button';
import { logger } from '@/core/logger';
import { CONFIG } from '@/core/config';
import { useWebSocket } from '@/core/websocket/websocket-provider';

// ---------------------------------------------------------------------------
// Mock data for development testing
// ---------------------------------------------------------------------------
const MOCK_AUDIO_FILE  = require('@/../assets/audio/adulto-mayor-animo-positivo.mp3');

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IncomingEventView() {
  const { width: screenWidth } = useWindowDimensions();
  const { user } = useAuth();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  
  const { events, isLoading } = useAssistantCalendarEvents();
  const currentEvent = events.find(e => e.id === eventId);
  const eventTitle = currentEvent?.title || 'Evento Entrante';
  
  const { family } = useFamily();
  const { members } = useFamilyDetails(family?.id);
  const creatorMember = members.find(m => m.profileId === currentEvent?.caretaker_profile_id);
  const senderName = creatorMember?.name || 'Tu familia';

  // Responsive sizing: avatar ~25% (inside card), button ~72% of screen
  const avatarSize = Math.min(screenWidth * 0.25, 96);
  const buttonSize = Math.min(screenWidth * 0.72, 288);
  const iconSize   = Math.round(buttonSize * 0.24);

  const { status, error, startRecording, stopAndUpload, cancelRecording, isRecording } = useAudioUpload();
  const [isCooldown, setIsCooldown] = useState(false);
  const isBusy    = status === 'uploading' || status === 'processing';
  const isSuccess = status === 'success';

  // ── Analysis result from WebSocket ──────────────────────────────────────────
  // Tracks what the assistant service returns after processing the audio.
  const [analysisResult, setAnalysisResult] = useState<{
    /** True between a successful upload and the arrival of assistant:analysis_complete */
    waiting: boolean;
    description: string | null;
    analysisStatus: 'completed' | 'skipped' | 'failed' | null;
  }>({ waiting: false, description: null, analysisStatus: null });
  
  // Track the audio profile ID of the currently uploading/processing recording
  const [uploadAudioProfileId, setUploadAudioProfileId] = useState<string | null>(null);
  const uploadAudioProfileIdRef = useRef(uploadAudioProfileId);
  useEffect(() => { uploadAudioProfileIdRef.current = uploadAudioProfileId; }, [uploadAudioProfileId]);

  const { subscribe } = useWebSocket();

  // Subscribe to assistant:analysis_complete — fires when the backend finishes STT + LLM
  useEffect(() => {
    return subscribe('assistant:analysis_complete', (data) => {
      logger.info('Received assistant:analysis_complete', data);

      // Only process the analysis if it belongs to the audio we just uploaded
      const currentId = uploadAudioProfileIdRef.current;
      if (!currentId || data.audio_profile_id !== currentId) {
        logger.debug(`Ignoring analysis for different or null audio profile: ${data.audio_profile_id}`);
        return;
      }

      setAnalysisResult({
        waiting: false,
        description: data.description ?? null,
        analysisStatus: data.status,
      });
    });
  }, [subscribe]);

  // When upload is acknowledged by the server, start waiting for the async analysis
  useEffect(() => {
    if (status === 'success') {
      setAnalysisResult({ waiting: true, description: null, analysisStatus: null });
    } else if (status === 'error') {
      setAnalysisResult({ waiting: false, description: null, analysisStatus: null });
    }
  }, [status]);
  
  // Get final audio url
  let finalAudioUrl = currentEvent?.audio_url || null;
  if (finalAudioUrl && finalAudioUrl.includes('localhost')) {
    const apiUrl = CONFIG.API_URL;
    const ipMatch = apiUrl.match(/:\/\/([^\/:]+)/);
    if (ipMatch && ipMatch[1] && ipMatch[1] !== 'localhost') {
      finalAudioUrl = finalAudioUrl.replace('localhost', ipMatch[1]);
    }
  }

  // --- Pulse ring ---
  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.22, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1,    { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 1000 }),
          withTiming(0.15, { duration: 1000 })
        ),
        -1, true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      pulseScale.value   = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
    return () => { cancelAnimation(pulseScale); cancelAnimation(pulseOpacity); };
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity:   pulseOpacity.value,
  }));

  const handleMicPress = async () => {
    if (isCooldown) return;

    if (isRecording) {
      let returnedId: string | undefined;
      
      if (!CONFIG.USE_AUDIO_MOCK) {
        // Real recording flow
        returnedId = await stopAndUpload(eventId);
      } else {
        // Simulation: substitute a static MP3 asset (EXPO_PUBLIC_USE_AUDIO_MOCK=true)
        const asset = Asset.fromModule(MOCK_AUDIO_FILE);
        await asset.downloadAsync();

        if (user?.id) {
          returnedId = await stopAndUpload(eventId, asset.localUri || asset.uri);
        } else {
          console.warn('No user session available to upload audio');
        }
      }
      
      if (returnedId) {
        setUploadAudioProfileId(returnedId);
      }
    } else {
      // Reset previous analysis when starting a new recording
      setAnalysisResult({ waiting: false, description: null, analysisStatus: null });
      setIsCooldown(true);
      startRecording();
      setTimeout(() => setIsCooldown(false), 1000); // 1 sec cooldown
    }
  };

  const buttonLabel = isSuccess  ? '¡ENVIADO!'
    : isRecording ? 'GRABANDO...'
    : isBusy      ? 'ENVIANDO...'
    : 'PRESIONA PARA\nHABLAR';

  return (
    <View className="flex-1 bg-raices-bg items-center px-6">

      {/* Decorative blobs */}
      <View className="absolute -top-[80px] -right-[80px] w-[280px] h-[280px] rounded-full bg-raices-secondary/10" />
      <View className="absolute top-[35%] -left-[80px] w-[220px] h-[220px] rounded-full bg-raices-secondary/5" />

      {/* ── Brand label ─────────────────────────────────────── */}
      <Text
        className="mt-10 font-body italic text-xs uppercase text-raices-text text-center"
        style={{ opacity: 0.5, letterSpacing: 4 }}
      >
        Raíces
      </Text>

      {/* ── Event card: avatar + event + sender ──────────────── */}
      {/* ── Event card ──────────────────────────────────────── */}
      <View className="mt-4 w-full bg-raices-surface rounded-3xl p-4 shadow-sm elevation-3" style={{ gap: 14 }}>
        {/* Top row: avatar + event info */}
        <View className="flex-row items-center gap-4">
          {/* Compact avatar */}
          <View
            className="rounded-full bg-raices-secondary/20 items-center justify-center flex-shrink-0"
            style={{
              width:  avatarSize,
              height: avatarSize,
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.6)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.10,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <IconSymbol name="person.fill" size={avatarSize * 0.48} color="#53815F" />
          </View>

          {/* Event info */}
          <View className="flex-1" style={{ gap: 3 }}>
            <View className="flex-row items-center gap-1 self-start bg-raices-secondary/10 rounded-full px-3 py-0.5">
              <IconSymbol name="calendar" size={10} color="#53815F" />
              <Text className="font-headline font-semibold text-[10px] text-raices-secondary uppercase tracking-widest">
                Evento entrante
              </Text>
            </View>
            <Text className="font-headline font-bold text-xl text-raices-text leading-tight">
              {eventTitle}
            </Text>
            <Text className="font-body text-sm text-raices-text-muted">
              Mensaje de{' '}
              <Text className="font-body font-semibold text-raices-secondary">{senderName}</Text>
            </Text>
          </View>
        </View>

        {/* Escuchar mensaje button */}
        {finalAudioUrl && (
          <View className="w-full">
            <AudioPlayButton audioUrl={finalAudioUrl} variant="pill-lg" fullWidth />
          </View>
        )}
      </View>

      {/* ── Button area: flex-1 centers the button vertically ─── */}
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        {/* Big mic button */}
        <View className="items-center justify-center" style={{ width: buttonSize, height: buttonSize }}>
          <Animated.View
            className="absolute rounded-full bg-raices-primary"
            style={[{ width: buttonSize, height: buttonSize }, pulseStyle]}
          />
          <Pressable
            onPress={handleMicPress}
            disabled={isBusy || isCooldown}
            className="rounded-full items-center justify-center"
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: isRecording ? '#C0392B' : '#325F3F',
              borderWidth: 7,
              borderColor: 'rgba(255,255,255,0.2)',
              shadowColor: isRecording ? '#C0392B' : '#924C00',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.35,
              shadowRadius: 40,
              elevation: 16,
              opacity: (isBusy || isCooldown) ? 0.75 : 1,
            }}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <View className="items-center" style={{ gap: 10 }}>
                <IconSymbol
                  name={isSuccess ? 'checkmark' : isRecording ? 'stop.fill' : 'mic.fill'}
                  size={iconSize}
                  color="#FFFFFF"
                />
                <Text
                  className="font-headline font-bold text-white text-center"
                  style={{ fontSize: Math.max(14, buttonSize * 0.063), letterSpacing: 1.5, lineHeight: buttonSize * 0.085 }}
                >
                  {buttonLabel}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Fixed 56px slot — always reserves the same height so the transcription card never moves */}
        <View className="items-center w-full" style={{ height: 56, justifyContent: 'flex-start' }}>
          {isRecording && (
            <Pressable className="py-1 px-6" onPress={cancelRecording}>
              <Text className="font-headline font-medium text-raices-error text-base text-center">
                Cancelar grabación
              </Text>
            </Pressable>
          )}
          {error && (
            <Text className="font-headline font-medium text-raices-error text-center px-4" numberOfLines={2}>
              {error}
            </Text>
          )}
        </View>
      </View>

      {/* ── Transcription card — always anchored to the bottom ─── */}
      <View className="mb-6 w-full bg-raices-surface rounded-3xl p-5 shadow-sm elevation-2">
        <Text className="font-headline font-semibold text-xs text-raices-tertiary uppercase tracking-widest mb-2">
          {analysisResult.analysisStatus === 'completed' || analysisResult.analysisStatus === 'skipped'
            ? `Tu respuesta`
            : `Mensaje de ${senderName}`}
        </Text>

        {analysisResult.waiting ? (
          // Backend is processing — show spinner + label
          <View className="flex-row items-center justify-center gap-3 py-1">
            <ActivityIndicator size="small" color="#53815F" />
            <Text className="font-body text-raices-text-muted text-base">
              Analizando tu respuesta...
            </Text>
          </View>
        ) : analysisResult.analysisStatus === 'failed' ? (
          // Pipeline failed — show a friendly error
          <Text
            className="font-body text-raices-error text-center text-base leading-6"
          >
            No se pudo procesar tu respuesta. Intenta de nuevo.
          </Text>
        ) : analysisResult.analysisStatus === 'completed' || analysisResult.analysisStatus === 'skipped' ? (
          // Analysis complete — show real transcript
          <Text
            className="font-body text-raices-text text-center text-lg leading-7"
            style={{ fontStyle: 'italic' }}
          >
            {analysisResult.description ? `"${analysisResult.description}"` : '(Audio inaudible o vacío)'}
          </Text>
        ) : currentEvent?.description ? (
          // Default / before first recording: show caretaker's message/transcription
          <Text
            className="font-body text-raices-text text-center text-lg leading-7"
            style={{ fontStyle: 'italic' }}
          >
            {`"${currentEvent.description}"`}
          </Text>
        ) : (
          // Default fallback if no incoming description exists
          <Text
            className="font-body text-raices-text-muted text-center text-lg leading-7"
            style={{ fontStyle: 'italic' }}
          >
            Presiona el botón para grabar una respuesta...
          </Text>
        )}
      </View>

    </View>
  );
}
