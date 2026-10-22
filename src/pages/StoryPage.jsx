import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Hand,
  Rocket,
  ScanSearch,
} from "lucide-react";
import CaseStudyHeader from "../components/casestudy/CaseStudyHeader";
import CompanyLogo from "../components/CompanyLogo";
import Footer from "../components/Footer";
import CountUp from "../components/motion/CountUp";
import RevealText from "../components/motion/RevealText";
import { rich } from "../components/rich";
import HeroSheet from "../components/story/HeroSheet";
import StorySketch from "../components/story/Sketches";
import TeamGrid from "../components/story/TeamGrid";
import omnirioLogo from "../assets/logos/omnirio-logo.png";
import {
  chapters,
  impact,
  journeyBreak,
  offClock,
  origins,
  principles,
  today,
} from "../data/story";
import styles from "./StoryPage.module.css";

const EASE = [0.16, 1, 0.3, 1];
const ICONS = { hand: Hand, rocket: Rocket, scan: ScanSearch, blocks: Blocks };

// Delhivery and BYJU'S have themed wordmarks. Omnirio's mark is a roundel
// whose lettering is unreadable this small, so it sits on a white chip (the
// About board's treatment) with the name set beside it.
function Logo({ logo }) {
  if (logo === "omnirio") {
    return (
      <span className={styles.logoNamed}>
        <span className={styles.logoChip}>
          <img src={omnirioLogo} alt="" />
        </span>
        Omnirio
      </span>
    );
  }
  return <CompanyLogo company={logo} className={styles.logo} />;
}

