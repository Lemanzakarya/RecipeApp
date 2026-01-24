import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import CategoryTabs, { type Category } from "@/components/CategoryTabs";
import RecipeCard, { type Recipe } from "@/components/RecipeCard";
import RecipesHeader from "@/components/RecipesHeader";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((res) => res.json())
      .then((data) => {
        const mappedRecipes: Recipe[] = data.recipes.map((r: any) => {
          let meal: Recipe["meal"] = "Dinner";
          if (r.mealType && r.mealType.length > 0) {
            const apiMeal = r.mealType[0];
            if (apiMeal === "Breakfast") meal = "Breakfast";
            else if (
              apiMeal === "Lunch" ||
              apiMeal === "Snack" ||
              apiMeal === "Appetizer" ||
              apiMeal === "Side Dish" ||
              apiMeal === "Beverage"
            )
              meal = "Lunch";
            else if (apiMeal === "Dinner") meal = "Dinner";
            else if (apiMeal === "Dessert") meal = "Desserts";
            else meal = "Dinner"; // Default fallback
          }

          return {
            id: String(r.id),
            title: r.name,
            // Use first instruction as description, truncating if too long, or fallback to cuisine
            description: r.instructions?.[0]
              ? r.instructions[0]
              : `${r.cuisine} cuisine`,
            difficulty:
              r.difficulty === "Hard"
                ? "Hard"
                : r.difficulty === "Medium"
                ? "Medium"
                : "Easy",
            timeMins: (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0),
            servings: r.servings,
            meal: meal,
            tags: r.tags || [],
            image: r.image,
          };
        });
        setRecipes(mappedRecipes);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch recipes:", e);
        setLoading(false);
      });
  }, []);

  const categories: Category[] = useMemo(() => {
    const counts = {
      all: recipes.length,
      breakfast: recipes.filter((r) => r.meal === "Breakfast").length,
      lunch: recipes.filter((r) => r.meal === "Lunch").length,
      dinner: recipes.filter((r) => r.meal === "Dinner").length,
      desserts: recipes.filter((r) => r.meal === "Desserts").length,
    };
    return [
      { key: "all", label: "All", count: counts.all },
      { key: "breakfast", label: "Breakfast", count: counts.breakfast },
      { key: "lunch", label: "Lunch", count: counts.lunch },
      { key: "dinner", label: "Dinner", count: counts.dinner },
      { key: "desserts", label: "Desserts", count: counts.desserts },
    ];
  }, [recipes]);

  const filtered = useMemo(
    () =>
      recipes
        .filter((r) =>
          category === "all" ? true : r.meal.toLowerCase() === category
        )
        .filter((r) =>
          difficulty === "All" ? true : r.difficulty === difficulty
        )
        .filter((r) => {
          if (!query.trim()) return true;
          const hay = (
            r.title +
            " " +
            r.description +
            " " +
            r.tags.join(" ")
          ).toLowerCase();
          return hay.includes(query.trim().toLowerCase());
        }),
    [recipes, category, difficulty, query]
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
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
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
});