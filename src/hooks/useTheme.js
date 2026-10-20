import { useCallback, useState } from "react";

const THEME_COLORS = { light: "#fafcfd", dark: "#12161b" };

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

// Every page load starts in light mode, whatever the system preference, so
// the intro loader always samples light colours. index.html sets
// data-theme="light" before first paint. The nav toggle switches to dark for
// the rest of the visit only; nothing is persisted.
export function useTheme() {
  // Read from the DOM, not a fixed false: Nav and CaseStudyHeader each hold
  // their own copy, and one mounting after a mid-visit toggle must match.
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");

  // Applies to the DOM synchronously, so a view transition wrapped around
  // the toggle captures the new theme.
  const toggle = useCallback(() => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    setIsDark(next === "dark");
  }, []);

  return { isDark, toggle };
}
