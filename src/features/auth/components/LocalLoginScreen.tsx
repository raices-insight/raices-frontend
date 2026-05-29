import { router, type Href } from 'expo-router';
import { ActivityIndicator, TextInput as RNTextInput, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from '@/core/ui/image';
import { Pressable, Text, View } from '@/core/ui/tw';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';

const TERMS_ROUTE = '/terms' as Href;
const PRIVACY_ROUTE = '/privacy' as Href;

interface LocalLoginScreenProps {
  loading: boolean;
  error: string | null;
  onSignIn: () => void;
  onLocalSignIn: () => void;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LocalLoginScreen({
  loading,
  error,
  onSignIn,
  onLocalSignIn,
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: LocalLoginScreenProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length > 0;
  const isButtonDisabled = loading || !isFormValid;

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1, backgroundColor: '#FFF6EB' }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32, overflow: 'hidden' }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
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

      {/* Local Login Form */}
      <View className="mt-10 w-full max-w-[360px] gap-3">
        <RNTextInput
          style={{
            width: '100%',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: 'rgba(255,237,213,0.2)',
            fontSize: 16,
            color: '#1F1B15',
          }}
          placeholder="Correo electrónico"
          placeholderTextColor="#A0978A"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={onEmailChange}
          editable={!loading}
        />
        <View className="relative w-full">
          <RNTextInput
            style={{
              width: '100%',
              paddingVertical: 16,
              paddingHorizontal: 20,
              paddingRight: 50,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: 'rgba(255,237,213,0.2)',
              fontSize: 16,
              color: '#1F1B15',
            }}
            placeholder="Contraseña"
            placeholderTextColor="#A0978A"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={onPasswordChange}
            editable={!loading}
          />
          <Pressable
            className="absolute right-0 h-full px-4 justify-center"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#A0978A"
            />
          </Pressable>
        </View>
        <Pressable
          className={`py-4 px-8 rounded-full items-center justify-center w-full bg-raices-secondary shadow-md elevation-3 ${isButtonDisabled ? 'opacity-50' : ''}`}
          onPress={onLocalSignIn}
          disabled={isButtonDisabled}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-headline font-bold text-white text-lg">
              Iniciar sesión
            </Text>
          )}
        </Pressable>
      </View>

      {/* Divider */}
      <View className="mt-6 w-full max-w-[360px] flex-row items-center gap-3">
        <View className="flex-1 h-px bg-raices-text-muted/20" />
        <Text className="font-body text-sm text-raices-text-muted">o continúa con</Text>
        <View className="flex-1 h-px bg-raices-text-muted/20" />
      </View>

      {/* Google Sign-In */}
      <View className="mt-6 w-full max-w-[360px]">
        <Pressable
          className={`py-4 px-8 rounded-full items-center justify-center flex-row gap-4 w-full bg-raices-surface border-2 border-orange-100/20 shadow-md elevation-3 ${loading ? 'opacity-50' : ''}`}
          onPress={onSignIn}
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
      </View>

      {error && (
        <Text className="text-raices-error text-center mt-4 max-w-[340px]">
          {error}
        </Text>
      )}

      {/* Legal */}
      <View className="mt-10 max-w-[280px] flex-row flex-wrap justify-center">
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
    </KeyboardAwareScrollView>
  );
}
