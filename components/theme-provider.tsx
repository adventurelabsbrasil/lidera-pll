"use client";

import { useEffect } from "react";

const THEME_KEY = "pll-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | "system" | null;
    const theme = stored ?? "light";
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  return <>{children}</>;
}

export function setThemeInStorage(theme: "light" | "dark" | "system") {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "light") root.classList.remove("dark");
  else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.classList.add("dark");
    else root.classList.remove("dark");
  }
}
