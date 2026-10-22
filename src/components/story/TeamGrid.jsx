import { motion, useReducedMotion } from "motion/react";
import styles from "./TeamGrid.module.css";

// One square per person, in the same square-cell language as the homepage's
// activity grid. `me` is my own square, `pod` the indices of the team I sat
// in. Cells fill in one after another when the grid scrolls into view.
export default function TeamGrid({ total, cols, me, pod = [], legend }) {
  const reduce = useReducedMotion();
  const podSet = new Set(pod);
  const play = reduce
    ? { initial: false, animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount: 0.3 } };

  return (
    <div className={styles.wrap}>
      <motion.div
        className={styles.grid}
        style={{ "--cols": cols }}
        transition={{ staggerChildren: Math.min(0.03, 0.9 / total) }}
        {...play}
      >
        {Array.from({ length: total }, (_, i) => (
          <motion.span
            key={i}
            className={`${styles.cell} ${i === me ? styles.me : podSet.has(i) ? styles.pod : ""}`}
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              shown: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
          />
        ))}
      </motion.div>
      <ul className={styles.legend}>
        {legend.map((item) => (
          <li key={item.label}>
            <span className={`${styles.swatch} ${styles[item.kind] ?? ""}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
