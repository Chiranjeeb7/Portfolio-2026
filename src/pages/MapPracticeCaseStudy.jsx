import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookHeart,
  BookOpen,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Clock,
  Compass,
  GraduationCap,
  Layers,
  Map as MapIcon,
  MapPin,
  Moon,
  Pencil,
  Repeat,
  Ruler,
  ScanLine,
  School,
  Shapes,
  Smile,
  Sparkle,
  Sun,
  Timer,
  Users,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { projects } from "../data/content";
import {
  nav,
  hero,
  context,
  stakes,
  research,
  insights,
  problem,
  approach,
  solution,
  testing,
  impact,
  learnings,
} from "../data/mapPracticeCaseStudy";
import CaseStudySideNav from "../components/casestudy/CaseStudySideNav";
import CornerMarks from "../components/CornerMarks";
import Footer from "../components/Footer";
import scanImg from "../assets/photos/map-practice-scan.png";
import learnStationImg from "../assets/photos/map-practice-learnstation.png";
import mapTypesImg from "../assets/photos/map-practice-map-types.png";
import youngerGradesImg from "../assets/photos/map-practice-younger-grades.png";
import elderGradesImg from "../assets/photos/map-practice-elder-grades.png";
import priorityCurveImg from "../assets/photos/map-practice-priority-curve.png";
import usabilityTestImg from "../assets/photos/map-practice-usability-test.png";
import questionScreenImg from "../assets/photos/map-practice-question-screen.png";
import mapSheetImg from "../assets/photos/map-practice-map-sheet.png";
import styles from "./CaseStudy.module.css";
import local from "./MapPracticeCaseStudy.module.css";

const STAT_ICONS = { engagement: Smile, phygital: Layers, research: Users, timeline: CalendarDays };
const FLOW_ICONS = { map: MapIcon, scan: ScanLine, pencil: Pencil };
const SMALL_STAT_ICONS = { marks: GraduationCap, clock: Clock, timer: Timer };
const POINT_ICONS = {
  school: School,
  compass: Compass,
  pin: MapPin,
  book: BookOpen,
  ruler: Ruler,
  pencil: Pencil,
  repeat: Repeat,
  story: BookHeart,
  shapes: Shapes,
};
const GRADE_IMAGES = { younger: youngerGradesImg, elder: elderGradesImg };
const BLOCK_IMAGES = {
  question: questionScreenImg,
  sheet: mapSheetImg,
};

