import { Image } from '@/core/ui/image';
import { Pressable, Text, View } from '@/core/ui/tw';
import { router, type Href } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

const TERMS_ROUTE = '/terms' as Href;
const PRIVACY_ROUTE = '/privacy' as Href;

interface LoginScreenProps {
  loading: boolean;
  error: string | null;
  onSignIn: () => void;
}

export function LoginScreen({ loading, error, onSignIn }: LoginScreenProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onPressIn = () => { scale.value = withTiming(0.96, { duration: 80 }); };
  const onPressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };

  return (
    <View className="flex-1 px-6 py-8 justify-center items-center overflow-hidden bg-raices-bg">
      {/* Decorative Blobs */}
      <View className="absolute -top-[120px] -right-[110px] w-[300px] h-[300px] rounded-full bg-raices-secondary/10" />
      <View className="absolute -bottom-[120px] -left-[120px] w-[280px] h-[280px] rounded-full bg-raices-secondary/5" />

      {/* Logo */}
      <View className="w-[195px] h-[195px] rounded-full bg-raices-bg items-center justify-center border border-raices-secondary/10 shadow-sm elevation-2">
        <Image
          source={require('@/assets/images/raices-login-logo.png')}
          className="w-[167px] h-[166px] rounded-full"
          contentFit="cover"
        />
      </View>

      {/* Branding */}
      <View className="mt-8 items-center gap-4">
        <Text className="font-headline font-bold text-[72px] leading-[84px] text-raices-secondary text-center tracking-tight">
          Raíces
        </Text>
        <Text className="font-body text-2xl leading-[30px] text-center text-raices-text-muted max-w-[300px]">
          Cuidando el bienestar de los que{`\n`}más quieres
        </Text>
      </View>

      {/* Action */}
      <View className="mt-16 w-full max-w-[360px]">
        <Animated.View style={animStyle}>
        <Pressable
          className={`py-4 px-8 rounded-full items-center justify-center flex-row gap-4 w-full bg-raices-surface border-2 border-orange-100/20 shadow-md elevation-3 ${loading ? 'opacity-50' : ''}`}
          onPress={onSignIn}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1F1B15" />
          ) : (
            <>
              <Image
                source={require('@/assets/images/google-g-logo.png')}
                className="w-[22px] h-[22px]"
                contentFit="contain"
              />
              <Text className="font-headline font-bold text-raices-text text-lg">
                Iniciar sesión con Google
              </Text>
            </>
          )}
        </Pressable>
        </Animated.View>
      </View>

      {error && (
        <Text className="text-raices-error text-center mt-4 max-w-[340px]">
          {error}
        </Text>
      )}

      {/* Legal */}
      <View className="mt-12 max-w-[280px] flex-row flex-wrap justify-center">
        <Text className="font-headline font-medium text-[#777777] text-[11px] leading-[18px] text-center">
          Al continuar, aceptas nuestros{' '}
        </Text>
        <Pressable onPress={() => router.push(TERMS_ROUTE)}>
          <Text className="font-headline font-bold text-[#225031] text-[11px] leading-[18px] text-center">
            Términos de Servicio
          </Text>
        </Pressable>
        <Text className="font-headline font-medium text-[#777777] text-[11px] leading-[18px] text-center">
          {' '}y{' '}
        </Text>
        <Pressable onPress={() => router.push(PRIVACY_ROUTE)}>
          <Text className="font-headline font-bold text-[#225031] text-[11px] leading-[18px] text-center">
            Política de Privacidad
          </Text>
        </Pressable>
        <Text className="font-headline font-medium text-[#777777] text-[11px] leading-[18px] text-center">
          .
        </Text>
      </View>
    </View>
  );
}
