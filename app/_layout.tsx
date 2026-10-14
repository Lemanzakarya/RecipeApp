import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  AppThemeProvider,
  useThemeController,
} from "@/providers/ThemeProvider";
import { ShoppingListProvider } from "@/providers/ShoppingListProvider";

export default function RootLayout() {
  // Continue to read the system scheme; but ThemeProvider below enables manual toggle in UI
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppThemeProvider>
      <ShoppingListProvider>
        <InnerLayout systemScheme={colorScheme ?? "light"} />
      </ShoppingListProvider>
    </AppThemeProvider>
  );
}

function InnerLayout({ systemScheme }: { systemScheme: "light" | "dark" }) {
  const { colorScheme } = useThemeController();
  const scheme = colorScheme ?? systemScheme;
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
