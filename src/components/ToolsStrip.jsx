import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { skills } from "../data/content";
import styles from "./ToolsStrip.module.css";

const COPIES = 4;
const BASE_SPEED = 2; // % of the track per second

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// The page's one marquee. It drifts on its own, surges with scroll speed and
// flips direction when the visitor scrolls back up, so the band feels tied to
// the page rather than looping on a timer. Hovering slows it to a crawl so a
// badge can be read. Reduced motion gets a still, wrapped list.
export default function ToolsStrip() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  // Direction and hover speed each ease toward their target, like a belt
  // with some weight: a reversal slows through zero instead of flipping in
  // one frame, and hover coasts down to a crawl instead of braking dead.
  const direction = useRef(-1);
  const dirTarget = useRef(-1);
  const pace = useRef(1);
  const paceTarget = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) dirTarget.current = 1;
    else if (b > 0) dirTarget.current = -1;
    const ease = (ms) => 1 - Math.exp(-delta / ms);
    direction.current += (dirTarget.current - direction.current) * ease(120);
    pace.current += (paceTarget.current - pace.current) * ease(160);
    let move = direction.current * BASE_SPEED * (delta / 1000);
    move += move * Math.abs(b);
    baseX.set(baseX.get() + move * pace.current);
  });

  const items = skills.map((s) => (
    <li key={s} className="tag">
      {s}
    </li>
  ));

  return (
    <section className={styles.strip} aria-labelledby="tools-heading">
      <div className={`container ${styles.inner}`}>
        <h2 id="tools-heading" className={styles.label}>
          Tools &amp; craft
        </h2>
        {reduce ? (
          <ul className={styles.still}>{items}</ul>
        ) : (
          <div
            className={styles.viewport}
            onPointerEnter={() => (paceTarget.current = 0.15)}
            onPointerLeave={() => (paceTarget.current = 1)}
          >
            <motion.div className={styles.track} style={{ x }}>
              {Array.from({ length: COPIES }, (_, i) => (
                <ul key={i} className={styles.group} aria-hidden={i > 0 ? "true" : undefined}>
                  {items}
                </ul>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
