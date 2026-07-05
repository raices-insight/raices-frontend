import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { apiClient } from '@/core/api/client';
import type { PrivacyRecord } from '../api/privacy-api';

interface UsePrivacyForProfileReturn {
  privacy: PrivacyRecord | null;
  isActivityShared: boolean;
  isMoodShared: boolean;
  isHealthShared: boolean;
  loading: boolean;
  error: string | null;
}

export function usePrivacyForProfile(profileId: string | null | undefined): UsePrivacyForProfileReturn {
  const [privacy, setPrivacy] = useState<PrivacyRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(!!profileId);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profileId) {
        setPrivacy(null);
        setLoading(false);
        return;
      }

      let cancelled = false;
      setLoading(true);
      setError(null);

      const fetchPrivacy = async () => {
        try {
          const { data } = await apiClient.get<PrivacyRecord | PrivacyRecord[]>(
            `/privacy/profile/${profileId}`,
          );
          if (cancelled) return;
          const record = Array.isArray(data) ? (data[0] ?? null) : data ?? null;
          setPrivacy(record);
        } catch (e: any) {
          if (cancelled) return;
          setPrivacy(null);
          setError(e?.message ?? 'No se pudo cargar la configuración de privacidad.');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void fetchPrivacy();
      return () => {
        cancelled = true;
      };
    }, [profileId]),
  );

  return {
    privacy,
    isActivityShared: privacy?.isActivityShared ?? false,
    isMoodShared: privacy?.isMoodShared ?? false,
    isHealthShared: privacy?.isHealthShared ?? false,
    loading,
    error,
  };
}
