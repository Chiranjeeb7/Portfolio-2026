// Shared presenter shell for the unlisted interview decks (#/planner-deck,
// #/ai-deck): a fixed 1600x900 stage scaled to fit the screen, keyboard and
// swipe navigation, slide number in the URL, and the presenter tools (pen,
// highlighter, laser, eraser, timer, blank screen, full-size media, overview).
// Each deck passes its slides; slides build on R (reveal) and Media below.
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Eraser,
  Highlighter,
  Keyboard,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  MonitorOff,
  Moon,
  MousePointer2,
  Pen,
  Sun,
  Timer,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import Annotator from "./Annotator";
import { ZoomContext } from "./zoom";
import { useTheme } from "../../hooks/useTheme";
import s from "./Deck.module.css";

const STAGE_W = 1600;
const STAGE_H = 900;

// Where the soft accent glow drifts to, slide by slide (stage %).
const GLOW_SPOTS = [
  ["68%", "18%"],
  ["12%", "70%"],
  ["82%", "78%"],
  ["30%", "12%"],
  ["58%", "60%"],
  ["8%", "28%"],
];

const clamp = (n, last) => Math.max(0, Math.min(last, n));
// True while the address bar points at this deck ("#/<slug>" or "#/<slug>/<n>").
const isOwnHash = (slug) => new RegExp(`^#/${slug}(/\\d+)?$`).test(window.location.hash);
const slideFromHash = (slug, last) => {
  const n = Number(window.location.hash.match(new RegExp(`^#/${slug}/(\\d+)`))?.[1]) || 1;
  return clamp(n - 1, last);
};

const EASE = [0.16, 1, 0.3, 1];

// One revealed item: rises out of a soft blur after the slide's earlier items.
export function R({ as = "div", className, children }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className} variants={reduce ? ITEM_STILL : ITEM}>
      {children}
    </Tag>
  );
}

const ITEM = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
};
const ITEM_STILL = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } };

// Headline whose words rise out of clipping masks one after another (the
// site's hero idiom). "*a phrase*" is the accent, which also gets a drawn-in
// underline; "\n" forces a line break.
function parseWords(text) {
  const out = [];
  text.split(/(\*[^*]+\*|\n)/).forEach((seg) => {
    if (!seg) return;
    if (seg === "\n") return out.push({ br: true });
    const accent = seg.startsWith("*");
    const words = (accent ? seg.slice(1, -1) : seg).split(" ").filter(Boolean);
    words.forEach((w) => {
      const prev = out[out.length - 1];
      // Lone punctuation sticks to the word before it.
      if (/^[.,!?:;]+$/.test(w) && prev && !prev.br) prev.word += w;
      else out.push({ word: w, accent });
    });
  });
  return out;
}

