import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import { View, Text } from '@/core/ui/tw';
import type { FamilyMember } from '@/features/family/api/schemas';

interface OlderAdultChipSelectorProps {
  olderAdults: FamilyMember[];
  selected: FamilyMember | null;
  onSelect: (adult: FamilyMember) => void;
}

/**
 * Horizontal chip row that lets the caregiver switch between older adults
 * belonging to the same family. Hidden when 0 or 1 adult is present.
 */
export function OlderAdultChipSelector({
  olderAdults,
  selected,
  onSelect,
}: OlderAdultChipSelectorProps) {
  if (olderAdults.length <= 1) return null;

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, flexDirection: 'row' }}
      >
        {olderAdults.map((adult) => {
          const isSelected = selected?.id === adult.id;
          return (
            <Pressable
              key={adult.id}
              onPress={() => onSelect(adult)}
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${
                isSelected
                  ? 'bg-raices-primary border-raices-primary'
                  : 'bg-white border-raices-secondary/30'
              }`}
            >
              {/* Avatar initials */}
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  isSelected ? 'bg-white/20' : 'bg-raices-primary/10'
                }`}
              >
                <Text
                  className={`text-[10px] font-headline font-bold ${
                    isSelected ? 'text-white' : 'text-raices-primary'
                  }`}
                >
                  {adult.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text
                className={`font-body font-semibold text-sm ${
                  isSelected ? 'text-white' : 'text-raices-text'
                }`}
              >
                {adult.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
