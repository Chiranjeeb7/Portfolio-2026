import { useEffect, useState } from "react";

// Case-study pages live at "#/<id>" (e.g. "#/planner"), distinct from the
// homepage's plain section anchors ("#work", "#about", ...) so the two hash
// schemes never collide. No routing library needed for one dynamic page,
// and hash-based routing needs no server rewrite rules on any static host.
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const match = hash.match(/^#\/(.+)$/);
  return match ? match[1] : null;
}
