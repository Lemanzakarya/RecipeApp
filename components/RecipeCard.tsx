import ImageWithFallback from "@/components/figma/ImageWithFallback";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

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
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const diffColor =
    item.difficulty === "Easy"
      ? "#16a34a"
      : item.difficulty === "Medium"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <Link href={`/recipe/${item.id}`} asChild>
      <TouchableOpacity activeOpacity={0.9}>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: card, borderColor: (icon as string) + "33" },
          ]}
        >
          <View style={styles.imageContainer}>
            <ImageWithFallback
              uri={
                typeof item.image === "string"
                  ? item.image
                  : item.image?.uri ?? undefined
              }
              width="100%"
              height={200}
              borderRadius={0}
            />
            <View style={[styles.badge, { backgroundColor: diffColor }]}>
              <ThemedText style={styles.badgeText}>
                {item.difficulty}
              </ThemedText>
            </View>
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText
              style={[styles.desc, { color: text, opacity: 0.8 }]}
              numberOfLines={2}
            >
              {item.description}
            </ThemedText>
            <View style={styles.metaRow}>
              <ThemedText
                style={[styles.meta, { color: icon }]}
              >{`${item.timeMins}m`}</ThemedText>
              <ThemedText style={[styles.dot, { color: icon }]}>•</ThemedText>
              <ThemedText
                style={[styles.meta, { color: icon }]}
              >{`${item.servings}`}</ThemedText>
              <ThemedText style={[styles.dot, { color: icon }]}>•</ThemedText>
              <ThemedText style={[styles.meta, { color: icon }]}>
                {item.meal}
              </ThemedText>
            </View>
            <View style={styles.tagsRow}>
              {item.tags?.slice(0, 3).map((t) => (
                <View
                  key={t}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: "rgba(99,102,241,0.12)",
                      borderColor: (tint as string) + "33",
                    },
                  ]}
                >
                  <ThemedText style={[styles.tagText, { color: tint }]}>
                    {t}
                  </ThemedText>
                </View>
              ))}
              {item.tags?.length > 3 && (
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: "rgba(99,102,241,0.12)",
                      borderColor: (tint as string) + "33",
                    },
                  ]}
                >
                  <ThemedText style={[styles.tagText, { color: tint }]}>{`+${
                    item.tags.length - 3
                  }`}</ThemedText>
                </View>
              )}
            </View>
          </View>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12, // Moved to right for better aesthetics on large image
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  content: {
    padding: 12,
  },
  title: { fontWeight: "700", fontSize: 18, marginBottom: 4 }, // Increased font size slightly
  desc: { fontSize: 14, marginBottom: 8 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  meta: { fontSize: 12, opacity: 0.95 },
  dot: { marginHorizontal: 2, opacity: 0.6 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: { fontSize: 11 },
});
