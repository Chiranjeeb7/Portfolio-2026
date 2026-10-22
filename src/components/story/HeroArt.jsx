import { motion, useReducedMotion } from "motion/react";
import { Sketch, Stroke } from "./Sketches";
import styles from "./HeroArt.module.css";

// Small drawn touches for the Story hero headline (see HeroSheet.jsx). All
// decorative and aria-hidden.

// A car from the 2015 notebooks, drawn live while `active` (hovering the
// word "sketching") and erased again when it ends.
export function NotebookCar({ active }) {
  return (
    <Sketch viewBox="0 0 106 80" rough active={active}>
      <Stroke d="M8 58 L8 50 C8 46 12 44 18 43 L32 41 C40 32 50 27 62 27 C72 27 80 33 86 40 L92 42 C96 43 98 46 98 51 L98 58" at={0} dur={0.7} width={2} />
      <Stroke d="M8 58 H18 A10 10 0 0 1 38 58 H66 A10 10 0 0 1 86 58 H98" at={0.35} dur={0.5} width={2} />
      <Stroke d="M36 59 A8 8 0 1 1 20 59 A8 8 0 1 1 36 59 M84 59 A8 8 0 1 1 68 59 A8 8 0 1 1 84 59" at={0.6} dur={0.4} width={2} />
      <Stroke d="M40 40 C46 34 52 32 60 32 L61 40 Z M66 32 C72 33 77 36 81 40 L67 40 Z" at={0.8} dur={0.4} tone="muted" width={1.5} />
      <Stroke d="M90 46 L97 49" at={1} dur={0.2} tone="accent" width={2.5} />
      <Stroke d="M0 36 H10 M2 46 H8" at={1.05} dur={0.3} tone="faint" width={1.5} />
    </Sketch>
  );
}

// A pencil scribble under a word, drawn once the headline has risen.
export function Scribble({ at = 1.1 }) {
  const reduce = useReducedMotion();
  return (
    <svg className={styles.scribble} viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M3 10 C40 4 70 13 104 8 S168 5 197 9 M18 14 C60 10 120 14 186 11"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { delay: at, duration: 0.9, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: at, duration: 0.01 } }}
      />
    </svg>
  );
}

// A sparkle that pops beside a word, then keeps twinkling.
export function WordSparkle({ at = 1.4 }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={styles.wordSparkle}
      aria-hidden="true"
      initial={reduce ? false : { scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: at, type: "spring", stiffness: 300, damping: 12 }}
    >
      <svg viewBox="0 0 60 60">
        <path d="M30 4 L35 25 L56 30 L35 35 L30 56 L25 35 L4 30 L25 25 Z" />
      </svg>
      <svg viewBox="0 0 60 60" className={styles.wordSparkleSmall}>
        <path d="M30 4 L35 25 L56 30 L35 35 L30 56 L25 35 L4 30 L25 25 Z" />
      </svg>
    </motion.span>
  );
}
