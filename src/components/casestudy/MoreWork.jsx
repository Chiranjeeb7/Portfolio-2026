import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/content";
import { COVER_THUMBNAILS, THUMBNAILS } from "../projectArt";
import styles from "./MoreWork.module.css";

// End-of-case-study "keep exploring" row: the other projects as visual cards
// (thumbnail + outcome title + headline stat) rather than a bare link list,
// so finishing one case study naturally leads into the next.
export default function MoreWork({ currentId }) {
  const others = projects.filter((p) => p.id !== currentId);

  return (
    <section className={styles.section} aria-labelledby="more-work">
      <h2 id="more-work" className={styles.heading}>
        More work
      </h2>
      <div className={styles.grid}>
        {others.map((p, i) => (
          <a key={p.id} href={p.href} className={styles.card} data-reveal style={{ "--reveal-i": i }}>
            <span className={`${styles.art} ${COVER_THUMBNAILS.has(p.id) ? styles.artCover : ""} ${p.id === "map-practice" ? styles.artLavender : ""}`}>
              <img src={THUMBNAILS[p.id]} alt="" loading="lazy" />
            </span>
            <span className={styles.body}>
              <span className={styles.tag}>{p.tag}</span>
              <span className={styles.title}>{p.title}</span>
              {p.stats[0] && (
                <span className={styles.stat}>
                  <span className={styles.statValue}>{p.stats[0].value}</span> {p.stats[0].label}
                </span>
              )}
              <span className={styles.cta}>
                <span className="roll">
                  <span>Read case study</span>
                  <span aria-hidden="true">Read case study</span>
                </span>
                <span className={styles.ctaIcon}>
                  <ArrowUpRight size={15} />
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
