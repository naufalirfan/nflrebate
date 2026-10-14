"use client";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Mode siang — klik untuk siang" : "Mode malam — klik untuk malam"}
      aria-label="Ganti tema siang/malam"
      className="min-h-[44px] min-w-[44px] w-11 h-11 inline-flex items-center justify-center rounded-full border text-[16px] shrink-0"
      style={{
        background: isDark ? "#2a2a30" : "#ffffff",
        borderColor: isDark ? "#34343e" : "#e6e6e6",
        color: isDark ? "#ffffff" : "#000000",
      }}
    >
      <span aria-hidden>{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
