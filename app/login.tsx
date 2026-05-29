import { View } from '@/core/ui/tw';
import { LoginScreen } from '@/features/auth/components/LoginScreen';
import { LocalLoginScreen } from '@/features/auth/components/LocalLoginScreen';
import { useAuth } from '@/features/auth/context/auth-context';
import { ToastRenderer } from '@/core/toast/toast-renderer';

const LOGIN_MODE = process.env.EXPO_PUBLIC_LOGIN_MODE;

export default function LoginRoute() {
  const {
    loading,
    error,
    signIn,
    localEmail,
    localPassword,
    onLocalEmailChange,
    onLocalPasswordChange,
    localSignIn,
  } = useAuth();

  return (
    <View className="flex-1 bg-raices-bg">
      {LOGIN_MODE === 'LOCAL_DEVELOPMENT' ? (
        <LocalLoginScreen
          loading={loading}
          error={error}
          onSignIn={signIn}
          onLocalSignIn={localSignIn}
          email={localEmail}
          password={localPassword}
          onEmailChange={onLocalEmailChange}
          onPasswordChange={onLocalPasswordChange}
        />
      ) : (
        <LoginScreen
          loading={loading}
          error={error}
          onSignIn={signIn}
        />
      )}
      <ToastRenderer />
    </View>
  );
}
