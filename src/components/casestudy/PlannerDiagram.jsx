import { Package } from "lucide-react";
import styles from "./PlannerDiagram.module.css";

// Node-diagram explaining what the planner algorithm does — rebuilt against
// the real DOM/colors of the V1 Framer illustration (colors/shapes pulled
// directly from the live site's computed styles), with the zone headings
// and criteria labels dropped and the frame cropped down to match — the
// nodes/pill/loads tell the story on their own without the extra copy.
const ORDER_NODES = [
  { id: 1, x: 12, y: 20, tint: "#f9f0ff", icon: "#390f85" },
  { id: 2, x: 19, y: 13, tint: "#fffbe6", icon: "#874d01" },
  { id: 3, x: 26, y: 20, tint: "#e6fffb", icon: "#0a979d" },
  { id: 8, x: 9, y: 50, tint: "#fff0f6", icon: "#eb3097" },
  { id: 4, x: 28, y: 50, tint: "#fce8e8", icon: "#c0392b" },
  { id: 7, x: 12, y: 80, tint: "#fff7e6", icon: "#d56b08" },
  { id: 6, x: 19, y: 87, tint: "#ebf3ff", icon: "#0b6ffd" },
  { id: 5, x: 26, y: 80, tint: "#e3fcec", icon: "#30674f" },
];

const PLANNER_IN = { x: 45, y: 50 };
const PLANNER_OUT = { x: 55, y: 50 };
const PINCH_IN = { x: 40, y: 50 };
const PINCH_OUT = { x: 60, y: 50 };

const LOADS = [
  { id: 1, x: 84, y: 40, count: 5, color: "#ff7738" },
  { id: 2, x: 84, y: 60, count: 3, color: "#308dff" },
];

function orderLine(x1, y1) {
  const cx = x1 + (PINCH_IN.x - x1) * 0.55;
  return `M ${x1} ${y1} Q ${cx} ${y1} ${PINCH_IN.x} ${PINCH_IN.y} L ${PLANNER_IN.x} ${PLANNER_IN.y}`;
}

function loadLine(x2, y2) {
  const cx = PINCH_OUT.x + (x2 - PINCH_OUT.x) * 0.45;
  return `M ${PLANNER_OUT.x} ${PLANNER_OUT.y} L ${PINCH_OUT.x} ${PINCH_OUT.y} Q ${cx} ${y2} ${x2} ${y2}`;
}

export default function PlannerDiagram() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {ORDER_NODES.map((n) => (
            <g key={n.id}>
              <path d={orderLine(n.x + 2.2, n.y)} vectorEffect="non-scaling-stroke" />
              <path d={orderLine(n.x + 2.2, n.y + 1.4)} vectorEffect="non-scaling-stroke" className={styles.lineFaint} />
            </g>
          ))}
          {LOADS.map((l) => (
            <g key={l.id}>
              <path d={loadLine(l.x - 8, l.y)} vectorEffect="non-scaling-stroke" />
              <path d={loadLine(l.x - 8, l.y - 1.4)} vectorEffect="non-scaling-stroke" className={styles.lineFaint} />
            </g>
          ))}
        </svg>

        <span className={styles.centerLabel} style={{ left: "18%", top: "50%" }}>
          Orders
        </span>

        {ORDER_NODES.map((n) => (
          <div key={n.id} className={styles.orderNode} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <span className={styles.orderChip} style={{ background: n.tint, borderColor: n.icon }}>
              <Package size={14} strokeWidth={2} style={{ color: n.icon }} />
            </span>
            <span className={styles.orderLabel}>Order {n.id}</span>
          </div>
        ))}

        <div className={styles.plannerPill} style={{ left: "50%", top: "50%" }}>
          Planner
        </div>

        {LOADS.map((l) => (
          <div key={l.id} className={styles.loadWrap} style={{ left: `${l.x}%`, top: `${l.y}%` }}>
            <span className={styles.loadLabel}>Load {l.id}</span>
            <div className={styles.loadBox} style={{ borderColor: l.color }}>
              {Array.from({ length: l.count }).map((_, i) => (
                <Package key={i} size={15} strokeWidth={2} style={{ color: l.color }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
