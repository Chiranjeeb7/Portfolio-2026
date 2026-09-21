import { useSyncExternalStore } from "react";

// Live boolean for a CSS media query, for layout-dependent motion (the Work
// stack only pins on screens tall and wide enough to hold a whole card).
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