function StatRow({ stats }) {
  return (
    <div className={styles.insightStatRow}>
      {stats.map((s) => {
        const Icon = SMALL_STAT_ICONS[s.icon];
        return (
          <div key={s.label} className={styles.insightStat}>
            <Icon size={18} strokeWidth={1.6} className={styles.insightStatIcon} />
            <span className={`numeric ${styles.insightStatValue}`}>{s.value}</span>
            <span className={styles.insightStatLabel}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function PointGrid({ points, className = "" }) {
  return (
    <div className={`${styles.insightPointGrid} ${className}`}>
      {points.map((p) => {
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
  );
}

function Figure({ src, alt, caption }) {
  return (
    <figure className={local.figure}>
      <div className={local.figureFrame}>
        <img src={src} alt={alt} className={local.figureImg} loading="lazy" />
      </div>
      {caption && <figcaption className={local.figureCaption}>{caption}</figcaption>}
    </figure>
  );
}

// Autoplaying, looping YouTube embed. Browsers only allow autoplay when muted,
// so it starts muted (viewers can unmute from the controls). The iframe is
// only mounted once the frame scrolls into view, so each video starts when
// it's actually seen rather than playing off-screen from page load.
function VideoEmbed({ video, caption }) {
  const frameRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const params = `autoplay=1&mute=1&loop=1&playlist=${video.id}&rel=0&modestbranding=1&playsinline=1`;

  return (
    <figure className={local.figure}>
      <div ref={frameRef} className={local.videoFrame} style={{ aspectRatio: video.ratio }}>
        {inView && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      {caption && <figcaption className={local.figureCaption}>{caption}</figcaption>}
    </figure>
  );
}

function ProblemSolutionBlock({ block }) {
  return (
    <div className={styles.solutionBlock}>
      <div className={styles.solutionMedia}>
        <img
          src={BLOCK_IMAGES[block.image]}
          alt={block.title}
          className={`${styles.solutionImage} ${block.tall ? local.tallImage : ""}`}
          loading="lazy"
        />
      </div>
      <div className={styles.solutionBody}>
        <span className={styles.eyebrow}>{block.number}</span>
        <h3 className={styles.solutionTitle}>{block.title}</h3>
        <div className={styles.solutionRow}>
          <h4 className={styles.miniLabel}>Problem</h4>
          <p className={styles.solutionText}>{block.problem}</p>
        </div>
        <div className={styles.solutionRow}>
          <h4 className={styles.miniLabel}>Solution</h4>
          <p className={styles.solutionText}>{block.solution}</p>
        </div>
      </div>
    </div>
  );
}

export default function MapPracticeCaseStudy() {
  const { isDark, toggle } = useTheme();

  // Arriving via a hash-route change doesn't reset scroll the way a fresh
  // page load would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const otherProjects = projects.filter((p) => p.id !== "map-practice");

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
                    <div key={s.label} className={styles.statTile}>
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
              src={scanImg}
              alt="Map Practice on LearnStation — the scan screen asking students to place an India map in front of the device"
              className={`${styles.heroShotImg} ${local.heroCrop}`}
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
                <div className={local.deviceStage}>
                  <img
                    src={learnStationImg}
                    alt="BYJU'S LearnStation tablet on its stand"
                    className={local.deviceImg}
                    loading="lazy"
                  />
                </div>

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

            {/* Why map practice matters */}
            <section id="stakes" className={styles.section}>
              <span className={styles.eyebrowAccent}>{stakes.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{stakes.heading}</h2>
              {stakes.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {p}
                </p>
              ))}

              <StatRow stats={stakes.stats} />

              <Figure
                src={mapTypesImg}
                alt="Blank outline maps: India political, India physical, and world"
                caption={stakes.figureCaption}
              />
            </section>

            {/* Research */}
            <section id="research" className={styles.section}>
              <span className={styles.eyebrowAccent}>{research.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{research.heading}</h2>
              <p className={styles.paragraph}>{research.method}</p>

              <div className={local.findingGrid}>
                {research.findings.map((f) => (
                  <div key={f.label} className={local.finding}>
                    <span className={`numeric ${local.findingValue}`}>{f.value}</span>
                    <span className={local.findingLabel}>{f.label}</span>
                  </div>
                ))}
              </div>

              <h3 className={styles.diagramHeading}>{research.teachersHeading}</h3>
              <PointGrid points={research.teacherPoints} />
            </section>

            {/* Insights */}
            <section id="insights" className={styles.section}>
              <span className={styles.eyebrowAccent}>{insights.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{insights.heading}</h2>

              <StatRow stats={insights.stats} />

              <h3 className={styles.diagramHeading}>{insights.perceptionHeading}</h3>
              <div className={local.gradeList}>
                {insights.grades.map((g) => (
                  <div key={g.id} className={local.grade}>
                    <div className={local.gradeHeader}>
                      <h4 className={local.gradeTitle}>{g.title}</h4>
                      <span className={local.gradeRange}>{g.range}</span>
                    </div>
                    <img
                      src={GRADE_IMAGES[g.id]}
                      alt={`Illustrations of ${g.title.toLowerCase()} students learning maps`}
                      className={local.gradeImg}
                      loading="lazy"
                    />
                    <ol className={local.gradePoints}>
                      {g.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <Figure
                src={priorityCurveImg}
                alt="Chart of how students prioritise map learning over time, spiking the day before the exam"
                caption={insights.priorityCaption}
              />

              <h3 className={styles.diagramHeading}>{insights.methodsHeading}</h3>
              <PointGrid points={insights.methods} className={local.fourUp} />
            </section>

            {/* Problem */}
            <section id="problem" className={styles.section}>
              <h2 className={styles.sectionTitle}>{problem.eyebrow}</h2>

              <div className={styles.problemList}>
                {[problem.business, problem.user].map((row) => (
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
                  <span className={styles.coreTag}>{problem.core.tag}</span>
                  <h3 className={styles.corePanelTitle}>{problem.core.title}</h3>
                  <p className={styles.corePanelBody}>{problem.core.text}</p>
                </div>

                <div className={styles.goalCardsRow}>
                  {problem.goalCards.map((card) => (
                    <div key={card.title} className={styles.goalCard}>
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
                  ))}
                </div>
              </div>
            </section>

            {/* Approach */}
            <section id="approach" className={styles.section}>
              <span className={styles.eyebrowAccent}>{approach.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{approach.heading}</h2>
              {approach.paragraphs.map((p) => (
                <p key={p} className={styles.paragraph}>
                  {p}
                </p>
              ))}

              <VideoEmbed video={approach.video} caption={approach.videoCaption} />
            </section>

            {/* Solution */}
            <section id="solution" className={styles.section}>
              <span className={styles.eyebrowAccent}>{solution.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{solution.heading}</h2>
              <p className={styles.paragraph}>{solution.intro}</p>

              <VideoEmbed video={solution.video} />
            </section>

            {/* Testing */}
            <section id="testing" className={styles.section}>
              <span className={styles.eyebrowAccent}>{testing.eyebrow}</span>
              <h2 className={styles.sectionTitle}>{testing.heading}</h2>
              <p className={styles.paragraph}>{testing.method}</p>

              <dl className={local.metaRow}>
                {testing.meta.map((m) => (
                  <div key={m.label} className={local.metaItem}>
                    <dt className={styles.miniLabel}>{m.label}</dt>
                    <dd className={local.metaValue}>{m.value}</dd>
                  </div>
                ))}
              </dl>

              <div className={local.testGrid}>
                <img
                  src={usabilityTestImg}
                  alt="A student marking a paper map in front of LearnStation during usability testing"
                  className={local.testImg}
                  loading="lazy"
                />
                <ul className={local.testFindings}>
                  {testing.findings.map((f) => {
                    const Icon = f.tone === "positive" ? CircleCheck : CircleAlert;
                    return (
                      <li key={f.title} className={local.testFinding}>
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className={f.tone === "positive" ? local.toneGood : local.toneIssue}
                        />
                        <div>
                          <h3 className={local.testFindingTitle}>{f.title}</h3>
                          <p className={local.testFindingText}>{f.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <h3 className={styles.diagramHeading}>{testing.resultsHeading}</h3>
              <div className={local.threeCol}>
                {testing.results.map((r) => (
                  <div key={r.title} className={styles.card}>
                    <h4 className={styles.cardTitle}>{r.title}</h4>
                    <p className={styles.cardText}>{r.text}</p>
                  </div>
                ))}
              </div>

              <h3 className={styles.diagramHeading}>{testing.changesHeading}</h3>
              {testing.changes.map((block) => (
                <ProblemSolutionBlock key={block.title} block={block} />
              ))}
            </section>

            {/* Impact */}
            <section id="impact" className={styles.section}>
              <h2 className={styles.sectionTitle}>{impact.heading}</h2>

              <div className={styles.impactGrid}>
                {impact.stats.map((s) => {
                  const Icon = STAT_ICONS[s.icon];
                  return (
                    <div key={s.title} className={styles.impactTile}>
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
                {otherProjects.map((p) =>
                  p.href.startsWith("#") ? (
                    <a key={p.id} className={styles.otherLink} href={p.href}>
                      {p.title} <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <a key={p.id} className={styles.otherLink} href={p.href} target="_blank" rel="noreferrer">
                      {p.title} <ArrowUpRight size={16} />
                    </a>
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
