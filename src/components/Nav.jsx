import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { profile } from "../data/content";
import { useThemeSwitch } from "../hooks/useThemeSwitch";
import Magnetic from "./motion/Magnetic";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#writing", label: "Writing" },
];

const EASE = [0.16, 1, 0.3, 1];

// Highlights whichever homepage section currently sits under the nav.
function useActiveSection() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const targets = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return active;
}

// Label + an aria-hidden twin that rolls up into place on hover.
function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { isDark, switchTheme } = useThemeSwitch();
  const active = useActiveSection();

  // Escape closes the mobile menu; widening past the breakpoint does too, so
  // it can't linger open behind the desktop links.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 721px)");
    const onWide = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  const ThemeIcon = (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={isDark ? "sun" : "moon"}
        className={styles.themeIcon}
        initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.brand} aria-label={`${profile.name}, back to top`}>
          <span className={styles.brandMark} aria-hidden="true">
            CD
          </span>
          <span className={styles.brandName}>
            <Roll>{profile.name}</Roll>
          </span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`${styles.link} ${active === l.href ? styles.linkActive : ""}`}
              aria-current={active === l.href ? "true" : undefined}
            >
              {active === l.href && (
                <motion.span
                  layoutId="nav-active"
                  className={styles.activeMark}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Roll>{l.label}</Roll>
            </a>
          ))}
          <button
            type="button"
            className={styles.themeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={switchTheme}
          >
            {ThemeIcon}
          </button>
          <Magnetic strength={0.25}>
            <a href="#contact" className={`btn btn-primary ${styles.cta}`}>
              <Roll>Say hello</Roll>
              <ArrowUpRight size={15} className={styles.ctaArrow} />
            </a>
          </Magnetic>
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

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className={styles.mobilePanel}
            aria-label="Primary mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className={styles.mobileList}>
              {LINKS.map((l, i) => (
                <li key={l.href} className="mask">
                  <motion.a
                    href={l.href}
                    className={styles.mobileLink}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.07 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className={styles.mobileFooter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            >
              <button
                type="button"
                className={`${styles.themeToggle} ${styles.themeToggleMobile}`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={switchTheme}
              >
                {ThemeIcon} {isDark ? "Light mode" : "Dark mode"}
              </button>
              <a
                href="#contact"
                className={`btn btn-primary ${styles.mobileCta}`}
                onClick={() => setOpen(false)}
              >
                Say hello <ArrowUpRight size={15} />
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
