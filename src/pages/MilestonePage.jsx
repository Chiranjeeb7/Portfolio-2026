import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ImagePlus, MapPin } from "lucide-react";
import CaseStudyHeader from "../components/casestudy/CaseStudyHeader";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import RevealText from "../components/motion/RevealText";
import { milestones } from "../data/milestones";
import styles from "./MilestonePage.module.css";

const hrefFor = (slug) => `#/moment/${slug}`;

// A photo, or a labelled empty slot of the same shape while it's missing.
// `fit: "contain"` shows a screenshot whole (on a panel) instead of cropping
// it; `caption` prints the alt text under the image.
function Photo({ image, className = "", caption = false }) {
  if (image.src) {
    return (
      <figure className={`${styles.photo} ${image.fit === "contain" ? styles.photoContain : ""} ${className}`}>
        <div className={styles.photoFrame}>
          <img src={image.src} alt={image.alt} loading="lazy" />
        </div>
        {caption && <figcaption className={styles.caption}>{image.alt}</figcaption>}
      </figure>
    );
  }
  return (
    <figure className={`${styles.photo} ${styles.photoEmpty} ${className}`}>
      <ImagePlus size={20} strokeWidth={1.5} />
      <span>Photo to be added</span>
      <figcaption>{image.alt}</figcaption>
    </figure>
  );
}

// Several screenshots presented together as one hero image, e.g. the steps
// of a single run side by side. Each is shown whole on the shared panel.
function PhotoSet({ images }) {
  return (
    <figure className={styles.photoSet}>
      {images.map((img) => (
        <img key={img.alt} src={img.src} alt={img.alt} />
      ))}
    </figure>
  );
}

// Detail page for one gold milestone from the hero timeline. Same shell as a
// case study (sticky header, footer), with three ways to move between the
// milestones: the switcher under the header, previous/next cards at the end,
// and the arrow keys.
export default function MilestonePage({ slug }) {
  const index = Math.max(0, milestones.findIndex((m) => m.slug === slug));
  const m = milestones[index];
  const prev = milestones[index - 1];
  const next = milestones[index + 1];

  // ← / → step through milestones, unless focus is in something that uses
  // arrows itself (a field, or the About canvas on the homepage).
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowLeft" && prev) window.location.hash = hrefFor(prev.slug);
      if (e.key === "ArrowRight" && next) window.location.hash = hrefFor(next.slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <>
      <CaseStudyHeader title={m.title} backHref="#home" backLabel="to key moments" />

      <main id="main" tabIndex={-1}>
        <nav className={styles.switcher} aria-label="Milestones">
          <div className={`container ${styles.switcherInner}`}>
            <span className={styles.switcherLabel}>Milestones</span>
            <ol className={styles.switcherList}>
              {milestones.map((item) => (
                <li key={item.slug}>
                  <a
                    href={hrefFor(item.slug)}
                    className={`${styles.switcherItem} ${item.slug === m.slug ? styles.switcherItemActive : ""}`}
                    aria-current={item.slug === m.slug ? "page" : undefined}
                  >
                    <span className={styles.switcherDot} aria-hidden="true" />
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
            <span className={styles.keysHint} aria-hidden="true">
              ← → to switch
            </span>
          </div>
        </nav>

        <article className="container">
          <header className={styles.hero}>
            <span className={styles.kind}>{m.kind}</span>
            <RevealText as="h1" trigger="mount" className={styles.title} text={m.title} key={m.slug} />
            <p className={styles.summary}>{m.summary}</p>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>
                  <CalendarDays size={14} /> Date
                </dt>
                <dd>{m.date}</dd>
              </div>
              <div className={styles.fact}>
                <dt>
                  <Clock size={14} /> {m.timeLabel ?? "Time"}
                </dt>
                <dd>{m.time}</dd>
              </div>
              <div className={styles.fact}>
                <dt>
                  <MapPin size={14} /> Where
                </dt>
                <dd>{m.place}</dd>
              </div>
            </dl>
          </header>

          <div className={styles.coverWrap} data-reveal>
            <CornerMarks accentCorner="br" />
            {m.cover.set ? <PhotoSet images={m.cover.set} /> : <Photo image={m.cover} className={styles.cover} />}
          </div>

          <div className={styles.body}>
            {m.sections.map((s, i) => (
              <section key={s.heading} className={styles.section} data-reveal style={{ "--reveal-i": i }}>
                <h2 className={styles.sectionTitle}>{s.heading}</h2>
                <div className={styles.sectionText}>
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.steps && (
                    <ol className={styles.steps}>
                      {s.steps.map((step, n) => (
                        <li key={step}>
                          <span className={styles.stepIndex}>{String(n + 1).padStart(2, "0")}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            ))}
          </div>

          {m.gallery.length > 0 && (
            <div
              className={`${styles.gallery} ${
                m.galleryLayout === "wideTall"
                  ? styles.galleryWideTall
                  : m.galleryLayout === "row"
                    ? styles.galleryRow
                    : m.galleryLayout === "single"
                      ? styles.gallerySingle
                    : m.gallery.length === 3
                      ? styles.galleryThree
                      : ""
              }`}
            >
              {m.gallery.map((img, i) => (
                <div key={img.alt} data-reveal style={{ "--reveal-i": i }}>
                  <Photo image={img} caption={Boolean(img.src)} />
                </div>
              ))}
            </div>
          )}

          <nav className={styles.pager} aria-label="Previous and next milestone">
            {prev ? (
              <a href={hrefFor(prev.slug)} className={styles.pagerCard}>
                <span className={styles.pagerDir}>
                  <ArrowLeft size={14} /> Previous milestone
                </span>
                <span className={styles.pagerTitle}>{prev.title}</span>
                <span className={styles.pagerDate}>{prev.date}</span>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={hrefFor(next.slug)} className={`${styles.pagerCard} ${styles.pagerNext}`}>
                <span className={styles.pagerDir}>
                  Next milestone <ArrowRight size={14} />
                </span>
                <span className={styles.pagerTitle}>{next.title}</span>
                <span className={styles.pagerDate}>{next.date}</span>
              </a>
            ) : (
              <a href="#home" className={`${styles.pagerCard} ${styles.pagerNext}`}>
                <span className={styles.pagerDir}>
                  Back to the timeline <ArrowRight size={14} />
                </span>
                <span className={styles.pagerTitle}>All key moments</span>
                <span className={styles.pagerDate}>On the homepage</span>
              </a>
            )}
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}
