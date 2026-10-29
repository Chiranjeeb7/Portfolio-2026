// Interview presentation of the Planner case study: the same facts as the
// case study page, re-cut as a story told one slide at a time. Reached only
// by typing "#/planner-deck" (optionally "#/planner-deck/<slide>"); nothing
// on the site links here and the page asks search engines not to index it.
//
// The presenter shell and tools live in components/deck/Deck.jsx.
import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpDown,
  Box,
  Check,
  ClipboardList,
  Cpu,
  EyeOff,
  FileSpreadsheet,
  GitBranch,
  LayoutGrid,
  MapPin,
  Maximize2,
  Minus,
  PackageSearch,
  Receipt,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Deck, { Count, Media, Meter, PlayToggle, R, Words } from "../components/deck/Deck";
import { ZoomContext } from "../components/deck/zoom";
import PlannerDiagram from "../components/casestudy/PlannerDiagram";
import { rich } from "../components/rich";
import { profile } from "../data/content";
import { context, insights, iterations, learnings, problem, solutions } from "../data/plannerCaseStudy";
import plannerPlan from "../assets/photos/planner-plan.webp";
import plannerFailureSummary from "../assets/photos/planner-failure-summary.webp";
import truck3dMp4 from "../assets/photos/3d-truck.mp4";
import truck3dPoster from "../assets/photos/3d-truck-poster.webp";
import oldFlowMp4 from "../assets/photos/planner-old-flow.mp4";
import oldFlowPoster from "../assets/photos/planner-old-flow-poster.webp";
import orderLoadMp4 from "../assets/photos/order-loading.mp4";
import concept1 from "../assets/photos/planner-concept-1.webp";
import concept2 from "../assets/photos/planner-concept-2.webp";
import concept3 from "../assets/photos/planner-concept-3.webp";
import concept4 from "../assets/photos/planner-concept-4.webp";
import concept5 from "../assets/photos/planner-concept-5.webp";
import s from "../components/deck/Deck.module.css";

const CONCEPT_SHOTS = { 1: concept1, 2: concept2, 3: concept3, 4: concept4, 5: concept5 };
const FLOW_ICONS = { orders: PackageSearch, core: Cpu, output: ShieldCheck };
const POINT_ICONS = { eyeOff: EyeOff, box: Box, sheet: FileSpreadsheet, tabs: LayoutGrid, split: GitBranch, swap: ArrowUpDown };
const SOLUTION_MEDIA = {
  plan: { img: plannerPlan },
  truck3d: { video: truck3dMp4, poster: truck3dPoster },
  summary: { img: plannerFailureSummary },
  orderLoad: { video: orderLoadMp4 },
};

/* ---------- Slides ---------- */

function Cover() {
  return (
    <div className={s.cover}>
      <div className={s.coverText}>
        <R className={s.tag}>Delhivery · TransportOne TMS · B2B SaaS</R>
        <Words as="h1" className={s.display} text="How we got planners to *trust the algorithm*" />
        <R as="p" className={s.lede}>
          The planner revamp: a simple SaaS interface on top of a decade of logistics data.
        </R>
        <R className={s.byline}>
          <span className={s.bylineName}>{profile.name}</span>
          <span>Led the redesign end to end</span>
        </R>
      </div>
      <R className={s.coverMedia}>
        <Media media={SOLUTION_MEDIA.truck3d} label="Planner: the 3D truck view of a planned load" className={s.fill} />
      </R>
    </div>
  );
}

function Hook() {
  return (
    <div className={s.center}>
      <R as="p" className={s.kicker}>The number that proved it</R>
      <R className={s.giant}>
        <Count value="18%" delay={0.5} />
      </R>
      <R className={s.hookMeter}>
        <Meter to={18} delay={0.6} />
      </R>
      <R as="p" className={s.statement}>
        of the algorithm's plans were accepted. Everyone else <span className={s.accent}>re-planned by hand</span>.
      </R>
      <R as="p" className={s.muted}>This is the story of how that number got to 72%.</R>
    </div>
  );
}

function Setting() {
  return (
    <div className={s.split}>
      <div className={s.stack}>
        <Words as="h2" className={s.title} text="Delhivery is India's largest fully integrated logistics provider." />
        <R className={s.statRow}>
          <div className={s.stat}>
            <Count className={s.statValue} value="19,000+" />
            <span className={s.statLabel}>pin codes served</span>
          </div>
          <div className={s.stat}>
            <Count className={s.statValue} value="4 billion+" />
            <span className={s.statLabel}>shipments since 2011</span>
          </div>
        </R>
      </div>
      <R className={s.panel}>
        <span className={s.label}>The product</span>
        <p className={s.panelLead}>
          <strong className={s.ink}>TransportOne</strong> is its SaaS bet: a Transport Management System that moves
          enterprise shippers from <span className="hl">manual data entry to automated execution</span>.
        </p>
      </R>
    </div>
  );
}

