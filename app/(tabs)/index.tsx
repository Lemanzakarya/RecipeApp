import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CategoryTabs, { type Category } from "@/components/CategoryTabs";
import RecipeCard, { type Recipe } from "@/components/RecipeCard";
import RecipesHeader from "@/components/RecipesHeader";
import { RequestState } from "@/components/RequestState";
import { ThemedView } from "@/components/ThemedView";
import { fetchRecipes } from "@/lib/recipes";

export default function HomeScreen() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const categories: Category[] = useMemo(() => {
    const counts = {
      all: recipes.length,
      breakfast: recipes.filter((recipe) => recipe.meal === "Breakfast").length,
      lunch: recipes.filter((recipe) => recipe.meal === "Lunch").length,
      dinner: recipes.filter((recipe) => recipe.meal === "Dinner").length,
      desserts: recipes.filter((recipe) => recipe.meal === "Desserts").length,
    };
    return [
      { key: "all", label: "All", count: counts.all },
      { key: "breakfast", label: "Breakfast", count: counts.breakfast },
      { key: "lunch", label: "Lunch", count: counts.lunch },
      { key: "dinner", label: "Dinner", count: counts.dinner },
      { key: "desserts", label: "Desserts", count: counts.desserts },
    ];
  }, [recipes]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return recipes
      .filter((recipe) => category === "all" || recipe.meal.toLowerCase() === category)
      .filter((recipe) => difficulty === "All" || recipe.difficulty === difficulty)
      .filter((recipe) => {
        if (!search) return true;
        const searchableText = [
          recipe.title,
          recipe.description,
          recipe.cuisine ?? "",
          ...recipe.tags,
          ...recipe.ingredients,
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(search);
      });
  }, [recipes, category, difficulty, query]);

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
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <RecipesHeader
              query={query}
              onQueryChange={setQuery}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
            />
            <CategoryTabs
              categories={categories}
              value={category}
              onChange={setCategory}
            />
          </View>
        }
        renderItem={({ item }) => <RecipeCard item={item} />}
        ListEmptyComponent={<RequestState />}
        contentContainerStyle={styles.content}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
});
