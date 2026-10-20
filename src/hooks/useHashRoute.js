import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { preloadRoute } from "../routes";

// Case-study pages live at "#/<id>" (e.g. "#/planner"), distinct from the
// homepage's plain section anchors ("#work", "#about", ...) so the two hash
// schemes never collide. No routing library needed for one dynamic page,
// and hash-based routing needs no server rewrite rules on any static host.
const routeOf = (hash) => hash.match(/^#\/(.+)$/)?.[1] ?? null;

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    let current = window.location.hash;
    const onHashChange = () => {
      const next = window.location.hash;
      const pageChanges = routeOf(next) !== routeOf(current);
      current = next;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Moving between pages (home and a case study) wipes the new page up
      // over the old one; plain section anchors just update.
      if (!pageChanges || reduce || !document.startViewTransition) {
        setHash(next);
        return;
      }
      // The transition snapshots the new page synchronously, so its chunk has
      // to be in hand first. A newer hash change while waiting wins.
      preloadRoute(routeOf(next)).then(() => {
        if (window.location.hash !== next) return;
        const root = document.documentElement;
        root.classList.add("vt-route");
        const t = document.startViewTransition(() => flushSync(() => setHash(next)));
        t.finished.finally(() => root.classList.remove("vt-route"));
      });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return routeOf(hash);
}
