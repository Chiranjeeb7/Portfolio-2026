import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { profile } from "../data/content";
import { useTheme } from "../hooks/useTheme";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#writing", label: "Writing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.brand}>
          <span className={styles.brandName}>{profile.name}</span>
          <span className={styles.brandRole}>{profile.role}</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className={styles.themeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#contact" className={`btn btn-primary ${styles.cta}`}>
            Say hello
          </a>
        </nav>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className={styles.mobilePanel} aria-label="Primary mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className={`${styles.themeToggle} ${styles.themeToggleMobile}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? "Light mode" : "Dark mode"}
          </button>
          <a
            href="#contact"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => setOpen(false)}
          >
            Say hello
          </a>
        </nav>
      )}
    </header>
  );
}
