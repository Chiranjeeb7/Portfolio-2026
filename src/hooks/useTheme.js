import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme-preference"; // "light" | "dark" | absent (follow system)

function getSystemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme) root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
}

// Three states: explicit "light", explicit "dark", or null (follow system).
// The nav toggle only ever switches between the two explicit states.
export function useTheme() {
  const [theme, setThemeState] = useState(() => readStored());
  const [isDark, setIsDark] = useState(() => {
    const stored = readStored();
    return stored ? stored === "dark" : getSystemPrefersDark();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme) {
      setIsDark(theme === "dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const onChange = (e) => setIsDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const current = prev ?? (getSystemPrefersDark() ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode / storage unavailable — theme just won't persist */
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
