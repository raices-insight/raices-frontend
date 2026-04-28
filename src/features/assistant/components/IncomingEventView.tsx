import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useAudioUpload } from '@/features/assistant/hooks/use-audio-upload';
import { View, Text, Pressable } from '@/core/ui/tw';
import { Animated } from '@/core/ui/animated';
import { IconSymbol } from '@/core/ui/icon-symbol';

export function IncomingEventView() {
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
      stopAndUpload('11111111-1111-1111-1111-111111111111', 'adulto_mayor');
    } else {
      startRecording();
    }
  };

  return (
    <View className="flex-1 bg-raices-bg p-6 items-center justify-between">
      {/* Decorative Background */}
      <View className="absolute -top-[120px] -right-[110px] w-[300px] h-[300px] rounded-full bg-raices-secondary/10" />
      <View className="absolute -bottom-[120px] -left-[120px] w-[280px] h-[280px] rounded-full bg-raices-secondary/5" />

      {/* Header Info */}
      <View className="mt-16 items-center w-full">
        <Text className="font-headline font-medium text-sm text-raices-tertiary uppercase tracking-widest mb-2">
          Evento Entrante
        </Text>
        <Text className="font-body font-bold text-[32px] text-raices-text text-center">
          {eventTitle}
        </Text>
      </View>

      {/* Caretaker's Prompt Audio (Mocked Visual) */}
      <View className="bg-raices-surface w-full rounded-[24px] p-6 shadow-sm elevation-4 my-8">
        <View className="flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-raices-secondary/10 items-center justify-center">
            <IconSymbol name="person.fill" size={24} color="#53815F" />
          </View>
          <View>
            <Text className="font-headline font-bold text-base text-raices-text">
              {caretakerName}
            </Text>
            <Text className="font-headline font-normal text-sm text-raices-text-muted">
              te ha dejado un mensaje de voz
            </Text>
          </View>
        </View>
        <Pressable className="bg-raices-secondary flex-row items-center justify-center gap-3 py-4 rounded-full">
          <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
          <Text className="font-headline font-bold text-white text-base">
            Escuchar Mensaje
          </Text>
        </Pressable>
      </View>

      {/* Recording Area */}
      <View className="flex-1 items-center justify-center w-full pb-10">
        <Text className="font-headline font-medium text-lg text-raices-text mb-12 text-center">
          {isRecording 
            ? "Grabando tu respuesta..." 
            : status === 'uploading' 
              ? "Enviando respuesta..." 
              : status === 'success'
                ? "¡Respuesta enviada!"
                : "Toca el micrófono para responder"}
        </Text>

        <View className="w-40 h-40 items-center justify-center">
          {/* Animated Pulse Ring */}
          <Animated.View 
            className="absolute w-[140px] h-[140px] rounded-full bg-raices-primary" 
            style={pulseStyle} 
          />
          
          <Pressable 
            className={`w-[100px] h-[100px] rounded-full items-center justify-center shadow-lg elevation-8 ${
              isRecording ? 'bg-raices-error shadow-raices-error/30' : 'bg-raices-primary shadow-raices-primary/30'
            } ${(status === 'uploading' || status === 'processing') ? 'opacity-70' : ''}`}
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
          <Pressable className="mt-8 py-3 px-6" onPress={cancelRecording}>
            <Text className="font-headline font-medium text-raices-error text-base">
              Cancelar grabación
            </Text>
          </Pressable>
        )}
        
        {error && (
          <Text className="mt-4 font-headline font-medium text-raices-error text-center px-5">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}
