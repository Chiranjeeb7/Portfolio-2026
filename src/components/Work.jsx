import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import CompanyLogo from "./CompanyLogo";
import ThumbnailPlaceholder from "./ThumbnailPlaceholder";
import plannerThumbnail from "../assets/photos/planner-thumbnail.png";
import styles from "./Work.module.css";

// Populate with `{ [project.id]: importedImage }` once real thumbnail art is ready.
const THUMBNAILS = { planner: plannerThumbnail };

export default function Work() {
  return (
    <section id="work" className={`container ${styles.section}`}>
      <h2 className={styles.heading}>Work that shipped, with the numbers to show for it</h2>
      <p className={styles.intro}>Three projects, three real outcomes.</p>

      <div className={styles.list}>
        {projects.map((p) => (
          <article className={styles.card} key={p.id}>
            <div className={styles.art}>
              <span className={`tag ${styles.cardTag}`}>{p.tag}</span>
              {THUMBNAILS[p.id] ? (
                <img
                  src={THUMBNAILS[p.id]}
                  alt={p.title}
                  className={styles.thumbnail}
                  loading="lazy"
                />
              ) : (
                <ThumbnailPlaceholder />
              )}
              <div className={styles.shippedAt}>
                <span>Shipped at</span>
                <CompanyLogo company={p.company} className={styles.metaLogo} />
              </div>
            </div>
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDescription}>{p.description}</p>

              <div className={styles.stats}>
                {p.stats.map((s) => (
                  <div className={styles.stat} key={s.label}>
                    <span className={`${styles.statValue} numeric`}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              {p.href.startsWith("#") ? (
                <a className={styles.link} href={p.href}>
                  View case study <ArrowUpRight size={16} />
                </a>
              ) : (
                <a className={styles.link} href={p.href} target="_blank" rel="noreferrer">
                  View case study <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
