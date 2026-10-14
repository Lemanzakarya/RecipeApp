import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type Props = {
  loading?: boolean;
  message?: string;
  title?: string;
  onRetry?: () => void;
};

export function RequestState({ loading = false, message, title, onRetry }: Props) {
  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>
            {title ?? (message ? "Something went wrong" : "No recipes found")}
          </ThemedText>
          <ThemedText style={styles.message}>
            {message ?? "Try changing your filters or search terms."}
          </ThemedText>
          {onRetry && (
            <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
              <ThemedText style={styles.buttonText}>Try again</ThemedText>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  content: { alignItems: "center", gap: 12, maxWidth: 320 },
  title: { textAlign: "center" },
  message: { textAlign: "center", opacity: 0.7, lineHeight: 22 },
  button: { marginTop: 4, backgroundColor: "#0a7ea4", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
