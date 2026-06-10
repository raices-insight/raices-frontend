import { Text, View, Pressable, ScrollView } from "@/src/core/ui/tw";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { Modal, TextInput as RNTextInput, ActivityIndicator, Platform, Image } from "react-native";
import { IconSymbol } from '@/src/core/ui/icon-symbol';
import { useToast } from '@/src/core/toast/use-toast';
import { logger } from '@/src/core/logger';
import { CONFIG } from '@/src/core/config';
import { apiClient } from '@/src/core/api/client';
import { useAudioUpload } from '@/src/features/assistant/hooks/use-audio-upload';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, cancelAnimation } from 'react-native-reanimated';
import { Animated } from '@/src/core/ui/animated';
import type { CalendarEvent } from '../api/schemas';

const heroImage = require('@/../assets/images/Gradient.png');

const CATEGORIES: { id: string; label: string; icon: any; longLabel: string }[] = [
  { id: '73f481a5-f672-4584-bb23-46004192e567', label: 'MED',  icon: 'pill.fill',      longLabel: 'Medicación' },
  { id: '3585fd3c-9e31-4569-8678-fafb68880380', label: 'CITA', icon: 'stethoscope',    longLabel: 'Cita' },
  { id: '7355fc6b-29eb-4781-8523-ea73741f6a4b', label: 'ACT',  icon: 'figure.walk',    longLabel: 'Actividad' },
  { id: '2f0a0ff3-fc94-46ce-8807-9eb879c2bbec', label: 'VIS',  icon: 'person.2.fill',  longLabel: 'Visita' },
];

interface EditEventModalProps {
  event: CalendarEvent | null;
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { title?: string; due_date?: string; category_id?: string }) => Promise<void>;
}

const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear().toString().slice(-2);
  return `${d}-${m}-${y}`;
};

const formatTime = (date: Date) => {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m}${period}`;
};

const toLocalISODate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const toLocalISOTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${min}`;
};

const WebDateInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) =>
  React.createElement('input', {
    type: 'date',
    style: {
      width: '100%',
      border: 'none',
      background: 'transparent',
      fontSize: '16px',
      color: '#1F1B15',
      outline: 'none',
      fontFamily: 'inherit',
      padding: 0,
    },
    value,
    onChange: (e: any) => onChange(e.target.value),
  });

const WebTimeInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) =>
  React.createElement('input', {
    type: 'time',
    style: {
      width: '100%',
      border: 'none',
      background: 'transparent',
      fontSize: '16px',
      color: '#1F1B15',
      outline: 'none',
      fontFamily: 'inherit',
      padding: 0,
    },
    value,
    onChange: (e: any) => onChange(e.target.value),
  });

