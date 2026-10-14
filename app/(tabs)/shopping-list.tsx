import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useShoppingList } from "@/providers/ShoppingListProvider";

export default function ShoppingListScreen() {
  const { items, toggleItem, removeItem, clearChecked } = useShoppingList();
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({ light: "#e5e7eb", dark: "#374151" }, "icon");
  const checkedCount = items.filter((item) => item.checked).length;
  const remainingCount = items.length - checkedCount;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Shopping List</ThemedText>
          <ThemedText style={styles.subtitle}>
            {remainingCount} {remainingCount === 1 ? "item" : "items"} left
          </ThemedText>
        </View>
        {checkedCount > 0 && (
          <Pressable accessibilityRole="button" onPress={clearChecked}>
            <ThemedText style={[styles.clearButton, { color: tint }]}>
              Clear checked
            </ThemedText>
          </Pressable>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length === 0 ? styles.emptyContent : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="cart.fill" size={42} color={tint} />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              Your list is empty
            </ThemedText>
            <ThemedText style={styles.emptyCopy}>
              Add ingredients from a recipe and they’ll show up here.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { borderBottomColor: border }]}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
              accessibilityLabel={item.name}
              onPress={() => toggleItem(item.id)}
              style={styles.itemButton}
            >
              <IconSymbol
                name={item.checked ? "checkmark.circle.fill" : "circle"}
                size={23}
                color={item.checked ? tint : border}
              />
              <View style={styles.itemText}>
                <ThemedText style={[styles.itemName, item.checked && styles.checkedText]}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.sourceText} numberOfLines={1}>
                  From {item.recipes.join(", ")}
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name}`}
              onPress={() => removeItem(item.id)}
              hitSlop={8}
              style={styles.removeButton}
            >
              <IconSymbol name="xmark" size={18} color={border} />
            </Pressable>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: { marginTop: 4, opacity: 0.65 },
  clearButton: { fontSize: 14, fontWeight: "600" },
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  emptyContent: { flexGrow: 1, justifyContent: "center" },
  emptyState: { alignItems: "center", padding: 28 },
  emptyTitle: { marginTop: 16, textAlign: "center" },
  emptyCopy: { marginTop: 8, opacity: 0.65, textAlign: "center", lineHeight: 22 },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemButton: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  itemText: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600" },
  checkedText: { opacity: 0.5, textDecorationLine: "line-through" },
  sourceText: { marginTop: 3, fontSize: 12, opacity: 0.55 },
  removeButton: { padding: 10, marginLeft: 6 },
});
