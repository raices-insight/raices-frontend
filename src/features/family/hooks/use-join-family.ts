import { useState, useCallback } from 'react';
import { apiClient } from '@/core/api/client';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import {
  JoinFamilyPayloadSchema,
  type JoinFamilyPayload,
  JoinFamilyResponseSchema,
  type JoinFamilyResponse,
} from '../api/schemas';
import { setFamilyState } from '../state/family-state';

export function useJoinFamily() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinFamily = useCallback(
    async (payload: JoinFamilyPayload): Promise<JoinFamilyResponse | null> => {
      setLoading(true);
      setError(null);

      try {
				await apiClient.post("family/join", payload);

        const { data } = await apiClient.post<JoinFamilyResponse>(
          '/family/join',
          payload,
        );

        const responseValidation = JoinFamilyResponseSchema.safeParse(data);
        if (!responseValidation.success) {
          logger.error(
            'Respuesta inesperada del servidor al unirse a familia',
            responseValidation.error,
          );
          toast.error('Error al procesar la respuesta del servidor');
          setError('Respuesta inesperada del servidor');
          return null;
        }

        // Actualiza el estado global para reflejar que ahora se pertenece a una familia
        setFamilyState(responseValidation.data);

        toast.success(`Te has unido a la familia "${responseValidation.data.name}"`);
        return responseValidation.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al unirse a la familia';
        logger.error('Error en joinFamily', err);
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    joinFamily,
    loading,
    error,
  };
}