// A bordered panel that wipes open from the rail side the first time it
// scrolls into view, before its sketch starts drawing. The outer box is the
// one watched for visibility: a clip-path on the observed element itself
// would hide it from the intersection check, and it would never open.
function Panel({ className = "", children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={styles.panelWrap}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={`${styles.panel} ${className}`}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
          shown: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ---------- Company visuals (decorative: the facts are in the text) ----------
const BYJUS_POD = [23, 24, 25, 26, 33, 34, 35, 36, 43, 44, 45, 46];

function ChapterVisual({ kind }) {
  if (kind === "startup") {
    return (
      <div className={styles.visual}>
        <p className={styles.visualTitle}>The team when I joined</p>
        <TeamGrid
          total={25}
          cols={5}
          me={12}
          legend={[
            { kind: "me", label: "Me, the first designer" },
            { kind: "team", label: "25 people" },
          ]}
        />
        <div className={styles.visualStat}>
          <CountUp value="6 → 100" className={styles.visualStatValue} />
          <span className={styles.visualStatLabel}>customers while I was there</span>
        </div>
      </div>
    );
  }
  if (kind === "studio") {
    return (
      <div className={styles.visual}>
        <p className={styles.visualTitle}>The design org</p>
        <TeamGrid
          total={80}
          cols={10}
          me={34}
          pod={BYJUS_POD}
          legend={[
            { kind: "me", label: "Me" },
            { kind: "pod", label: "My pod, 12" },
            { kind: "team", label: "Designers and researchers, ~80" },
          ]}
        />
      </div>
    );
  }
  return (
    <div className={styles.visual}>
      <p className={styles.visualTitle}>What I work on now</p>
      <StorySketch name="agents" className={styles.agents} />
      <ol className={styles.ladder}>
        <li>Product Designer</li>
        <li aria-hidden="true">
          <ArrowRight size={14} />
        </li>
        <li>Design Lead</li>
        <li aria-hidden="true">
          <ArrowRight size={14} />
        </li>
        <li className={styles.ladderNow}>SaaS + agentic team</li>
      </ol>
    </div>
  );
}

// ---------- Journey: one rail from 2015 to today ----------

// Every stop on the rail, in order. Breaks sit on the rail but don't move
// the year counter.
// `yearIndex` numbers the stops that do move it.
let nextYear = 0;
const STOPS = [
  ...origins.map((o) => ({ kind: "origin", ...o })),
  { kind: "break", ...journeyBreak },
  ...chapters.map((c) => ({ kind: "company", place: c.company, ...c })),
  { kind: "today", ...today },
].map((s) => (s.kind === "break" ? s : { ...s, yearIndex: nextYear++ }));
const YEAR_STOPS = STOPS.filter((s) => s.kind !== "break");

// The stop in the middle band of the viewport. Remembers the direction of
// travel too, so the year counter rolls the right way when scrolling back up.
function useActiveStop(listRef) {
  const [state, setState] = useState({ index: 0, dir: 1 });
  useEffect(() => {
    const els = Array.from(listRef.current?.querySelectorAll("[data-stop]") ?? []);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const index = Number(e.target.dataset.stop);
          setState((s) => (s.index === index ? s : { index, dir: index > s.index ? 1 : -1 }));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [listRef]);
  return state;
}

// Odometer: each digit that changes rolls out and the new one rolls in, in
// the direction of travel. Digits that stay the same ("20") don't move.
function YearCounter({ stop, dir }) {
  return (
    <div className={styles.counter} aria-hidden="true">
      <div className={styles.counterDigits}>
        {stop.year.split("").map((d, i) => (
          <span key={i} className={styles.digitSlot}>
            <AnimatePresence initial={false} custom={dir}>
              <motion.span
                key={d}
                custom={dir}
                className={styles.digit}
                variants={{
                  enter: (dr) => ({ y: dr > 0 ? "100%" : "-100%", opacity: 0 }),
                  center: { y: "0%", opacity: 1 },
                  exit: (dr) => ({ y: dr > 0 ? "-100%" : "100%", opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.04 }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </div>
      <div className={styles.counterPlace}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={stop.place}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {stop.place}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function OriginStop({ stop }) {
  return (
    <>
      <div className={styles.stopText}>
        <span className={styles.stopYear}>{stop.year}</span>
        <RevealText as="h3" className={styles.stopTitle} text={stop.title} />
        {stop.body.map((p, i) => (
          <p key={p} className={styles.stopBody} data-reveal style={{ "--reveal-i": i + 1 }}>
            {rich(p)}
          </p>
        ))}
      </div>
      <Panel className={styles.sketchPanel}>
        <StorySketch name={stop.sketch} />
      </Panel>
    </>
  );
}

function CompanyStop({ stop }) {
  return (
    <>
      <div className={styles.stopText}>
        <span className={styles.stopYear}>{stop.year}</span>
        <div className={styles.chapterMeta} data-reveal>
          <Logo logo={stop.logo} />
          <span>{stop.dates}</span>
        </div>
        <span className={styles.role} data-reveal>
          {stop.role}
        </span>
        <RevealText as="h3" className={styles.stopTitle} text={stop.title} />
        {stop.body.map((p, i) => (
          <p key={p} className={styles.stopBody} data-reveal style={{ "--reveal-i": i + 1 }}>
            {rich(p)}
          </p>
        ))}
        <div className={styles.learned} data-reveal style={{ "--reveal-i": 3 }}>
          <span className={styles.learnedLabel}>What I learned</span>
          <p>{stop.learned}</p>
        </div>
        {stop.caseStudy && (
          <a href={stop.caseStudy.href} className={styles.inlineLink}>
            <span className="roll">
              <span>{stop.caseStudy.label}</span>
              <span aria-hidden="true">{stop.caseStudy.label}</span>
            </span>
            <ArrowRight size={14} />
          </a>
        )}
      </div>
      <Panel className={styles.companyPanel}>
        <div aria-hidden="true">
          <ChapterVisual kind={stop.visual} />
        </div>
      </Panel>
    </>
  );
}

function Journey() {
  const listRef = useRef(null);
  const railRef = useRef(null);
  const reduce = useReducedMotion();
  const { index, dir } = useActiveStop(listRef);

  // The rail draws as the reader moves down it; a pen tip rides the end of
  // the line. The tip's travel is measured in pixels (rail height), so it
  // moves with a transform, never `top`.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 45%", "end 45%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const railH = useMotionValue(0);
  const tipY = useTransform(() => fill.get() * railH.get());
  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => railH.set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [railH]);

  return (
    <section className={`container ${styles.block}`}>
      <RevealText className={styles.sectionTitle} text="How I got here" />
      <div className={styles.journey}>
        <div className={styles.counterCol}>
          <YearCounter stop={YEAR_STOPS[index]} dir={dir} />
        </div>

        <div className={styles.track} ref={listRef}>
          <span className={styles.rail} ref={railRef} aria-hidden="true">
            <motion.span className={styles.railFill} style={{ scaleY: reduce ? 1 : fill }} />
            {!reduce && <motion.span className={styles.railTip} style={{ y: tipY }} />}
          </span>

          <ol className={styles.stops}>
            {STOPS.map((stop) => {
              if (stop.kind === "break") {
                return (
                  <li key="break" className={styles.breakStop}>
                    <RevealText as="h3" className={styles.breakTitle} text={stop.title} />
                    <p className={styles.breakBody} data-reveal>
                      {stop.body}
                    </p>
                  </li>
                );
              }
              const reached = stop.yearIndex <= index;
              return (
                <li
                  key={stop.year + stop.title}
                  data-stop={stop.yearIndex}
                  className={`${styles.stop} ${reached ? styles.reached : ""} ${
                    stop.kind === "today" ? styles.todayStop : ""
                  }`}
                >
                  {stop.kind === "company" ? <CompanyStop stop={stop} /> : <OriginStop stop={stop} />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ---------- Other sections ----------
function Principles() {
  return (
    <section className={`container ${styles.block}`}>
      <RevealText className={styles.sectionTitle} text="How I design" />
      <ul className={styles.principles}>
        {principles.map((p, i) => {
          const Icon = ICONS[p.icon];
          return (
            <li key={p.title} className={styles.principle} data-reveal style={{ "--reveal-i": i }}>
              <div className={styles.principleTop}>
                <span className={styles.principleIcon}>
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <span className="tag">From {p.from}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Impact() {
  return (
    <section className={`container ${styles.block}`}>
      <RevealText className={styles.sectionTitle} text="Impact so far" />
      <div className={styles.ledger}>
        {impact.map((row, i) => (
          <div key={row.company} className={styles.ledgerRow} data-reveal style={{ "--reveal-i": i }}>
            <div className={styles.ledgerCompany}>
              <Logo logo={row.logo} />
              {row.links.length > 0 && (
                <div className={styles.ledgerLinks}>
                  {row.links.map((l) => (
                    <a key={l.href} href={l.href}>
                      {l.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {row.items.map((item) => (
              <div key={item.label} className={styles.ledgerItem}>
                <CountUp value={item.value} className={styles.ledgerValue} />
                <span className={styles.ledgerLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function OffClock() {
  return (
    <section className={`container ${styles.block}`}>
      <RevealText className={styles.sectionTitle} text="Off the clock" />
      <div className={styles.offGrid}>
        {offClock.map((h, i) => (
          <div key={h.title} className={styles.offTile} data-reveal style={{ "--reveal-i": i }}>
            <StorySketch name={h.sketch} className={styles.offSketch} />
            <h3>{h.title}</h3>
            <p>{h.body}</p>
          </div>
        ))}
      </div>
      <a href="#work" className={`btn btn-primary ${styles.next}`}>
        <span className="roll">
          <span>See the work</span>
          <span aria-hidden="true">See the work</span>
        </span>
        <ArrowRight size={15} />
      </a>
    </section>
  );
}

// The long-form About: one timeline from a sketchbook in 2015 to AI agents
// today, then how I work, what came of it, and life outside it.
export default function StoryPage() {
  return (
    <>
      <CaseStudyHeader title="My story" backHref="#about" backLabel="to about" />
      <main id="main" tabIndex={-1}>
        <HeroSheet />
        <Journey />
        <Principles />
        <Impact />
        <OffClock />
      </main>
      <Footer />
    </>
  );
}
