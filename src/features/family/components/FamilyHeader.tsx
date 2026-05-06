import { View, Text, StyleSheet } from 'react-native';

export function FamilyHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Familia</Text>
      <Text style={styles.subtitle}>
        Gestiona los miembros de tu hogar y comparte momentos seguros.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  title: {
    fontFamily: 'BeVietnamPro-ExtraBold',
    fontSize: 30,
    color: '#1F1B15',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: '#474747',
    textAlign: 'center',
  },
});
