"use client";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "⚙️";
  const title = theme === "light" ? "Mode siang" : theme === "dark" ? "Mode malam" : "Ikut sistem";
  return (
    <button
      onClick={() => setTheme(next as any)}
      title={`${title} — klik untuk ganti`}
      className="w-9 h-9 rounded-full border bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 flex items-center justify-center text-sm shrink-0"
      aria-label="Ganti tema"
    >
      <span>{label}</span>
    </button>
  );
}
