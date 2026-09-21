import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const NUM = /\d+(?:\.\d+)?/g;

// Counts every number inside a stat string up from zero the first time it
// scrolls into view ("18% → 72%" ticks both figures), so the outcome is the
// thing that moves. The final string is rendered from the start, so it is
// correct without JS, for screen readers, and under reduced motion; the
// animation only rewrites the text node, never React state.
export default function CountUp({ value, className, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const targets = (value.match(NUM) ?? []).map(Number);
    if (targets.length === 0) return;
    const el = ref.current;
    const render = (t) => {
      let n = 0;
      el.textContent = value.replace(NUM, (m) => {
        const target = targets[n++];
        const decimals = m.includes(".") ? m.split(".")[1].length : 0;
        return (target * t).toFixed(decimals);
      });
    };
    render(0);
    const controls = animate(0, 1, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: render });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
