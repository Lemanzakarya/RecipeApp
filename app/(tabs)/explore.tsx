import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";

import { Loading } from "@/components/Loading";
import RecipeCard, { type Recipe } from "@/components/RecipeCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExploreScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search State
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const inputBg = useThemeColor({ light: "#f3f4f6", dark: "#1f2937" }, "background");
  const textColor = useThemeColor({}, "text");
  const cardBorder = useThemeColor({ light: "#e5e7eb", dark: "#374151" }, "icon");

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((res) => res.json())
      .then((data) => {
        const mappedRecipes: Recipe[] = data.recipes.map((r: any) => ({
          id: String(r.id),
          title: r.name,
          description: r.cuisine,
          difficulty: r.difficulty === "Hard" ? "Hard" : r.difficulty === "Medium" ? "Medium" : "Easy",
          timeMins: (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0),
          servings: r.servings,
          meal: r.mealType?.[0] || "Dinner",
          tags: r.tags || [],
          ingredients: r.ingredients || [],
          image: r.image,
          rating: r.rating,
          cuisine: r.cuisine,
        }));
        setRecipes(mappedRecipes);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch recipes:", e);
        setLoading(false);
      });
  }, []);

  const addIngredient = () => {
    if (ingredientInput.trim().length > 0 && !selectedIngredients.includes(ingredientInput.trim())) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedIngredients([...selectedIngredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const removeIngredient = (ing: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
  };

  const handleSurpriseMe = () => {
    if (recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const randomRecipe = recipes[randomIndex];
      router.push(`/recipe/${randomRecipe.id}`);
    }
  };

  const filteredData = useMemo(() => {
    if (selectedIngredients.length === 0) {
      // Return simple wrapper to keep types consistent
      return recipes.map(r => ({ recipe: r, matchCount: 0, matchedIngredients: [] }));
    }

    // Calculate match score for each recipe
    const scored = recipes.map((r) => {
      const recipeIngredients = (r as any).ingredients.map((i: string) => i.toLowerCase());
      const matched: string[] = [];
      
      selectedIngredients.forEach(userIng => {
        // Check if user ingredient is found in recipe ingredients
        if (recipeIngredients.some((apiIng: string) => apiIng.includes(userIng.toLowerCase()))) {
            matched.push(userIng);
        }
      });

      return { recipe: r, matchCount: matched.length, matchedIngredients: matched };
    });

    // Filter out recipes with 0 matches and sort by match count (descending)
    return scored
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [recipes, selectedIngredients]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Kitchen Assistant</ThemedText>
        <ThemedText style={{opacity: 0.6, marginBottom: 16}}>
          What's in your fridge today?
        </ThemedText>

        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
            <IconSymbol name="magnifyingglass" size={20} color={iconColor} />
            <TextInput
              placeholder="Add ingredient (e.g. Eggs)"
              placeholderTextColor={iconColor}
              style={[styles.input, { color: textColor }]}
              value={ingredientInput}
              onChangeText={setIngredientInput}
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
            {ingredientInput.length > 0 && (
              <TouchableOpacity onPress={addIngredient}>
                <IconSymbol name="plus.circle.fill" size={24} color={tintColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.surpriseBtn, { backgroundColor: tintColor }]}
          onPress={handleSurpriseMe}
          activeOpacity={0.8}
        >
          <IconSymbol name="shuffle" size={20} color="#fff" />
          <ThemedText style={styles.surpriseBtnText}>Surprise Me</ThemedText>
        </TouchableOpacity>

        {/* Selected Ingredients Chips */}
        <View style={styles.chipsContainer}>
          {selectedIngredients.map((ing) => (
            <TouchableOpacity 
              key={ing} 
              style={[styles.chip, { backgroundColor: inputBg, borderColor: cardBorder }]}
              onPress={() => removeIngredient(ing)}
            >
              <ThemedText style={styles.chipText}>{ing}</ThemedText>
              <IconSymbol name="xmark" size={12} color={iconColor} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
            <ThemedText type="subtitle">
                {selectedIngredients.length > 0 
                  ? `Found ${filteredData.length} recipes` 
                  : "All Recipes"}
            </ThemedText>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.recipe.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
                {selectedIngredients.length > 0 && (
                    <View style={[styles.matchInfo, { backgroundColor: tintColor + '15' }]}>
                        <IconSymbol name="checkmark.circle.fill" size={16} color={tintColor} />
                        <ThemedText style={[styles.matchText, { color: tintColor }]}>
                            Matches {item.matchCount} of {selectedIngredients.length}: {item.matchedIngredients.join(", ")}
                        </ThemedText>
                    </View>
                )}
                <RecipeCard item={item.recipe} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="tray" size={48} color={iconColor} />
              <ThemedText style={{ marginTop: 16, opacity: 0.6, textAlign: 'center' }}>
                No recipes found with these specific ingredients. Try simpler terms like "Chicken" or "Rice".
              </ThemedText>
            </View>
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  surpriseBtn: {
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  surpriseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 32, // Prevent layout jump
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: -8, // Pull closer to card
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 6,
    zIndex: -1, // Behind card if overlapping, but here we want it visible
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
});
