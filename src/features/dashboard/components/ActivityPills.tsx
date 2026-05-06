import React from 'react';
import { View, Text } from '@/core/ui/tw';

interface ActivityPillsProps {
  activities: string[];
}

export function ActivityPills({ activities }: ActivityPillsProps) {
  if (!activities || activities.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
      {activities.map((activity, index) => (
        <View 
          key={index} 
          className="px-3 py-1 rounded-full bg-white/40 border border-black/10 shadow-sm"
        >
          <Text className="font-body text-xs font-semibold text-black/80 capitalize">
            {activity.replace('_', ' ')}
          </Text>
        </View>
      ))}
    </View>
  );
}
