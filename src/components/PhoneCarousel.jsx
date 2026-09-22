import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import styles from "./PhoneCarousel.module.css";

const EASE = [0.16, 1, 0.3, 1];
// Poses by position in the row. The hero phone stands tall in the middle;
// its neighbours sit back, smaller and washed out, half-cropped by the stage
// edges; any others wait out of sight past the right edge. x is a percentage
// of one phone's width.
const HERO = { x: "0%", y: "0%", scale: 1, opacity: 1, layer: 30, shade: 0 };
const RIGHT = { x: "84%", y: "7%", scale: 0.8, opacity: 1, layer: 20, shade: 0.45 };
const LEFT = { ...RIGHT, x: "-84%" };
const WAITING = { x: "165%", y: "12%", scale: 0.66, opacity: 0, layer: 10, shade: 0.7 };
const EXITED = { ...WAITING, x: "-165%" };
const HOVER_MS = 2200;

const poseAt = (s, n) => (s === 0 ? HERO : s === 1 ? RIGHT : s === n - 1 ? LEFT : WAITING);

// The phone counterpart to ScreenStack: tall screens don't pile well, so
// they stand in a row instead and the row slides one step left on hover
// (right neighbour becomes the hero), repeating while the hover lasts.
export default function PhoneCarousel({ screens, tone = "sand", hovered = false, eager = false }) {
  const reduce = useReducedMotion();
  const phones = useRef([]);
  const shades = useRef([]);
  // order[0] is the index of the hero screen; order[1] its right neighbour.
  const order = useRef(screens.map((_, i) => i));
  const busy = useRef(false);
  const n = screens.length;

  const put = useCallback((i, pose, transition) => {
    const { layer, shade, ...motionPose } = pose;
    phones.current[i].style.zIndex = layer;
    animate(shades.current[i], { opacity: shade }, transition);
    return animate(phones.current[i], motionPose, transition);
  }, []);

  useLayoutEffect(() => {
    order.current.forEach((i, s) => put(i, poseAt(s, n), { duration: 0 }));
  }, [put, n]);

  const advance = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const prev = order.current;
    const next = [...prev.slice(1), prev[0]];
    const move = { duration: 0.9, ease: EASE };

    const steps = next.map((i, s) => {
      const was = prev.indexOf(i);
      // The old left neighbour slides off the left edge, jumps unseen to the
      // waiting spot past the right edge, and (in a short row) slides back in
      // from there.
      if (was === n - 1 && s !== n - 1) {
        return put(i, EXITED, move)
          .then(() => put(i, WAITING, { duration: 0 }))
          .then(() => poseAt(s, n) !== WAITING && put(i, poseAt(s, n), move));
      }
      return put(i, poseAt(s, n), move);
    });
    await Promise.all(steps);

    order.current = next;
    busy.current = false;
  }, [put, n]);

  useEffect(() => {
    if (reduce || !hovered || n < 2) return;
    advance();
    const id = setInterval(advance, HOVER_MS);
    return () => clearInterval(id);
  }, [hovered, reduce, advance, n]);

  return (
    <div className={`${styles.stage} ${styles[tone]}`} aria-hidden="true">
      <div className={styles.rail}>
        {screens.map((src, i) => (
          <div key={src} ref={(el) => (phones.current[i] = el)} className={styles.phone}>
            <div className={styles.screen}>
              <img src={src} alt="" loading={eager ? "eager" : "lazy"} draggable="false" />
            </div>
            <span ref={(el) => (shades.current[i] = el)} className={styles.shade} />
          </div>
        ))}
      </div>
    </div>
  );
}
