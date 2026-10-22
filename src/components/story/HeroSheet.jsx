import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Hand } from "lucide-react";
import CountUp from "../motion/CountUp";
import { rich } from "../rich";
import profilePhoto from "../../assets/photos/profile.webp";
import { heroParts, storyHero, titleBlock } from "../../data/story";
import { NotebookCar, Scribble, WordSparkle } from "./HeroArt";
import styles from "./HeroSheet.module.css";

// The Story hero, drawn as an engineering sheet: a framed drawing with zone
// markings, the portrait standing in as the "part", numbered balloons
// pointing at head, heart and hands, a parts list explaining them, and a
// title block along the bottom. A mechanical engineer's way of saying who
// he is. Everything draws itself in on load, in the order a draughtsman
// would: frame, construction lines, the part, then the annotations.

const EASE = [0.16, 1, 0.3, 1];
const IMG_W = 480;
const IMG_H = 600;
const ZONES_X = ["1", "2", "3", "4", "5", "6", "7", "8"];
const ZONES_Y = ["A", "B", "C", "D"];

// Load sequence, in seconds.
const T = { frame: 0, grid: 0.35, title: 0.3, draft: 0.6, print: 0.9, parts: 1.5, block: 1.7, hello: 2.3 };

// ---------- Sheet frame: four edges drawing clockwise ----------
function Frame() {
  const edges = [
    { cls: styles.edgeTop, from: { scaleX: 0 }, at: 0 },
    { cls: styles.edgeRight, from: { scaleY: 0 }, at: 0.25 },
    { cls: styles.edgeBottom, from: { scaleX: 0 }, at: 0.5 },
    { cls: styles.edgeLeft, from: { scaleY: 0 }, at: 0.75 },
  ];
  return edges.map((e) => (
    <motion.span
      key={e.cls}
      className={`${styles.edge} ${e.cls}`}
      aria-hidden="true"
      variants={{
        hidden: e.from,
        shown: { scaleX: 1, scaleY: 1, transition: { delay: T.frame + e.at, duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
      }}
    />
  ));
}

function Zones() {
  const mark = (z, i, offset) => (
    <motion.span
      key={z}
      variants={{
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { delay: T.grid + offset + i * 0.04 } },
      }}
    >
      {z}
    </motion.span>
  );
  return (
    <>
      <div className={`${styles.zones} ${styles.zonesTop}`} aria-hidden="true">
        {ZONES_X.map((z, i) => mark(z, i, 0))}
      </div>
      <div className={`${styles.zones} ${styles.zonesBottom}`} aria-hidden="true">
        {ZONES_X.map((z, i) => mark(z, i, 0.2))}
      </div>
      <div className={`${styles.zones} ${styles.zonesLeft}`} aria-hidden="true">
        {ZONES_Y.map((z, i) => mark(z, i, 0.1))}
      </div>
      <div className={`${styles.zones} ${styles.zonesRight}`} aria-hidden="true">
        {ZONES_Y.map((z, i) => mark(z, i, 0.3))}
      </div>
    </>
  );
}

// ---------- CAD crosshair following the mouse, with a coordinate readout ----------
function Crosshair({ x, y, on }) {
  const readout = useRef(null);
  const write = () => {
    if (!readout.current) return;
    const pad = (v) => String(Math.max(0, Math.round(v))).padStart(4, "0");
    readout.current.textContent = `X ${pad(x.get())}  Y ${pad(y.get())}`;
  };
  useMotionValueEvent(x, "change", write);
  useMotionValueEvent(y, "change", write);
  return (
    <div className={`${styles.crosshair} ${on ? styles.crosshairOn : ""}`} aria-hidden="true">
      <motion.span className={styles.crossV} style={{ x }} />
      <motion.span className={styles.crossH} style={{ y }} />
      <motion.span className={styles.readout} style={{ x, y }} ref={readout} />
    </div>
  );
}

// ---------- Headline ----------
const TITLE_WORDS = storyHero.title.split(" ").map((raw) => {
  const m = /^\*(.+)\*([.,]?)$/.exec(raw);
  return m ? { text: m[1], tail: m[2], accent: true } : { text: raw, tail: "", accent: false };
});

// "sketching" is hoverable (and focusable): it opens a little car sketch
// from the 2015 notebooks, drawn live.
function SketchWord({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={styles.sketchWord}
      tabIndex={0}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {children}
      <Scribble at={T.title + 0.9} />
      <span className={`${styles.notebook} ${open ? styles.notebookOpen : ""}`} aria-hidden="true">
        <NotebookCar active={open} />
        <span className={styles.notebookNote}>{storyHero.scribbleNote}</span>
      </span>
    </span>
  );
}

function Title() {
  return (
    <motion.h1
      className={styles.title}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: T.title } } }}
    >
      {TITLE_WORDS.map((w, i) => {
        const word = (
          <span className="mask">
            <motion.span
              className={w.accent ? styles.titleEm : undefined}
              variants={{
                hidden: { y: "115%", rotate: 4 },
                shown: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              {w.text}
              {w.tail}
            </motion.span>
          </span>
        );
        return (
          <span key={w.text}>
            {w.text === storyHero.scribble ? (
              <SketchWord>{word}</SketchWord>
            ) : (
              <span className={styles.word}>
                {word}
                {w.accent && <WordSparkle at={T.title + 1.2} />}
              </span>
            )}
            {i < TITLE_WORDS.length - 1 ? " " : ""}
          </span>
        );
      })}
    </motion.h1>
  );
}

