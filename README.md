# RecipeApp

A cross-platform recipe discovery app built with React Native and Expo. Browse recipes, filter by meal and difficulty, search ingredients, and open a detailed cooking guide.

## Features

- Browse recipes with photos, preparation and cooking time, servings, and difficulty
- Filter by meal category and difficulty
- Search recipe names, ingredients, tags, cuisine, and descriptions
- Find recipes that use ingredients you already have
- Sort ingredient matches by the number of matching ingredients
- Pick a random recipe from the current matching results
- View ingredients, nutrition, ratings, and step-by-step instructions
- Switch between light and dark themes

Recipe content is provided by the [DummyJSON Recipes API](https://dummyjson.com/docs/recipes), so an internet connection is required.

## Built with

- React Native
- Expo and Expo Router
- TypeScript
- DummyJSON Recipes API

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npx expo start
   ```

3. Open the app using Expo Go, an Android emulator, an iOS simulator, or the web option shown in the Expo terminal.

## Project structure

- `app/(tabs)/index.tsx` — recipe browsing, filters, and search
- `app/(tabs)/explore.tsx` — ingredient-based discovery
- `app/recipe/[id].tsx` — recipe details
- `lib/recipes.ts` — recipe API requests and data mapping
- `components/` — reusable interface components
