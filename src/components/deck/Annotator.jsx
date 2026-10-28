// Drawing layer for the interview deck: pen, highlighter, laser pointer and
// eraser, drawn in the stage's own 1600x900 coordinates so marks stay put
// whatever the window size. Strokes belong to the parent (one list per
// slide); this layer only draws them and reports changes. The parent keys
// it by slide and tool, so switching either starts it fresh.
import { useEffect, useRef, useState } from "react";
import s from "./Annotator.module.css";

const WIDTH = { pen: 5, highlighter: 28 };
const ERASE_RADIUS = 18;
const LASER_TRAIL_MS = 260;

function pathOf(pts) {
  if (pts.length === 1) {
    const [x, y] = pts[0];
    return `M${x} ${y}l0.01 0`;
  }
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x} ${y} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx} ${ly}`;
}

function distToSegment([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function hits(stroke, p) {
  const reach = stroke.width / 2 + ERASE_RADIUS;
  const pts = stroke.points;
  if (pts.length === 1) return Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]) < reach;
  for (let i = 1; i < pts.length; i++) if (distToSegment(p, pts[i - 1], pts[i]) < reach) return true;
  return false;
}

function Stroke({ stroke }) {
  return (
    <path
      d={pathOf(stroke.points)}
      className={stroke.tool === "highlighter" ? s.highlight : s.ink}
      style={{ stroke: stroke.color, strokeWidth: stroke.width }}
    />
  );
}

export default function Annotator({ width, height, tool, color, strokes, onChange }) {
  const ref = useRef(null);
  const [draft, setDraft] = useState(null);
  const [hover, setHover] = useState(null);
  const [trail, setTrail] = useState([]);
  const erasing = useRef(false);

  const toStage = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [
      Math.round(((e.clientX - r.left) * width) / r.width * 10) / 10,
      Math.round(((e.clientY - r.top) * height) / r.height * 10) / 10,
    ];
  };

  // The laser trail fades out on its own once the pointer stops. Each
  // point carries its remaining life (1 to 0), worked out per frame here.
  useEffect(() => {
    if (!trail.length) return;
    const id = requestAnimationFrame(() => {
      const now = performance.now();
      setTrail((t) =>
        t.map((p) => ({ ...p, life: 1 - (now - p.t) / LASER_TRAIL_MS })).filter((p) => p.life > 0),
      );
    });
    return () => cancelAnimationFrame(id);
  }, [trail]);

  const eraseAt = (p) => {
    const kept = strokes.filter((st) => !hits(st, p));
    if (kept.length !== strokes.length) onChange(kept);
  };

  const onPointerDown = (e) => {
    if (!tool || e.button > 0) return;
    e.preventDefault();
    ref.current.setPointerCapture(e.pointerId);
    const p = toStage(e);
    if (tool === "pen" || tool === "highlighter") {
      setDraft({ tool, color, width: WIDTH[tool], points: [p] });
    } else if (tool === "eraser") {
      erasing.current = true;
      eraseAt(p);
    }
  };

  const onPointerMove = (e) => {
    if (!tool) return;
    const p = toStage(e);
    if (tool === "laser") {
      setTrail((t) => [...t.slice(-24), { x: p[0], y: p[1], t: performance.now(), life: 1 }]);
      setHover(p);
      return;
    }
    setHover(p);
    if (draft) {
      const [lx, ly] = draft.points[draft.points.length - 1];
      if (Math.hypot(p[0] - lx, p[1] - ly) < 1.5) return;
      setDraft((d) => d && { ...d, points: [...d.points, p] });
    } else if (erasing.current) {
      eraseAt(p);
    }
  };

  const finish = () => {
    if (draft) onChange([...strokes, draft]);
    setDraft(null);
    erasing.current = false;
  };

  return (
    <svg
      ref={ref}
      className={`${s.layer} ${tool ? s.active : ""} ${tool ? s[tool] : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onPointerLeave={() => {
        setHover(null);
      }}
      aria-hidden="true"
    >
      {strokes.map((st, i) => (
        <Stroke key={i} stroke={st} />
      ))}
      {draft && <Stroke stroke={draft} />}

      {tool === "eraser" && hover && <circle cx={hover[0]} cy={hover[1]} r={ERASE_RADIUS} className={s.eraserRing} />}

      {tool === "laser" &&
        trail.map((p) => (
          <circle key={p.t} cx={p.x} cy={p.y} r={4 + 6 * p.life} className={s.laserTrail} style={{ opacity: p.life * 0.5 }} />
        ))}
      {tool === "laser" && hover && (
        <>
          <circle cx={hover[0]} cy={hover[1]} r={22} className={s.laserGlow} />
          <circle cx={hover[0]} cy={hover[1]} r={9} className={s.laserDot} />
        </>
      )}
    </svg>
  );
}
