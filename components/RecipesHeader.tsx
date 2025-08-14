import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeController } from "@/providers/ThemeProvider";

type Props = {
  difficulty?: "All" | "Easy" | "Medium" | "Hard";
  onDifficultyChange?: (d: "All" | "Easy" | "Medium" | "Hard") => void;
};

export default function RecipesHeader({
  difficulty = "All",
  onDifficultyChange,
}: Props) {
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const { colorScheme, toggle } = useThemeController();
  const [open, setOpen] = useState(false);
  const options = useMemo(() => ["All", "Easy", "Medium", "Hard"] as const, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Recipes</ThemedText>
        <View style={styles.iconRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setOpen(true)}
            style={styles.iconBtn}
          >
            <IconSymbol name="chevron.right" color={text} size={22} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={toggle}
            style={styles.iconBtn}
          >
            <IconSymbol
              name="chevron.left.forwardslash.chevron.right"
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
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor={(text as string) + "80"}
          style={[styles.input, { color: text }]}
        />
      </View>

      <Pressable style={styles.filterBtn} onPress={() => setOpen(true)}>
        <ThemedText style={styles.filterText}>Filters</ThemedText>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <ThemedView style={styles.sheet}>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Filter by difficulty
          </ThemedText>
          <View style={{ gap: 8 }}>
            {options.map((opt) => {
              const active = opt === difficulty;
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onDifficultyChange?.(opt);
                    setOpen(false);
                  }}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      active && styles.optionTextActive,
                    ]}
                  >
                    {opt}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ThemedView>
      </Modal>
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
    paddingVertical: 10,
  },
  input: { fontSize: 16 },
  filterBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: { fontWeight: "600" },
  backdrop: {
    position: "absolute",
    inset: 0 as any,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 120,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  option: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionActive: { backgroundColor: "#0a7ea4", borderColor: "#0a7ea4" },
  optionText: { fontSize: 16 },
  optionTextActive: { color: "#fff", fontWeight: "700" },
});
