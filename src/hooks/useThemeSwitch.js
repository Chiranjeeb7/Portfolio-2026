import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "./useTheme";

// useTheme plus a click handler that grows the new theme out of the pressed
// button as a circle (View Transitions API). Shared by the homepage nav and
// the case study / milestone header so both switch the same way. Falls back
// to an instant swap without the API or under reduced motion.
export function useThemeSwitch() {
  const { isDark, toggle } = useTheme();

  const switchTheme = useCallback(
    (e) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !document.startViewTransition || !e?.currentTarget) {
        toggle();
        return;
      }
      const r = e.currentTarget.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const root = document.documentElement;
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty(
        "--vt-r",
        `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`
      );
      root.classList.add("vt-theme");
      const t = document.startViewTransition(() => flushSync(toggle));
      t.finished.finally(() => root.classList.remove("vt-theme"));
    },
    [toggle]
  );

  return { isDark, switchTheme };
}
