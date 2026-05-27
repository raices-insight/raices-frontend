/**
 * OlderAdultChipSelector
 * A horizontal row of chips, one per older adult. The active chip is highlighted.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { OlderAdultChipSelector } from '../OlderAdultChipSelector';
import type { FamilyMember } from '@/features/family/api/schemas';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

const makeAdult = (id: string, name: string): FamilyMember => ({
  id,
  profileId: `profile-${id}`,
  role: 'MEMBER',
  userRole: 'older_adult',
  name,
});

describe('OlderAdultChipSelector', () => {
  const adults = [makeAdult('1', 'María'), makeAdult('2', 'José')];

  it('renders a chip for each older adult', () => {
    render(
      <OlderAdultChipSelector
        olderAdults={adults}
        selected={adults[0]}
        onSelect={jest.fn()}
      />,
    );

    expect(screen.getByText('María')).toBeOnTheScreen();
    expect(screen.getByText('José')).toBeOnTheScreen();
  });

  it('calls onSelect with the correct adult when a chip is pressed', () => {
    const onSelect = jest.fn();
    render(
      <OlderAdultChipSelector
        olderAdults={adults}
        selected={adults[0]}
        onSelect={onSelect}
      />,
    );

    fireEvent.press(screen.getByText('José'));

    expect(onSelect).toHaveBeenCalledWith(adults[1]);
  });

  it('does not render when the list is empty', () => {
    const { toJSON } = render(
      <OlderAdultChipSelector
        olderAdults={[]}
        selected={null}
        onSelect={jest.fn()}
      />,
    );
    expect(toJSON()).toBeNull();
  });

  it('does not render when there is only one older adult', () => {
    const { toJSON } = render(
      <OlderAdultChipSelector
        olderAdults={[adults[0]]}
        selected={adults[0]}
        onSelect={jest.fn()}
      />,
    );
    expect(toJSON()).toBeNull();
  });
});
