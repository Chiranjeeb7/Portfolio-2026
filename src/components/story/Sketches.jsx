import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Sketches.module.css";

const EASE = [0.65, 0, 0.35, 1];

// Line drawings for the Story page. Each one draws itself stroke by stroke
// the first time it scrolls into view, the way a sketch builds up on paper.
// `rough` runs the strokes through a small displacement filter so the early
// chapters (mechanical engineering, the bicycle) read as pencil sketches, and
// the later ones stay crisp: the line gets more precise as the story moves
// from paper to screens. Under reduced motion everything renders drawn.

// `active`, when given, drives the drawing directly (draw on hover, say)
// instead of the default "draw once when scrolled into view".
export function Sketch({ viewBox, rough = false, label, className = "", active, children }) {
  const reduce = useReducedMotion();
  const filterId = useId().replace(/:/g, "");
  const play = reduce
    ? { initial: false, animate: "shown" }
    : active !== undefined
      ? { initial: "hidden", animate: active ? "shown" : "hidden" }
      : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount: 0.45 } };

  return (
    <motion.svg
      viewBox={viewBox}
      className={`${styles.sketch} ${className}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...play}
    >
      {rough && (
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
        </defs>
      )}
      <g filter={rough ? `url(#${filterId})` : undefined}>{children}</g>
    </motion.svg>
  );
}

// A stroke that draws on. `at` is when it starts (seconds into the sketch),
// `dur` how long the pen takes.
export function Stroke({ d, at = 0, dur = 0.9, tone = "ink", width, fill }) {
  return (
    <motion.path
      d={d}
      className={`${styles.stroke} ${styles[tone]} ${fill ? styles[`fill-${fill}`] : ""}`}
      style={width ? { strokeWidth: width } : undefined}
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        shown: {
          pathLength: 1,
          opacity: 1,
          transition: {
            pathLength: { delay: at, duration: dur, ease: EASE },
            opacity: { delay: at, duration: 0.01 },
          },
        },
      }}
    />
  );
}

// Dashed construction lines can't use pathLength (it owns the dash array),
// so they fade in instead.
function Guide({ d, at = 0 }) {
  return (
    <motion.path
      d={d}
      className={`${styles.stroke} ${styles.guide}`}
      variants={{
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { delay: at, duration: 0.6 } },
      }}
    />
  );
}

function Label({ x, y, children, at = 0, anchor = "start", tone = "faint" }) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`${styles.label} ${styles[`label-${tone}`]}`}
      variants={{
        hidden: { opacity: 0, y: 4 },
        shown: { opacity: 1, y: 0, transition: { delay: at, duration: 0.5 } },
      }}
    >
      {children}
    </motion.text>
  );
}

export function Dot({ cx, cy, r, at = 0, tone = "accent" }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      className={styles[`fill-${tone}`]}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      variants={{
        hidden: { scale: 0, opacity: 0 },
        shown: { scale: 1, opacity: 1, transition: { delay: at, type: "spring", stiffness: 260, damping: 16 } },
      }}
    />
  );
}

// ---------- 2015: a car, sketched side-on ----------
function CarSketch() {
  return (
    <Sketch viewBox="0 0 400 250" rough label="A pencil sketch of a car in side profile">
      <Guide d="M16 218 H384" />
      <Guide d="M110 132 V234 M300 132 V234" at={0.1} />
      <Guide d="M40 100 H360" at={0.2} />
      <Stroke d="M46 186 L46 172 C46 162 54 156 66 154 L116 148 C144 122 182 104 230 103 C264 102 290 120 314 142 L350 148 C364 151 372 161 372 174 L372 186" at={0.2} dur={1.4} />
      <Stroke d="M46 186 H74 A36 36 0 0 1 146 186 H264 A36 36 0 0 1 336 186 H372" at={0.9} dur={1.1} />
      <Stroke d="M138 190 A28 28 0 1 1 82 190 A28 28 0 1 1 138 190" at={1.3} dur={0.7} />
      <Stroke d="M328 190 A28 28 0 1 1 272 190 A28 28 0 1 1 328 190" at={1.45} dur={0.7} />
      <Stroke d="M119 190 A9 9 0 1 1 101 190 A9 9 0 1 1 119 190 M309 190 A9 9 0 1 1 291 190 A9 9 0 1 1 309 190" at={1.8} dur={0.5} tone="muted" />
      <Stroke d="M132 146 C154 126 184 114 222 113 L225 144 Z" at={1.6} dur={0.8} />
      <Stroke d="M234 113 C258 114 280 126 298 142 L236 144 Z" at={1.75} dur={0.8} />
      <Stroke d="M228 146 L231 182 M60 160 C140 154 262 154 366 162" at={2} dur={0.7} tone="muted" />
      {/* Overdrawn roofline: the second pass every sketch gets. */}
      <Stroke d="M110 151 C142 120 186 99 236 99 C272 99 298 120 320 141" at={2.2} dur={0.9} tone="faint" width={1} />
      <Stroke d="M354 158 L370 164" at={2.3} dur={0.3} tone="accent" width={2.5} />
      <Stroke d="M8 150 H32 M2 166 H26 M12 182 H34" at={2.5} dur={0.5} tone="faint" />
      <Stroke d="M236 98 L262 56 H344" at={2.6} dur={0.6} tone="accent" width={1} />
      <Label x={266} y={48} at={3}>Shaped for use</Label>
    </Sketch>
  );
}

