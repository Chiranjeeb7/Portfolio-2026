import { useEffect } from "react";

// Fades [data-reveal] elements in as they scroll into view. One observer per
// page; re-scans whenever `deps` change (e.g. a route swap mounts new
// content), and also picks up [data-reveal] elements mounted later (a
// component that renders after load, or a dev hot-reload remount), which
// would otherwise stay invisible forever. Elements already on screen at
// mount reveal immediately, so the first viewport never flashes empty.
export function useReveal(deps = []) {
  useEffect(() => {
    const root = document.documentElement;
    const pending = () => Array.from(document.querySelectorAll("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("is-visible"));
      return;
    }
    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    pending().forEach((el) => observer.observe(el));

    // Observing an element twice is a no-op, so re-scanning is safe. Batched
    // to one scan per frame, since text animations (CountUp) mutate often.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pending().forEach((el) => observer.observe(el));
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
