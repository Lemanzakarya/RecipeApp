export type RecipeDifficulty = "Easy" | "Medium" | "Hard";
export type RecipeMeal = "Breakfast" | "Lunch" | "Dinner" | "Desserts";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  difficulty: RecipeDifficulty;
  timeMins: number;
  servings: number;
  meal: RecipeMeal;
  tags: string[];
  ingredients: string[];
  image?: string;
  rating?: number;
  cuisine?: string;
};

type ApiRecipe = {
  id: number;
  name: string;
  instructions?: string[];
  difficulty?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  mealType?: string[];
  tags?: string[];
  ingredients?: string[];
  image?: string;
  rating?: number;
  cuisine?: string;
  caloriesPerServing?: number;
  reviewCount?: number;
};

type RecipeListResponse = { recipes: ApiRecipe[] };
const API_URL = "https://dummyjson.com/recipes";

async function request<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Could not connect. Check your internet connection and try again.");
  }

  if (!response.ok) {
    throw new Error(`The recipe service returned an error (${response.status}). Try again.`);
  }

  return response.json() as Promise<T>;
}

function mapMeal(mealType?: string[]): RecipeMeal {
  const meal = mealType?.[0]?.toLowerCase();
  if (meal === "breakfast") return "Breakfast";
  if (meal === "dessert") return "Desserts";
  if (["lunch", "snack", "appetizer", "side dish", "beverage"].includes(meal ?? "")) {
    return "Lunch";
  }
  return "Dinner";
}

function mapRecipe(recipe: ApiRecipe): Recipe {
  return {
    id: String(recipe.id),
    title: recipe.name,
    description: recipe.instructions?.[0] ?? recipe.cuisine ?? "A delicious recipe.",
    difficulty:
      recipe.difficulty === "Hard"
        ? "Hard"
        : recipe.difficulty === "Medium"
          ? "Medium"
          : "Easy",
    timeMins: (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0),
    servings: recipe.servings ?? 1,
    meal: mapMeal(recipe.mealType),
    tags: recipe.tags ?? [],
    ingredients: recipe.ingredients ?? [],
    image: recipe.image,
    rating: recipe.rating,
    cuisine: recipe.cuisine,
  };
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const data = await request<RecipeListResponse>(API_URL);
  if (!Array.isArray(data.recipes)) {
    throw new Error("The recipe list could not be read. Please try again.");
  }
  return data.recipes.map(mapRecipe);
}

export async function fetchRecipe(id: string): Promise<ApiRecipe> {
  const recipe = await request<ApiRecipe>(`${API_URL}/${encodeURIComponent(id)}`);
  if (!recipe || typeof recipe.name !== "string" || !Array.isArray(recipe.ingredients)) {
    throw new Error("This recipe could not be found.");
  }
  return recipe;
}
