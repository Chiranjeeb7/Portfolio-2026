import { createElement } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1];

// Splits "curious by default, and I build until it's *trusted*." into words,
// each rising out of its own clipping mask in sequence. Words wrapped in
// *asterisks* render inside <em> so a component can style the emphasis.
// `trigger="mount"` plays on load (hero), otherwise it plays the first time
// the heading scrolls into view.
function parse(text) {
  return text.split(" ").map((raw, i) => {
    const em = /^\*(.+)\*([.,!?]?)$/.exec(raw);
    return em ? { key: i, word: em[1], tail: em[2], em: true } : { key: i, word: raw, tail: "", em: false };
  });
}

export default function RevealText({
  as = "h2",
  text,
  className,
  delay = 0,
  stagger = 0.055,
  trigger = "view",
  play: canPlay = true,
  emClassName,
  ...rest
}) {
  const reduce = useReducedMotion();
  const words = parse(text);

  if (reduce) {
    return createElement(
      as,
      { className, ...rest },
      words.map((w, i) => (
        <span key={w.key}>
          {w.em ? <em className={emClassName}>{w.word}</em> : w.word}
          {w.tail}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))
    );
  }

  const play = trigger === "mount" ? { animate: canPlay ? "shown" : "hidden" } : { whileInView: "shown", viewport: { once: true, amount: 0.6 } };

  return createElement(
    motion[as],
    {
      className,
      initial: "hidden",
      ...play,
      transition: { staggerChildren: stagger, delayChildren: delay },
      ...rest,
    },
    words.map((w, i) => (
      <span key={w.key}>
        <span className="mask">
          <motion.span
            variants={{
              hidden: { y: "115%", rotate: 4 },
              shown: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
            }}
          >
            {w.em ? <em className={emClassName}>{w.word}</em> : w.word}
            {w.tail}
          </motion.span>
        </span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}