// ---------- 2017: the bicycle number plate ----------
// Drawn like an engineering sheet: the whole bicycle small, the plate
// circled as "A", and a detail view blowing it up. The eye goes where mine
// did at that showcase.
function BicycleSketch() {
  return (
    <Sketch
      viewBox="0 0 400 250"
      rough
      label="A sketch of a bicycle, with its number plate circled and shown enlarged in a detail view"
    >
      <Guide d="M10 226 H262" />
      <g transform="translate(-10 44) scale(0.75)">
        <Stroke d="M160 186 A56 56 0 1 1 48 186 A56 56 0 1 1 160 186" at={0.1} dur={0.8} />
        <Stroke d="M352 186 A56 56 0 1 1 240 186 A56 56 0 1 1 352 186" at={0.2} dur={0.8} />
        <Stroke d="M104 186 L188 190 L276 132 M104 186 L170 112 L268 112 M188 190 L166 100" at={0.6} dur={1} />
        <Stroke d="M268 106 L278 136 L296 186" at={1.1} dur={0.5} />
        <Stroke d="M266 104 L272 90 M256 88 C266 83 280 84 290 91" at={1.3} dur={0.4} />
        <Stroke d="M148 100 C160 95 178 95 190 100" at={1.4} dur={0.4} width={3} />
        <Stroke d="M200 190 A12 12 0 1 1 176 190 A12 12 0 1 1 200 190 M188 190 L204 208 M197 208 H213" at={1.5} dur={0.5} tone="muted" />
        <Stroke d="M164 106 L134 104" at={1.7} dur={0.3} tone="muted" />
        <Stroke d="M78 90 H134 V118 H78 Z" at={1.8} dur={0.5} tone="accent" width={2.5} />
      </g>
      {/* Circle the plate, then pull it out into a detail view. */}
      <Stroke d="M100 122 A30 30 0 1 1 40 122 A30 30 0 1 1 100 122" at={2.2} dur={0.6} tone="accent" width={1} />
      <Label x={34} y={86} at={2.5} tone="accent">A</Label>
      <Guide d="M89 99 L253 88" at={2.6} />
      <Stroke d="M384 100 A66 66 0 1 1 252 100 A66 66 0 1 1 384 100" at={2.7} dur={0.8} />
      <Stroke d="M364 58 L358 146" at={3.1} dur={0.4} tone="muted" width={3} />
      <Stroke d="M352 88 H362 M352 100 H361" at={3.2} dur={0.3} tone="muted" />
      <Stroke d="M276 72 H352 V112 H276 Z" at={3.3} dur={0.7} tone="accent" width={2} />
      <Stroke d="M288 86 H302 M310 86 H340 M288 98 H326" at={3.7} dur={0.5} tone="accent" width={2.5} />
      <Guide d="M276 124 H352 M276 120 V128 M352 120 V128" at={3.9} />
      <Label x={312} y={192} anchor="middle" at={4}>Detail A: number plate</Label>
    </Sketch>
  );
}

