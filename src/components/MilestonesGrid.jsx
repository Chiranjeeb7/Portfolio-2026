import { useState } from "react";
import { buildGrid, totalEvents, TOTAL_DAYS } from "../data/activity";
import CornerMarks from "./CornerMarks";
import styles from "./MilestonesGrid.module.css";

const { days, yearLabels, from, to } = buildGrid();

// Which legend entry a cell belongs to, for the legend-hover highlight.
function kindOf(day) {
  if (day.events.length === 0) return day.isFuture ? "upcoming" : "quiet";
  return day.milestone ? "milestone" : "event";
}

const LEGEND = [
  { kind: "milestone", label: "Milestone", swatch: styles.milestone },
  { kind: "event", label: "Event", swatch: styles.event },
  { kind: "quiet", label: "Quiet day", swatch: styles.empty },
];

// One accent colour for every event; gold only for the three milestones.
function cellClass(day) {
  if (day.events.length === 0) return day.isFuture ? styles.upcoming : styles.empty;
  if (day.milestone) return styles.milestone;
  return day.events.length > 1 ? styles.eventStacked : styles.event;
}

// Milestones with a detail page (a `slug` in data/activity.js) open it.
const storyOf = (day) => day.events.find((e) => e.slug);

function cellLabel(day) {
  const when = `${day.monthLabel} ${day.year}`;
  if (day.events.length === 0) return `${when}: no activity`;
  const text = `${when}: ${day.events.map((e) => `${e.kind}: ${e.label}`).join(", ")}`;
  return storyOf(day) ? `${text}. Open the story` : text;
}

// Tooltips near either end anchor to the cell's own edge so they never poke
// out past the panel. Measured as a share of the row, since how many columns
// those days land in depends on the row count CSS picks at this width.
function edgeClass(index) {
  if (index < TOTAL_DAYS * 0.1) return styles.edgeStart;
  if (index > TOTAL_DAYS * 0.9) return styles.edgeEnd;
  return "";
}

export default function MilestonesGrid() {
  // Hovering (or focusing) a legend entry fades every other kind of cell, so
  // the three gold milestones can be found among ~400 squares at a glance.
  const [focus, setFocus] = useState(null);

  return (
    <div className={styles.panel} data-focus={focus ?? undefined}>
      <CornerMarks accentCorner="br" />
      <div className={styles.header}>
        <h3 className={styles.title}>Key moments</h3>
        <p className={styles.subtitle}>Hover a cell for details</p>
      </div>

      {/* A group, not role="img": the event cells inside are real focusable
          buttons with their own labels, which role="img" would hide. */}
      <div
        className={styles.gridWrap}
        role="group"
        aria-label={`Activity grid: ${totalEvents} events (design research, testing and launches, commits, pull requests, things built, community meetups and a workshop) between ${from.monthLabel} ${from.year} and ${to.monthLabel} ${to.year}`}
      >
        <div className={styles.plot}>
          <div className={styles.yearRow} aria-hidden="true">
            {yearLabels.map((label) => (
              <span
                key={label.year}
                className={styles.yearTick}
                style={{ left: `${(label.at * 100).toFixed(2)}%` }}
              >
                {label.year}
              </span>
            ))}
          </div>

          {/* One flat list of days; `grid-auto-flow: column` fills it top to
              bottom then left to right, and the row count is a CSS variable
              so the block can be shorter on wide screens. */}
          <div className={styles.grid}>
            {days.map((day) => (
              <button
                type="button"
                key={day.key}
                className={`${styles.cell} ${cellClass(day)} ${edgeClass(day.index)}`}
                data-kind={kindOf(day)}
                style={{ "--i": day.index }}
                disabled={day.events.length === 0}
                aria-label={cellLabel(day)}
                onClick={
                  storyOf(day)
                    ? () => {
                        window.location.hash = `#/moment/${storyOf(day).slug}`;
                      }
                    : undefined
                }
              >
                {day.events.length > 0 && (
                  <span className={styles.tooltip} aria-hidden="true">
                    <span className={styles.tooltipDate}>
                      {day.monthLabel} {day.year}
                    </span>
                    {day.events.map((e) => (
                      <span key={e.label} className={styles.tooltipRow}>
                        <span className={styles.tooltipKind}>{e.kind}</span>
                        {e.label}
                      </span>
                    ))}
                    {storyOf(day) && <span className={styles.tooltipCta}>Click to read the story →</span>}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendCount}>{totalEvents} events</span>
        <div className={styles.legendRight}>
          {LEGEND.map((l) => (
            <button
              key={l.kind}
              type="button"
              className={`${styles.legendItem} ${focus === l.kind ? styles.legendItemActive : ""}`}
              onPointerEnter={() => setFocus(l.kind)}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus(l.kind)}
              onBlur={() => setFocus(null)}
            >
              <span className={`${styles.legendDot} ${l.swatch}`} /> {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
