import { Image, Text as RNText } from 'react-native';
import { View } from '@/core/ui/tw';

interface UserAvatarProps {
  name: string | null;
  photo: string | null;
  size?: number;
}

export function UserAvatar({ name, photo, size = 40 }: UserAvatarProps) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const style = { width: size, height: size, borderRadius: size / 2 };

  if (photo) {
    return (
      <Image
        source={{ uri: photo }}
        style={style}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={style}
      className="bg-raices-primary items-center justify-center"
    >
      <RNText
        style={{
          fontSize: size * 0.4,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          includeFontPadding: false,
          textAlignVertical: 'center',
        }}
      >
        {initial}
      </RNText>
    </View>
  );
}
