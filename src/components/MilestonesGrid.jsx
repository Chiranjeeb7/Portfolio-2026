import { activityCategories, buildColumns } from "../data/activity";
import CornerMarks from "./CornerMarks";
import styles from "./MilestonesGrid.module.css";

const COLUMNS = buildColumns();

export default function MilestonesGrid() {
  return (
    <div className={styles.panel}>
      <CornerMarks accentCorner="br" />
      <div className={styles.header}>
        <h3 className={styles.title}>2025 — 2026</h3>
        <p className={styles.subtitle}>Hover a cell for details</p>
      </div>

      <div className={styles.gridWrap}>
        <div
          className={styles.grid}
          role="img"
          aria-label="Activity grid for 2025 and 2026, showing design, shipping, research and writing events"
        >
          {COLUMNS.map((column) => (
            <div className={styles.column} key={column.col}>
              {column.isYearStart && <span className={styles.yearLabel}>{column.year}</span>}
              {column.cells.map((event, row) => (
                <button
                  type="button"
                  key={row}
                  className={`${styles.cell} ${
                    event ? `${styles[`kind-${event.kind}`]} ${styles[`level-${event.level}`]}` : styles.empty
                  }`}
                  disabled={!event}
                  aria-label={
                    event
                      ? `${column.monthLabel} ${column.year}: ${event.label}`
                      : `${column.monthLabel} ${column.year}: no event yet`
                  }
                >
                  {event && (
                    <span className={styles.tooltip} aria-hidden="true">
                      <span className={styles.tooltipDate}>
                        {column.monthLabel} {column.year}
                      </span>
                      {event.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ul className={styles.legend}>
        {activityCategories.map((c) => (
          <li key={c.kind} className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles[`kind-${c.kind}`]}`} />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
