import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { apiClient } from '@/core/api/client';
import { logger } from '@/core/logger';
import { useToast } from '@/core/toast/use-toast';
import { useAuth } from '@/features/auth/context/auth-context';
import {
  CreateFamilyPayloadSchema,
  type CreateFamilyPayload,
  CreateFamilyResponseSchema,
  type CreateFamilyResponse,
  GetFamilyResponseSchema,
  type GetFamilyResponse,
  FamilyDetailsResponseSchema,
  type FamilyDetailsResponse,
  type FamilyMember,
  RegenerateCodeResponseSchema,
  type RegenerateCodeResponse,
  type UpdateMemberRolePayload,
  type ExpulseMemberPayload,
} from '../api/schemas';
import { getFamilyState, setFamilyState, subscribe } from '../state/family-state';

export interface UseFamily {
  family: GetFamilyResponse | null;
  isFamily: boolean;
  loading: boolean;
  error: string | null;
}

export function useFamily(): UseFamily {
  const [family, setFamily] = useState<GetFamilyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(
    getFamilyState() === null,
  );
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      logger.debug('[useFamily] Focus gained: checking family state');
      let cancelled = false;

    if (getFamilyState() !== null) {
      setFamily(getFamilyState());
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
        const message =
          err instanceof Error ? err.message : 'Error al consultar familia';
        logger.info('No se encontró familia para el usuario', err);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchFamily();

    const unsubscribe = subscribe(() => {
      const state = getFamilyState();
      setFamily(state);
      setError(null);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
    }, [])
  );

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

        setFamilyState({
          ...responseValidation.data,
          invitationCode: '',
          imageUrl: null,
          createdAt: new Date().toISOString(),
          members: [],
        });

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

export function useFamilyDetails(familyId: string | undefined) {
  const { user } = useAuth();
  const [details, setDetails] = useState<FamilyDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!familyId) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<FamilyDetailsResponse>(
        `/family/${familyId}/details`,
      );

      const validation = FamilyDetailsResponseSchema.safeParse(data);
      if (!validation.success) {
        logger.error(
          'Respuesta inesperada al obtener detalles de familia',
          validation.error,
        );
        setError('Error al procesar los detalles de la familia');
        return;
      }

      setDetails(validation.data);
      setFamilyState(validation.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al obtener detalles de la familia';
      logger.error('Error al obtener detalles de familia', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useFocusEffect(
    useCallback(() => {
      logger.debug(`[useFamilyDetails] Focus gained: fetching details for ${familyId}`);
      void fetchDetails();
    }, [fetchDetails])
  );

  return {
    details,
    members: details?.members ?? [],
    loading,
    error,
    refetch: fetchDetails,
    isAdmin: details
      ? details.members.some(
          (m: FamilyMember) =>
            m.profileId === user?.id && m.role === 'ADMINISTRATOR',
        )
      : false,
    currentMember: details
      ? details.members.find((m: FamilyMember) => m.profileId === user?.id) ?? null
      : null,
  };
}

export function useUpdateMemberRole() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRole = useCallback(
    async (
      familyId: string,
      payload: UpdateMemberRolePayload,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.patch(`/family/${familyId}/member-role`, payload);

        toast.success('Rol actualizado exitosamente');
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al actualizar el rol';
        logger.error('Error al actualizar rol de miembro', err);
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
    updateRole,
    loading,
    error,
  };
}

export function useExpulseMember() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expulse = useCallback(
    async (
      familyId: string,
      payload: ExpulseMemberPayload,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.post(`/family/${familyId}/expulse`, payload);

        toast.success('Miembro expulsado exitosamente');
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al expulsar al miembro';
        logger.error('Error al expulsar miembro', err);
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
    expulse,
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
