import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export type Category = {
  key: string;
  label: string;
  count?: number;
};

type Props = {
  categories: Category[];
  value?: string;
  onChange?: (key: string) => void;
};

export default function CategoryTabs({ categories, value, onChange }: Props) {
  const [internal, setInternal] = useState(value ?? categories[0]?.key);
  const current = value ?? internal;
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");

  const items = useMemo(() => categories, [categories]);

  const handlePress = (key: string) => {
    setInternal(key);
    onChange?.(key);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((c) => {
          const active = c.key === current;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => handlePress(c.key)}
              activeOpacity={0.8}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? tint : background,
                  borderColor: active ? tint : "rgba(148,163,184,0.35)",
                },
              ]}
            >
              <View style={styles.row}>
                <ThemedText
                  style={[styles.pillText, { color: active ? "#fff" : text }]}
                >
                  {c.label}
                </ThemedText>
                {typeof c.count === "number" && (
                  <ThemedText
                    style={[
                      styles.pillCount,
                      { color: active ? "#fff" : text },
                    ]}
                  >
                    {` (${c.count})`}
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  pill: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  pillText: { fontWeight: "600" },
  pillCount: { opacity: 0.8 },
});