const WORD = {
  hidden: { y: "108%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};
const UNDERLINE = {
  hidden: { backgroundSize: "0% 0.07em" },
  show: { backgroundSize: "100% 0.07em", transition: { duration: 0.9, delay: 0.55, ease: EASE } },
};

export function Words({ as = "h2", text, className }) {
  const reduce = useReducedMotion();
  const items = parseWords(text);
  const Tag = motion[as];
  if (reduce) {
    return (
      <Tag className={className} variants={ITEM_STILL}>
        {text.replace(/\*/g, "").split("\n").map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </Tag>
    );
  }
  // Consecutive accent words share one underline span so it wraps with them.
  const groups = [];
  items.forEach((it) => {
    const g = groups[groups.length - 1];
    if (!it.br && it.accent && g?.accent) g.items.push(it);
    else groups.push({ accent: !it.br && it.accent, br: it.br, items: [it] });
  });
  const word = (it, k) => (
    <span key={k} className={s.wordMask}>
      <motion.span className={s.word} variants={WORD}>
        {it.word}
      </motion.span>
    </span>
  );
  return (
    <Tag className={className} aria-label={text.replace(/\*/g, "").replace("\n", " ")} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
      {groups.map((g, gi) => {
        if (g.br) return <br key={gi} />;
        const last = gi === groups.length - 1 || groups[gi + 1].br;
        if (!g.accent) {
          return g.items.map((it, wi) => (
            <span key={`${gi}-${wi}`} aria-hidden="true">
              {word(it, wi)}
              {(!last || wi < g.items.length - 1) && " "}
            </span>
          ));
        }
        return (
          <span key={gi} aria-hidden="true">
            <motion.span className={s.accentLine} variants={UNDERLINE}>
              {g.items.map((it, wi) => (
                <span key={wi}>
                  {word(it, wi)}
                  {wi < g.items.length - 1 && " "}
                </span>
              ))}
            </motion.span>
            {!last && " "}
          </span>
        );
      })}
    </Tag>
  );
}

// Counts every number in a stat string up from zero when the slide opens.
// The final string renders from the start (correct without JS and under
// reduced motion); the animation only rewrites the text node.
const NUM = /\d[\d,]*(?:\.\d+)?/g;
export function Count({ value, className, delay = 0.35, duration = 1.5 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    const parts = value.match(NUM);
    if (reduce || !el || !parts) return;
    const fmt = (m, k) => {
      const n = Number(m.replace(/,/g, "")) * k;
      if (m.includes(",")) return Math.round(n).toLocaleString("en-US");
      const dec = m.includes(".") ? m.split(".")[1].length : 0;
      return n.toFixed(dec);
    };
    const render = (k) => {
      let i = 0;
      el.textContent = value.replace(NUM, () => fmt(parts[i++], k));
    };
    render(0);
    const c = animate(0, 1, { duration, delay, ease: EASE, onUpdate: render });
    return () => {
      c.stop();
      el.textContent = value;
    };
  }, [value, reduce, delay, duration]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

// A bar that fills from `from`% to `to`% when the slide opens.
export function Meter({ to, from = 0, className, delay = 0.5 }) {
  const reduce = useReducedMotion();
  return (
    <div className={`${s.meter} ${className ?? ""}`} aria-hidden="true">
      <motion.span
        className={s.meterFill}
        variants={{
          hidden: { width: `${reduce ? to : from}%` },
          show: { width: `${to}%`, transition: { duration: reduce ? 0 : 1.6, delay, ease: EASE } },
        }}
      />
      {from > 0 && <span className={s.meterMark} style={{ left: `${from}%` }} />}
    </div>
  );
}

// A screenshot or recording in a browser-style frame. It opens through a
// clip as the slide arrives, tilts slightly toward the pointer, and opens
// full size on click.
const FRAME = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  show: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 1, ease: EASE } },
};
const FRAME_INNER = {
  hidden: { scale: 1.08 },
  show: { scale: 1, transition: { duration: 1.4, ease: EASE } },
};

// Play / pause for a slide's video, so the presenter decides when it moves.
// Mirrors the video's own state, so K and clicks elsewhere stay in sync.
export function PlayToggle({ videoRef, className, size = 14, withLabel = false }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // timeupdate also catches an autoplay that started before this mounted.
    const sync = () => setPlaying(!v.paused);
    const events = ["play", "playing", "pause", "timeupdate"];
    events.forEach((ev) => v.addEventListener(ev, sync));
    return () => events.forEach((ev) => v.removeEventListener(ev, sync));
  }, [videoRef]);
  const toggle = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const what = playing ? "Pause" : "Play";
  return (
    <button type="button" className={className} onClick={toggle} aria-label={`${what} video (K)`} title={`${what} (K)`}>
      {playing ? <Pause size={size} fill="currentColor" /> : <Play size={size} fill="currentColor" />}
      {withLabel && <span>{what}</span>}
    </button>
  );
}

