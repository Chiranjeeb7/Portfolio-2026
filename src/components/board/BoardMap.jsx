import { useRef } from "react";
import styles from "./BoardMap.module.css";

// Miro/FigJam-style navigator for the About board: the whole world in
// miniature (the core card sort, each off-screen zone) with a coral frame
// for what the viewport currently shows. Clicking a spot jumps the board
// there; from the keyboard, each press of Enter/Space moves to the next
// zone. Its main job is telling visitors there is more board than the
// first view shows.
export default function BoardMap({ world, core, zones, view, viewport, onJump }) {
  const svgRef = useRef(null);
  const next = useRef(0);
  if (!world || !viewport.w) return null;

  const w = world.x1 - world.x0;
  const h = world.y1 - world.y0;
  const seen = {
    x: -view.pan.x / view.zoom,
    y: -view.pan.y / view.zoom,
    w: viewport.w / view.zoom,
    h: viewport.h / view.zoom,
  };

  const onClick = (e) => {
    // Keyboard activation has no pointer position: step through the zones.
    if (e.detail === 0) {
      const z = zones[next.current % zones.length];
      next.current += 1;
      onJump(z.x + z.w / 2, z.y + z.h / 2);
      return;
    }
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    onJump(p.x, p.y);
  };

  return (
    <button type="button" className={styles.map} onClick={onClick} aria-label="Board map: jump to another part of the board">
      <span className={styles.label}>Board map</span>
      <svg
        ref={svgRef}
        viewBox={`${world.x0} ${world.y0} ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className={styles.svg}
        aria-hidden="true"
      >
        <rect x={0} y={0} width={core.w} height={core.h} className={styles.core} />
        {zones.map((z) => (
          <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h} className={styles.zone} />
        ))}
        <rect x={seen.x} y={seen.y} width={seen.w} height={seen.h} className={styles.seen} />
      </svg>
    </button>
  );
}
