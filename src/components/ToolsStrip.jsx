import { skills } from "../data/content";
import styles from "./ToolsStrip.module.css";

export default function ToolsStrip() {
  return (
    <div className={styles.strip}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.label}>Tools &amp; craft</span>
        <ul className={styles.list}>
          {skills.map((s) => (
            <li key={s} className="tag">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
