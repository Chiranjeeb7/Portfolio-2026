// Private index of the interview decks, at /presentations (forwarded to
// "#/presentations"). Nothing on the site links here and the page asks
// search engines not to index it.
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Keyboard, Link2, Lock } from "lucide-react";
import { decks } from "../data/decks";
import { profile } from "../data/content";
import styles from "./PresentationsPage.module.css";

function CopyLink({ slug }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/#/${slug}`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={styles.secondary}
      onClick={() => {
        navigator.clipboard?.writeText(url).then(() => setCopied(true), () => {});
      }}
    >
      {copied ? <Check size={16} strokeWidth={2} /> : <Link2 size={16} strokeWidth={1.8} />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

export default function PresentationsPage() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
      <header className={styles.head}>
        <a href="#" className={styles.home}>
          {profile.name}
        </a>
        <span className={styles.private}>
          <Lock size={13} strokeWidth={2} /> Unlisted
        </span>
      </header>

      <div className={styles.intro}>
        <h1 className={styles.title}>Presentations</h1>
        <p className={styles.lede}>
          Case studies told as slide decks, for walking through in interviews. Each opens full screen with presenter
          tools.
        </p>
      </div>

      <ul className={styles.list}>
        {decks.map((d) => (
          <li key={d.slug} className={styles.card}>
            <a href={`#/${d.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
              <img src={d.thumb} alt="" />
            </a>
            <div className={styles.body}>
              <span className={styles.tag}>{d.tag}</span>
              <h2 className={styles.cardTitle}>
                <a href={`#/${d.slug}`}>{d.title}</a>
              </h2>
              <p className={styles.summary}>{d.summary}</p>
              <ol className={styles.chapters} aria-label="Chapters">
                {d.chapters.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ol>
              <div className={styles.actions}>
                <a href={`#/${d.slug}`} className={styles.primary}>
                  Present <ArrowUpRight size={16} strokeWidth={2} />
                </a>
                <CopyLink slug={d.slug} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.hint}>
        <Keyboard size={15} strokeWidth={1.8} />
        In a deck: arrow keys to move, F for fullscreen, O for all slides, ? for every shortcut.
      </p>
    </main>
  );
}
