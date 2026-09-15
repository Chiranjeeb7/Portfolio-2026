import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import CompanyLogo from "./CompanyLogo";
import ThumbnailPlaceholder from "./ThumbnailPlaceholder";
import plannerThumbnail from "../assets/photos/planner-thumbnail.png";
import transporterThumbnail from "../assets/photos/transporter-thumbnail.png";
import mapPracticeThumbnail from "../assets/photos/map-practice-thumbnail.png";
import styles from "./Work.module.css";

// Populate with `{ [project.id]: importedImage }` once real thumbnail art is ready.
const THUMBNAILS = {
  planner: plannerThumbnail,
  "transporter-mobile-app": transporterThumbnail,
  "map-practice": mapPracticeThumbnail,
};
// Thumbnails that already fill their own frame (own background) render full-bleed
// instead of floating over the accent gradient like a bare screenshot does.
const COVER_THUMBNAILS = new Set(["transporter-mobile-app"]);
// Per-project backdrop overrides for screenshots whose colours clash with the
// default accent gradient.
const ART_BACKGROUNDS = { "map-practice": styles.artLavender };

export default function Work() {
  return (
    <section id="work" className={`container ${styles.section}`}>
      <h2 className={styles.heading}>Work that shipped, with the numbers to show for it</h2>
      <p className={styles.intro}>Three projects, three real outcomes.</p>

      <div className={styles.list}>
        {projects.map((p) => (
          <article className={styles.card} key={p.id}>
            <div
              className={`${styles.art} ${COVER_THUMBNAILS.has(p.id) ? styles.artFlat : ""} ${ART_BACKGROUNDS[p.id] ?? ""}`}
            >
              <span className={`tag ${styles.cardTag}`}>{p.tag}</span>
              {THUMBNAILS[p.id] ? (
                <img
                  src={THUMBNAILS[p.id]}
                  alt={p.title}
                  className={COVER_THUMBNAILS.has(p.id) ? styles.thumbnailCover : styles.thumbnail}
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
