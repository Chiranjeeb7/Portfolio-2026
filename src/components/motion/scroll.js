let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

// Scrolls to an element or y-position through Lenis when it is running (so
// the smoothing never fights a native jump), or natively when it is not.
// Both paths honour the root's scroll-padding-top, so headings clear the nav.
export function scrollToTarget(target, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: immediate ? "instant" : "smooth" });
  else target.scrollIntoView({ behavior: immediate ? "instant" : "smooth", block: "start" });
}
