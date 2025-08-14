import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export type Scheme = "light" | "dark";

type ThemeCtx = {
  colorScheme: Scheme;
  setColorScheme: (s: Scheme) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = (useRNColorScheme() ?? "light") as Scheme;
  const [scheme, setScheme] = useState<Scheme>(system);
  const toggle = useCallback(
    () => setScheme((s) => (s === "light" ? "dark" : "light")),
    []
  );

  const value = useMemo(
    () => ({ colorScheme: scheme, setColorScheme: setScheme, toggle }),
    [scheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useThemeController() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // If provider not mounted yet, fallback to system scheme without controls
    const system = (useRNColorScheme() ?? "light") as Scheme;
    return {
      colorScheme: system,
      setColorScheme: () => {},
      toggle: () => {},
    } as ThemeCtx;
  }
  return ctx;
}
