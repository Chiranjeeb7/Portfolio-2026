import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import styles from "./motion.module.css";

// A hairline of accent across the very top that fills as the page is read:
// on long case studies it answers "how much is left?" at a glance.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className={styles.progress}
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      aria-hidden="true"
    />
  );
}
