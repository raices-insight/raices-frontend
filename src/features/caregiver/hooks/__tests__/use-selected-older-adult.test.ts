/**
 * useSelectedOlderAdult
 * Manages which older adult the caregiver is currently viewing on the home screen.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useSelectedOlderAdult } from '../use-selected-older-adult';
import type { FamilyMember } from '@/features/family/api/schemas';

const makeAdult = (id: string, name: string): FamilyMember => ({
  id,
  profileId: `profile-${id}`,
  role: 'MEMBER',
  userRole: 'older_adult',
  name,
});

describe('useSelectedOlderAdult', () => {
  it('returns null selected adult when the list is empty', () => {
    const { result } = renderHook(() => useSelectedOlderAdult([]));
    expect(result.current.selected).toBeNull();
  });

  it('defaults to the first older adult in the list', () => {
    const adults = [makeAdult('1', 'María'), makeAdult('2', 'José')];
    const { result } = renderHook(() => useSelectedOlderAdult(adults));
    expect(result.current.selected?.id).toBe('1');
  });

  it('allows selecting a different older adult', () => {
    const adults = [makeAdult('1', 'María'), makeAdult('2', 'José')];
    const { result } = renderHook(() => useSelectedOlderAdult(adults));

    act(() => {
      result.current.selectOlderAdult(adults[1]);
    });

    expect(result.current.selected?.id).toBe('2');
  });

  it('resets to first adult when list changes and previous selection no longer exists', () => {
    const initial = [makeAdult('1', 'María'), makeAdult('2', 'José')];
    const { result, rerender } = renderHook(
      ({ list }) => useSelectedOlderAdult(list),
      { initialProps: { list: initial } },
    );

    act(() => {
      result.current.selectOlderAdult(initial[1]); // select José
    });
    expect(result.current.selected?.id).toBe('2');

    // new list without José
    rerender({ list: [makeAdult('3', 'Clara')] });
    expect(result.current.selected?.id).toBe('3');
  });
});
