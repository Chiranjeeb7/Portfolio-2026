import {
  AppWindow,
  ArrowRight,
  EyeOff,
  Gamepad2,
  Gavel,
  Hand,
  ImagePlus,
  Layers,
  MessageCircle,
  RefreshCw,
  Sparkle,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react";
import { nav, hero, context, problem, goals, solutions, impact, learnings } from "../data/transporterCaseStudy";
import CaseStudyHeader from "../components/casestudy/CaseStudyHeader";
import CaseStudySideNav from "../components/casestudy/CaseStudySideNav";
import MoreWork from "../components/casestudy/MoreWork";
import CountUp from "../components/motion/CountUp";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import newHome from "../assets/photos/transporter-new-home.png";
import newSpotList from "../assets/photos/transporter-new-spot-list.png";
import newAcceptTerms from "../assets/photos/transporter-new-accept-terms.png";
import newAuctionRoom from "../assets/photos/transporter-new-auction-room.png";
import newBidCard from "../assets/photos/transporter-new-bid-card.png";
import oldHome from "../assets/photos/transporter-old-home.webp";
import oldAuctionDetail from "../assets/photos/transporter-old-auction-detail.webp";
import styles from "./CaseStudy.module.css";
import local from "./TransporterCaseStudy.module.css";

const STAT_ICONS = {
  scope: Layers,
  typing: Hand,
  participation: Users,
  offline: MessageCircle,
  revise: RefreshCw,
};
const FLOW_ICONS = { gavel: Gavel, trend: TrendingDown, trophy: Trophy };
const POINT_ICONS = { generic: AppWindow, gamepad: Gamepad2, eyeOff: EyeOff };
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
};
const FRAMED_SCREENS = new Set(["newHome", "newSpotList", "newAcceptTerms", "newAuctionRoom"]);

function Screen({ screen }) {
  if (!screen.src) {
    return (
      <figure className={local.screen}>
        <div className={local.screenPlaceholder}>
          <ImagePlus size={20} strokeWidth={1.5} />
          <span>Screen to be added</span>
        </div>
        <figcaption className={local.screenCaption}>{screen.label}</figcaption>
      </figure>
    );
  }

  const imgClass = screen.crop
    ? local.cropImg
    : FRAMED_SCREENS.has(screen.src)
      ? local.framedImg
      : local.bezelImg;

  return (
    <figure className={`${local.screen} ${screen.crop ? local.screenWide : ""}`}>
      <img src={SCREENS[screen.src]} alt={screen.label} className={imgClass} loading="lazy" />
      <figcaption className={local.screenCaption}>{screen.label}</figcaption>
    </figure>
  );
}

