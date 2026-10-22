import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { chapters, origins, today } from "../../data/story";
import styles from "./StoryTeaser.module.css";

// The way into the Story page from the homepage About section: a strip of
// graph paper with the whole career as a track, 2015 to today. The notebook
// car from the story drives it when the strip scrolls into view, lighting
// each year as it passes, and drives it again on hover. The whole strip is
// one link.

const YEARS = [...origins, ...chapters, today].map((s) => Number(s.year));
const FIRST = YEARS[0];
const SPAN = YEARS[YEARS.length - 1] - FIRST;
// Spaced by real time, so the gaps between years mean something.
const STOPS = YEARS.map((y) => ({ year: y, at: (y - FIRST) / SPAN }));
const EASE_DRIVE = [0.65, 0, 0.35, 1];

function Car({ spin }) {
  return (
    <svg viewBox="0 0 106 72" className={styles.carSvg} aria-hidden="true">
      <path d="M8 58 L8 50 C8 46 12 44 18 43 L32 41 C40 32 50 27 62 27 C72 27 80 33 86 40 L92 42 C96 43 98 46 98 51 L98 58 H86 A10 10 0 0 0 66 58 H38 A10 10 0 0 0 18 58 Z" className={styles.carBody} />
      <path d="M40 40 C46 34 52 32 60 32 L61 40 Z M66 32 C72 33 77 36 81 40 L67 40 Z" className={styles.carGlass} />
      <path d="M92 46 L98 48" className={styles.carLight} />
      {[28, 76].map((cx) => (
        <motion.g key={cx} style={{ rotate: spin }}>
          <circle cx={cx} cy={59} r={8} className={styles.wheel} />
          <path d={`M${cx - 5} 59 H${cx + 5} M${cx} 54 V64`} className={styles.spoke} />
        </motion.g>
      ))}
    </svg>
  );
}

export default function StoryTeaser() {
  const reduce = useReducedMotion();
  const cardRef = useRef(null);
  const trackRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.6 });

  // Progress along the track, 0..1, and the track's width in pixels: the car
  // rides on transforms derived from both, never on React state.
  const p = useMotionValue(reduce ? 1 : 0);
  const width = useMotionValue(0);
  const carX = useTransform(() => p.get() * width.get());
  const spin = useTransform(p, (v) => v * 1080);
  const drive = useRef(null);

  // Only the "which years has it passed" index is state: it changes seven
  // times per drive, not every frame.
  const [reached, setReached] = useState(reduce ? STOPS.length - 1 : -1);
  useMotionValueEvent(p, "change", (v) => {
    let idx = -1;
    STOPS.forEach((s, i) => {
      if (v >= s.at - 0.005) idx = i;
    });
    setReached((r) => (r === idx ? r : idx));
  });

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => width.set(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const go = (duration, delay = 0) => {
    drive.current?.stop();
    p.set(0);
    drive.current = animate(p, 1, { duration, delay, ease: EASE_DRIVE });
  };

  useEffect(() => {
    if (!inView || reduce) return;
    go(2.4, 0.3);
    return () => drive.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const onEnter = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    go(1.5);
  };

  const done = reached === STOPS.length - 1;

  return (
    <a href="#/story" className={styles.teaser} ref={cardRef} onPointerEnter={onEnter}>
      <div className={styles.copy}>
        <span className={styles.kicker}>The long version</span>
        <span className={styles.title}>From sketching cars to designing AI agents.</span>
      </div>

      <div className={styles.trackWrap} aria-hidden="true">
        <div className={styles.track} ref={trackRef}>
          <span className={styles.line} />
          <motion.span className={styles.lineFill} style={{ scaleX: p }} />
          {STOPS.map((s, i) => (
            <span
              key={s.year}
              className={`${styles.stop} ${i <= reached ? styles.stopOn : ""} ${
                i === STOPS.length - 1 ? styles.stopLast : ""
              }`}
              style={{ left: `${s.at * 100}%` }}
            >
              <span className={styles.marker} />
              <span className={styles.year}>{s.year}</span>
            </span>
          ))}
          <span className={`${styles.spark} ${done ? styles.sparkOn : ""}`}>
            <Sparkles size={20} strokeWidth={2} />
          </span>
          <motion.span className={styles.car} style={{ x: carX }}>
            <Car spin={spin} />
          </motion.span>
        </div>
      </div>

      <span className={`btn btn-primary ${styles.cta}`}>
        <span className="roll">
          <span>Read my story</span>
          <span aria-hidden="true">Read my story</span>
        </span>
        <ArrowRight size={15} className={styles.ctaArrow} />
      </span>
    </a>
  );
}
