import { useMemo } from 'react';
import type { FamilyMember } from '../api/schemas';
import { useFamily, useFamilyDetails } from './use-family';

interface UseFamilyOlderAdultsReturn {
  olderAdults: FamilyMember[];
  loading: boolean;
  error: string | null;
  familyId: string | null;
  refetch: () => void;
}

export function useFamilyOlderAdults(): UseFamilyOlderAdultsReturn {
  const { family, loading: familyLoading } = useFamily();
  const familyId = family?.id ?? null;
  const { members, loading: detailsLoading, error, refetch } = useFamilyDetails(familyId ?? undefined);

  const olderAdults = useMemo(
    () => members.filter((m) => m.userRole === 'older_adult'),
    [members],
  );

  return {
    olderAdults,
    loading: familyLoading || detailsLoading,
    error,
    familyId,
    refetch,
  };
}