// A shipment's life in a TMS, with planning (this story) marked.
function WhatIsATms() {
  const steps = [
    { Icon: ClipboardList, title: "Orders", text: "What needs to move: weight, volume, where and by when." },
    { Icon: Route, title: "Plan", text: "Group orders into truck loads and pick the vehicle.", here: true },
    { Icon: Truck, title: "Book a carrier", text: "Assign each load to a transporter at an agreed rate." },
    { Icon: MapPin, title: "Track", text: "Follow every truck from pickup to delivery." },
    { Icon: Receipt, title: "Settle", text: "Check the freight bill and pay the carrier." },
  ];
  return (
    <div className={s.stack}>
      <R as="p" className={s.kicker}>What's a TMS?</R>
      <Words as="h2" className={s.title} text="A Transport Management System runs a shipper's freight, from order to invoice." />
      <div className={s.pipeline}>
        {steps.map(({ Icon, title, text, here }, i) => (
          <R key={title} className={`${s.flowStep} ${here ? s.flowStepHere : ""}`}>
            <div className={s.flowHead}>
              <span className={`${s.iconTile} ${here ? s.iconTileAccent : ""}`}>
                <Icon size={24} strokeWidth={1.6} />
              </span>
              <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
              {i < steps.length - 1 && <ArrowRight className={s.flowArrow} size={24} strokeWidth={1.4} />}
            </div>
            <h3 className={s.flowTitle}>{title}</h3>
            <p className={s.bodySmall}>{text}</p>
            {here && <span className={s.hereTag}>This story</span>}
          </R>
        ))}
      </div>
    </div>
  );
}

function WhatIsAPlanner() {
  return (
    <div className={s.stackSnug}>
      <Words as="h2" className={s.title} text="At the heart of it: the planner." />
      {/* Same diagram as the case study: orders in, the planner, loads out. */}
      <R className={s.plannerPanel}>
        <div className={s.plannerDiagram}>
          <PlannerDiagram />
        </div>
        <div className={s.plannerFlow}>
          {context.flow.map((step, i) => {
            const Icon = FLOW_ICONS[step.icon];
            return (
              <div key={step.title} className={s.plannerStep}>
                <div className={s.plannerStepHead}>
                  <span className={s.iconTile}>
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
                  {i < context.flow.length - 1 && <ArrowRight className={s.flowArrow} size={24} strokeWidth={1.4} />}
                </div>
                <h3 className={s.plannerStepTitle}>{step.title}</h3>
                <p className={s.bodySmall}>{step.text}</p>
              </div>
            );
          })}
        </div>
      </R>
    </div>
  );
}

