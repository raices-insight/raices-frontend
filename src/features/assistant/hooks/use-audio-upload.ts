import { useState, useCallback } from 'react';
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import { apiClient } from '@/core/api/client';
import { UploadTicketSchema, NotifyUploadResponseSchema } from '@/features/assistant/api/schemas';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import { Platform } from 'react-native';

export type UploadStatus = 'idle' | 'recording' | 'processing' | 'uploading' | 'success' | 'error';

export function useAudioUpload() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== 'granted') {
        toast.error('Se requiere permiso para usar el micrófono.');
        setError('Se requiere permiso para usar el micrófono.');
        return;
      }

      setStatus('recording');
      
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      logger.error('Failed to start recording', err);
      toast.error('No se pudo iniciar la grabación.');
      setError('No se pudo iniciar la grabación.');
      setStatus('idle');
    }
  }, [audioRecorder]);

  const stopAndUpload = useCallback(async (profileId: string, role: string) => {
    try {
      setStatus('processing');
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        throw new Error('No se pudo obtener el archivo de audio.');
      }

      // 1. Get Pre-Signed URL
      logger.info('Fetching upload URL', { mimeType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mpeg' });
      const ticketResponse = await apiClient.get('/assistant/upload-url', {
        params: { mimeType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mpeg' }
      });
      
      // Validate the response with Zod (parse-use-safeparse)
      const ticketResult = UploadTicketSchema.safeParse(ticketResponse.data);
      if (!ticketResult.success) {
        throw new Error(`Respuesta inesperada del servidor: ${ticketResult.error.issues[0]?.message}`);
      }
      logger.info('Upload ticket received', { audioProfileId: ticketResult.data.audioProfileId });
      const ticket = ticketResult.data;

      setStatus('uploading');

      // 2. Upload directly to S3/MinIO
      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const uploadResult = await fetch(ticket.uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Error al subir el archivo al servidor de almacenamiento.');
      }

      logger.info('Audio file uploaded to storage successfully');

      // 3. Notify Gateway
      setStatus('processing');
      const notifyResponse = await apiClient.post('/assistant/audio/notify', {
        profileId,
        role,
        audioProfileId: ticket.audioProfileId,
      });

      // Validate the notification response (parse-use-safeparse)
      const notifyResult = NotifyUploadResponseSchema.safeParse(notifyResponse.data);
      if (!notifyResult.success) {
        throw new Error(`Respuesta de notificación inválida: ${notifyResult.error.issues[0]?.message}`);
      }

      logger.info('Audio response submitted successfully', { audioProfileId: ticket.audioProfileId });
      toast.success('¡Respuesta enviada con éxito!');
      setStatus('success');
      
      // Reset back to idle after a moment
      setTimeout(() => setStatus('idle'), 3000);
      
      return ticket.audioProfileId;

    } catch (err) {
      logger.error('Upload flow failed', err);
      const message = err instanceof Error ? err.message : 'Error inesperado durante la subida.';
      toast.error(message);
      setError(message);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }, [audioRecorder]);

  const cancelRecording = useCallback(async () => {
    try {
      await audioRecorder.stop();
      setStatus('idle');
    } catch (err) {
      logger.warn('Failed to cancel recording', err);
    }
  }, [audioRecorder]);

  return {
    status,
    error,
    startRecording,
    stopAndUpload,
    cancelRecording,
    isRecording: status === 'recording',
  };
}
