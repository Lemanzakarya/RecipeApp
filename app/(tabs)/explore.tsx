import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  UIManager,
  View,
} from "react-native";

import { RequestState } from "@/components/RequestState";
import RecipeCard from "@/components/RecipeCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fetchRecipes, type Recipe } from "@/lib/recipes";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExploreScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const inputBg = useThemeColor({ light: "#f3f4f6", dark: "#1f2937" }, "background");
  const textColor = useThemeColor({}, "text");
  const cardBorder = useThemeColor({ light: "#e5e7eb", dark: "#374151" }, "icon");

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecipes(await fetchRecipes());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  const addIngredient = () => {
    const values = ingredientInput
      .split(/[,;\n]+/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIngredients((current) => {
      const next = [...current];
      const seen = new Set(current.map((item) => item.toLocaleLowerCase()));
      values.forEach((value) => {
        const normalized = value.toLocaleLowerCase();
        if (!seen.has(normalized)) {
          next.push(value);
          seen.add(normalized);
        }
      });
      return next;
    });
    setIngredientInput("");
  };

  const removeIngredient = (ingredient: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIngredients((current) => current.filter((item) => item !== ingredient));
  };

  const filteredData = useMemo(() => {
    if (selectedIngredients.length === 0) {
      return recipes.map((recipe) => ({ recipe, matchedIngredients: [] as string[] }));
    }

    return recipes
      .map((recipe) => {
        const available = recipe.ingredients.map((ingredient) => ingredient.toLowerCase());
        const matchedIngredients = selectedIngredients.filter((selected) =>
          available.some((ingredient) => {
            const term = selected.toLocaleLowerCase();
            const singular = term.endsWith("ies")
              ? `${term.slice(0, -3)}y`
              : term.endsWith("es")
                ? term.slice(0, -2)
                : term.endsWith("s") && !term.endsWith("ss")
                  ? term.slice(0, -1)
                  : term;
            return ingredient.includes(term) || ingredient.includes(singular);
          })
        );
        return { recipe, matchedIngredients };
      })
      .filter((item) => item.matchedIngredients.length > 0)
      .sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length);
  }, [recipes, selectedIngredients]);

  const handleSurpriseMe = () => {
    if (filteredData.length === 0) return;
    const random = filteredData[Math.floor(Math.random() * filteredData.length)];
    router.push(`/recipe/${random.recipe.id}`);
  };

  if (loading || error) {
    return (
      <RequestState
        loading={loading}
        message={error ?? undefined}
        onRetry={error ? loadRecipes : undefined}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Find recipes by ingredients</ThemedText>
        <ThemedText style={styles.subtitle}>
          Add what you have. Recipes with the most matches appear first.
        </ThemedText>

        <View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
          <IconSymbol name="magnifyingglass" size={20} color={iconColor} />
          <TextInput
            accessibilityLabel="Ingredient to search"
            placeholder="Add an ingredient (e.g. eggs)"
            placeholderTextColor={iconColor}
            style={[styles.input, { color: textColor }]}
            value={ingredientInput}
            onChangeText={setIngredientInput}
            onSubmitEditing={addIngredient}
            returnKeyType="done"
          />
          {ingredientInput.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Add ingredient" onPress={addIngredient}>
              <IconSymbol name="plus.circle.fill" size={24} color={tintColor} />
            </Pressable>
          )}
        </View>
        <ThemedText style={styles.inputHint}>
          Press Enter after each ingredient, or separate several with commas.
        </ThemedText>

        <Pressable
          style={[styles.surpriseBtn, { backgroundColor: tintColor }, filteredData.length === 0 && styles.disabled]}
          onPress={handleSurpriseMe}
          disabled={filteredData.length === 0}
          accessibilityRole="button"
        >
          <IconSymbol name="shuffle" size={20} color="#fff" />
          <ThemedText style={styles.surpriseBtnText}>Choose a random match</ThemedText>
        </Pressable>

        <View style={styles.chipsHeader}>
          <View style={styles.chipsContainer}>
            {selectedIngredients.map((ingredient) => (
            <Pressable
              key={ingredient}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${ingredient}`}
              style={[styles.chip, { backgroundColor: inputBg, borderColor: cardBorder }]}
              onPress={() => removeIngredient(ingredient)}
            >
              <ThemedText style={styles.chipText}>{ingredient}</ThemedText>
              <IconSymbol name="xmark" size={12} color={iconColor} />
            </Pressable>
            ))}
          </View>
          {selectedIngredients.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all ingredients"
              onPress={() => setSelectedIngredients([])}
            >
              <ThemedText style={[styles.clearButton, { color: tintColor }]}>Clear all</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <ThemedText type="subtitle">
            {selectedIngredients.length > 0 ? `${filteredData.length} ${filteredData.length === 1 ? "recipe" : "recipes"} found` : "All recipes"}
          </ThemedText>
        </View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.recipe.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              {selectedIngredients.length > 0 && (
                <View style={[styles.matchInfo, { backgroundColor: tintColor + "15" }]}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color={tintColor} />
                  <ThemedText style={[styles.matchText, { color: tintColor }]}>
                    Matches {item.matchedIngredients.length} of {selectedIngredients.length} ingredients: {item.matchedIngredients.join(", ")}
                  </ThemedText>
                </View>
              )}
              <RecipeCard item={item.recipe} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <RequestState
              title="No recipes found"
              message="Try another ingredient or remove one of your selected ingredients."
            />
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  subtitle: { opacity: 0.7, marginBottom: 12 },
  inputHint: { opacity: 0.65, fontSize: 12, marginTop: -4, marginBottom: 12 },
  chipsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  clearButton: { fontSize: 13, fontWeight: "600", paddingVertical: 6 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 16, height: "100%" },
  surpriseBtn: {
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: { opacity: 0.45 },
  surpriseBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, minHeight: 32 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: "500" },
  resultsContainer: { flex: 1 },
  resultsHeader: { paddingHorizontal: 16, paddingBottom: 8 },
  listContent: { flexGrow: 1, paddingBottom: 40 },
  cardWrapper: { marginBottom: 8 },
  matchInfo: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginBottom: -8, paddingHorizontal: 12, paddingVertical: 6, borderTopLeftRadius: 12, borderTopRightRadius: 12, gap: 6 },
  matchText: { fontSize: 12, fontWeight: "600" },
});