function Forgotten() {
  const beats = [
    { when: "A year earlier", text: "The planner was built, then left untouched." },
    { when: "A few months back", text: "Data science shipped a sharper algorithm, behind the same old interface." },
    { when: "Then", text: "Leadership asked to see it end to end, from first click to confirmed load." },
  ];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="A tool that was built, then forgotten." />
      <div className={s.timelineWrap}>
        <motion.span
          className={s.timelineLine}
          aria-hidden="true"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } } }}
        />
        <ol className={s.timeline}>
          {beats.map((b) => (
            <R as="li" key={b.when} className={s.beat}>
              <span className={s.beatDot} aria-hidden="true" />
              <span className={s.label}>{b.when}</span>
              <p className={s.beatText}>{b.text}</p>
            </R>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Review() {
  return (
    <div className={s.center}>
      <Words as="h2" className={s.display} text="The review didn't go well." />
      <R className={s.chips}>
        <span className={s.chip}>Broken flows</span>
        <span className={s.chip}>Confusing screens</span>
        <span className={s.chip}>Steps that didn't match real work</span>
      </R>
      <R as="p" className={s.statement}>
        And no one had answers. The old team had left. <span className={s.accent}>No designer owned it.</span>
      </R>
    </div>
  );
}

function Twist() {
  return (
    <div className={s.center}>
      <R as="p" className={s.kicker}>But broken flows weren't the real problem</R>
      <Words className={s.display} text="Planners didn't *trust* the output." />
      <R as="p" className={s.muted}>So they worked around it, in Excel, for a year.</R>
    </div>
  );
}

function Brief() {
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="The ask, and where I came in." />
      <div className={s.twoCol}>
        <R className={s.panel}>
          <span className={s.label}>What leadership wanted</span>
          <p className={s.panelLead}>
            Get planners to <span className="hl">trust the output</span>, and show savings over planning by hand.
          </p>
        </R>
        <R className={`${s.panel} ${s.panelAccent}`}>
          <span className={s.label}>My role</span>
          <p className={s.panelLead}>
            I joined the TMS team and <span className="hl">led the planner revamp end to end</span>.
          </p>
        </R>
      </div>
    </div>
  );
}

function Listening() {
  return (
    <div className={s.split}>
      <div className={s.stack}>
        <Words as="h2" className={s.title} text="Before designing anything, I went and listened." />
        <R as="p" className={s.sub}>{rich(insights.method)}</R>
      </div>
      <div className={s.stackTight}>
        {insights.stats.map((st) => (
          <R key={st.label} className={s.bigStat}>
            <Count className={s.statValue} value={st.value} />
            <span className={s.statLabel}>{st.label}</span>
          </R>
        ))}
      </div>
    </div>
  );
}

function Findings() {
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="What planners were really living with." />
      <div className={s.grid3}>
        {insights.points.map((p) => {
          const Icon = POINT_ICONS[p.icon];
          return (
            <R key={p.title} className={s.card}>
              <span className={s.iconTile}>
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <h3 className={s.cardTitle}>{p.title}</h3>
              <p className={s.body}>{p.text}</p>
            </R>
          );
        })}
      </div>
    </div>
  );
}

// The old planner, as a 31-second screen recording, with the problems it
// shows listed beside it. Each problem is pinned to the moment it appears:
// clicking one jumps the video there, and the current one lights up as the
// video plays. Every point is what the recording itself shows.
const OLD_FLOW_LENGTH = 31;
const OLD_FLOW_ISSUES = [
  {
    at: 0,
    title: "Plans failed, silently",
    text: "Recent plans are row after row of “Failed”, with no reason and “--” in every column.",
  },
  {
    at: 6,
    title: "A plan you couldn't judge",
    text: "₹0 freight, estimated freight “--”, and settings in jargon. Nothing says whether the plan is good.",
  },
  {
    at: 8,
    title: "Loads and orders, split apart",
    text: "Separate tabs, so seeing which orders went into which load meant switching back and forth.",
  },
  {
    at: 10,
    title: "Numbers that contradicted each other",
    text: "The header says 0 unassigned; the order below is tagged “Unassigned”; filtering for it finds nothing.",
  },
  {
    at: 23,
    title: "Back to a bulk upload",
    text: "With no orders visible, the way forward was uploading a file to a template.",
  },
];

function OldPlanner() {
  const reduce = useReducedMotion();
  const videoRef = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const seek = (at) => {
    const v = videoRef.current;
    if (!v) return;
    // Jumps without changing play state: paused stays paused on that frame.
    v.currentTime = at;
    setTime(at);
  };
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  // The issue whose moment has most recently passed.
  const active = OLD_FLOW_ISSUES.reduce((cur, it, i) => (time >= it.at ? i : cur), 0);

  return (
    <div className={s.stackSnug}>
      <Words as="h2" className={s.title} text="The old planner, in *31 seconds.*" />
      <div className={s.oldFlow}>
        <R className={s.oldFlowMain}>
          <div className={s.frame}>
            <div className={s.frameBar} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <video
              ref={videoRef}
              src={oldFlowMp4}
              poster={oldFlowPoster}
              autoPlay={!reduce}
              muted
              loop
              playsInline
              aria-label="Screen recording of the old planner"
              className={`${s.mediaEl} ${s.clickToPlay}`}
              onClick={togglePlay}
            />
          </div>
          <div className={s.playerRow}>
          <PlayToggle videoRef={videoRef} className={s.playBig} size={18} />
          <div className={s.scrubber}>
            <span className={s.scrubberFill} style={{ width: `${(time / OLD_FLOW_LENGTH) * 100}%` }} />
            {OLD_FLOW_ISSUES.map((it, i) => (
              <button
                key={it.at}
                type="button"
                className={`${s.scrubberMark} ${i === active ? s.scrubberMarkOn : ""}`}
                style={{ left: `${(it.at / OLD_FLOW_LENGTH) * 100}%` }}
                onClick={() => seek(it.at)}
                aria-label={`Jump to ${it.title}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          </div>
        </R>
        <ol className={s.issues}>
          {OLD_FLOW_ISSUES.map((it, i) => (
            <R as="li" key={it.at}>
              <button type="button" className={`${s.issue} ${i === active ? s.issueOn : ""}`} onClick={() => seek(it.at)}>
                <span className={s.issueNum}>{i + 1}</span>
                <span className={s.issueBody}>
                  <span className={s.issueTitle}>
                    {it.title}
                    <span className={s.issueTime}>0:{String(it.at).padStart(2, "0")}</span>
                  </span>
                  <span className={s.issueText}>{it.text}</span>
                </span>
              </button>
            </R>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CoreProblem() {
  return (
    <div className={s.stack}>
      <R as="p" className={s.kicker}>{problem.core.tag}</R>
      <Words
        className={s.titleLarge}
        text="A strong 10-year algorithm, trapped behind an interface too complex to scale and *too opaque to trust.*"
      />
      <div className={s.twoCol}>
        <R className={s.panel}>
          <span className={s.label}>{problem.business.title}</span>
          <p className={s.body}>{rich(problem.business.text)}</p>
        </R>
        <R className={s.panel}>
          <span className={s.label}>{problem.user.title}</span>
          <p className={s.body}>{rich(problem.user.text)}</p>
        </R>
      </div>
    </div>
  );
}

function Goals() {
  const cols = [problem.businessGoals, problem.designGoals];
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="What success had to look like." />
      <div className={s.twoCol}>
        {cols.map((col) => (
          <R key={col.title} className={s.panel}>
            <span className={s.label}>{col.title}</span>
            <ul className={s.goalList}>
              {col.items.map((g) => (
                <li key={g.title}>
                  <strong className={s.goalTitle}>{g.title}</strong>
                  <span className={s.body}>{g.text}</span>
                </li>
              ))}
            </ul>
          </R>
        ))}
      </div>
    </div>
  );
}

// All five concepts, one at a time: the tabs under the screenshot switch
// between them, and the screenshot opens full size on click.
function Concepts() {
  const reduce = useReducedMotion();
  const zoom = useContext(ZoomContext);
  const [active, setActive] = useState(0);
  const all = iterations.concepts;
  const c = all[active];
  const label = `Concept ${c.number}: ${c.title}`;

  return (
    <div className={s.stackSnug}>
      <Words as="h2" className={s.title} text="Five concepts before one shipped." />
      <R className={s.conceptLayout}>
        <div className={s.conceptMain}>
          <button
            type="button"
            className={`${s.zoomable} ${s.conceptShot}`}
            onClick={() => zoom({ img: CONCEPT_SHOTS[c.number], label })}
            aria-label={`${label}: view full size`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={c.number}
                src={CONCEPT_SHOTS[c.number]}
                alt={label}
                className={s.fill}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.16 }}
              />
            </AnimatePresence>
            <span className={s.zoomHint} aria-hidden="true">
              <Maximize2 size={14} /> Full size
            </span>
          </button>

          <div className={s.conceptTabs} role="tablist" aria-label="Concepts">
            {all.map((k, i) => (
              <button
                key={k.number}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${s.conceptTab} ${i === active ? s.conceptTabOn : ""}`}
                onClick={() => setActive(i)}
              >
                <img src={CONCEPT_SHOTS[k.number]} alt="" />
                <span>Concept {k.number}</span>
                {k.shipped && <Check size={14} strokeWidth={2.6} className={s.proIcon} aria-label="shipped" />}
              </button>
            ))}
          </div>
        </div>

        <div className={s.conceptDetails} key={c.number}>
          <div className={s.winnerHead}>
            <span className={s.index}>
              Concept {c.number} of {all.length}
            </span>
            {c.shipped && <span className={s.shippedTag}>Shipped</span>}
          </div>
          <h3 className={s.conceptHeading}>{c.title}</h3>
          <ul className={s.pros}>
            {c.pros.map((x) => (
              <li key={x}>
                <Check size={18} strokeWidth={2.2} className={s.proIcon} />
                <span>{rich(x)}</span>
              </li>
            ))}
            {c.cons.map((x) => (
              <li key={x}>
                <Minus size={18} strokeWidth={2.2} className={s.conIcon} />
                <span>{rich(x)}</span>
              </li>
            ))}
          </ul>
          {c.shipped && <p className={s.whyWon}>{rich(iterations.intro)}</p>}
        </div>
      </R>
    </div>
  );
}

function makeSolution(sol, i) {
  return function Solution() {
    return (
      <div className={s.solution}>
        <div className={s.solutionText}>
          <R as="p" className={s.kicker}>
            Fix {i + 1} of {solutions.length}
          </R>
          <Words as="h2" className={s.title} text={sol.title} />
          <R className={s.pair}>
            <span className={s.label}>The problem</span>
            <p className={s.body}>{sol.problem}</p>
          </R>
          <R className={`${s.pair} ${s.pairAccent}`}>
            <span className={s.label}>What we did</span>
            <p className={s.panelLead}>{rich(sol.solution)}</p>
          </R>
        </div>
        <R className={s.solutionMedia}>
          <Media media={SOLUTION_MEDIA[sol.image]} label={sol.title} className={s.fill} />
        </R>
      </div>
    );
  };
}

function Impact() {
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text="Once planners could see why a plan was good, they shipped it." />
      <div className={s.impact}>
        <R className={s.impactHero}>
          <span className={s.label}>Auto-plan acceptance</span>
          <span className={s.impactValue}>
            <Count value="18%" /> <ArrowRight size={56} strokeWidth={1.4} className={s.impactArrow} />{" "}
            <Count className={s.accent} value="72%" delay={0.7} />
          </span>
          <Meter to={72} from={18} delay={0.7} />
          <p className={s.body}>A 4x surge in trust: planners choosing the algorithm's plan over their own.</p>
        </R>
        <div className={s.stackTight}>
          <R className={s.bigStat}>
            <Count className={s.statValue} value="74% faster" />
            <span className={s.statLabel}>daily planning, from 19 minutes to under 5</span>
          </R>
          <R className={s.bigStat}>
            <Count className={s.statValue} value="100% self-serve" />
            <span className={s.statLabel}>down from 2 weeks of training</span>
          </R>
        </div>
      </div>
    </div>
  );
}

