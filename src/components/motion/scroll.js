let lenis = null;
let locked = false;

export function setLenis(instance) {
  lenis = instance;
  if (lenis && locked) lenis.stop();
}

// Freezes page scroll (the intro holds the page at the top while the
// timeline assembles). Applies to Lenis and native scroll alike, and to a
// Lenis instance created after the lock.
export function setScrollLocked(value) {
  locked = value;
  document.documentElement.style.overflow = value ? "hidden" : "";
  if (lenis) {
    if (value) lenis.stop();
    else lenis.start();
  }
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
