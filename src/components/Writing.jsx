import { ArrowUpRight } from "lucide-react";
import bootcampLogo from "../assets/logos/bootcamp.png";
import edTechTalksLogo from "../assets/logos/ed-tech-talks.png";
import uxCollectiveLogo from "../assets/logos/ux-collective.png";
import { blogPosts } from "../data/content";
import RevealText from "./motion/RevealText";
import styles from "./Writing.module.css";

const PUBLICATIONS = [...new Set(blogPosts.map((p) => p.featuredIn))].join(", ").replace(/, ([^,]*)$/, " and $1");

const PUBLICATION_LOGOS = {
  "Ed-Tech Talks": edTechTalksLogo,
  "UX Collective": uxCollectiveLogo,
  Bootcamp: bootcampLogo,
};

// The accent fill enters from whichever edge the pointer came in through
// (and leaves through the edge it exits), so the row feels pushed, not
// toggled. Only a data attribute changes; CSS does the motion.
function setDirection(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.dataset.from = e.clientY - r.top < r.height / 2 ? "top" : "bottom";
}

export default function Writing() {
  return (
    <section id="writing" className={`container section ${styles.section}`}>
      <RevealText className={styles.heading} text="Thinking out loud, in public" />
      <p className={styles.intro} data-reveal>
        Articles on designing for real audiences, featured in {PUBLICATIONS}.
      </p>

      <ul className={styles.list}>
        {blogPosts.map((post, i) => (
          <li key={post.id} data-reveal style={{ "--reveal-i": i }}>
            <a
              className={styles.row}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              onPointerEnter={setDirection}
              onPointerLeave={setDirection}
            >
              <img src={PUBLICATION_LOGOS[post.featuredIn]} alt="" className={styles.logo} />
              <h3 className={styles.title}>{post.title}</h3>
              <span className={styles.meta}>
                <span>{post.featuredIn}</span>
                <span>{post.readTime}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
