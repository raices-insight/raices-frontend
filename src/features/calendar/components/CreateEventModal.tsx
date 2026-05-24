import { Text, View, Pressable } from "@/src/core/ui/tw";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { Modal, TextInput as RNTextInput, ViewStyle, ActivityIndicator } from "react-native";
import { EventDTO } from "../dto/dto";
import { useAudioUpload } from "@/src/features/assistant/hooks/use-audio-upload";
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, cancelAnimation } from 'react-native-reanimated';
import { Animated } from '@/src/core/ui/animated';
import { IconSymbol } from '@/src/core/ui/icon-symbol';
import { useToast } from '@/src/core/toast/use-toast';
import { logger } from '@/src/core/logger';
import { apiClient } from '@/src/core/api/client';

interface CreateEventModalProps {
    selectedDate: Date;
    visible: boolean;
    addEvent: (event: EventDTO) => void;
    onClose: () => void;
}

const STATIC_CALENDAR_ID = "primary";

export function CreateEventModal({ selectedDate, visible, addEvent, onClose }: CreateEventModalProps) {
    const normalButtonStyle: ViewStyle = { flexShrink: 3, backgroundColor: "#325F3F", margin: 6, padding: 8, alignItems: "center", justifyContent: "center", borderRadius: 10 };
    
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(selectedDate);
    const [endDate, setEndDate] = useState<Date>(selectedDate);
    const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
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

    useEffect(() => {
        setStartDate(selectedDate);
        setEndDate(selectedDate);
        setName("");
        setRecordedAudioUri(null); // Reset when modal opens/closes
    }, [selectedDate, visible]);

    const showMode = (currentMode: any, date: Date, setDate: (date: Date) => void) => {
        DateTimePickerAndroid.open({
            value: date,
            onValueChange: (event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
            },
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showStartDatePicker = () => showMode('date', startDate, setStartDate);
    const showStartTimePicker = () => showMode('time', startDate, setStartDate);
    const showEndDatePicker = () => showMode('date', endDate, setEndDate);
    const showEndTimePicker = () => showMode('time', endDate, setEndDate);
    
    const onNameChange = (nameInput: string) => setName(nameInput);

    const handleMicPress = async () => {
        if (isRecording) {
            const uri = await stopRecording();
            if (uri) {
                setRecordedAudioUri(uri);
            }
        } else {
            setRecordedAudioUri(null);
            await startRecording();
        }
    };

    const handleCancelRecording = async () => {
        await cancelRecording();
    };

    const handleDeleteAudio = () => {
        setRecordedAudioUri(null);
    };

    const onSend = async () => {
        if (!name.trim()) {
            toast.error("Por favor, ingresa el nombre del evento.");
            return;
        }

        try {
            setIsSaving(true);
            let finalAudioProfileId: string | undefined = undefined;

            if (recordedAudioUri) {
                // S3 upload + Notify Gateway
                finalAudioProfileId = await uploadAudio(recordedAudioUri);
            }

            const jsonBody = {
                calendarId: STATIC_CALENDAR_ID,
                name,
                startDatetime: startDate.toISOString(),
                endDatetime: endDate.toISOString(),
                audioProfileId: finalAudioProfileId,
            };

            logger.info("Creating event with audio status", { hasAudio: !!finalAudioProfileId });
            const response = await apiClient.post('/calendar/date', jsonBody);

            const evData = response.data;
            addEvent(
                new EventDTO(
                    evData.eventId || evData.id || "new-event",
                    name,
                    startDate,
                    endDate
                )
            );

            toast.success("¡Evento creado con éxito!");
            setName("");
            setRecordedAudioUri(null);
            onClose();
        } catch (err) {
            logger.error("Failed to create calendar event", err);
            toast.error("Error al crear el evento.");
        } finally {
            setIsSaving(false);
        }
    };

    // UI helper states
    const buttonSize = 72;
    const iconSize = 24;

    const micButtonColor = isRecording ? '#C0392B' : recordedAudioUri ? '#53815F' : '#325F3F';

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View className="flex-1 justify-center items-center px-6 bg-black/50">
                {/* Modal box */}
                <View className="w-full bg-raices-surface rounded-3xl p-5 justify-center items-center shadow-lg elevation-5" style={{ gap: 14 }}>
                    <Text className="text-2xl font-headline font-bold text-raices-text mb-2">Crear evento</Text>
                    
                    <View className="w-full" style={{ gap: 6 }}>
                        <Text className="text-sm font-headline font-semibold text-raices-text-muted">Nombre del evento</Text>
                        <RNTextInput
                            style={{
                                width: '100%',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 16,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1,
                                borderColor: 'rgba(50, 95, 63, 0.3)',
                                fontSize: 16,
                                color: '#1F1B15',
                            }}
                            placeholder="Ej. Tomar medicamentos"
                            placeholderTextColor="#A0978A"
                            autoCapitalize="sentences"
                            autoCorrect={true}
                            value={name}
                            onChangeText={onNameChange}
                            editable={!isSaving}
                        />
                    </View>

                    {/* DATES */}
                    <View className="w-full flex-row justify-between items-center bg-raices-bg p-3 rounded-2xl">
                        <View style={{ flex: 1 }}>
                            <Text className="text-xs font-headline font-semibold text-raices-text-muted uppercase tracking-wider">Inicio</Text>
                            <Text className="text-sm font-body text-raices-text mt-1">
                                {startDate.getDate()}/{startDate.getMonth() + 1}/{startDate.getFullYear()} a las {startDate.getHours().toString().padStart(2, '0')}:{startDate.getMinutes().toString().padStart(2, '0')}
                            </Text>
                        </View>
                        <View className="flex-row" style={{ gap: 6 }}>
                            <Pressable onPress={showStartDatePicker} style={normalButtonStyle}>
                                <Text className="font-headline font-semibold text-xs text-white">Fecha</Text>
                            </Pressable>
                            <Pressable onPress={showStartTimePicker} style={normalButtonStyle}>
                                <Text className="font-headline font-semibold text-xs text-white">Hora</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View className="w-full flex-row justify-between items-center bg-raices-bg p-3 rounded-2xl">
                        <View style={{ flex: 1 }}>
                            <Text className="text-xs font-headline font-semibold text-raices-text-muted uppercase tracking-wider">Término</Text>
                            <Text className="text-sm font-body text-raices-text mt-1">
                                {endDate.getDate()}/{endDate.getMonth() + 1}/{endDate.getFullYear()} a las {endDate.getHours().toString().padStart(2, '0')}:{endDate.getMinutes().toString().padStart(2, '0')}
                            </Text>
                        </View>
                        <View className="flex-row" style={{ gap: 6 }}>
                            <Pressable onPress={showEndDatePicker} style={normalButtonStyle}>
                                <Text className="font-headline font-semibold text-xs text-white">Fecha</Text>
                            </Pressable>
                            <Pressable onPress={showEndTimePicker} style={normalButtonStyle}>
                                <Text className="font-headline font-semibold text-xs text-white">Hora</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* AUDIO RECORDING SECTION */}
                    <View className="w-full items-center py-2 bg-raices-bg rounded-2xl" style={{ gap: 8 }}>
                        <Text className="text-xs font-headline font-semibold text-raices-text-muted uppercase tracking-wider">Nota de voz asociada</Text>
                        
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
                                    borderWidth: 4,
                                    borderColor: 'rgba(255,255,255,0.4)',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 8,
                                    elevation: 4,
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

                        {/* Status descriptions & Action links */}
                        <View className="items-center" style={{ height: 24 }}>
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
                            ) : (
                                <Text className="text-xs font-body text-raices-text-muted">Presiona para grabar audio</Text>
                            )}
                        </View>
                    </View>

                    {/* MODAL ACTIONS */}
                    <View className="flex-row justify-center mt-2" style={{ gap: 12 }}>
                        <Pressable
                            onPress={onClose}
                            disabled={isSaving || isRecording}
                            className="px-6 py-3 rounded-xl bg-zinc-200 active:bg-zinc-300"
                            style={{ opacity: (isSaving || isRecording) ? 0.5 : 1 }}
                        >
                            <Text className="text-zinc-800 font-headline font-bold text-base">Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={onSend}
                            disabled={isSaving || isRecording}
                            className="px-6 py-3 rounded-xl bg-raices-primary active:opacity-90 flex-row items-center justify-center"
                            style={{ minWidth: 120, backgroundColor: "#325F3F", opacity: (isSaving || isRecording) ? 0.5 : 1 }}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text className="text-white font-headline font-bold text-base">Agregar</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
