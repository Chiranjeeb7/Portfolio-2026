import { rich } from "../components/rich";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AppWindow,
  Code,
  EyeOff,
  Gamepad2,
  Gavel,
  Hand,
  Headset,
  ImagePlus,
  Keyboard,
  Layers,
  LogOut,
  MessageCircle,
  Phone,
  Play,
  RefreshCw,
  Rows3,
  Smartphone,
  Sparkle,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react";
import {
  nav,
  hero,
  context,
  research,
  problem,
  goals,
  solutions,
  build,
  impact,
  learnings,
} from "../data/transporterCaseStudy";
import CaseStudyHeader from "../components/casestudy/CaseStudyHeader";
import CaseStudySideNav from "../components/casestudy/CaseStudySideNav";
import MoreWork from "../components/casestudy/MoreWork";
import LaneSwipeDemo from "../components/casestudy/LaneSwipeDemo";
import CountUp from "../components/motion/CountUp";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import newHome from "../assets/photos/transporter-new-home.webp";
import newSpotList from "../assets/photos/transporter-new-spot-list.webp";
import newAcceptTerms from "../assets/photos/transporter-new-accept-terms.webp";
import newAuctionRoom from "../assets/photos/transporter-new-auction-room.webp";
import newBidCard from "../assets/photos/transporter-new-bid-card.webp";
import oldHome from "../assets/photos/transporter-old-home.webp";
import oldAuctionDetail from "../assets/photos/transporter-old-auction-detail.webp";
import oldBidForm from "../assets/photos/transporter-old-bid-form.webp";
import newLongTermList from "../assets/photos/transporter-new-longterm-list.webp";
import newEarlyBid from "../assets/photos/transporter-new-early-bid.webp";
import newLaneBookmarked from "../assets/photos/transporter-new-lane-bookmarked.webp";
import newPreloadedBid from "../assets/photos/transporter-new-preloaded-bid.webp";
import kiroBuild from "../assets/photos/transporter-kiro-build.webp";
import handMockup from "../assets/photos/hand-phone-mockup.webp";
import styles from "./CaseStudy.module.css";
import local from "./TransporterCaseStudy.module.css";

const STAT_ICONS = {
  scope: Layers,
  typing: Hand,
  participation: Users,
  offline: MessageCircle,
  revise: RefreshCw,
  adoption: Smartphone,
  build: Code,
};
const FLOW_ICONS = { gavel: Gavel, trend: TrendingDown, trophy: Trophy };
const POINT_ICONS = {
  generic: AppWindow,
  gamepad: Gamepad2,
  eyeOff: EyeOff,
  leave: LogOut,
  keyboard: Keyboard,
  lanes: Rows3,
};
const SOURCE_ICONS = { phone: Phone, support: Headset };
// New screens are flat 360×800 exports and get a CSS phone frame; old screens
// come from the V1 page with their device bezel already baked in.
const SCREENS = {
  newHome,
  newSpotList,
  newAcceptTerms,
  newAuctionRoom,
  newBidCard,
  oldHome,
  oldAuctionDetail,
  oldBidForm,
  newLongTermList,
  newEarlyBid,
  newLaneBookmarked,
  newPreloadedBid,
  kiroBuild,
};
const FRAMED_SCREENS = new Set([
  "newHome",
  "newSpotList",
  "newAcceptTerms",
  "newAuctionRoom",
  "newLongTermList",
  "newEarlyBid",
  "newLaneBookmarked",
  "newPreloadedBid",
]);

// Interactions shown as animated demos instead of a still screen.
const DEMOS = { laneSwipe: LaneSwipeDemo };

// Renders one screen at whatever size its container gives it: a demo, a
// dashed placeholder for a screen still to come, or the image itself.
function Screen({ screen }) {
  if (screen.demo) {
    const Demo = DEMOS[screen.demo];
    return <Demo />;
  }
  if (!screen.src) {
    return (
      <div className={local.screenPlaceholder}>
        <ImagePlus size={20} strokeWidth={1.5} />
        <span>Screen to be added</span>
      </div>
    );
  }
  const imgClass = screen.crop ? local.cropImg : FRAMED_SCREENS.has(screen.src) ? local.framedImg : local.bezelImg;
  return <img src={SCREENS[screen.src]} alt={screen.label} className={imgClass} loading="lazy" />;
}

