import { useThemeController } from "@/providers/ThemeProvider";

export function useColorScheme() {
  const { colorScheme } = useThemeController();
  return colorScheme;
}
