import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export function Loading() {
  const color = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={color} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