export function Media({ media, label, chrome = true }) {
  const reduce = useReducedMotion();
  const zoom = useContext(ZoomContext);
  const videoRef = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 });
  const el = media.video ? (
    <video ref={videoRef} className={s.mediaEl} src={media.video} poster={media.poster} autoPlay={!reduce} muted loop playsInline aria-label={label} />
  ) : (
    <img className={s.mediaEl} src={media.img} alt={label} />
  );
  const tilt = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  return (
    <motion.div
      className={s.frame}
      variants={reduce ? ITEM_STILL : FRAME}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      onPointerMove={tilt}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {(chrome || media.video) && (
        <div className={s.frameBar}>
          <span className={s.frameDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {media.video && <PlayToggle videoRef={videoRef} className={s.frameToggle} withLabel />}
        </div>
      )}
      <button type="button" className={s.zoomable} onClick={() => zoom({ ...media, label })} aria-label={`${label}: view full size`}>
        <motion.div className={s.frameInner} variants={reduce ? undefined : FRAME_INNER}>
          {el}
        </motion.div>
        <span className={s.zoomHint} aria-hidden="true">
          <Maximize2 size={14} /> Full size
        </span>
      </button>
    </motion.div>
  );
}

/* ---------- Deck shell ---------- */

const TOOLS = [
  { id: "pen", label: "Pen", key: "P", Icon: Pen },
  { id: "highlighter", label: "Highlighter", key: "H", Icon: Highlighter },
  { id: "laser", label: "Laser pointer", key: "L", Icon: Crosshair },
  { id: "eraser", label: "Eraser", key: "E", Icon: Eraser },
];
const TOOL_KEYS = { p: "pen", h: "highlighter", l: "laser", e: "eraser" };

// Pen colours read on both themes; highlighter colours are the usual marker set.
const PALETTES = {
  pen: [
    { name: "Orange", value: "var(--accent)" },
    { name: "Blue", value: "#2f6fdb" },
    { name: "Green", value: "#2f9e44" },
    { name: "Ink", value: "var(--ink)" },
  ],
  highlighter: [
    { name: "Yellow", value: "#ffd43b" },
    { name: "Orange", value: "#ff922b" },
    { name: "Blue", value: "#74c0fc" },
    { name: "Green", value: "#8ce99a" },
  ],
};

const SHORTCUTS = [
  ["→  Space  Enter", "Next slide"],
  ["←  Backspace", "Previous slide"],
  ["Home / End", "First / last slide"],
  ["O", "All slides"],
  ["Click a screenshot", "View it full size (Esc closes)"],
  ["P", "Pen"],
  ["H", "Highlighter"],
  ["L", "Laser pointer"],
  ["E", "Eraser"],
  ["1 – 4", "Pen or highlighter colour"],
  ["Z  or  Ctrl+Z", "Undo last mark"],
  ["C", "Clear marks on this slide"],
  ["Esc", "Put the tool down"],
  ["B", "Blank the screen"],
  ["T", "Reset the timer"],
  ["D", "Dark mode"],
  ["F", "Fullscreen"],
  ["K", "Play / pause the slide's video"],
  ["?", "This list"],
];

