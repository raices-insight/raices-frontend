import { useState } from 'react';
import { Image, Text as RNText, View } from 'react-native';

interface UserAvatarProps {
  name: string | null;
  photo: string | null;
  size?: number;
}

const PRIMARY = '#325F3F';

export function UserAvatar({ name, photo, size = 40 }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const circle = { width: size, height: size, borderRadius: size / 2 };

  if (photo && !imgError) {
    return (
      <View style={[circle, { overflow: 'hidden', backgroundColor: PRIMARY }]}>
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      </View>
    );
  }

  return (
    <View style={[circle, { backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' }]}>
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