// ---------- The part: drafted circle, centre lines, printed portrait ----------
const HEAD = { x: 236, y: 168, r: 150 };

function Drafting() {
  return (
    <svg className={styles.drafting} viewBox={`0 0 ${IMG_W} ${IMG_H}`} aria-hidden="true">
      <motion.circle
        cx={HEAD.x}
        cy={HEAD.y}
        r={HEAD.r}
        className={styles.headFill}
        variants={{ hidden: { opacity: 0, scale: 0.6 }, shown: { opacity: 1, scale: 1, transition: { delay: T.draft + 0.4, duration: 1, ease: EASE } } }}
        style={{ transformOrigin: `${HEAD.x}px ${HEAD.y}px` }}
      />
      <motion.circle
        cx={HEAD.x}
        cy={HEAD.y}
        r={HEAD.r}
        className={styles.headLine}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          shown: { pathLength: 1, opacity: 1, transition: { pathLength: { delay: T.draft, duration: 1.1, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: T.draft, duration: 0.01 } } },
        }}
      />
      {/* Centre lines: the dash-dot of a real drawing, so they extend rather than draw. */}
      <motion.line
        x1={-60}
        x2={IMG_W + 60}
        y1={HEAD.y}
        y2={HEAD.y}
        className={styles.centre}
        style={{ transformOrigin: `${HEAD.x}px ${HEAD.y}px` }}
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { delay: T.draft + 0.2, duration: 0.9, ease: EASE } } }}
      />
      <motion.line
        x1={HEAD.x}
        x2={HEAD.x}
        y1={-30}
        y2={HEAD.y + HEAD.r + 40}
        className={styles.centre}
        style={{ transformOrigin: `${HEAD.x}px ${HEAD.y}px` }}
        variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { delay: T.draft + 0.3, duration: 0.9, ease: EASE } } }}
      />
    </svg>
  );
}

function Portrait() {
  return (
    <div className={styles.print}>
      <motion.img
        src={profilePhoto}
        alt="Chiranjeeb Deb, arms crossed, smiling"
        variants={{
          hidden: { clipPath: "inset(100% 0 0 0)" },
          shown: { clipPath: "inset(0% 0 0 0)", transition: { delay: T.print, duration: 1.1, ease: [0.65, 0, 0.35, 1] } },
        }}
      />
      {/* The print head: a hairline riding the top of the reveal. */}
      <motion.span
        className={styles.printHead}
        aria-hidden="true"
        variants={{
          hidden: { y: "100%", opacity: 0 },
          shown: {
            y: ["100%", "0%", "0%"],
            opacity: [1, 1, 0],
            transition: { delay: T.print, duration: 1.4, times: [0, 0.78, 1], ease: [0.65, 0, 0.35, 1] },
          },
        }}
      />
    </div>
  );
}

// ---------- Balloons + leaders ----------
const pct = ([x, y]) => ({ left: `${(x / IMG_W) * 100}%`, top: `${(y / IMG_H) * 100}%` });

