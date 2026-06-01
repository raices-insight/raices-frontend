import { useState, useEffect } from 'react';
import type { FamilyMember } from '@/features/family/api/schemas';

interface UseSelectedOlderAdultReturn {
  selected: FamilyMember | null;
  selectOlderAdult: (adult: FamilyMember) => void;
}

/**
 * Tracks which older adult the caregiver is currently viewing.
 * Defaults to the first adult in the list. Resets to the first adult
 * if the list changes and the previous selection is no longer present.
 */
export function useSelectedOlderAdult(
  olderAdults: FamilyMember[],
): UseSelectedOlderAdultReturn {
  const [selected, setSelected] = useState<FamilyMember | null>(
    olderAdults[0] ?? null,
  );

  // Sync when the list changes: keep selection if still present, else reset.
  useEffect(() => {
    if (olderAdults.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => {
      const stillExists = prev && olderAdults.some((a) => a.id === prev.id);
      return stillExists ? prev : olderAdults[0];
    });
  }, [olderAdults]);

  return { selected, selectOlderAdult: setSelected };
}