// ---------- 2018: industrial, communication, interaction ----------
function DisciplinesSketch() {
  return (
    <Sketch viewBox="0 0 400 250" label="Three sketches in a row: a product, a poster and a phone">
      {/* Industrial: a block in isometric */}
      <Stroke d="M70 72 L106 92 L70 112 L34 92 Z" at={0} dur={0.6} />
      <Stroke d="M34 92 V138 L70 158 V112 M106 92 V138 L70 158" at={0.4} dur={0.7} />
      <Guide d="M70 52 V72 M70 158 V176" at={0.6} />
      {/* Communication: a poster */}
      <Stroke d="M166 70 H234 V164 H166 Z" at={0.9} dur={0.7} />
      <Stroke d="M184 138 L200 90 L216 138 M190 122 H210" at={1.3} dur={0.6} width={2.5} />
      <Stroke d="M178 150 H222 M178 156 H208" at={1.6} dur={0.4} tone="muted" />
      {/* Interaction: a phone and a tap */}
      <Stroke d="M312 66 H350 Q356 66 356 72 V160 Q356 166 350 166 H312 Q306 166 306 160 V72 Q306 66 312 66 Z" at={1.9} dur={0.8} tone="accent" />
      <Stroke d="M322 74 H340" at={2.3} dur={0.3} tone="accent" />
      <Stroke d="M314 88 H348 M314 96 H338" at={2.4} dur={0.4} tone="muted" />
      <Dot cx={331} cy={124} r={5} at={2.7} />
      <Stroke d="M345 124 A14 14 0 1 1 317 124 A14 14 0 1 1 345 124" at={2.85} dur={0.5} tone="accent" width={1} />
      {/* Arrows between them */}
      <Stroke d="M120 116 H150 M144 110 L150 116 L144 122" at={0.8} dur={0.4} tone="faint" />
      <Stroke d="M250 116 H290 M284 110 L290 116 L284 122" at={1.8} dur={0.4} tone="faint" />
      <Label x={70} y={204} anchor="middle" at={0.7}>Industrial</Label>
      <Label x={200} y={204} anchor="middle" at={1.7}>Communication</Label>
      <Label x={331} y={204} anchor="middle" at={2.6} tone="accent">Interaction</Label>
    </Sketch>
  );
}

// ---------- Today: the same instinct, three materials ----------
function EvolutionSketch() {
  return (
    <Sketch viewBox="0 0 400 200" label="A car sketch, a phone screen and an AI agent in a row, joined by arrows">
      <g transform="translate(3 37) scale(0.32)">
        <Stroke d="M46 186 L46 172 C46 162 54 156 66 154 L116 148 C144 122 182 104 230 103 C264 102 290 120 314 142 L350 148 C364 151 372 161 372 174 L372 186" at={0} dur={0.8} width={4.5} />
        <Stroke d="M46 186 H74 A36 36 0 0 1 146 186 H264 A36 36 0 0 1 336 186 H372" at={0.4} dur={0.6} width={4.5} />
        <Stroke d="M138 190 A28 28 0 1 1 82 190 A28 28 0 1 1 138 190 M328 190 A28 28 0 1 1 272 190 A28 28 0 1 1 328 190" at={0.7} dur={0.5} width={4.5} />
      </g>
      <Stroke d="M132 100 H164 M158 94 L164 100 L158 106" at={1} dur={0.4} tone="faint" />
      <Stroke d="M184 56 H216 Q222 56 222 62 V138 Q222 144 216 144 H184 Q178 144 178 138 V62 Q178 56 184 56 Z" at={1.2} dur={0.7} />
      <Stroke d="M190 72 H210 M190 80 H204 M190 120 H210" at={1.6} dur={0.4} tone="muted" />
      <Dot cx={200} cy={100} r={4} at={1.8} tone="ink" />
      <Stroke d="M236 100 H268 M262 94 L268 100 L262 106" at={1.9} dur={0.4} tone="faint" />
      <Stroke d="M330 100 L368 66 M330 100 L372 128 M330 100 L300 146" at={2.1} dur={0.5} tone="faint" />
      <Stroke d="M306 76 H354 V124 H306 Z" at={2.2} dur={0.6} tone="accent" width={2} fill="panel" />
      <Stroke d="M330 86 L333.5 96.5 L344 100 L333.5 103.5 L330 114 L326.5 103.5 L316 100 L326.5 96.5 Z" at={2.6} dur={0.5} tone="accent" />
      <Dot cx={368} cy={66} r={4} at={2.8} tone="ink" />
      <Dot cx={372} cy={128} r={4} at={2.9} tone="ink" />
      <Dot cx={300} cy={146} r={4} at={3} tone="ink" />
      <Label x={70} y={182} anchor="middle" at={0.9}>Paper</Label>
      <Label x={200} y={182} anchor="middle" at={1.8}>Screens</Label>
      <Label x={330} y={182} anchor="middle" at={2.8} tone="accent">Agents</Label>
    </Sketch>
  );
}