function formatElapsed(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  return `${String(m).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export default function Deck({ slides, slug, brand, label, preload = [] }) {
  const last = slides.length - 1;
  const reduce = useReducedMotion();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [index, setIndex] = useState(() => slideFromHash(slug, last));
  const [scale, setScale] = useState(1);
  const [overview, setOverview] = useState(false);
  const [help, setHelp] = useState(false);
  const [zoomed, setZoomed] = useState(null);
  const [blank, setBlank] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [tool, setTool] = useState(null);
  const [colorIdx, setColorIdx] = useState({ pen: 0, highlighter: 0 });
  // Marks per slide, kept while the deck is open so going back shows them.
  const [marks, setMarks] = useState({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const touch = useRef(null);
  const stageRef = useRef(null);
  const cursorX = useMotionValue(STAGE_W / 2);
  const cursorY = useMotionValue(STAGE_H / 2);
  const cursorOn = useMotionValue(0);
  const glowX = useSpring(cursorX, { stiffness: 90, damping: 22, mass: 0.8 });
  const glowY = useSpring(cursorY, { stiffness: 90, damping: 22, mass: 0.8 });

  // Direction of travel, derived while rendering (React's "adjust state on
  // prop change" pattern), so the new slide already knows which way to enter.
  const [prevIndex, setPrevIndex] = useState(index);
  const [dir, setDir] = useState(1);
  if (index !== prevIndex) {
    setPrevIndex(index);
    setDir(index > prevIndex ? 1 : -1);
  }

  const go = useCallback((n) => setIndex((i) => clamp(typeof n === "function" ? n(i) : n, last)), [last]);
  const slideMarks = marks[index] ?? [];
  const setSlideMarks = useCallback((next) => setMarks((m) => ({ ...m, [index]: next })), [index]);
  const undo = useCallback(() => setMarks((m) => ({ ...m, [index]: (m[index] ?? []).slice(0, -1) })), [index]);
  const clearSlide = useCallback(() => setMarks((m) => ({ ...m, [index]: [] })), [index]);
  const palette = PALETTES[tool];
  const color = palette ? palette[colorIdx[tool]].value : null;

  // Slide number lives in the URL (replaceState, so the router never sees a
  // route change), so a refresh mid-interview lands on the same slide.
  // Only while the URL is still ours: leaving for another page must not be
  // rewritten back to the deck.
  useEffect(() => {
    if (isOwnHash(slug)) history.replaceState(null, "", `#/${slug}/${index + 1}`);
  }, [index, slug]);

  // A slide number typed into the address bar jumps there.
  useEffect(() => {
    const onHash = () => {
      if (isOwnHash(slug)) setIndex(slideFromHash(slug, last));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [slug, last]);

  // Fit the 16:9 stage to the window.
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Private page: keep it out of search results, and no page scroll.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const root = document.documentElement;
    root.classList.add(s.lock);
    return () => {
      meta.remove();
      root.classList.remove(s.lock);
    };
  }, []);

  // Warm every image so no slide pops in late.
  useEffect(() => {
    preload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [preload]);

  // Talk timer, counting from when the deck opened (T resets it).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const resetTimer = useCallback(() => {
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
  }, []);

  const pickTool = useCallback((id) => setTool((t) => (t === id ? null : id)), []);

  // Hide the controls and cursor while presenting; any mouse move brings them back.
  useEffect(() => {
    let t;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 2500);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", wake);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      const lower = k.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && lower === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (zoomed) {
        if (k === "Escape" || k === " " || k === "Enter") {
          e.preventDefault();
          setZoomed(null);
        }
        return;
      }

      // A blank screen comes back on any key.
      if (blank) {
        e.preventDefault();
        setBlank(false);
        return;
      }
      if (help) {
        if (k === "Escape" || k === "?") setHelp(false);
        return;
      }
      if (overview) {
        if (k === "Escape" || lower === "o" || lower === "g") setOverview(false);
        return;
      }

      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) {
        e.preventDefault();
        go((i) => i + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) {
        e.preventDefault();
        go((i) => i - 1);
      } else if (k === "Home") go(0);
      else if (k === "End") go(last);
      else if (k === "Escape") setTool(null);
      else if (TOOL_KEYS[lower]) pickTool(TOOL_KEYS[lower]);
      else if (/^[1-4]$/.test(k) && (tool === "pen" || tool === "highlighter")) {
        setColorIdx((c) => ({ ...c, [tool]: Number(k) - 1 }));
      } else if (lower === "z") undo();
      else if (lower === "c") clearSlide();
      else if (lower === "b" || k === ".") setBlank(true);
      else if (lower === "t") resetTimer();
      else if (lower === "f") toggleFullscreen();
      else if (lower === "o" || lower === "g") setOverview(true);
      else if (lower === "d") toggleTheme();
      else if (k === "?") setHelp(true);
      else if (lower === "k") {
        // Play / pause the video on the current slide.
        const v = stageRef.current?.querySelector("section video");
        if (v) {
          if (v.paused) v.play().catch(() => {});
          else v.pause();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, last, overview, help, blank, zoomed, tool, pickTool, undo, clearSlide, resetTimer, toggleFullscreen, toggleTheme]);

  // Swipe between slides, unless a drawing tool has the touch.
  const onTouchStart = (e) => {
    touch.current = tool ? null : e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 50) go((i) => i + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  const slide = slides[index];
  const { Body } = slide;
  const hideChrome = idle && !overview && !help && !zoomed;
  const enterDelay = 0.12;

  // A soft blurred glow trails the pointer (stage coordinates, sprung so it
  // lags a little behind), and fades out when the pointer leaves the stage.
  const onStageMove = (e) => {
    const el = stageRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    cursorX.set(((e.clientX - r.left) / r.width) * STAGE_W);
    cursorY.set(((e.clientY - r.top) / r.height) * STAGE_H);
    if (cursorOn.get() === 0) animate(cursorOn, 1, { duration: 0.6 });
  };
  const onStageLeave = () => animate(cursorOn, 0, { duration: 0.8 });
  const glow = GLOW_SPOTS[index % GLOW_SPOTS.length];

  return (
    <div
      className={`${s.deck} ${hideChrome ? s.idle : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={stageRef}
        className={s.stage}
        data-tone={slide.tone ?? "light"}
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
        role="region"
        aria-roledescription="slide deck"
        aria-label={label}
        onPointerMove={onStageMove}
        onPointerLeave={onStageLeave}
      >
        {!reduce && (
          <motion.div
            className={s.cursorGlow}
            aria-hidden="true"
            style={{ x: glowX, y: glowY, opacity: cursorOn }}
          />
        )}
        <motion.div
          className={s.bgGlow}
          aria-hidden="true"
          initial={false}
          animate={{ left: glow[0], top: glow[1] }}
          transition={{ duration: reduce ? 0 : 1.8, ease: EASE }}
        />
        <header className={s.stageHead}>
          {/* A new chapter's name slides in with a short accent rule. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={slide.chapter}
              className={`${s.label} ${s.chapterLabel}`}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.1, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {slide.chapter && (
                <motion.i
                  className={s.chapterRule}
                  aria-hidden="true"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1, transition: { duration: 0.6, delay: 0.25, ease: EASE } }}
                />
              )}
              {slide.chapter}
            </motion.span>
          </AnimatePresence>
          <span className={s.label}>{brand}</span>
        </header>

        <AnimatePresence mode="wait" initial={false} custom={{ dir, reduce }}>
          <motion.section
            key={index}
            className={s.slide}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            custom={{ dir, reduce }}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: (c) => ({ opacity: c.reduce ? 0 : 1, x: c.reduce ? 0 : 70 * c.dir }),
              show: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: reduce ? 0.2 : 0.8,
                  ease: EASE,
                  delayChildren: reduce ? 0 : enterDelay,
                  staggerChildren: reduce ? 0 : 0.09,
                },
              },
              exit: (c) => ({
                opacity: 0,
                x: c.reduce ? 0 : -50 * c.dir,
                filter: c.reduce ? "none" : "blur(8px)",
                transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
              }),
            }}
          >
            <ZoomContext.Provider value={setZoomed}>
              <Body />
            </ZoomContext.Provider>
          </motion.section>
        </AnimatePresence>

        <footer className={s.stageFoot}>
          <div className={s.segments} aria-hidden="true">
            {slides.map((sl, i) => (
              <span
                key={i}
                className={`${i <= index ? s.segOn : ""} ${i === index ? s.segNow : ""} ${
                  i > 0 && sl.chapter !== slides[i - 1].chapter ? s.segBreak : ""
                }`}
              />
            ))}
          </div>
          <span className={s.counter}>
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </footer>

        <Annotator
          key={`${index}-${tool}`}
          width={STAGE_W}
          height={STAGE_H}
          tool={tool}
          color={color}
          strokes={slideMarks}
          onChange={setSlideMarks}
        />

      </div>

      <div className={s.toolbar} role="toolbar" aria-label="Presenter tools">
        <div className={s.group}>
          <button type="button" onClick={() => go((i) => i - 1)} disabled={index === 0} aria-label="Previous slide" title="Previous (←)">
            <ChevronLeft size={18} />
          </button>
          <span className={s.slideNum}>
            {index + 1}/{slides.length}
          </span>
          <button type="button" onClick={() => go((i) => i + 1)} disabled={index === slides.length - 1} aria-label="Next slide" title="Next (→)">
            <ChevronRight size={18} />
          </button>
        </div>

        <span className={s.controlSep} />

        <div className={s.group}>
          <button
            type="button"
            className={!tool ? s.on : ""}
            onClick={() => setTool(null)}
            aria-pressed={!tool}
            aria-label="Pointer (Esc)"
            title="Pointer (Esc)"
          >
            <MousePointer2 size={16} />
          </button>
          {TOOLS.map(({ id, label, key, Icon }) => (
            <button
              key={id}
              type="button"
              className={tool === id ? s.on : ""}
              onClick={() => pickTool(id)}
              aria-pressed={tool === id}
              aria-label={`${label} (${key})`}
              title={`${label} (${key})`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {palette && (
          <div className={s.group} role="radiogroup" aria-label={`${tool} colour`}>
            {palette.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={colorIdx[tool] === i}
                className={`${s.swatch} ${colorIdx[tool] === i ? s.swatchOn : ""}`}
                onClick={() => setColorIdx((ci) => ({ ...ci, [tool]: i }))}
                aria-label={`${c.name} (${i + 1})`}
                title={`${c.name} (${i + 1})`}
              >
                <span style={{ background: c.value }} />
              </button>
            ))}
          </div>
        )}

        <div className={s.group}>
          <button type="button" onClick={undo} disabled={!slideMarks.length} aria-label="Undo (Z)" title="Undo (Z)">
            <Undo2 size={16} />
          </button>
          <button type="button" onClick={clearSlide} disabled={!slideMarks.length} aria-label="Clear this slide (C)" title="Clear this slide (C)">
            <Trash size={16} />
          </button>
        </div>

        <span className={s.controlSep} />

        <div className={s.group}>
          <button type="button" className={s.timer} onClick={resetTimer} aria-label="Elapsed time, click to reset (T)" title="Elapsed time · click to reset (T)">
            <Timer size={15} />
            <span>{formatElapsed(now - startedAt)}</span>
          </button>
          <button type="button" onClick={() => setBlank(true)} aria-label="Blank screen (B)" title="Blank screen (B)">
            <MonitorOff size={16} />
          </button>
          <button type="button" onClick={() => setOverview(true)} aria-label="All slides (O)" title="All slides (O)">
            <LayoutGrid size={16} />
          </button>
          <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode (D)" title="Dark mode (D)">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen (F)" title="Fullscreen (F)">
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button type="button" onClick={() => setHelp(true)} aria-label="Keyboard shortcuts (?)" title="Shortcuts (?)">
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {zoomed && (
        <div className={s.viewer} role="dialog" aria-label={zoomed.label} onClick={() => setZoomed(null)}>
          {zoomed.video ? (
            <video src={zoomed.video} poster={zoomed.poster} autoPlay={!reduce} muted loop playsInline controls onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={zoomed.img} alt={zoomed.label} />
          )}
          <div className={s.viewerBar}>
            <span>{zoomed.label}</span>
            <button type="button" onClick={() => setZoomed(null)} aria-label="Close full size view (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {blank && (
        <button type="button" className={s.blank} onClick={() => setBlank(false)} aria-label="Show the slide again" />
      )}

      {help && (
        <div className={s.helpScrim} onClick={() => setHelp(false)}>
          <div className={s.help} role="dialog" aria-label="Keyboard shortcuts" onClick={(e) => e.stopPropagation()}>
            <div className={s.overviewHead}>
              <span className={s.label}>Keyboard shortcuts</span>
              <button type="button" onClick={() => setHelp(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <dl className={s.helpList}>
              {SHORTCUTS.map(([keys, what]) => (
                <div key={what}>
                  <dt>{keys}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {overview && (
        <div className={s.overview} role="dialog" aria-label="All slides">
          <div className={s.overviewHead}>
            <span className={s.label}>All slides</span>
            <a href="#/presentations" className={s.allDecks}>
              All presentations
            </a>
            <button type="button" onClick={() => setOverview(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <ol className={s.overviewGrid}>
            {slides.map((sl, i) => (
              <li key={sl.title}>
                <button
                  type="button"
                  className={`${s.overviewItem} ${i === index ? s.overviewActive : ""}`}
                  onClick={() => {
                    go(i);
                    setOverview(false);
                  }}
                >
                  <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.overviewTitle}>{sl.title}</span>
                  <span className={s.overviewChapter}>
                    {sl.chapter.replace(/^\d+ · /, "")}
                    {marks[i]?.length ? " · marked" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
