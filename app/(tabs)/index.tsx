import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CategoryTabs, { type Category } from "@/components/CategoryTabs";
import RecipeCard, { type Recipe } from "@/components/RecipeCard";
import RecipesHeader from "@/components/RecipesHeader";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");

  const categories: Category[] = [
    { key: "all", label: "All", count: 4 },
    { key: "breakfast", label: "Breakfast", count: 1 },
    { key: "lunch", label: "Lunch", count: 1 },
    { key: "dinner", label: "Dinner", count: 1 },
    { key: "desserts", label: "Desserts", count: 1 },
  ];

  const data: Recipe[] = useMemo(
    () => [
      {
        id: "1",
        title: "Classic Pancakes",
        description: "Fluffy, golden pancakes perfect for weekend mornings",
        difficulty: "Easy",
        timeMins: 20,
        servings: 4,
        meal: "Breakfast",
        tags: ["quick", "family-friendly"],
      },
      {
        id: "2",
        title: "Caesar Salad",
        description: "Fresh romaine lettuce with classic Caesar dressing",
        difficulty: "Easy",
        timeMins: 15,
        servings: 2,
        meal: "Lunch",
        tags: ["healthy", "vegetarian"],
        image: require("@/assets/images/react-logo.png"),
      },
      {
        id: "3",
        title: "Beef Tacos",
        description:
          "Seasoned ground beef in soft tortillas with fresh toppings",
        difficulty: "Medium",
        timeMins: 25,
        servings: 4,
        meal: "Dinner",
        tags: ["mexican", "family-dinner"],
      },
      {
        id: "4",
        title: "Chocolate Chip Cookies",
        description: "Classic homemade cookies with gooey chocolate chips",
        difficulty: "Easy",
        timeMins: 30,
        servings: 24,
        meal: "Desserts",
        tags: ["dessert", "baking"],
      },
    ],
    []
  );

  const filtered = data
    .filter((r) =>
      category === "all" ? true : r.meal.toLowerCase() === category
    )
    .filter((r) => (difficulty === "All" ? true : r.difficulty === difficulty));

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            <RecipesHeader
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
});
