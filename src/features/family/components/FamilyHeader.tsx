import { View, Text, StyleSheet, Image } from "react-native";
import { IconSymbol } from "@/core/ui/icon-symbol";

interface FamilyHeaderProps {
  imageUrl?: string | null;
  familyName?: string | null;
}

export function FamilyHeader({ imageUrl, familyName }: FamilyHeaderProps) {
  const initial = familyName
    ? familyName.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : "F";

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}
        <View style={styles.heartBadge}>
          <IconSymbol name="heart.fill" size={16} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.title}>Mi Familia</Text>
      <Text style={styles.subtitle}>
        Gestiona los miembros de tu hogar y comparte momentos seguros.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  avatarWrapper: {
    position: "relative",
    width: 112,
    height: 112,
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    backgroundColor: "#D9E2C7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 42,
    color: "#325F3F",
  },
  heartBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#53815F",
    borderWidth: 3,
    borderColor: "#F0F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 28,
    fontWeight: "800",
    color: "#1F1B15",
    textAlign: "center",
    marginTop: 4,
  },
  subtitle: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 15,
    color: "#474747",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
