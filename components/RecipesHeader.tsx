import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeController } from "@/providers/ThemeProvider";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  onDifficultyChange: (d: "All" | "Easy" | "Medium" | "Hard") => void;
};

export default function RecipesHeader({
  query,
  onQueryChange,
  difficulty,
  onDifficultyChange,
}: Props) {
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const icon = useThemeColor({}, "icon");
  const { colorScheme, toggle } = useThemeController();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Recipes</ThemedText>
        <View style={styles.iconRow}>
          <Pressable
            accessibilityRole="button"
            onPress={toggle}
            style={styles.iconBtn}
          >
            <IconSymbol
              name={colorScheme === "dark" ? "sun.max.fill" : "moon.fill"}
              color={text}
              size={22}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.search,
          { backgroundColor: background, borderColor: "#e5e7eb" },
        ]}
      >
        <IconSymbol name="magnifyingglass" color={icon} size={18} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search recipes..."
          placeholderTextColor={icon as string}
          style={[styles.input, { color: text }]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.chipsRow}>
        {(["All", "Easy", "Medium", "Hard"] as const).map((opt) => {
          const active = opt === difficulty;
          return (
            <Pressable
              key={opt}
              onPress={() => onDifficultyChange(opt)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <ThemedText
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {opt}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconRow: { flexDirection: "row" },
  iconBtn: { padding: 8 },
  search: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 16 },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: "#0a7ea4", borderColor: "#0a7ea4" },
  chipText: { fontSize: 14 },
  chipTextActive: { color: "#fff", fontWeight: "700" },
});