function Learnings() {
  return (
    <div className={s.stack}>
      <Words as="h2" className={s.title} text={learnings.heading} />
      <div className={s.grid2}>
        {learnings.items.map((l, i) => (
          <R key={l.title} className={s.card}>
            <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={s.cardTitle}>{l.title}</h3>
            <p className={s.body}>{rich(l.text)}</p>
          </R>
        ))}
      </div>
    </div>
  );
}

function Close() {
  return (
    <div className={s.center}>
      <Words className={s.display} text={"A better algorithm isn't a better product.\n*A trusted one is.*"} />
      <R as="p" className={s.muted}>Thank you. Happy to take questions.</R>
      <R className={s.byline}>
        <span className={s.bylineName}>{profile.name}</span>
        <span>{profile.email}</span>
      </R>
    </div>
  );
}

const SLIDES = [
  { title: "Cover", chapter: "", Body: Cover },
  { title: "Delhivery & TransportOne", chapter: "01 · The setting", Body: Setting },
  { title: "What's a TMS?", chapter: "01 · The setting", Body: WhatIsATms },
  { title: "What a planner does", chapter: "01 · The setting", Body: WhatIsAPlanner },
  { title: "Built, then forgotten", chapter: "02 · What went wrong", Body: Forgotten },
  { title: "The review", chapter: "02 · What went wrong", Body: Review, tone: "dark" },
  { title: "The real problem", chapter: "02 · What went wrong", Body: Twist, tone: "dark" },
  { title: "18% accepted", chapter: "02 · What went wrong", Body: Hook, tone: "dark" },
  { title: "The ask & my role", chapter: "02 · What went wrong", Body: Brief },
  { title: "Research", chapter: "03 · Listening", Body: Listening },
  { title: "Six findings", chapter: "03 · Listening", Body: Findings },
  { title: "The old planner, on video", chapter: "03 · Listening", Body: OldPlanner },
  { title: "The core problem", chapter: "04 · Framing", Body: CoreProblem },
  { title: "Goals", chapter: "04 · Framing", Body: Goals },
  { title: "Five concepts", chapter: "05 · Exploring", Body: Concepts },
  ...solutions.map((sol, i) => ({ title: sol.title, chapter: "06 · The fixes", Body: makeSolution(sol, i) })),
  { title: "Impact", chapter: "07 · Impact", Body: Impact },
  { title: "Learnings", chapter: "08 · Learnings", Body: Learnings },
  { title: "Thank you", chapter: "", Body: Close, tone: "dark" },
];

const PRELOAD = [oldFlowPoster, plannerPlan, plannerFailureSummary, truck3dPoster, ...Object.values(CONCEPT_SHOTS)];

export default function PlannerDeck() {
  return (
    <Deck
      slides={SLIDES}
      slug="planner-deck"
      brand="Planner · Delhivery TMS"
      label="Planner case study presentation"
      preload={PRELOAD}
    />
  );
}
