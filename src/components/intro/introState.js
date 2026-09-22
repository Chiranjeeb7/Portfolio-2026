import { createContext, useContext } from "react";

// { ready: the page may play its own entrances; played: the intro ran on
// this load (so elements it animates into place skip their own entrance). }
export const IntroContext = createContext({ ready: true, played: false });
export const useIntro = () => useContext(IntroContext);

// The intro plays on every full load (or refresh) of the homepage,
// including one sitting on a section anchor like "#work" (the nav writes
// those into the URL). Not for case study or milestone pages ("#/..."), not
// when navigating back home within the site (it is decided once, at app
// start), and never under reduced motion.
export function shouldPlayIntro() {
  if (window.location.hash.startsWith("#/")) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The pixels land in the hero, so a refresh that plays the intro starts at
// the top: drop any section anchor before the app scrolls to it.
export function clearSectionAnchor() {
  if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
}
