import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeMins: number;
  servings: number;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Desserts";
  tags: string[];
  image?: any; // require(..) or uri
};

export default function RecipeCard({ item }: { item: Recipe }) {
  const card = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  const diffColor =
    item.difficulty === "Easy"
      ? "#16a34a"
      : item.difficulty === "Medium"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <ThemedView style={[styles.card, { backgroundColor: card }]}>
      <View style={styles.row}>
        <View style={styles.thumbWrap}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.thumb}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={[styles.badge, { backgroundColor: diffColor }]}>
            <ThemedText style={styles.badgeText}>{item.difficulty}</ThemedText>
          </View>
        </View>
        <View style={styles.info}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText
            style={[styles.desc, { color: text, opacity: 0.8 }]}
            numberOfLines={2}
          >
            {item.description}
          </ThemedText>
          <View style={styles.metaRow}>
            <ThemedText style={styles.meta}>{`${item.timeMins}m`}</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.meta}>{`${item.servings}`}</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.meta}>{item.meal}</ThemedText>
          </View>
          <View style={styles.tagsRow}>
            {item.tags?.slice(0, 3).map((t) => (
              <View key={t} style={styles.tag}>
                <ThemedText style={styles.tagText}>{t}</ThemedText>
              </View>
            ))}
            {item.tags?.length > 3 && (
              <View style={styles.tag}>
                <ThemedText style={styles.tagText}>{`+${
                  item.tags.length - 3
                }`}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  row: { flexDirection: "row" },
  thumbWrap: { marginRight: 12 },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  thumbPlaceholder: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  badge: {
    position: "absolute",
    top: -6,
    left: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  info: { flex: 1 },
  title: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  desc: { fontSize: 13, marginBottom: 6 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  meta: { fontSize: 12, opacity: 0.85 },
  dot: { marginHorizontal: 2, opacity: 0.5 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: "#374151" },
});
