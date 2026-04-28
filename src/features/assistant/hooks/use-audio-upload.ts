import { useState, useCallback } from 'react';
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import { apiClient } from '@/core/api/client';
import { UploadTicketSchema, NotifyUploadResponseSchema } from '@/features/assistant/api/schemas';
import { Platform } from 'react-native';

export type UploadStatus = 'idle' | 'recording' | 'processing' | 'uploading' | 'success' | 'error';

export function useAudioUpload() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== 'granted') {
        setError('Se requiere permiso para usar el micrófono.');
        return;
      }

      setStatus('recording');
      
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      console.error('Failed to start recording', err);
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
      const ticketResponse = await apiClient.get('/assistant/upload-url', {
        params: { mimeType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mpeg' }
      });
      
      // Validate the response with Zod
      const ticket = UploadTicketSchema.parse(ticketResponse.data);

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

      // 3. Notify Gateway
      setStatus('processing');
      const notifyResponse = await apiClient.post('/assistant/audio/notify', {
        profileId,
        role,
        audioProfileId: ticket.audioProfileId,
      });

      // Validate the notification response
      NotifyUploadResponseSchema.parse(notifyResponse.data);

      setStatus('success');
      
      // Reset back to idle after a moment
      setTimeout(() => setStatus('idle'), 3000);
      
      return ticket.audioProfileId;

    } catch (err) {
      console.error('Upload flow failed:', err);
      setError(err instanceof Error ? err.message : 'Error inesperado durante la subida.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }, [audioRecorder]);

  const cancelRecording = useCallback(async () => {
    try {
      await audioRecorder.stop();
      setStatus('idle');
    } catch (err) {
      console.error('Failed to cancel recording', err);
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