function Thumb({ screen }) {
  if (screen.src) return <img src={SCREENS[screen.src]} alt="" loading="lazy" />;
  return <span className={local.thumbEmpty}>{screen.demo ? <Play size={12} /> : <ImagePlus size={12} />}</span>;
}

// Phone screens get one solution row each: the copy on one side, and on the
// other a single screen shown large, with a strip of thumbnails beneath to
// flip between the before and after screens. Showing one screen at a time
// is what lets it be big enough to read; every screen is still a tap away.
// Rows alternate sides (flip) so a run of solutions doesn't read as a column.
function SolutionShowcase({ sol, flip }) {
  const isNew = sol.before.length === 0;
  const screens = [
    ...sol.before.map((s) => ({ ...s, kind: "Before" })),
    ...sol.after.map((s) => ({ ...s, kind: isNew ? "New" : "After" })),
  ];
  // Open on the redesign: the first "after" screen.
  const [active, setActive] = useState(sol.before.length);
  const shown = screens[active];
  const groups = isNew
    ? [{ kind: "New", items: screens.map((s, i) => [s, i]) }]
    : ["Before", "After"].map((kind) => ({ kind, items: screens.map((s, i) => [s, i]).filter(([s]) => s.kind === kind) }));

  return (
    <div className={`${local.sol} ${flip ? local.solFlip : ""}`}>
      <div className={local.solStage}>
        <div className={local.hero}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className={local.heroInner}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Screen screen={shown} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className={local.heroCaption} aria-live="polite">
          <span className={`${local.kindTag} ${shown.kind === "Before" ? local.kindBefore : ""}`}>{shown.kind}</span>
          {shown.label}
        </p>

        {screens.length > 1 && (
          <div className={local.thumbs} role="group" aria-label={`Screens for ${sol.title}`}>
            {groups.map((g) => (
              <div key={g.kind} className={local.thumbGroup}>
                <span className={local.thumbLabel}>{g.kind}</span>
                <div className={local.thumbRow}>
                  {g.items.map(([s, i]) => (
                    <button
                      key={s.label}
                      type="button"
                      className={local.thumb}
                      aria-pressed={i === active}
                      aria-label={`${s.kind}: ${s.label}`}
                      title={s.label}
                      onClick={() => setActive(i)}
                    >
                      <Thumb screen={s} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={local.solBody}>
        <span className={styles.eyebrow}>{sol.number}</span>
        <h3 className={styles.solutionTitle}>{sol.title}</h3>
        <div className={styles.solutionRow}>
          <h4 className={styles.miniLabel}>Problem</h4>
          <p className={styles.solutionText}>{rich(sol.problem)}</p>
        </div>
        <div className={styles.solutionRow}>
          <h4 className={styles.miniLabel}>Solution</h4>
          <p className={styles.solutionText}>{rich(sol.solution)}</p>
        </div>
      </div>
    </div>
  );
}

function GoalCard({ card }) {
  return (
    <div className={styles.goalCard}>
      <h4 className={styles.goalCardTitle}>
        {card.title}
      </h4>
      <ul className={styles.goalList}>
        {card.items.map((g) => (
          <li key={g.title}>
            <Sparkle size={13} strokeWidth={1.8} className={styles.goalIcon} />
            <div>
              <strong>{g.title}</strong>
              <p>{rich(g.text)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// A real app screen composited into the hand-held phone photo (the same
// mockup as the Framer page). The screen sits in a box matched to the
// phone's display, so any 360×800 export drops straight in.
function HandMockup({ screen, alt }) {
  return (
    <figure className={local.hand}>
      <div className={local.handFrame}>
        <img src={handMockup} alt="" className={local.handImg} loading="lazy" />
        <img src={SCREENS[screen]} alt={alt} className={local.handScreen} loading="lazy" />
      </div>
    </figure>
  );
}

// App share of auction usage before and after, as two 100% bars. The rest of each
// bar is web and WhatsApp combined, the only other channels measured. The
// app segment grows in once the Impact section scrolls into view.
function ChannelShare({ before, after }) {
  const rows = [
    { label: "Before", app: before },
    { label: "After", app: after },
  ];
  return (
    <div className={local.channels}>
      <p className={local.channelsLabel}>Share of auction usage by channel</p>
      <div className={local.channelRows}>
        {rows.map((r) => {
          // Too narrow to hold its own label: show it just outside instead.
          const narrow = r.app < 15;
          return (
            <div key={r.label} className={local.channelRow}>
              <span className={local.channelRowLabel}>{r.label}</span>
              <div
                className={local.channelBar}
                role="img"
                aria-label={`${r.label}: ${r.app}% on the mobile app, ${100 - r.app}% on web and WhatsApp`}
              >
                <span className={local.channelApp} style={{ "--share": `${r.app}%` }}>
                  {!narrow && <span className="numeric">{r.app}%</span>}
                </span>
                <span className={`${local.channelRest} ${narrow ? local.channelRestSplit : ""}`}>
                  {narrow && <span className={`numeric ${local.channelOutside}`}>{r.app}%</span>}
                  <span className="numeric">{100 - r.app}%</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={local.channelLegend} aria-hidden="true">
        <span>
          <i className={local.swatchApp} /> Mobile app
        </span>
        <span>
          <i className={local.swatchRest} /> Web + WhatsApp
        </span>
      </div>
    </div>
  );
}

export default function TransporterCaseStudy() {
  const heroStats = hero.stats.filter((s) => !s.placeholder);
  // The app-adoption figure leads the Impact section with its own chart;
  // any other confirmed figures sit in the tile grid below it.
  const impactStats = impact.stats.filter((s) => !s.placeholder);
  const adoption = impactStats.find((s) => s.icon === "adoption");
  const otherImpactStats = impactStats.filter((s) => s !== adoption);
  const sections = nav;

  return (
    <>
      <CaseStudyHeader title="Transporter auctions" />

      <main>
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <span className="tag">{hero.tag}</span>
              <h1 className={styles.title}>
                {hero.titleLines.map((line, i) => (
                  <span key={line.text} className={line.accent ? styles.accentLine : styles.titleLine}>
                    {line.text}
                    {/* Keeps the lines apart in the accessible name. */}
                    {i < hero.titleLines.length - 1 && " "}
                  </span>
                ))}
              </h1>

              <div className={styles.roleBlock}>
                <span className={styles.eyebrow}>My role</span>
                <p className={`measure ${styles.roleText}`}>{rich(hero.role)}</p>
              </div>
            </div>

            <div className={styles.statGridWrap}>
              <CornerMarks />
              <div className={styles.statGrid}>
                {heroStats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div
                      key={s.label}
                      className={`${styles.statTile} ${s.placeholder ? styles.statTilePlaceholder : ""}`}
                    >
                      <Icon size={17} strokeWidth={1.6} className={styles.statIcon} />
                      <CountUp value={s.value} className={`numeric ${styles.statValue}`} />
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.heroShot}>
            <CornerMarks />
            <div className={local.heroStage}>
              {hero.screens.map((s) => (
                <img key={s.src} src={SCREENS[s.src]} alt={s.alt} className={local.framedImg} />
              ))}
            </div>
          </div>
        </section>

        <div className={`container ${styles.body}`}>
          <CaseStudySideNav items={sections} />

          <div className={styles.content}>
            {/* Context */}
            <section id="context" className={styles.section} data-reveal>
              {context.eyebrow && <span className={styles.eyebrowAccent}>{context.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{context.heading}</h2>
              {context.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {rich(p)}
                </p>
              ))}

              <h3 className={styles.diagramHeading}>{context.diagramHeading}</h3>

              <div className={styles.plannerSection}>
                <div className={`${styles.flow} ${local.flowFlush}`}>
                  {context.flow.map((step, i) => {
                    const Icon = FLOW_ICONS[step.icon];
                    return (
                      <div key={step.title} className={styles.flowStep}>
                        <span className={styles.flowIconTile}>
                          <Icon size={18} strokeWidth={1.6} />
                        </span>
                        <span className={`numeric ${styles.flowIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                        <h3 className={styles.flowTitle}>{step.title}</h3>
                        <p className={styles.flowText}>{rich(step.text)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Research */}
            <section id="research" className={styles.section} data-reveal>
              {research.eyebrow && <span className={styles.eyebrowAccent}>{research.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{research.heading}</h2>
              <p className={styles.paragraph}>{rich(research.intro)}</p>

              <div className={local.sourceGrid}>
                {research.sources.map((s) => {
                  const Icon = SOURCE_ICONS[s.icon];
                  return (
                    <div key={s.title} className={styles.insightPoint}>
                      <span className={styles.flowIconTile}>
                        <Icon size={17} strokeWidth={1.6} />
                      </span>
                      <h3 className={styles.insightPointTitle}>{s.title}</h3>
                      <p className={styles.insightPointText}>{rich(s.text)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Problem */}
            <section id="problem" className={styles.section} data-reveal>
              {problem.eyebrow && <span className={styles.eyebrowAccent}>{problem.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{problem.heading}</h2>
              <p className={styles.paragraph}>{rich(problem.intro)}</p>

              <div className={styles.insightPointGrid}>
                {problem.points.map((p) => {
                  const Icon = POINT_ICONS[p.icon];
                  return (
                    <div key={p.title} className={styles.insightPoint}>
                      <span className={styles.flowIconTile}>
                        <Icon size={17} strokeWidth={1.6} />
                      </span>
                      <h3 className={styles.insightPointTitle}>{p.title}</h3>
                      <p className={styles.insightPointText}>{rich(p.text)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Goals */}
            <section id="goals" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{goals.eyebrow}</h2>

              <div className={styles.problemList}>
                {[goals.business, goals.user].map((row) => (
                  <div key={row.title} className={styles.problemRow}>
                    <span className={styles.problemLabel}>{row.title}:</span>
                    <p className={styles.problemText}>
                      <Sparkle size={13} strokeWidth={1.8} className={styles.problemIcon} />
                      {rich(row.text)}
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.corePanel}>
                <div className={styles.corePanelText}>
                  <span className={styles.coreTag}>{goals.core.tag}</span>
                  <h3 className={styles.corePanelTitle}>{goals.core.title}</h3>
                  <p className={styles.corePanelBody}>{rich(goals.core.text)}</p>
                </div>

                <div className={styles.goalCardsRow}>
                  <GoalCard card={goals.businessGoals} />
                  <GoalCard card={goals.designGoals} />
                </div>
              </div>
            </section>

            {/* Solution */}
            <section id="solution" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>Solution</h2>
              <p className={styles.paragraph}>
                Six problems, six fixes. Tap the thumbnails to compare old and new.
              </p>

              {solutions.map((sol, i) => (
                <SolutionShowcase key={sol.title} sol={sol} flip={i % 2 === 1} />
              ))}
            </section>

            {/* How we built it */}
            <section id="build" className={styles.section} data-reveal>
              {build.eyebrow && <span className={styles.eyebrowAccent}>{build.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{build.heading}</h2>
              {build.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {rich(p)}
                </p>
              ))}
              <figure className={local.buildShot}>
                <img src={SCREENS[build.image.src]} alt={build.image.alt} loading="lazy" />
                <figcaption className={local.buildCaption}>{build.caption}</figcaption>
              </figure>
            </section>

            {/* Impact */}
            <section id="impact" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{impact.heading}</h2>
              <p className={styles.paragraph}>{rich(impact.intro)}</p>

              <div className={local.impactShowcase}>
                <div className={local.impactLead}>
                  <Smartphone size={20} strokeWidth={1.6} className={styles.impactIcon} />
                  <CountUp value={adoption.value} className={`numeric ${local.impactLeadValue}`} />
                  <h3 className={styles.impactTitle}>{adoption.title}</h3>
                  <p className={styles.impactText}>{rich(adoption.text)}</p>
                  <ChannelShare {...impact.adoption} />
                </div>
                <HandMockup screen={impact.showcase.src} alt={impact.showcase.alt} />
              </div>

              {otherImpactStats.length > 0 && (
              <div className={`${styles.impactGrid} ${local.impactRest}`}>
                {otherImpactStats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div
                      key={s.title}
                      className={`${styles.impactTile} ${s.placeholder ? styles.impactTilePlaceholder : ""}`}
                    >
                      <Icon size={20} strokeWidth={1.6} className={styles.impactIcon} />
                      <CountUp value={s.value} className={`numeric ${styles.impactValue}`} />
                      <h3 className={styles.impactTitle}>{s.title}</h3>
                      <p className={styles.impactText}>{rich(s.text)}</p>
                    </div>
                  );
                })}
              </div>
              )}
            </section>

            {/* Learnings */}
            <section id="learnings" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{learnings.heading}</h2>
              <div className={styles.twoCol}>
                {learnings.items.map((l) => (
                  <div key={l.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{l.title}</h3>
                    <p className={styles.cardText}>{rich(l.text)}</p>
                  </div>
                ))}
              </div>
            </section>

            <MoreWork currentId="transporter-mobile-app" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
