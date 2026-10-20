import { rich } from "../components/rich";
import {
  ArrowUpDown,
  Banknote,
  Box,
  Clock,
  Cpu,
  EyeOff,
  FileSpreadsheet,
  Gauge,
  GitBranch,
  GraduationCap,
  ImageIcon,
  LayoutGrid,
  PackageSearch,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import {
  nav,
  hero,
  context,
  story,
  insights,
  problem,
  iterations,
  solutions,
  impact,
  learnings,
} from "../data/plannerCaseStudy";
import CaseStudyHeader from "../components/casestudy/CaseStudyHeader";
import CaseStudySideNav from "../components/casestudy/CaseStudySideNav";
import MoreWork from "../components/casestudy/MoreWork";
import CountUp from "../components/motion/CountUp";
import ConceptExplorer from "../components/casestudy/ConceptExplorer";
import PlannerDiagram from "../components/casestudy/PlannerDiagram";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import landingBanner from "../assets/photos/planner-landing-banner.webp";
import plannerPlan from "../assets/photos/planner-plan.webp";
import plannerFailureSummary from "../assets/photos/planner-failure-summary.webp";
import truck3dMp4 from "../assets/photos/3d-truck.mp4";
import orderLoadMp4 from "../assets/photos/order-loading.mp4";
import styles from "./CaseStudy.module.css";

const FLOW_ICONS = { orders: PackageSearch, core: Cpu, output: ShieldCheck };
const STAT_ICONS = { trust: ShieldCheck, cost: Banknote, time: Clock, onboarding: GraduationCap };
const SOLUTION_IMAGES = {
  plan: plannerPlan,
  summary: plannerFailureSummary,
};
const SOLUTION_VIDEOS = {
  truck3d: { mp4: truck3dMp4 },
  orderLoad: { mp4: orderLoadMp4 },
};
const INSIGHT_STAT_ICONS = { gauge: Gauge, clock: Clock };
const INSIGHT_POINT_ICONS = {
  eyeOff: EyeOff,
  box: Box,
  sheet: FileSpreadsheet,
  tabs: LayoutGrid,
  split: GitBranch,
  swap: ArrowUpDown,
};

export default function PlannerCaseStudy() {
  const heroStats = hero.stats.filter((s) => !s.placeholder);
  const impactStats = impact.stats.filter((s) => !s.placeholder);
  const sections = nav.filter((item) => item.id !== "impact" || impactStats.length > 0);

  return (
    <>
      <CaseStudyHeader title="Planner" />

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
            <img
              src={landingBanner}
              alt="Planner: Unplanned orders, Plan, and load-detail screens"
              className={styles.heroShotImg}
            />
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
                <PlannerDiagram />

                <div className={styles.flow}>
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

            {/* Story */}
            <section id="story" className={styles.section} data-reveal>
              {story.eyebrow && <span className={styles.eyebrowAccent}>{story.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{story.heading}</h2>

              <ol className={styles.timeline}>
                {story.beats.map((beat, i) => (
                  <li key={beat.title} className={styles.timelineItem}>
                    <span className={styles.timelineRail} aria-hidden="true">
                      <span className={`numeric ${styles.timelineIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <div className={styles.timelineBody}>
                      <h3 className={styles.timelineTitle}>{beat.title}</h3>
                      <p className={styles.timelineText}>{rich(beat.text)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Insights */}
            <section id="insights" className={styles.section} data-reveal>
              {insights.eyebrow && <span className={styles.eyebrowAccent}>{insights.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{insights.heading}</h2>
              <p className={styles.paragraph}>{rich(insights.method)}</p>

              <div className={styles.insightStatRow}>
                {insights.stats.map((s) => {
                  const Icon = INSIGHT_STAT_ICONS[s.icon];
                  return (
                    <div key={s.label} className={styles.insightStat}>
                      <Icon size={18} strokeWidth={1.6} className={styles.insightStatIcon} />
                      <CountUp value={s.value} className={`numeric ${styles.insightStatValue}`} />
                      <span className={styles.insightStatLabel}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.insightPointGrid}>
                {insights.points.map((p) => {
                  const Icon = INSIGHT_POINT_ICONS[p.icon];
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

            {/* Problem */}
            <section id="problem" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{problem.eyebrow}</h2>

              <div className={styles.problemList}>
                <div className={styles.problemRow}>
                  <span className={styles.problemLabel}>{problem.business.title}:</span>
                  <p className={styles.problemText}>
                    <Sparkle size={13} strokeWidth={1.8} className={styles.problemIcon} />
                    {rich(problem.business.text)}
                  </p>
                </div>
                <div className={styles.problemRow}>
                  <span className={styles.problemLabel}>{problem.user.title}:</span>
                  <p className={styles.problemText}>
                    <Sparkle size={13} strokeWidth={1.8} className={styles.problemIcon} />
                    {rich(problem.user.text)}
                  </p>
                </div>
              </div>

              <div className={styles.corePanel}>
                <div className={styles.corePanelText}>
                  <span className={styles.coreTag}>{problem.core.tag}</span>
                  <h3 className={styles.corePanelTitle}>{problem.core.title}</h3>
                  <p className={styles.corePanelBody}>{rich(problem.core.text)}</p>
                </div>

                <div className={styles.goalCardsRow}>
                  <div className={styles.goalCard}>
                    <h4 className={styles.goalCardTitle}>
                      {problem.businessGoals.title}
                    </h4>
                    <ul className={styles.goalList}>
                      {problem.businessGoals.items.map((g) => (
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
                  <div className={styles.goalCard}>
                    <h4 className={styles.goalCardTitle}>
                      {problem.designGoals.title}
                    </h4>
                    <ul className={styles.goalList}>
                      {problem.designGoals.items.map((g) => (
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
                </div>
              </div>
            </section>

            {/* Iterations */}
            <section id="iterations" className={styles.section} data-reveal>
              {iterations.eyebrow && <span className={styles.eyebrowAccent}>{iterations.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{iterations.heading}</h2>
              <p className={styles.paragraph}>Flip through to see how the layout evolved.</p>

              <ConceptExplorer concepts={iterations.concepts} />

              <div className={styles.whyChosen}>
                <span className={styles.eyebrow}>Why concept 5 won</span>
                <p className={styles.whyChosenText}>{rich(iterations.intro)}</p>
              </div>
            </section>

            {/* Solution */}
            <section id="solution" className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>Solution</h2>
              <p className={styles.paragraph}>Four problems, four fixes.</p>

              {solutions.map((sol) => (
                <div key={sol.title} className={styles.solutionBlock}>
                  <div className={styles.solutionMedia}>
                    {SOLUTION_VIDEOS[sol.image] ? (
                      <video
                        className={styles.solutionImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label={sol.title}
                      >
                        <source src={SOLUTION_VIDEOS[sol.image].mp4} type="video/mp4" />
                      </video>
                    ) : sol.image ? (
                      <img
                        src={SOLUTION_IMAGES[sol.image]}
                        alt={sol.title}
                        className={styles.solutionImage}
                      />
                    ) : (
                      <div className={styles.solutionPlaceholder}>
                        <ImageIcon size={22} strokeWidth={1.5} />
                        <span>Screenshot coming soon</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.solutionBody}>
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
                      <p className={styles.impactText}>{rich(s.text)}</p>
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
                    <p className={styles.cardText}>{rich(l.text)}</p>
                  </div>
                ))}
              </div>
            </section>

            <MoreWork currentId="planner" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
