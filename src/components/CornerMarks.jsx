import styles from "./CornerMarks.module.css";

// Small blueprint-style "+" marks at the four corners of a bordered panel —
// the parent must be position:relative with room in its padding for them.
export default function CornerMarks({ accentCorner = "br" }) {
  return (
    <>
      <span className={`${styles.mark} ${styles.tl}`} aria-hidden="true">
        +
      </span>
      <span className={`${styles.mark} ${styles.tr}`} aria-hidden="true">
        +
      </span>
      <span className={`${styles.mark} ${styles.bl}`} aria-hidden="true">
        +
      </span>
      <span
        className={`${styles.mark} ${styles.br} ${accentCorner === "br" ? styles.accent : ""}`}
        aria-hidden="true"
      >
        +
      </span>
    </>
  );
}
