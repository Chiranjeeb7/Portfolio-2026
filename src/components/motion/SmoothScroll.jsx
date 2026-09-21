import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { scrollToTarget, setLenis } from "./scroll";

// Inertial wheel scrolling for the whole page. Off entirely under reduced
// motion, and touch keeps its native momentum (Lenis leaves touch alone by
// default). Anything that owns its own wheel (the About canvas zooms on
// wheel) opts out with a data-lenis-prevent attribute.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, autoRaf: true });
    setLenis(lenis);

    // Same-page section links ("#work") glide instead of jumping. Hash
    // routes ("#/planner") and anchors whose target is not on this page fall
    // through to the browser, so routing keeps working unchanged.
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute("href").slice(1);
      if (!/^[\w-]+$/.test(id)) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
