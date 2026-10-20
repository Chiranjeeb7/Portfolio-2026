import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { profile } from "../data/content";
import CoffeeGame from "./CoffeeGame";
import CoffeeIcon from "./icons/CoffeeIcon";
import { InstagramIcon, LinkedinIcon } from "./icons/SocialIcons";
import Magnetic from "./motion/Magnetic";
import RevealText from "./motion/RevealText";
import { scrollToTarget } from "./motion/scroll";
import styles from "./Footer.module.css";

// mailto: silently does nothing for anyone without a desktop mail client
// (most webmail users), so the address is also one click to copy.
function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className={`container ${styles.footer}`}>
      <div className={styles.grid}>
        <div>
          <div className={styles.headingRow}>
            <Magnetic strength={0.4}>
              <span className={styles.coffeeTile}>
                <CoffeeIcon size={26} />
              </span>
            </Magnetic>
            <RevealText className={styles.heading} text="Coffee's on me." />
          </div>
          <p className={styles.copy} data-reveal>
            Hiring, or have a product problem worth untangling? I read every message myself.
          </p>

          <div className={styles.contacts} data-reveal style={{ "--reveal-i": 1 }}>
            <div className={styles.emailRow}>
              <a className={styles.contactLink} href={`mailto:${profile.email}`}>
                <span className={styles.iconTile}>
                  <Mail size={18} />
                </span>
                <span className={styles.contactText}>{profile.email}</span>
              </a>
              <CopyEmailButton />
            </div>
            <a
              className={styles.contactLink}
              href={profile.linkedin.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.iconTile}>
                <LinkedinIcon size={18} />
              </span>
              <span className={styles.contactText}>{profile.linkedin.handle}</span>
              <ArrowUpRight size={14} className={styles.external} />
            </a>
            <a
              className={styles.contactLink}
              href={profile.instagram.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.iconTile}>
                <InstagramIcon size={18} />
              </span>
              <span className={styles.contactText}>{profile.instagram.handle}</span>
              <ArrowUpRight size={14} className={styles.external} />
            </a>
          </div>
        </div>

        <div data-reveal style={{ "--reveal-i": 2 }}>
          <CoffeeGame />
        </div>
      </div>


      <div className={styles.bottom}>
        <span>
          Designed &amp; built by {profile.shortName} <span className={styles.nowrap}>· 2026</span>
        </span>
        {/* Scrolls rather than linking to "#home", which on a case study
            page would navigate away instead of going to the top. */}
        <button type="button" className={styles.toTop} onClick={() => scrollToTarget(0)}>
          <span className="roll">
            <span>Back to top ↑</span>
            <span aria-hidden="true">Back to top ↑</span>
          </span>
        </button>
      </div>
    </footer>
  );
}
