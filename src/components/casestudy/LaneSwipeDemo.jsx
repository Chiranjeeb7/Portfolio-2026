import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import laneRank3 from "../../assets/photos/transporter-lane-rank-3.webp";
import laneRank2 from "../../assets/photos/transporter-lane-rank-2.webp";
import laneRank1 from "../../assets/photos/transporter-lane-rank-1.webp";
import styles from "./LaneSwipeDemo.module.css";

// One real screen per lane, each in a different rank state (3rd, 2nd, 1st)
// with its own pager position (1/12, 2/12, 3/12). All three share the same
// layout, so one set of crop boxes fits every screen.
const LANES = [laneRank3, laneRank2, laneRank1];
// Order of stops in one loop: forward through every lane, then back.
const PATH = [1, 2, 1, 0];
const HOLD_MS = 1500;
const SLIDE = { duration: 0.7, ease: [0.32, 0.72, 0, 1] };

// Lanes stack like a deck, later lanes on top. Relative to the lane on
// screen, a lane already passed sits underneath, sunk back and dimmed; the
// current one is flat and full size; a lane still to come waits off the
// right edge, tilted slightly as if mid-flick. Swiping forward slides the
// next card in over the current one; swiping back slides the top card off
// and lifts the one beneath.
function poseOf(i, current) {
  if (i < current) return { card: { x: "0%", scale: 0.9, rotate: 0 }, shade: 0.55 };
  if (i === current) return { card: { x: "0%", scale: 1, rotate: 0 }, shade: 0 };
  return { card: { x: "112%", scale: 1, rotate: 6 }, shade: 0 };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The swipe-between-lanes interaction, acted out on the real auction room
// screen: the header stays put while lane cards slide over and off one
// another, led by a touch point dragging across; rank and pager
// change with the lane, since each card is its own screen. Loops while on
// screen, alternating direction so both swipes are shown. Reduced motion
// gets the still first lane.
export default function LaneSwipeDemo() {
  const rootRef = useRef(null);
  const cards = useRef([]);
  const shades = useRef([]);
  const finger = useRef(null);
  const pagers = useRef([]);
  const current = useRef(0);
  const inView = useInView(rootRef, { amount: 0.5 });
  const reduce = useReducedMotion();

  // Cards start in their deck poses, set through motion so its later
  // animations start from where they really are.
  useLayoutEffect(() => {
    cards.current.forEach((el, i) => {
      const { card, shade } = poseOf(i, 0);
      animate(el, card, { duration: 0 });
      animate(shades.current[i], { opacity: shade }, { duration: 0 });
    });
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    let alive = true;
    const running = [];
    const run = (...args) => {
      const a = animate(...args);
      running.push(a);
      return a;
    };

    const swipe = async (to) => {
      const from = current.current;
      const left = to > from; // swiping left brings in the next lane
      const start = left ? "74%" : "26%";
      const end = left ? "26%" : "74%";

      await run(finger.current, { left: start, opacity: [0, 0.95], scale: [0.7, 1] }, { duration: 0.25 });
      if (!alive) return;
      run(finger.current, { left: end }, { ...SLIDE, duration: 0.6 });
      const slides = cards.current.flatMap((el, i) => {
        const { card, shade } = poseOf(i, to);
        return [run(el, card, { ...SLIDE, delay: 0.06 }), run(shades.current[i], { opacity: shade }, { ...SLIDE, delay: 0.06 })];
      });
      await sleep(260);
      if (!alive) return;
      pagers.current.forEach((el, i) => run(el, { opacity: i === to ? 1 : 0 }, { duration: 0.2 }));
      current.current = to;
      await Promise.all(slides);
      if (!alive) return;
      await run(finger.current, { opacity: 0, scale: 0.85 }, { duration: 0.25 });
    };

    (async () => {
      let step = PATH.indexOf(current.current);
      while (alive) {
        await sleep(HOLD_MS);
        if (!alive) return;
        step = (step + 1) % PATH.length;
        await swipe(PATH[step]);
      }
    })();

    return () => {
      alive = false;
      running.forEach((a) => a.stop());
    };
  }, [inView, reduce]);

  return (
    <div ref={rootRef} className={styles.phone} role="img" aria-label="Swiping left and right between lanes in a live auction">
      <div className={styles.screen}>
        <img src={LANES[0]} alt="" className={styles.base} draggable="false" />

        {/* Covers the screenshot's own card, so only the moving cards show
            there; the stacked card behind matches the deck in the screen. */}
        <div className={styles.backdrop}>
          <span className={styles.deck} />
        </div>

        {LANES.map((src, i) => (
          <div key={src} ref={(el) => (cards.current[i] = el)} className={styles.card} style={{ zIndex: i + 1 }}>
            <div className={styles.cardMask}>
              <img src={src} alt="" className={styles.cardImg} draggable="false" />
              <span ref={(el) => (shades.current[i] = el)} className={styles.shade} />
            </div>
          </div>
        ))}

        {/* Each screen's own pager, crossfaded as the lane changes. */}
        {LANES.map((src, i) => (
          <div
            key={src}
            ref={(el) => (pagers.current[i] = el)}
            className={styles.pager}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <img src={src} alt="" className={styles.pagerImg} draggable="false" />
          </div>
        ))}
        <span ref={finger} className={styles.finger} />
      </div>
    </div>
  );
}
