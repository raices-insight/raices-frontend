import { useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { View, ScrollView, Text } from "@/core/ui/tw";
import { Animated } from "@/core/ui/animated";
import { Button } from "@/core/ui/button";
import { OlderAdultHeader } from "./OlderAdultHeader";
import { PrivacyToggleCard } from "./PrivacyToggleCard";
import { useAuth } from "@/features/auth/context/auth-context";
import { usePrivacy } from "../hooks/use-privacy";
import { useToast } from "@/core/toast/use-toast";

export function OlderAdultProfileScreen() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const {
    isMoodShared,
    setIsMoodShared,
    isActivityShared,
    setIsActivityShared,
    isHealthShared,
    setIsHealthShared,
    loading,
    save,
  } = usePrivacy();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const screenStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      opacity.value = withTiming(1, { duration: 350 });
      translateY.value = withTiming(0, { duration: 350 });
      return () => {
        opacity.value = 0;
        translateY.value = 20;
      };
    }, [opacity, translateY])
  );

  const handleToggle = async (
    setter: (v: boolean) => void,
    field: "isMoodShared" | "isActivityShared" | "isHealthShared",
    value: boolean,
  ) => {
    setter(value);
    try {
      await save({ [field]: value });
      toast.success("Preferencia guardada");
    } catch {
      setter(!value);
      toast.error("No se pudo guardar. Intenta de nuevo.");
    }
  };

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <Animated.View className="flex-1 bg-raices-bg" style={screenStyle}>
      <OlderAdultHeader user={user} onProfilePress={handleSignOut} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-10 gap-5">
          {/* Title */}
          <View className="gap-3">
            <Text
              className="text-5xl font-headline font-bold text-raices-primary"
              style={{ lineHeight: 52 }}
            >
              Mi Privacidad
            </Text>
            <Text
              className="font-body text-lg leading-7"
              style={{ color: "#544438" }}
            >
              Controla qué información compartes con tus seres queridos para que
              se sientan tranquilos.
            </Text>
          </View>

          {/* Privacy toggles */}
          {loading && <ActivityIndicator size="large" color="#325F3F" />}
          <PrivacyToggleCard
            icon="heart.fill"
            title="Compartir Ánimo"
            description="Permite que tus hijos y seres queridos sepan como te sientes hoy emocionalmente."
            value={isMoodShared}
            onToggle={(v) => { void handleToggle(setIsMoodShared, "isMoodShared", v); }}
          />
          <PrivacyToggleCard
            icon="figure.walk"
            title="Compartir Actividad"
            description="Tus familiares podrán ver tus paseos y si estás en casa descansando."
            value={isActivityShared}
            onToggle={(v) => { void handleToggle(setIsActivityShared, "isActivityShared", v); }}
          />
          <PrivacyToggleCard
            icon="face.smiling"
            title="Compartir Salud"
            description="Permite que tus seres queridos estén al tanto de tu salud."
            value={isHealthShared}
            onToggle={(v) => { void handleToggle(setIsHealthShared, "isHealthShared", v); }}
          />

          {/* Info card */}
          <View
            className="rounded-2xl px-8 py-10 gap-1"
            style={{ backgroundColor: "#d8e6a6" }}
          >
            <Text
              className="font-headline font-bold text-xl"
              style={{ color: "#5c6834" }}
            >
              Privacidad Segura
            </Text>
            <Text
              className="font-body text-base leading-6"
              style={{ color: "#5c6834" }}
            >
              Tus datos están protegidos y solo las personas que tú elijas
              podrán verlos. Puedes cambiar esto cuando quieras.
            </Text>
          </View>

          {/* Sign out */}
          <Button label="Cerrar sesión" variant="danger" fullWidth onPress={handleSignOut} />
        </View>
      </ScrollView>
    </Animated.View>
  );
}
