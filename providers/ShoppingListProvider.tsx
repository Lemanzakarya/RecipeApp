import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ShoppingListItem = {
  id: string;
  name: string;
  checked: boolean;
  recipes: string[];
};

type ShoppingListContextValue = {
  items: ShoppingListItem[];
  addIngredients: (recipeName: string, ingredients: string[]) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
};

const STORAGE_KEY = "recipeapp.shopping-list.v1";
const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

function normalize(name: string) {
  return name.trim().toLocaleLowerCase();
}

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item): item is ShoppingListItem =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.checked === "boolean" &&
              Array.isArray(item.recipes) &&
              item.recipes.every((recipe: unknown) => typeof recipe === "string")
          );
          setItems(validItems);
        }
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, ready]);

  const addIngredients = useCallback((recipeName: string, ingredients: string[]) => {
    setItems((current) => {
      const next = [...current];
      ingredients.forEach((ingredient) => {
        const name = ingredient.trim();
        const id = normalize(name);
        if (!id) return;

        const existingIndex = next.findIndex((item) => item.id === id);
        if (existingIndex >= 0) {
          const existing = next[existingIndex];
          if (!existing.recipes.includes(recipeName)) {
            next[existingIndex] = { ...existing, recipes: [...existing.recipes, recipeName] };
          }
        } else {
          next.push({ id, name, checked: false, recipes: [recipeName] });
        }
      });
      return next;
    });
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearChecked = useCallback(() => {
    setItems((current) => current.filter((item) => !item.checked));
  }, []);

  const value = useMemo(
    () => ({ items, addIngredients, toggleItem, removeItem, clearChecked }),
    [items, addIngredients, toggleItem, removeItem, clearChecked]
  );

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used inside ShoppingListProvider");
  }
  return context;
}
