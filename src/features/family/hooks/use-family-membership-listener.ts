import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/core/websocket/websocket-provider';
import { setFamilyState, getFamilyState } from '../state/family-state';
import { stopTrackingLocation } from '@/features/location/services/tracking.service';
import { useToast } from '@/core/toast/use-toast';
import { logger } from '@/core/logger';

/**
 * Listens for server-side family membership changes that affect the current user.
 * Specifically handles being expelled by an admin: stops location tracking,
 * clears family state, and shows a toast — without requiring the user to take action.
 *
 * Mount once at the app root (inside WebSocketProvider and AuthProvider).
 */
export function useFamilyMembershipListener() {
  const { subscribe } = useWebSocket();
  const toast = useToast();
  const toastRef = useRef(toast);
  useEffect(() => { toastRef.current = toast; }, [toast]);

  useEffect(() => {
    return subscribe('family.member.expelled', ({ familyId }) => {
      const currentFamily = getFamilyState();
      if (currentFamily?.id !== familyId) return;

      logger.info(`[FamilyMembership] Expelled from family ${familyId} — cleaning up`);

      setFamilyState(null);
      void stopTrackingLocation().catch((e) =>
        logger.warn('[FamilyMembership] Could not stop location tracking', e),
      );
      toastRef.current.error('Has sido expulsado de la familia');
    });
  }, [subscribe]);
}
