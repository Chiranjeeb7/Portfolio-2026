import { useState } from "react";
import { Check, Minus } from "lucide-react";
import styles from "./ConceptExplorer.module.css";
import concept1 from "../../assets/photos/planner-concept-1.png";
import concept2 from "../../assets/photos/planner-concept-2.png";
import concept3 from "../../assets/photos/planner-concept-3.png";
import concept4 from "../../assets/photos/planner-concept-4.png";
import concept5 from "../../assets/photos/planner-concept-5.png";

const CONCEPT_SCREENSHOTS = {
  1: concept1,
  2: concept2,
  3: concept3,
  4: concept4,
  5: concept5,
};

// Tabbed concept browser for the Iterations section — one tab per concept,
// each swapping in its own screenshot slot + pros/cons with a quick crossfade
// so flipping through five iterations feels like paging through a real
// design-review deck rather than scrolling a wall of cards.
export default function ConceptExplorer({ concepts }) {
  const [active, setActive] = useState(0);
  const concept = concepts[active];

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Concept iterations">
        {concepts.map((c, i) => (
          <button
            key={c.number}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`${styles.tab} ${active === i ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            Concept {c.number}
            {c.shipped && <span className={styles.tabDot} aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div key={concept.number} className={styles.panel}>
        <div className={styles.shot}>
          <img
            src={CONCEPT_SCREENSHOTS[concept.number]}
            alt={`Concept ${concept.number}: ${concept.title}`}
            className={styles.shotImage}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <span className={`numeric ${styles.conceptNumber}`}>Concept {concept.number}</span>
            {concept.shipped && <span className={styles.shippedTag}>Shipped</span>}
          </div>
          <h3 className={styles.conceptTitle}>{concept.title}</h3>

          <ul className={styles.proConList}>
            {concept.pros.map((p) => (
              <li key={p} className={styles.proItem}>
                <Check size={18} strokeWidth={2.2} className={styles.proIcon} />
                <span>{p}</span>
              </li>
            ))}
            {concept.cons.map((con) => (
              <li key={con} className={styles.conItem}>
                <Minus size={18} strokeWidth={2.2} className={styles.conIcon} />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
