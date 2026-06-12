import { Modal, Linking, StyleSheet } from "react-native";
import { View, Text } from "@/core/ui/tw";
import { Button } from "@/core/ui/button";
import { IconSymbol } from "@/core/ui/icon-symbol";

interface LocationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called when user taps "Ahora no" — use to revert the sharing toggle */
  onDismiss?: () => void;
}

export function LocationPermissionModal({ visible, onClose, onDismiss }: LocationPermissionModalProps) {
  const handleDismiss = () => {
    onDismiss?.();
    onClose();
  };

  const handleOpenSettings = () => {
    void Linking.openSettings();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <IconSymbol name="location.slash.fill" size={48} color="#325F3F" />

          <Text style={styles.title}>Ubicación desactivada</Text>
          <Text style={styles.body}>
            Para compartir tu ubicación con tu familia, necesitas activar el
            acceso a la ubicación desde los ajustes de tu celular.
          </Text>

          <View style={styles.buttons}>
            <Button
              label="Ahora no"
              variant="outline"
              onPress={handleDismiss}
              style={{ flex: 1 }}
            />
            <Button
              label="Ir a Ajustes"
              variant="primary"
              onPress={handleOpenSettings}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  card: {
    margin: 24,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    color: "#1a1a1a",
  },
  body: {
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    textAlign: "center",
    color: "#474747",
    lineHeight: 24,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
});
