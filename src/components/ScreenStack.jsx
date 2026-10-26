import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import styles from "./ScreenStack.module.css";

const EASE = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];
// Resting poses, front to back: the front screen is the hero; each one
// behind is a step smaller and only its top edge peeks out above, like a
// neat pile of cards seen from the front.
const SLOTS = [
  { y: "0%", scale: 1, layer: 30, shade: 0 },
  { y: "-7%", scale: 0.92, layer: 20, shade: 0.35 },
  { y: "-14%", scale: 0.84, layer: 10, shade: 0.6 },
];
const HOVER_MS = 2200;

const slotOf = (s) => SLOTS[Math.min(s, SLOTS.length - 1)];

// A pile of product screens that sits still until its card is hovered, then
// deals the front one to the back straight away and every couple of seconds
// for as long as the hover lasts. A screen is an image URL, or
// `{ video, poster }` for a recording: videos loop muted, and only play
// while the stack is on screen (and never under reduced motion, where the
// poster stands in).
//
// Driven imperatively rather than through React state: each shuffle is one
// ordered sequence (fade out, restack, fade in at the back), so the stacking
// change always lands while the leaving card is invisible and never flashes
// over the one taking its place.
export default function ScreenStack({ screens, aspect, tone = "periwinkle", hovered = false, eager = false }) {
  const reduce = useReducedMotion();
  const cards = useRef([]);
  const shades = useRef([]);
  // order[0] is the index of the screen currently in front.
  const order = useRef(screens.map((_, i) => i));
  const busy = useRef(false);
  const stageRef = useRef(null);
  const videos = useRef([]);

  const put = useCallback((i, s, transition) => {
    const { layer, shade, ...pose } = slotOf(s);
    cards.current[i].style.zIndex = layer;
    animate(shades.current[i], { opacity: shade }, transition);
    return animate(cards.current[i], { ...pose, opacity: 1 }, transition);
  }, []);

  useLayoutEffect(() => {
    order.current.forEach((i, s) => put(i, s, { duration: 0 }));
  }, [put]);

  const shuffle = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const [front, ...rest] = order.current;
    const out = cards.current[front];

    // The rest step forward while the front card drops away over them.
    out.style.zIndex = 40;
    rest.forEach((i, s) => put(i, s, { duration: 0.9, ease: EASE, delay: 0.08 }));
    await animate(out, { y: "22%", scale: 0.97, opacity: 0 }, { duration: 0.42, ease: EASE_IN });

    // Invisible now: restack it at the back and let it settle in from above.
    const back = rest.length;
    const { layer, shade, scale } = slotOf(back);
    out.style.zIndex = layer;
    animate(shades.current[front], { opacity: shade }, { duration: 0 });
    await animate(out, { y: "-24%", scale, opacity: 0 }, { duration: 0 });
    await put(front, back, { duration: 0.6, ease: EASE });

    order.current = [...rest, front];
    busy.current = false;
  }, [put]);

  // Play recordings only while the stack is visible, so a page full of
  // cards doesn't decode video nobody is looking at.
  useEffect(() => {
    const els = videos.current.filter(Boolean);
    if (reduce || els.length === 0 || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      els.forEach((v) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    });
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce || !hovered) return;
    shuffle();
    const id = setInterval(shuffle, HOVER_MS);
    return () => clearInterval(id);
  }, [hovered, reduce, shuffle]);

  return (
    <div className={`${styles.stage} ${styles[tone]}`} ref={stageRef} aria-hidden="true">
      <div className={styles.pile} style={{ aspectRatio: aspect }}>
        {screens.map((screen, i) => (
          <div key={screen.video ?? screen} ref={(el) => (cards.current[i] = el)} className={styles.card}>
            {screen.video ? (
              <video
                ref={(el) => (videos.current[i] = el)}
                src={screen.video}
                poster={screen.poster}
                muted
                loop
                playsInline
                preload={eager ? "auto" : "metadata"}
              />
            ) : (
              <img src={screen} alt="" loading={eager ? "eager" : "lazy"} draggable="false" />
            )}
            <span ref={(el) => (shades.current[i] = el)} className={styles.shade} />
          </div>
        ))}
      </div>
    </div>
  );
}
