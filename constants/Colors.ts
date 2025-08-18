/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Brand palette: Indigo
const tintColorLight = "#6366F1"; // indigo-500
const tintColorDark = "#A5B4FC"; // indigo-300

export const Colors = {
  light: {
    text: "#0F172A",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#E5E7EB",
    background: "#0B1220",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,
  },
};
