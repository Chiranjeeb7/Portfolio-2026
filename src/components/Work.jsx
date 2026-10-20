import { rich } from "./rich";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import { useMediaQuery } from "../hooks/useMediaQuery";
import CompanyLogo from "./CompanyLogo";
import CountUp from "./motion/CountUp";
import RevealText from "./motion/RevealText";
import ThumbnailPlaceholder from "./ThumbnailPlaceholder";
import PhoneCarousel from "./PhoneCarousel";
import ScreenStack from "./ScreenStack";
import { COVER_THUMBNAILS, SCREEN_STACKS, THUMBNAILS } from "./projectArt";
import styles from "./Work.module.css";

// Per-project backdrop overrides for screenshots whose colours clash with the
// default accent gradient.
const ART_BACKGROUNDS = { "map-practice": styles.artLavender };

const EASE = [0.16, 1, 0.3, 1];
// The stack only pins where a whole card fits on screen with room to spare.
const STACK_QUERY = "(min-width: 1025px) and (min-height: 680px)";
// Must match --stack-top / --stack-step in Work.module.css.
const NAV_H = 72;
const STACK_TOP = NAV_H + 24;
const STACK_STEP = 30;

function ProjectCard({ project: p, index, total, progress, stacked, reduce, touch }) {
  const external = !p.href.startsWith("#");
  const stack = SCREEN_STACKS[p.id];
  const isCover = !stack && COVER_THUMBNAILS.has(p.id);
  const [hovered, setHovered] = useState(false);
  const last = index === total - 1;

  // Touch screens can't hover, so there the screens shuffle while the
  // card's art is well in view instead, and stop once it scrolls away.
  const artRef = useRef(null);
  const artInView = useInView(artRef, { amount: 0.6 });
  const active = touch ? artInView : hovered;

  // While pinned, each earlier card sinks back (smaller, dimmer) as the
  // cards after it slide up over it: depth that says "you've read this one".
  const start = total > 1 ? index / (total - 1) : 0;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.045]);
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.22]);

  // Border spotlight follows the pointer; CSS variables only, no re-render.
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const artReveal = reduce
    ? {}
    : {
        initial: { clipPath: "inset(14% 10% 14% 10%)" },
        whileInView: { clipPath: "inset(0% 0% 0% 0%)" },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 1.4, ease: EASE },
      };
  const imgReveal = reduce
    ? {}
    : {
        initial: { scale: 1.25 },
        whileInView: { scale: 1 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 1.6, ease: EASE },
      };

  return (
    <div className={styles.stackItem} style={{ "--i": index }}>
      <motion.article
        className={styles.card}
        style={stacked && !last ? { scale } : undefined}
        onPointerMove={onPointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <motion.div
          ref={artRef}
          className={`${styles.art} ${isCover ? styles.artFlat : ""} ${stack ? styles.artStack : ""} ${ART_BACKGROUNDS[p.id] ?? ""}`}
          {...artReveal}
        >
          {stack ? (
            stack.phones ? (
              <PhoneCarousel {...stack} hovered={active} eager={index === 0} />
            ) : (
              <ScreenStack {...stack} hovered={active} eager={index === 0} />
            )
          ) : THUMBNAILS[p.id] ? (
            <motion.img
              src={THUMBNAILS[p.id]}
              alt=""
              className={isCover ? styles.thumbnailCover : styles.thumbnail}
              loading={index === 0 ? "eager" : "lazy"}
              {...imgReveal}
            />
          ) : (
            <ThumbnailPlaceholder />
          )}
          <div className={styles.shippedAt}>
            <span>Shipped at</span>
            <CompanyLogo company={p.company} className={styles.metaLogo} />
          </div>
        </motion.div>

        <div className={styles.body}>
          <div className={styles.metaRow}>
            <span className={`numeric ${styles.index}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.tagText}>{p.tag}</span>
          </div>

          <h3 className={styles.cardTitle}>{p.title}</h3>
          <p className={styles.cardDescription}>{rich(p.description)}</p>

          <dl className={styles.stats}>
            {p.stats.map((s) => (
              <div className={styles.stat} key={s.label}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statValue}>
                  <CountUp value={s.value} className="numeric" />
                </dd>
              </div>
            ))}
          </dl>

          {/* The link's ::after stretches over the whole card, so the
              entire card is one click target without nesting content
              inside an <a>. */}
          <a
            className={styles.link}
            href={p.href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            aria-label={`Read case study: ${p.title}`}
          >
            <span className="roll">
              <span>Read case study</span>
              <span aria-hidden="true">Read case study</span>
            </span>
            <span className={styles.linkIcon}>
              <ArrowUpRight size={18} />
            </span>
          </a>
        </div>

        {stacked && !last && <motion.div className={styles.dim} style={{ opacity: dim }} aria-hidden="true" />}
      </motion.article>
    </div>
  );
}

export default function Work() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const canStack = useMediaQuery(STACK_QUERY);
  const stacked = canStack && !reduce;
  const touch = useMediaQuery("(hover: none)");

  // Progress runs from the first card pinning (list top at the stack line) to
  // the last card pinning (list bottom one card-height below its own pin
  // line), so every earlier card finishes sinking back exactly as the final
  // card lands. Needs the real card height, measured and kept up to date.
  const [lastH, setLastH] = useState(420);
  useLayoutEffect(() => {
    const last = listRef.current?.lastElementChild;
    if (!last) return;
    const ro = new ResizeObserver(() => setLastH(Math.round(last.offsetHeight)));
    ro.observe(last);
    return () => ro.disconnect();
  }, []);
  const endLine = STACK_TOP + (projects.length - 1) * STACK_STEP + lastH;
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: [`start ${STACK_TOP}px`, `end ${endLine}px`],
  });

  return (
    <section id="work" className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <span className={styles.eyebrow} data-reveal>
            Selected work
          </span>
          <RevealText className={styles.heading} text="Work that shipped, with the numbers to show for it" />
          <p className={styles.intro} data-reveal style={{ "--reveal-i": 2 }}>
            Three projects, three real outcomes.
          </p>
        </header>

        <div ref={listRef} className={`${styles.list} ${stacked ? styles.listStacked : ""}`}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
              reduce={reduce}
              touch={touch}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