function Leaders({ active }) {
  return (
    <svg className={styles.leaders} viewBox={`0 0 ${IMG_W} ${IMG_H}`} aria-hidden="true">
      {heroParts.map((p, i) => {
        const on = active === p.n;
        const dim = active !== null && !on;
        const at = T.parts + i * 0.18;
        return (
          <g key={p.n} className={`${styles.leader} ${on ? styles.leaderOn : ""} ${dim ? styles.leaderDim : ""}`}>
            <motion.path
              d={`M${p.balloon[0]} ${p.balloon[1]} L${p.point[0]} ${p.point[1]}`}
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                shown: { pathLength: 1, opacity: 1, transition: { pathLength: { delay: at, duration: 0.5, ease: EASE }, opacity: { delay: at, duration: 0.01 } } },
              }}
            />
            <motion.circle
              cx={p.point[0]}
              cy={p.point[1]}
              r={5}
              style={{ transformOrigin: `${p.point[0]}px ${p.point[1]}px` }}
              variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: at + 0.45, type: "spring", stiffness: 400, damping: 14 } } }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Balloons({ active, setActive }) {
  return heroParts.map((p, i) => (
    <motion.span
      key={p.n}
      className={`${styles.balloon} ${active === p.n ? styles.balloonOn : ""} ${
        active !== null && active !== p.n ? styles.balloonDim : ""
      }`}
      style={pct(p.balloon)}
      onPointerEnter={() => setActive(p.n)}
      onPointerLeave={() => setActive(null)}
      aria-hidden="true"
      variants={{
        hidden: { scale: 0, opacity: 0 },
        shown: { scale: 1, opacity: 1, transition: { delay: T.parts + i * 0.18, type: "spring", stiffness: 320, damping: 15 } },
      }}
    >
      {p.n}
    </motion.span>
  ));
}

function PartsList({ active, setActive }) {
  return (
    <motion.table
      className={styles.parts}
      variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { delay: T.parts + 0.1, duration: 0.8, ease: EASE } } }}
    >
      <caption>Parts list</caption>
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Part</th>
          <th scope="col">Note</th>
        </tr>
      </thead>
      <tbody>
        {heroParts.map((p) => (
          <tr
            key={p.n}
            tabIndex={0}
            className={`${active === p.n ? styles.rowOn : ""} ${active !== null && active !== p.n ? styles.rowDim : ""}`}
            onPointerEnter={() => setActive(p.n)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(p.n)}
            onBlur={() => setActive(null)}
          >
            <td>
              <span className={styles.rowBalloon}>{p.n}</span>
            </td>
            <th scope="row">{p.part}</th>
            <td>{p.note}</td>
          </tr>
        ))}
      </tbody>
    </motion.table>
  );
}

// A sticky note slapped on the drawing. Drag it; it springs back.
function Hello() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={styles.hello}
      drag={!reduce}
      dragSnapToOrigin
      dragElastic={0.5}
      whileHover={reduce ? undefined : { scale: 1.06, rotate: 0 }}
      whileDrag={{ scale: 1.1, rotate: 0, cursor: "grabbing" }}
      variants={{
        hidden: { scale: 0, rotate: -36, opacity: 0 },
        shown: { scale: 1, rotate: 6, opacity: 1, transition: { delay: T.hello, type: "spring", stiffness: 260, damping: 13 } },
      }}
    >
      <span className={styles.wave} aria-hidden="true">
        <Hand size={16} strokeWidth={2} />
      </span>
      {storyHero.hello}
    </motion.div>
  );
}

function TitleBlock() {
  return (
    <dl className={styles.block}>
      {titleBlock.map((c, i) => (
        <motion.div
          key={c.label}
          className={`${styles.cell} ${c.accent ? styles.cellAccent : ""}`}
          variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0, transition: { delay: T.block + i * 0.07, duration: 0.6, ease: EASE } } }}
        >
          <dt>{c.label}</dt>
          <dd>{c.count ? <CountUp value={c.value} /> : c.value}</dd>
        </motion.div>
      ))}
    </dl>
  );
}

export default function HeroSheet() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const [crossOn, setCrossOn] = useState(false);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    cx.set(e.clientX - r.left);
    cy.set(e.clientY - r.top);
    if (!crossOn) setCrossOn(true);
  };

  return (
    <section className={`container ${styles.wrap}`}>
      <motion.div className={styles.sheet} initial={reduce ? false : "hidden"} animate="shown">
        <Frame />
        <Zones />
        <div className={styles.inner} onPointerMove={onMove} onPointerLeave={() => setCrossOn(false)}>
          <motion.span
            className={styles.paper}
            aria-hidden="true"
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: T.grid, duration: 0.8 } } }}
          />
          <Crosshair x={cx} y={cy} on={crossOn} />

          <div className={styles.textCol}>
            <motion.span
              className={styles.eyebrow}
              variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: T.title } } }}
            >
              {storyHero.eyebrow}
            </motion.span>
            <Title />
            <motion.p
              className={styles.summary}
              variants={{ hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { delay: T.title + 0.6, duration: 0.9, ease: EASE } } }}
            >
              {rich(storyHero.summary)}
            </motion.p>
            <PartsList active={active} setActive={setActive} />
          </div>

          <div className={styles.stageCol}>
            <div className={styles.stage}>
              <Drafting />
              <Portrait />
              <Leaders active={active} />
              <Balloons active={active} setActive={setActive} />
              <Hello />
            </div>
          </div>
        </div>
        <TitleBlock />
      </motion.div>
    </section>
  );
}
