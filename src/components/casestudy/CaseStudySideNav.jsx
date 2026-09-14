import { useEffect, useState } from "react";
import styles from "./CaseStudySideNav.module.css";

// Sticky section nav with scrollspy — highlights whichever section is
// currently most visible, same pattern the V1 Framer case study used to
// make a long page feel navigable rather than like one big scroll.
export default function CaseStudySideNav({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Scrolls to the section directly (rather than an `href="#id"` anchor) so
  // clicking a section link never touches window.location.hash — this page
  // is itself reached via a "#/planner" route hash, and changing it to a
  // plain "#context" would make useHashRoute think we'd navigated home.
  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={styles.sideNav} aria-label="Case study sections">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`${styles.link} ${activeId === item.id ? styles.linkActive : ""}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
