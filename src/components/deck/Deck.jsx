// Shared presenter shell for the unlisted interview decks (#/planner-deck,
// #/ai-deck): a fixed 1600x900 stage scaled to fit the screen, keyboard and
// swipe navigation, slide number in the URL, and the presenter tools (pen,
// highlighter, laser, eraser, timer, blank screen, full-size media, overview).
// Each deck passes its slides; slides build on R (reveal) and Media below.
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const clamp = (n, last) => Math.max(0, Math.min(last, n));
// True while the address bar points at this deck ("#/<slug>" or "#/<slug>/<n>").
const isOwnHash = (slug) => new RegExp(`^#/${slug}(/\\d+)?$`).test(window.location.hash);
const slideFromHash = (slug, last) => {
  const n = Number(window.location.hash.match(new RegExp(`^#/${slug}/(\\d+)`))?.[1]) || 1;
  return clamp(n - 1, last);
};

// One revealed item: rises in after the slide's earlier items.
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
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const ITEM_STILL = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } };

export function Media({ media, label, className }) {
  const reduce = useReducedMotion();
  const zoom = useContext(ZoomContext);
  const el = media.video ? (
    <video
      className={className}
      src={media.video}
      poster={media.poster}
      autoPlay={!reduce}
      muted
      loop
      playsInline
      aria-label={label}
    />
  ) : (
    <img className={className} src={media.img} alt={label} />
  );
  return (
    <button type="button" className={s.zoomable} onClick={() => zoom({ ...media, label })} aria-label={`${label}: view full size`}>
      {el}
      <span className={s.zoomHint} aria-hidden="true">
        <Maximize2 size={14} /> Full size
      </span>
    </button>
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

  return (
    <div
      className={`${s.deck} ${hideChrome ? s.idle : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={s.stage}
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
        role="region"
        aria-roledescription="slide deck"
        aria-label={label}
      >
        <header className={s.stageHead}>
          <span className={s.label}>{slide.chapter}</span>
          <span className={s.label}>{brand}</span>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={index}
            className={s.slide}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
          >
            <ZoomContext.Provider value={setZoomed}>
              <Body />
            </ZoomContext.Provider>
          </motion.section>
        </AnimatePresence>

        <footer className={s.stageFoot}>
          <div className={s.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${(index + 1) / slides.length})` }} />
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
