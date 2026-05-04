import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { privacyApi, type PrivacyRecord } from '../api/privacy-api';

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
  save: () => Promise<void>;
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

  useEffect(() => {
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
  }, [sessionToken]);

  const save = useCallback(async () => {
    if (!sessionToken || !user) return;

    setSaving(true);
    setError(null);

    try {
      const payload = { isMoodShared, isActivityShared, isHealthShared };

      if (record) {
        const { data } = await privacyApi.update(sessionToken, record.id, payload);
        setRecord(data);
      } else {
        const { data } = await privacyApi.create(sessionToken, { profileId: user.id, ...payload });
        setRecord(data);
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