// ---------- Delhivery: the agent at the centre of the work ----------
const NODES = [
  { x: 200, y: 40, label: "SaaS" },
  { x: 346, y: 104, label: "Planner" },
  { x: 312, y: 236, label: "Transporters" },
  { x: 88, y: 236, label: "Shipments" },
  { x: 54, y: 104, label: "Design system" },
];

function AgentsSketch() {
  return (
    <Sketch viewBox="0 0 400 280" label="A diagram with an AI agent at the centre connected to SaaS, Planner, Transporters, Shipments and the design system">
      {NODES.map((n, i) => (
        <Stroke key={n.label} d={`M200 140 L${n.x} ${n.y}`} at={0.5 + i * 0.12} dur={0.6} tone="faint" />
      ))}
      <Stroke d="M176 116 H224 V164 H176 Z" at={0} dur={0.6} tone="accent" width={2} fill="panel" />
      <Stroke d="M200 126 L203.5 136.5 L214 140 L203.5 143.5 L200 154 L196.5 143.5 L186 140 L196.5 136.5 Z" at={0.45} dur={0.6} tone="accent" width={1.5} />
      <Label x={200} y={186} anchor="middle" at={0.5} tone="accent">AI agent</Label>
      {NODES.map((n, i) => (
        <g key={n.label}>
          <Dot cx={n.x} cy={n.y} r={6} at={1 + i * 0.12} tone="ink" />
          <Label x={n.x} y={n.y + (n.y > 140 ? 24 : -14)} anchor="middle" at={1.1 + i * 0.12}>
            {n.label}
          </Label>
        </g>
      ))}
    </Sketch>
  );
}

// ---------- Off the clock ----------
function BadmintonSketch() {
  return (
    <Sketch viewBox="0 0 320 200" rough label="A sketch of a badminton racket and a shuttlecock in flight">
      <Stroke d="M96 92 C112 78 112 52 96 38 C80 24 54 30 46 52 C38 74 50 100 72 104 C82 106 90 100 96 92 Z" at={0} dur={0.9} />
      <Stroke d="M60 40 L92 98 M48 66 L102 64 M52 86 L100 46" at={0.6} dur={0.6} tone="faint" width={0.75} />
      <Stroke d="M84 104 L112 176" at={0.8} dur={0.5} width={3} />
      <Guide d="M104 66 Q186 -6 262 84" at={1.1} />
      <Stroke d="M274 100 L248 70 M278 96 L262 62 M270 104 L238 86" at={1.4} dur={0.5} />
      <Stroke d="M248 70 Q252 60 262 62 M238 86 Q236 74 248 70" at={1.7} dur={0.4} />
      <Dot cx={276} cy={102} r={6} at={1.9} />
    </Sketch>
  );
}

function CookingSketch() {
  return (
    <Sketch viewBox="0 0 320 200" rough label="A sketch of a pan tossing food over a flame">
      <Stroke d="M60 118 H200 C200 148 180 160 130 160 C80 160 60 148 60 118 Z" at={0} dur={1} />
      <Stroke d="M200 124 L284 116 Q292 116 292 122 Q292 128 284 128 L200 132" at={0.6} dur={0.6} />
      <Guide d="M96 112 Q120 40 168 104" at={0.9} />
      <Dot cx={104} cy={82} r={5} at={1.1} tone="ink" />
      <Dot cx={128} cy={60} r={4} at={1.2} />
      <Dot cx={154} cy={76} r={5} at={1.3} tone="ink" />
      <Stroke d="M138 88 l8 -4 l3 8 l-8 4 Z" at={1.35} dur={0.3} tone="muted" />
      <Stroke d="M100 182 Q94 172 102 164 M130 184 Q122 170 132 160 M160 182 Q154 172 162 164" at={1.5} dur={0.6} tone="accent" />
      <Stroke d="M220 92 C214 82 226 76 220 64 M240 96 C234 86 246 80 240 68" at={1.8} dur={0.7} tone="faint" />
    </Sketch>
  );
}

const SKETCHES = {
  car: CarSketch,
  bicycle: BicycleSketch,
  disciplines: DisciplinesSketch,
  agents: AgentsSketch,
  evolution: EvolutionSketch,
  badminton: BadmintonSketch,
  cooking: CookingSketch,
};

export default function StorySketch({ name, className }) {
  const Component = SKETCHES[name];
  return Component ? (
    <div className={className}>
      <Component />
    </div>
  ) : null;
}
