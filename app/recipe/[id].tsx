import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { RequestState } from "@/components/RequestState";
import { fetchRecipe } from "@/lib/recipes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ImageWithFallback from "@/components/figma/ImageWithFallback";
import { useShoppingList } from "@/providers/ShoppingListProvider";

type RecipeDetail = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Array.isArray(id) ? id[0] : id;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToList, setAddedToList] = useState(false);
  const { addIngredients } = useShoppingList();

  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const secondaryBg = useThemeColor(
    { light: "#f3f4f6", dark: "#1f2937" },
    "background"
  );
  const cardBorder = useThemeColor(
    { light: "#e5e7eb", dark: "#374151" },
    "icon"
  );

  const loadRecipe = useCallback(async () => {
    if (!recipeId) {
      setError("This recipe could not be found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setAddedToList(false);
    try {
      setRecipe((await fetchRecipe(recipeId)) as RecipeDetail);
    } catch (cause) {
      setRecipe(null);
      setError(cause instanceof Error ? cause.message : "Could not load this recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    void loadRecipe();
  }, [loadRecipe]);

  if (loading || error || !recipe) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "#fff",
          }}
        />
        <RequestState
          loading={loading}
          message={error ?? "This recipe could not be found."}
          onRetry={error ? loadRecipe : undefined}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "#fff",
        }}
      />

      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <ImageWithFallback
            uri={recipe.image}
            style={styles.headerImage}
            contentFit="cover"
            width="100%"
            height={250}
            borderRadius={0}
          />
        }
      >
        <View style={styles.headerContent}>
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>{recipe.cuisine}</ThemedText>
          </View>
          <ThemedText type="title" style={styles.title}>
            {recipe.name}
          </ThemedText>
          <View style={styles.ratingRow}>
            <IconSymbol name="star.fill" size={18} color="#fbbf24" />
            <ThemedText style={styles.ratingText}>
              {recipe.rating}
            </ThemedText>
            <ThemedText style={styles.reviewCount}>
              ({recipe.reviewCount} reviews)
            </ThemedText>
            <View style={styles.dot} />
            <ThemedText style={styles.difficultyText}>
              {recipe.difficulty}
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.metaContainer,
            { backgroundColor: secondaryBg, borderColor: cardBorder },
          ]}
        >
          <MetaItem
            icon="clock"
            label="Prep"
            value={`${recipe.prepTimeMinutes}m`}
            color={iconColor}
          />
          <View style={[styles.separator, { backgroundColor: cardBorder }]} />
          <MetaItem
            icon="timer"
            label="Cook"
            value={`${recipe.cookTimeMinutes}m`}
            color={iconColor}
          />
          <View style={[styles.separator, { backgroundColor: cardBorder }]} />
          <MetaItem
            icon="person.2"
            label="Servings"
            value={`${recipe.servings}`}
            color={iconColor}
          />
          <View style={[styles.separator, { backgroundColor: cardBorder }]} />
          <MetaItem
            icon="flame"
            label="Cal"
            value={`${recipe.caloriesPerServing}`}
            color={iconColor}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            addIngredients(recipe.name, recipe.ingredients);
            setAddedToList(true);
          }}
          style={[styles.addToListButton, { backgroundColor: tintColor }]}
        >
          <IconSymbol
            name={addedToList ? "checkmark.circle.fill" : "cart.fill"}
            size={20}
            color="#fff"
          />
          <ThemedText style={styles.addToListText}>
            {addedToList ? "Ingredients added to list" : "Add ingredients to shopping list"}
          </ThemedText>
        </Pressable>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ingredients
          </ThemedText>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={index}
                style={[
                  styles.ingredientCard,
                  { backgroundColor: secondaryBg, borderColor: cardBorder },
                ]}
              >
                <View style={[styles.checkbox, { borderColor: tintColor }]}>
                  <View
                    style={[
                      styles.checkboxInner,
                      { backgroundColor: tintColor },
                    ]}
                  />
                </View>
                <ThemedText style={styles.ingredientText}>
                  {ingredient}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Instructions
          </ThemedText>
          <View style={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View
                  style={[
                    styles.stepIndicator,
                    { backgroundColor: tintColor + "20" },
                  ]}
                >
                  <ThemedText style={[styles.stepNumber, { color: tintColor }]}>
                    {index + 1}
                  </ThemedText>
                </View>
                <ThemedText style={styles.instructionText}>
                  {instruction}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {recipe.tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: secondaryBg, borderColor: cardBorder },
              ]}
            >
              <ThemedText style={[styles.tagText, { color: tintColor }]}>
                #{tag}
              </ThemedText>
            </View>
          ))}
        </View>
      </ParallaxScrollView>
    </>
  );
}

function MetaItem({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.metaItem}>
      <IconSymbol name={icon as any} size={22} color={color} />
      <View style={styles.metaTextContainer}>
        <ThemedText style={styles.metaValue}>{value}</ThemedText>
        <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  headerContent: {
    marginBottom: 24,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
  },
  reviewCount: {
    fontSize: 14,
    opacity: 0.6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9ca3af",
    marginHorizontal: 4,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  addToListButton: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
  },
  addToListText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  metaItem: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  metaTextContainer: {
    alignItems: "center",
  },
  separator: {
    width: 1,
    height: 32,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  metaLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  ingredientText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  instructionsList: {
    gap: 20,
  },
  instructionRow: {
    flexDirection: "row",
    gap: 16,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "800",
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
