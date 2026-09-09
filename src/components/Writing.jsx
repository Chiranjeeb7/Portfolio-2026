import { ArrowUpRight } from "lucide-react";
import bootcampLogo from "../assets/logos/bootcamp.png";
import edTechTalksLogo from "../assets/logos/ed-tech-talks.png";
import uxCollectiveLogo from "../assets/logos/ux-collective.png";
import { blogPosts } from "../data/content";
import styles from "./Writing.module.css";

const PUBLICATION_LOGOS = {
  "Ed-Tech Talks": edTechTalksLogo,
  "UX Collective": uxCollectiveLogo,
  Bootcamp: bootcampLogo,
};

export default function Writing() {
  return (
    <section id="writing" className={`container section ${styles.section}`}>
      <h2 className={styles.heading}>Writing</h2>

      <div className={styles.list}>
        {blogPosts.map((post) => (
          <a
            className={styles.card}
            href={post.href}
            target="_blank"
            rel="noreferrer"
            key={post.id}
          >
            <img
              src={PUBLICATION_LOGOS[post.featuredIn]}
              alt={post.featuredIn}
              className={styles.logo}
            />
            <div className={styles.body}>
              <div className={styles.meta}>
                <span>{post.featuredIn}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className={styles.title}>{post.title}</h3>
            </div>
            <ArrowUpRight size={16} className={styles.arrow} />
          </a>
        ))}
      </div>
    </section>
  );
}
