"use client";

import { useEffect, useState } from "react";
import { setThemeInStorage } from "@/components/theme-provider";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    setThemeInStorage(next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white text-sm"
      title={dark ? "Usar tema claro" : "Usar tema escuro"}
      aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
