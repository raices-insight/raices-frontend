import { setFamilyState } from '@/features/family/state/family-state';

/**
 * Resets every module-level state store on sign-out.
 * When adding a new module-level store, add its reset here to prevent
 * data leaking between user sessions.
 */
export function clearAppState(): void {
  setFamilyState(null);
}
