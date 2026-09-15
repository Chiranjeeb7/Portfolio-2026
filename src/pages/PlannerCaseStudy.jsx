import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
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
  Moon,
  PackageSearch,
  ShieldCheck,
  Sparkle,
  Sun,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { projects } from "../data/content";
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
import CaseStudySideNav from "../components/casestudy/CaseStudySideNav";
import ConceptExplorer from "../components/casestudy/ConceptExplorer";
import PlannerDiagram from "../components/casestudy/PlannerDiagram";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import landingBanner from "../assets/photos/planner-landing-banner.png";
import plannerPlan from "../assets/photos/planner-plan.png";
import plannerFailureSummary from "../assets/photos/planner-failure-summary.png";
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
  const { isDark, toggle } = useTheme();

  // Arriving via a hash-route change doesn't reset scroll the way a fresh
  // page load would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const otherProjects = projects.filter((p) => p.id !== "planner");

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <a href="#" className={styles.back}>
            <ArrowLeft size={16} /> Back to work
          </a>
          <button
            type="button"
            className={styles.themeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

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
                {hero.stats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div
                      key={s.label}
                      className={`${styles.statTile} ${s.placeholder ? styles.statTilePlaceholder : ""}`}
                    >
                      <Icon size={17} strokeWidth={1.6} className={styles.statIcon} />
                      <span className={`numeric ${styles.statValue}`}>{s.value}</span>
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
              alt="Planner — Unplanned orders, Plan, and load-detail screens"
              className={styles.heroShotImg}
            />
          </div>
        </section>

        <div className={`container ${styles.body}`}>
          <CaseStudySideNav items={nav} />

          <div className={styles.content}>
            {/* Context */}
            <section id="context" className={styles.section}>
              <span className={styles.eyebrowAccent}>{context.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{context.heading}</h2>
              {context.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {p}
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
                        <p className={styles.flowText}>{step.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Story */}
            <section id="story" className={styles.section}>
              <span className={styles.eyebrowAccent}>{story.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{story.heading}</h2>

              <ol className={styles.timeline}>
                {story.beats.map((beat, i) => (
                  <li key={beat.title} className={styles.timelineItem}>
                    <span className={styles.timelineRail} aria-hidden="true">
                      <span className={`numeric ${styles.timelineIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <div className={styles.timelineBody}>
                      <h3 className={styles.timelineTitle}>{beat.title}</h3>
                      <p className={styles.timelineText}>{beat.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Insights */}
            <section id="insights" className={styles.section}>
              <span className={styles.eyebrowAccent}>{insights.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{insights.heading}</h2>
              <p className={styles.paragraph}>{insights.method}</p>

              <div className={styles.insightStatRow}>
                {insights.stats.map((s) => {
                  const Icon = INSIGHT_STAT_ICONS[s.icon];
                  return (
                    <div key={s.label} className={styles.insightStat}>
                      <Icon size={18} strokeWidth={1.6} className={styles.insightStatIcon} />
                      <span className={`numeric ${styles.insightStatValue}`}>{s.value}</span>
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
                      <p className={styles.insightPointText}>{p.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Problem */}
            <section id="problem" className={styles.section}>
              <h2 className={styles.sectionTitle}>{problem.eyebrow}</h2>

              <div className={styles.problemList}>
                <div className={styles.problemRow}>
                  <span className={styles.problemLabel}>{problem.business.title}:</span>
                  <p className={styles.problemText}>
                    <Sparkle size={13} strokeWidth={1.8} className={styles.problemIcon} />
                    {problem.business.text}
                  </p>
                </div>
                <div className={styles.problemRow}>
                  <span className={styles.problemLabel}>{problem.user.title}:</span>
                  <p className={styles.problemText}>
                    <Sparkle size={13} strokeWidth={1.8} className={styles.problemIcon} />
                    {problem.user.text}
                  </p>
                </div>
              </div>

              <div className={styles.corePanel}>
                <div className={styles.corePanelText}>
                  <span className={styles.coreTag}>{problem.core.tag}</span>
                  <h3 className={styles.corePanelTitle}>{problem.core.title}</h3>
                  <p className={styles.corePanelBody}>{problem.core.text}</p>
                </div>

                <div className={styles.goalCardsRow}>
                  <div className={styles.goalCard}>
                    <h4 className={styles.goalCardTitle}>
                      {problem.businessGoals.title} <span aria-hidden="true">📝</span>
                    </h4>
                    <ul className={styles.goalList}>
                      {problem.businessGoals.items.map((g) => (
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
                  <div className={styles.goalCard}>
                    <h4 className={styles.goalCardTitle}>
                      {problem.designGoals.title} <span aria-hidden="true">🎨</span>
                    </h4>
                    <ul className={styles.goalList}>
                      {problem.designGoals.items.map((g) => (
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
                </div>
              </div>
            </section>

            {/* Iterations */}
            <section id="iterations" className={styles.section}>
              <span className={styles.eyebrowAccent}>{iterations.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{iterations.heading}</h2>
              <p className={styles.paragraph}>Flip through each pass to see how the layout evolved.</p>

              <ConceptExplorer concepts={iterations.concepts} />

              <div className={styles.whyChosen}>
                <span className={styles.eyebrow}>Why concept 5 won</span>
                <p className={styles.whyChosenText}>{iterations.intro}</p>
              </div>
            </section>

            {/* Solution */}
            <section id="solution" className={styles.section}>
              <h2 className={styles.sectionTitle}>Solution</h2>
              <p className={styles.paragraph}>Four problems, and what we shipped to fix each one.</p>

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
            <section id="impact" className={styles.section}>
              <h2 className={styles.sectionTitle}>{impact.heading}</h2>

              <div className={styles.impactGrid}>
                {impact.stats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div
                      key={s.title}
                      className={`${styles.impactTile} ${s.placeholder ? styles.impactTilePlaceholder : ""}`}
                    >
                      <Icon size={20} strokeWidth={1.6} className={styles.impactIcon} />
                      <span className={`numeric ${styles.impactValue}`}>{s.value}</span>
                      <h3 className={styles.impactTitle}>{s.title}</h3>
                      <p className={styles.impactText}>{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Learnings */}
            <section id="learnings" className={styles.section}>
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

            {/* Other work */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Other work</h2>
              <div className={styles.otherList}>
                {otherProjects.map((p) => (
                  <a key={p.id} className={styles.otherLink} href={p.href}>
                    {p.title} <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