export function EditEventModal({ event, visible, onClose, onSave }: EditEventModalProps) {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
  const toast = useToast();

  const { startRecording, stopRecording, uploadAudio, cancelRecording, isRecording } = useAudioUpload();

  const pulseScale = useSharedValue(1);
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
      pulseScale.value = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Pre-fill when event changes or modal opens
  useEffect(() => {
    if (event && visible) {
      setTitle(event.title ?? '');
      setEventDate(new Date(event.due_date));
      setCategory(event.category_id ?? CATEGORIES[0].id);
      setRecordedAudioUri(null); // Reset audio uri on open
    }
  }, [event, visible]);

  const showMode = (mode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: eventDate,
      onValueChange: (_e, selected) => {
        if (selected) setEventDate(selected);
      },
      mode,
      is24Hour: false,
    });
  };

  const onDateFromWeb = (val: string) => {
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    const next = new Date(eventDate);
    next.setFullYear(y, (m ?? 1) - 1, d ?? 1);
    setEventDate(next);
  };

  const onTimeFromWeb = (val: string) => {
    if (!val) return;
    const [h, min] = val.split(':').map(Number);
    const next = new Date(eventDate);
    next.setHours(h ?? 0, min ?? 0, 0, 0);
    setEventDate(next);
  };

  const handleMicPress = async () => {
    if (CONFIG.USE_AUDIO_MOCK) {
      try {
        const { Asset } = require('expo-asset');
        const mockAudio = require('@/../assets/audio/adulto-mayor-animo-positivo.mp3');
        const asset = Asset.fromModule(mockAudio);
        await asset.downloadAsync();
        const uri = asset.localUri || asset.uri;
        if (uri) {
          setRecordedAudioUri(uri);
          toast.success('Audio simulado cargado.');
        } else {
          throw new Error('No local URI');
        }
      } catch (err) {
        logger.error('Failed to load mock audio', err);
        toast.error('Error al cargar audio simulado.');
      }
    } else {
      if (isRecording) {
        const uri = await stopRecording();
        if (uri) {
          setRecordedAudioUri(uri);
        }
      } else {
        setRecordedAudioUri(null);
        await startRecording();
      }
    }
  };

  const handleCancelRecording = async () => {
    await cancelRecording();
  };

  const handleDeleteAudio = () => {
    setRecordedAudioUri(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Por favor, ingresa el nombre del evento.');
      return;
    }
    if (!event) return;

    try {
      setIsSaving(true);

      // If new audio was recorded, upload it and link to the existing event
      if (recordedAudioUri) {
        logger.info('Uploading audio for existing event', { eventId: event.id });
        await uploadAudio(recordedAudioUri, event.id);
      }

      await onSave(event.id, {
        title: title.trim(),
        due_date: eventDate.toISOString(),
        category_id: category,
      });
      toast.success('¡Evento actualizado con éxito!');
      onClose();
    } catch (err) {
      logger.error('Failed to update calendar event', err);
      toast.error('Error al actualizar el evento.');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldBoxStyle = {
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  } as const;

  const buttonSize = 80;
  const iconSize = 28;
  const micButtonColor = isRecording ? '#C0392B' : recordedAudioUri ? '#53815F' : '#325F3F';

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center px-4 bg-black/50">
        <View
          className="w-full bg-raices-surface rounded-3xl overflow-hidden shadow-lg elevation-5"
          style={{ maxHeight: '85%' }}
        >
          <ScrollView
            className="w-full"
            contentContainerClassName="p-5"
            showsVerticalScrollIndicator={false}
          >
            {/* HERO IMAGE */}
            <View className="w-full rounded-2xl overflow-hidden" style={{ height: 110 }}>
              <Image
                source={heroImage}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
            </View>

            <Text className="text-xl font-headline font-bold text-raices-text mt-4 mb-1">
              Editar Evento
            </Text>

            {/* NAME */}
            <View className="w-full mt-4" style={{ gap: 8 }}>
              <Text className="text-base font-headline font-bold text-raices-text">Nombre del Evento</Text>
              <RNTextInput
                style={{
                  backgroundColor: '#E5E5E5',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: '#1F1B15',
                }}
                placeholder="Ej: Medicamento Presión"
                placeholderTextColor="#8A8A8A"
                autoCapitalize="sentences"
                autoCorrect
                value={title}
                onChangeText={setTitle}
                editable={!isSaving}
              />
            </View>

            {/* DATE */}
            <View className="w-full mt-4" style={{ gap: 8 }}>
              <Text className="text-base font-headline font-bold text-raices-text">Fecha</Text>
              {Platform.OS === 'web' ? (
                <View style={fieldBoxStyle}>
                  <WebDateInput value={toLocalISODate(eventDate)} onChange={onDateFromWeb} />
                </View>
              ) : (
                <Pressable onPress={() => showMode('date')} style={fieldBoxStyle}>
                  <Text className="text-base font-body text-raices-text">
                    {formatDate(eventDate)}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* TIME */}
            <View className="w-full mt-4" style={{ gap: 8 }}>
              <Text className="text-base font-headline font-bold text-raices-text">Hora</Text>
              {Platform.OS === 'web' ? (
                <View style={[fieldBoxStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1 }}>
                    <WebTimeInput value={toLocalISOTime(eventDate)} onChange={onTimeFromWeb} />
                  </View>
                  <IconSymbol name="calendar" size={20} color="#325F3F" />
                </View>
              ) : (
                <Pressable
                  onPress={() => showMode('time')}
                  style={[fieldBoxStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                >
                  <Text className="text-base font-body text-raices-text">
                    {formatTime(eventDate)}
                  </Text>
                  <IconSymbol name="calendar" size={20} color="#325F3F" />
                </Pressable>
              )}
            </View>

            {/* CATEGORY */}
            <View className="w-full mt-4" style={{ gap: 8 }}>
              <Text className="text-base font-headline font-bold text-raices-text">Categoría</Text>
              <View className="w-full flex-row" style={{ gap: 10 }}>
                {CATEGORIES.map(cat => {
                  const isActive = cat.id === category;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      className="flex-1 items-center justify-center"
                      style={{
                        backgroundColor: isActive ? '#E8EFE5' : '#E5E5E5',
                        borderRadius: 10,
                        borderWidth: isActive ? 2 : 0,
                        borderColor: isActive ? '#325F3F' : 'transparent',
                        paddingVertical: 12,
                        gap: 4,
                      }}
                    >
                      <IconSymbol
                        name={cat.icon}
                        size={22}
                        color={isActive ? '#325F3F' : '#1F1B15'}
                      />
                      <Text
                        className="font-headline font-semibold"
                        style={{ fontSize: 11, color: isActive ? '#325F3F' : '#1F1B15' }}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* AUDIO RECORDING (Only shown if event doesn't already have audio, or if we want to allow replacing) */}
            {!event?.audio_url && (
              <View
                className="w-full items-center mt-5"
                style={{
                  backgroundColor: '#E8EFE5',
                  borderRadius: 16,
                  paddingVertical: 22,
                  paddingHorizontal: 16,
                  gap: 12,
                }}
              >
                <View className="items-center justify-center" style={{ width: buttonSize * 1.3, height: buttonSize * 1.3 }}>
                  {isRecording ? (
                    <Animated.View
                      className="absolute rounded-full bg-raices-error/30"
                      style={[{ width: buttonSize, height: buttonSize }, pulseStyle]}
                    />
                  ) : null}

                  <Pressable
                    onPress={handleMicPress}
                    disabled={isSaving}
                    className="rounded-full items-center justify-center"
                    style={{
                      width: buttonSize,
                      height: buttonSize,
                      backgroundColor: micButtonColor,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      elevation: 6,
                      opacity: isSaving ? 0.6 : 1,
                    }}
                  >
                    <IconSymbol
                      name={isRecording ? 'stop.fill' : recordedAudioUri ? 'checkmark' : 'mic.fill'}
                      size={iconSize}
                      color="#FFFFFF"
                    />
                  </Pressable>
                </View>

                <Text
                  className="font-headline font-bold text-center"
                  style={{ color: '#325F3F', fontSize: 18 }}
                >
                  Graba un recordatorio
                </Text>
                <Text
                  className="font-body text-center"
                  style={{ color: 'rgba(50, 95, 63, 0.6)', fontSize: 13, lineHeight: 18 }}
                >
                  Puedes dejar un mensaje de voz o instrucciones detalladas sobre el evento.
                </Text>

                <View className="items-center" style={{ minHeight: 18 }}>
                  {isRecording ? (
                    <Pressable onPress={handleCancelRecording}>
                      <Text className="text-sm font-headline font-semibold text-raices-error">Cancelar grabación</Text>
                    </Pressable>
                  ) : recordedAudioUri ? (
                    <View className="flex-row items-center" style={{ gap: 10 }}>
                      <Text className="text-xs font-body text-raices-secondary font-semibold">Audio grabado</Text>
                      <Pressable onPress={handleDeleteAudio}>
                        <Text className="text-xs font-headline font-semibold text-raices-error">Eliminar</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              </View>
            )}

            {/* SAVE BUTTON */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving || isRecording}
              className="w-full flex-row items-center justify-center mt-6"
              style={{
                backgroundColor: '#325F3F',
                borderRadius: 14,
                paddingVertical: 16,
                gap: 10,
                opacity: (isSaving || isRecording) ? 0.5 : 1,
              }}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
                  <Text className="text-white font-headline font-bold text-base">Guardar Cambios</Text>
                </>
              )}
            </Pressable>

            {/* CANCEL */}
            <Pressable
              onPress={onClose}
              disabled={isSaving || isRecording}
              className="w-full items-center mt-3"
              style={{ opacity: (isSaving || isRecording) ? 0.4 : 1, paddingVertical: 8 }}
            >
              <Text className="text-sm font-headline font-semibold text-raices-text-muted">Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
