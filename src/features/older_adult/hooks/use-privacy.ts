import { useAuth } from '@/features/auth/context/auth-context';
import { apiClient } from '@/src/core/api/client';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { stopTrackingLocation } from '../../location/services/tracking.service';
import { privacyApi, type PrivacyRecord } from '../api/privacy-api';

type PrivacyOverrides = {
  isMoodShared?: boolean;
  isActivityShared?: boolean;
  isHealthShared?: boolean;
};

interface UsePrivacyReturn {
  isMoodShared: boolean;
  isActivityShared: boolean;
  isHealthShared: boolean;
  setIsMoodShared: (v: boolean) => void;
  setIsActivityShared: (v: boolean) => void;
  setIsHealthShared: (v: boolean) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  save: (overrides?: PrivacyOverrides) => Promise<void>;
}

export function usePrivacy(): UsePrivacyReturn {
  const { user, sessionToken } = useAuth();

  const [record, setRecord] = useState<PrivacyRecord | null>(null);
  const [isMoodShared, setIsMoodShared] = useState(true);
  const [isActivityShared, setIsActivityShared] = useState(true);
  const [isHealthShared, setIsHealthShared] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      let cancelled = false;

      const fetchPrivacy = async () => {
        try {
          const { data } = await privacyApi.getMyPrivacy(sessionToken);
          if (cancelled) return;

          if (data.length > 0) {
            const r = data[0];
            setRecord(r);
            setIsMoodShared(r.isMoodShared);
            setIsActivityShared(r.isActivityShared);
            setIsHealthShared(r.isHealthShared);
          }
        } catch {
          if (!cancelled) setError('No se pudieron cargar tus preferencias de privacidad.');
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void fetchPrivacy();

      return () => {
        cancelled = true;
      };
    }, [sessionToken]),
  );

  const save = useCallback(async (overrides?: PrivacyOverrides) => {
    if (!sessionToken || !user) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        isMoodShared: overrides?.isMoodShared ?? isMoodShared,
        isActivityShared: overrides?.isActivityShared ?? isActivityShared,
        isHealthShared: overrides?.isHealthShared ?? isHealthShared,
      };

      if (record) {
        const { data } = await privacyApi.update(sessionToken, record.id, payload);
        setRecord(data);
      } else {
        const { data } = await privacyApi.create(sessionToken, { profileId: user.id, ...payload });
        setRecord(data);
      }

      if (overrides?.isActivityShared??isActivityShared==false){
        console.log("stopping location task and zeroing coordinates")
        stopTrackingLocation();

        let coords = {
          latitude: 0,
          longitude: 0,
        };
        await apiClient.post("/location", coords)
        console.log("done.")
      }
    } catch (e) {
      setError('No se pudieron guardar tus preferencias. Intenta de nuevo.');
      throw e;
    } finally {
      setSaving(false);
    }
  }, [sessionToken, user, record, isMoodShared, isActivityShared, isHealthShared]);

  return {
    isMoodShared,
    isActivityShared,
    isHealthShared,
    setIsMoodShared,
    setIsActivityShared,
    setIsHealthShared,
    loading,
    saving,
    error,
    save,
  };
}
