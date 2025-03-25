"use client";

import { useThemeStore } from "@/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  // Sincronizar o tema do zustand com o next-themes
  const handleThemeChange = (newTheme: string) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  };

  useEffect(() => {
    // Aplicar o tema salvo no zustand ao carregamento da página
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      value={{
        light: "light",
        dark: "dark",
        system: "system",
      }}
      onValueChange={handleThemeChange}
    >
      {children}
    </NextThemesProvider>
  );
} 