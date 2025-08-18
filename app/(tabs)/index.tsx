import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CategoryTabs, { type Category } from "@/components/CategoryTabs";
import RecipeCard, { type Recipe } from "@/components/RecipeCard";
import RecipesHeader from "@/components/RecipesHeader";
import { ThemedView } from "@/components/ThemedView";
// no extra components here; keep page minimal

export default function HomeScreen() {
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");
  const [query, setQuery] = useState<string>("");

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
        image:
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/Stack_of_blueberry_pancakes.jpg",
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
        image:
          "https://upload.wikimedia.org/wikipedia/commons/2/28/Caesar_salad_%281%29.jpg",
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
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/0b/Street_Tacos.jpg",
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
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/70/Chocolate_Chip_Cookies_-_kimberlykv.jpg",
      },
    ],
    []
  );

  // keep simple home without extra sections

  const filtered = data
    .filter((r) =>
      category === "all" ? true : r.meal.toLowerCase() === category
    )
    .filter((r) => (difficulty === "All" ? true : r.difficulty === difficulty))
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
    });

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
});
