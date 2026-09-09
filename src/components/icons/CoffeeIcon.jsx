import styles from "./CoffeeIcon.module.css";

// Hand-authored to match the site's single-stroke icon grammar (see
// SocialIcons.jsx) — a cup + saucer with three looping steam wisps animated
// via CSS (rise, curl, fade). Respects prefers-reduced-motion.
export default function CoffeeIcon({ size = 28, animate = true, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.icon} ${animate ? styles.animate : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        className={styles.steam1}
        d="M9.5 2.5c-.8.8-.8 1.6 0 2.4s.8 1.6 0 2.4"
      />
      <path className={styles.steam2} d="M12.5 1.8c-.8.8-.8 1.6 0 2.4s.8 1.6 0 2.4" />
      <path
        className={styles.steam3}
        d="M15.5 2.5c-.8.8-.8 1.6 0 2.4s.8 1.6 0 2.4"
      />
      <path d="M5 10h12v4.5A4.5 4.5 0 0 1 12.5 19h-3A4.5 4.5 0 0 1 5 14.5V10Z" />
      <path d="M17 11.5h1.2a2 2 0 0 1 0 4H17" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}
