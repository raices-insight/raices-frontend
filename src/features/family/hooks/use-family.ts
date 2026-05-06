import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/core/api/client';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import {
  CreateFamilyPayloadSchema,
  type CreateFamilyPayload,
  CreateFamilyResponseSchema,
  type CreateFamilyResponse,
  GetFamilyResponseSchema,
  type GetFamilyResponse,
  RegenerateCodeResponseSchema,
  type RegenerateCodeResponse,
} from '../api/schemas';
import { getFamilyState, setFamilyState, subscribe } from '../state/family-state';

export interface UseFamily {
  family: GetFamilyResponse | null;
  isFamily: boolean;
  loading: boolean;
  error: string | null;
}

export function useFamily(): UseFamily {
  const [family, setFamily] = useState<GetFamilyResponse | null>(
    getFamilyState,
  );
  const [loading, setLoading] = useState<boolean>(
    getFamilyState() === null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Si ya hay estado poblado (p.ej. desde useCreateFamily), no re-fetchear
    if (getFamilyState() !== null) {
      setLoading(false);
      return;
    }

    const fetchFamily = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.get<GetFamilyResponse>(
          '/family/my-family',
        );

        if (cancelled) return;

        const validation = GetFamilyResponseSchema.safeParse(data);
        if (!validation.success) {
          logger.error(
            'Respuesta inesperada al obtener familia',
            validation.error,
          );
          setError('Error al procesar la información de la familia');
          setLoading(false);
          return;
        }

        setFamilyState(validation.data);
      } catch (err: unknown) {
        if (cancelled) return;
        // 404 u otro error → el usuario no tiene familia, es esperado
        const message =
          err instanceof Error ? err.message : 'Error al consultar familia';
        logger.info('No se encontró familia para el usuario', err);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchFamily();

    // Suscribirse a cambios externos (p.ej. useCreateFamily)
    const unsubscribe = subscribe(() => {
      setFamily(getFamilyState());
      setError(null);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return {
    family,
    isFamily: family !== null,
    loading,
    error,
  };
}

export function useCreateFamily() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFamily = useCallback(
    async (payload: CreateFamilyPayload): Promise<CreateFamilyResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const validation = CreateFamilyPayloadSchema.safeParse(payload);
        if (!validation.success) {
          const msg = validation.error.errors[0]?.message || 'Datos inválidos';
          setError(msg);
          toast.error(msg);
          return null;
        }

        const { data } = await apiClient.post<CreateFamilyResponse>(
          '/family',
          validation.data,
        );

        const responseValidation = CreateFamilyResponseSchema.safeParse(data);
        if (!responseValidation.success) {
          logger.error(
            'Respuesta inesperada del servidor al crear familia',
            responseValidation.error,
          );
          toast.error('Error al procesar la respuesta del servidor');
          setError('Respuesta inesperada del servidor');
          return null;
        }

        // Persistir en el estado compartido para que useFamily reaccione
        setFamilyState(responseValidation.data);

        toast.success(
          `Familia "${responseValidation.data.name}" creada exitosamente`,
        );
        return responseValidation.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al crear la familia';
        logger.error('Error al crear familia', err);
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
    createFamily,
    loading,
    error,
  };
}

export function useRegenerateCode() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regenerateCode = useCallback(
    async (familyId: string): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.post<RegenerateCodeResponse>(
          `/family/${familyId}/regenerate-code`,
        );

        const validation = RegenerateCodeResponseSchema.safeParse(data);
        if (!validation.success) {
          logger.error(
            'Respuesta inesperada al regenerar código',
            validation.error,
          );
          toast.error('Error al procesar la respuesta del servidor');
          setError('Respuesta inesperada del servidor');
          return null;
        }

        toast.success('Código de invitación regenerado exitosamente');
        return validation.data.invitationCode;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al regenerar el código';
        logger.error('Error al regenerar código de invitación', err);
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
    regenerateCode,
    loading,
    error,
  };
}

export function useDeleteFamily() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFamily = useCallback(
    async (familyId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(`/family/${familyId}`);

        // Limpia el estado global de la familia
        setFamilyState(null);

        toast.success('Familia eliminada exitosamente');
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al eliminar la familia';
        logger.error('Error al eliminar la familia', err);
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    deleteFamily,
    loading,
    error,
  };
}
