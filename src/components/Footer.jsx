import { Mail } from "lucide-react";
import { profile } from "../data/content";
import CoffeeGame from "./CoffeeGame";
import CoffeeIcon from "./icons/CoffeeIcon";
import { InstagramIcon, LinkedinIcon } from "./icons/SocialIcons";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={`container ${styles.footer}`}>
      <div className={styles.grid}>
        <div>
          <div className={styles.headingRow}>
            <span className={styles.coffeeTile}>
              <CoffeeIcon size={26} />
            </span>
            <h2 className={styles.heading}>Coffee's on me.</h2>
          </div>
          <p className={styles.copy}>
            Have a project or idea in mind? Let's connect and create something amazing together —
            I read every message myself.
          </p>

          <div className={styles.contacts}>
            <a className={styles.contactLink} href={`mailto:${profile.email}`}>
              <span className={styles.iconTile}>
                <Mail size={18} />
              </span>
              {profile.email}
            </a>
            <a
              className={styles.contactLink}
              href={profile.linkedin.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.iconTile}>
                <LinkedinIcon size={18} />
              </span>
              {profile.linkedin.handle}
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
              {profile.instagram.handle}
            </a>
          </div>
        </div>

        <CoffeeGame />
      </div>

      <div className={styles.bottom}>
        <span>Designed &amp; built by {profile.shortName} · 2026</span>
        <span>{profile.role}</span>
      </div>
    </footer>
  );
}
