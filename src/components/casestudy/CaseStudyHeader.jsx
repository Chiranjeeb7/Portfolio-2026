import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useThemeSwitch } from "../../hooks/useThemeSwitch";
import { profile } from "../../data/content";
import styles from "./CaseStudyHeader.module.css";

const EASE = [0.16, 1, 0.3, 1];

// Sticky case-study header: back to the Work section, the page's name, a
// theme toggle, and a hairline reading-progress bar along its bottom edge.
// Progress is a motion value (no React state), so scrolling never
// re-renders the page. Matches the homepage nav: rolling link label and
// the circular theme reveal.
// backHref/backLabel default to the Work section; milestone pages point
// back to the hero timeline instead.
export default function CaseStudyHeader({ title, backHref = "#work", backLabel = "to work" }) {
  const { isDark, switchTheme } = useThemeSwitch();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href={backHref} className={styles.back}>
          <ArrowLeft size={16} />
          <span className="roll">
            <span>
              Back<span className={styles.backLong}> {backLabel}</span>
            </span>
            <span aria-hidden="true">
              Back<span className={styles.backLong}> {backLabel}</span>
            </span>
          </span>
        </a>
        <span className={styles.crumb} aria-hidden="true">
          {profile.name} / <span className={styles.crumbTitle}>{title}</span>
        </span>
        <button
          type="button"
          className={styles.themeToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={switchTheme}
        >
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
        </button>
      </div>
      <motion.span className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
    </header>
  );
}