// Slots whose screen hasn't been supplied yet are left out rather than shown
// as an empty frame; a side with nothing left drops out entirely.
function Compare({ before, after }) {
  const shownBefore = before.filter((s) => s.src);
  const shownAfter = after.filter((s) => s.src);
  if (shownAfter.length === 0) return null;
  if (shownBefore.length === 0) {
    return (
      <div className={local.compareGroup}>
        <span className={`${local.compareTag} ${local.compareTagAfter}`}>Redesign</span>
        <div className={local.compareScreens}>
          {shownAfter.map((s) => (
            <Screen key={s.label} screen={s} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={local.compare}>
      <div className={local.compareGroup}>
        <span className={`${local.compareTag} ${local.compareTagBefore}`}>Before</span>
        <div className={local.compareScreens}>
          {shownBefore.map((s) => (
            <Screen key={s.label} screen={s} />
          ))}
        </div>
      </div>

      <ArrowRight size={20} strokeWidth={1.6} className={local.compareArrow} aria-hidden="true" />

      <div className={local.compareGroup}>
        <span className={`${local.compareTag} ${local.compareTagAfter}`}>After</span>
        <div className={local.compareScreens}>
          {shownAfter.map((s) => (
            <Screen key={s.label} screen={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ card }) {
  return (
    <div className={styles.goalCard}>
      <h4 className={styles.goalCardTitle}>
        {card.title} <span aria-hidden="true">{card.emoji}</span>
      </h4>
      <ul className={styles.goalList}>
        {card.items.map((g) => (
          <li key={g.title}>
            <Sparkle size={13} strokeWidth={1.8} className={styles.goalIcon} />
            <div>
              <strong>{g.title}</strong>
              <p>{g.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TransporterCaseStudy() {
  const heroStats = hero.stats.filter((s) => !s.placeholder);
  const impactStats = impact.stats.filter((s) => !s.placeholder);
  const sections = nav.filter((item) => item.id !== "impact" || impactStats.length > 0);

  return (
    <>
      <CaseStudyHeader title="Transporter auctions" />

      <main>
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <span className="tag">{hero.tag}</span>
              <h1 className={styles.title}>
                {hero.titleLines.map((line) => (
                  <span key={line.text} className={line.accent ? styles.accentLine : styles.titleLine}>
                    {line.text}
                  </span>
                ))}
              </h1>

              <div className={styles.roleBlock}>
                <span className={styles.eyebrow}>My role</span>
                <p className={`measure ${styles.roleText}`}>{hero.role}</p>
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
              <span className={styles.eyebrowAccent}>{context.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{context.heading}</h2>
              {context.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {p}
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
                        <p className={styles.flowText}>{step.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Problem */}
            <section id="problem" className={styles.section} data-reveal>
              <span className={styles.eyebrowAccent}>{problem.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{problem.heading}</h2>
              <p className={styles.paragraph}>{problem.intro}</p>

              <div className={styles.insightPointGrid}>
                {problem.points.map((p) => {
                  const Icon = POINT_ICONS[p.icon];
                  return (
                    <div key={p.title} className={styles.insightPoint}>
                      <span className={styles.flowIconTile}>
                        <Icon size={17} strokeWidth={1.6} />
                      </span>
                      <h3 className={styles.insightPointTitle}>{p.title}</h3>
                      <p className={styles.insightPointText}>{p.text}</p>
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
                      {row.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.corePanel}>
                <div className={styles.corePanelText}>
                  <span className={styles.coreTag}>{goals.core.tag}</span>
                  <h3 className={styles.corePanelTitle}>{goals.core.title}</h3>
                  <p className={styles.corePanelBody}>{goals.core.text}</p>
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
              <p className={styles.paragraph}>Four problems, and how the redesign fixed each one, old screens next to new where we have them.</p>

              {solutions.map((sol) => (
                <div key={sol.title} className={styles.solutionBlock}>
                  {sol.after.some((s) => s.src) && (
                    <div className={styles.solutionMedia}>
                      <Compare before={sol.before} after={sol.after} />
                    </div>
                  )}

                  <div className={styles.solutionBody}>
                    <span className={styles.eyebrow}>{sol.number}</span>
                    <h3 className={styles.solutionTitle}>{sol.title}</h3>

                    <div className={styles.solutionRow}>
                      <h4 className={styles.miniLabel}>Problem</h4>
                      <p className={styles.solutionText}>{sol.problem}</p>
                    </div>
                    <div className={styles.solutionRow}>
                      <h4 className={styles.miniLabel}>Solution</h4>
                      <p className={styles.solutionText}>{sol.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Impact */}
            {impactStats.length > 0 && (
            <section id="impact" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{impact.heading}</h2>

              <div className={styles.impactGrid}>
                {impactStats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div
                      key={s.title}
                      className={`${styles.impactTile} ${s.placeholder ? styles.impactTilePlaceholder : ""}`}
                    >
                      <Icon size={20} strokeWidth={1.6} className={styles.impactIcon} />
                      <CountUp value={s.value} className={`numeric ${styles.impactValue}`} />
                      <h3 className={styles.impactTitle}>{s.title}</h3>
                      <p className={styles.impactText}>{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
            )}

            {/* Learnings */}
            <section id="learnings" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{learnings.heading}</h2>
              <div className={styles.twoCol}>
                {learnings.items.map((l) => (
                  <div key={l.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{l.title}</h3>
                    <p className={styles.cardText}>{l.text}</p>
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
