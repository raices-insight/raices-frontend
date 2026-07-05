import { Switch } from 'react-native';
import { View, Text } from '@/core/ui/tw';
import { IconSymbol } from '@/core/ui/icon-symbol';

interface PrivacyToggleCardProps {
  icon: 'heart.fill' | 'figure.walk' | 'face.smiling';
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export function PrivacyToggleCard({ icon, title, description, value, onToggle }: PrivacyToggleCardProps) {
  return (
    <View
      className="rounded-2xl p-7 w-full"
      style={{ backgroundColor: 'rgba(188, 239, 197, 0.4)' }}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <IconSymbol name={icon} size={26} color="#325F3F" />
        <Text className="text-2xl font-headline font-bold text-raices-text">
          {title}
        </Text>
      </View>
      <Text className="font-body text-lg leading-7 mb-5" style={{ color: '#544438' }}>
        {description}
      </Text>
      <Switch
        testID={`privacy-toggle-${title}-${value ? 'on' : 'off'}`}
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: '#325F3F' }}
        thumbColor="#ffffff"
      />
    </View>
  );
}
