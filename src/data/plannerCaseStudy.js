// Content for the Planner case study (V2, built to replace the old Framer
// page). Reframed from the V1 story ("we made planning 74% faster") to the
// trust story underneath it: planners were quietly bypassing the algorithm's
// output and replanning by hand, so speed on paper never showed up as speed
// on the ground until the redesign made the output legible enough to trust.
// Every fact/quote below is carried over unchanged from the V1 page; only
// emphasis and ordering changed. The cost-savings figure is a real follow-up
// item — marked as a placeholder, not fabricated.

export const nav = [
  { id: "context", label: "Context" },
  { id: "story", label: "Story" },
  { id: "insights", label: "Insights" },
  { id: "problem", label: "Problem" },
  { id: "iterations", label: "Iterations" },
  { id: "solution", label: "Solution" },
  { id: "impact", label: "Impact" },
  { id: "learnings", label: "Learnings" },
];

export const hero = {
  tag: "B2B SaaS · Logistics",
  titleLines: [
    { text: "How we got planners to", accent: false },
    { text: "trust the algorithm", accent: true },
  ],
  role: "As the lead designer for the planning revamp, I bridged a decade of proprietary logistics data with a user-friendly SaaS interface — and rebuilt planners' trust in an algorithm they'd been quietly working around for a year.",
  stats: [
    {
      icon: "trust",
      value: "18% → 72%",
      label: "auto-plan acceptance — planners choosing the algorithm's output over a manual plan",
    },
    {
      icon: "cost",
      value: "TBD",
      label: "freight cost saved, once trust in auto-plan replaced manual re-planning",
      placeholder: true,
    },
    { icon: "time", value: "19 min → <5 min", label: "daily planning time" },
    { icon: "onboarding", value: "100% self-serve", label: "down from 2 weeks of training" },
  ],
};

export const context = {
  eyebrow: "A bit of context…",
  heading: "About Delhivery TMS",
  paragraphs: [
    "Delhivery is India's largest fully integrated logistics services provider. Since its inception in 2011, the company has built a massive nationwide network covering over 19,000 pin codes and successfully fulfilling over 4 billion shipments.",
    "TransportOne is Delhivery's strategic entry into the SaaS arena. It is an Autonomous Transport Management System (TMS) designed to move enterprise shippers from manual data entry to automated execution.",
  ],
  diagramHeading: "So, what is a planner?",
  flow: [
    {
      icon: "orders",
      title: "Intelligent order orchestration",
      text: "Fragmented orders enter the TMS as raw data points — weight, volume, delivery windows.",
    },
    {
      icon: "core",
      title: "The optimization core (our USP)",
      text: 'A proprietary algorithm — built on 10 years of operational data — acts as the "brain." It instantly groups orders by customer split, weight/volume utilization, and route bundling.',
    },
    {
      icon: "output",
      title: "An output planners had to decide whether to trust",
      text: "The system replaced manual guesswork with ready-to-dispatch loads that maximized vehicle capacity and minimized cost — on paper. Whether planners actually shipped that output was a different question.",
    },
  ],
};

export const story = {
  eyebrow: "But how did it all start?",
  heading: "Story time",
  beats: [
    {
      title: "The forgotten planner",
      text: "The old team had built the planner about a year earlier and left it to gather dust — no updates since.",
    },
    {
      title: "A better algorithm, a few months back",
      text: "Our data science team shipped a meaningfully sharper planning algorithm — better optimization under the hood, sitting behind the exact same old interface.",
    },
    {
      title: "Leadership wanted to see it end to end",
      text: "With a stronger algorithm in hand, leadership asked for a full walkthrough — from a planner's first click to a confirmed load.",
    },
    {
      title: "The review didn't go well",
      text: "It surfaced real product and design problems: broken flows, confusing screens, steps that didn't match how planners actually worked.",
    },
    {
      title: "No one had answers",
      text: "Folks from the old team had left, and there was no one from design left to own it or be accountable.",
    },
    {
      title: "So what was the big problem?",
      text: "Broken flows on the surface — but underneath, planners simply didn't trust the algorithm's output enough to act on it.",
    },
    {
      title: "Leadership wanted trust — and savings to prove it",
      text: "The brief was explicit: get planners to trust the algorithm's output, and show visible savings against planning loads by hand.",
    },
    {
      title: "That's where I stepped in",
      text: "I moved onto the TMS team and led the project end to end, from design strategy through to shipped product.",
    },
  ],
};

// Distilled from real interviews (4 planners, 3 plant heads across current
// customers) plus internal conversations with customer support, sales, and
// business teams — short, scannable findings rather than quotes or full
// sentences, since the point here is what the research surfaced, not how
// any one person phrased it.
export const insights = {
  eyebrow: "Straight from the research",
  heading: "What we found",
  method:
    "I interviewed 4 planners and 3 plant heads across current customers, and pulled in our own customer support, sales, and business teams for the full picture.",
  stats: [
    { icon: "gauge", value: "80%", label: "truck utilization plant heads wanted before cost improved" },
    { icon: "clock", value: "15–20 min", label: "to plan, update, and confirm a single load" },
  ],
  points: [
    { icon: "eyeOff", title: "Orders were invisible", text: "Not visible inside TMS at all" },
    { icon: "box", title: "A black-box output", text: "No visibility into plan logic" },
    { icon: "sheet", title: "Excel still won", text: "Exported to SAP, grouped by hand" },
    { icon: "tabs", title: "Tabs everywhere", text: "Orders, plan, loads — all separate" },
    { icon: "split", title: "Roles got blurred", text: "Planning and dispatch, one flow" },
    { icon: "swap", title: "Structured backwards", text: "Orders on top, plan below" },
  ],
};

export const problem = {
  eyebrow: "So the problem is clear now,",
  business: {
    title: "Business problem",
    text: "Plant heads should be able to see lower freight costs. The tool's high complexity and training-heavy workflow prevented it from becoming a scalable, market-ready SaaS differentiator.",
  },
  user: {
    title: "User problem",
    text: 'Logistics planners faced extreme cognitive overload and a steep learning curve, caused by a fragmented, "black-box" interface that made complex algorithmic output difficult to trust or manage.',
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "Our powerful, 10-year proprietary optimization algorithm was trapped behind an over-engineered interface — one that made the product too complex to scale as SaaS, and its output too opaque to trust.",
  },
  // Each problem statement above, broken into the concrete goals it implied —
  // same facts as business/user problem, restructured as a checklist.
  businessGoals: {
    title: "Business goals",
    items: [
      { title: "Lower freight costs", text: "Plant heads should see cost come down, not just look efficient on paper." },
      { title: "Cut the support & training load", text: "A training-heavy, high-complexity tool couldn't scale as self-serve SaaS." },
      { title: "Stronger market position", text: "The planner was meant to be a best-in-class differentiator, not a liability." },
    ],
  },
  designGoals: {
    title: "Design goals",
    items: [
      { title: "Faster plan creation", text: "Get from raw orders to a usable plan in minutes, not 15–20." },
      { title: "Persona-based tasks", text: "Planning and dispatch are two different jobs — the tool should treat them that way." },
      { title: "An interface planners could trust", text: "Replace the black-box feeling with output planners understand and believe." },
    ],
  },
};

export const iterations = {
  heading: "Iterations",
  eyebrow: "Five concepts before this shipped",
  intro: "Every pass circled the same two open questions: where do a planner's actions actually live, and can this scale without turning into a second control tower? Concept 5 was the first to answer both — so it's what shipped.",
  concepts: [
    {
      number: 1,
      title: "Continuous plan + reporting layer",
      pros: [
        "Plan auto-refreshed at set intervals, always surfacing the most recent run",
        "Unassigned orders got an automatic LTL fallback instead of sitting idle",
      ],
      cons: [
        "Buried the actions a planner actually needed one layer behind the plan",
        "The performance view suited plant managers more than the planners using it daily",
      ],
      shipped: false,
    },
    {
      number: 2,
      title: "Loads up front, no analytics layer",
      pros: ["Dropped the reporting layer entirely and put loads straight in front of planners"],
      cons: [
        "Failed orders sat in one tab, new ones in another — confusing to reconcile",
        "Accepted and confirmed loads shared a tab, blurring what was actually approved",
      ],
      shipped: false,
    },
    {
      number: 3,
      title: "Action center + performance graph",
      pros: ["Gave planners explicit next-step guidance instead of a passive table"],
      cons: [
        "Duplicated the existing control tower — an action center for one module implied every module needed one",
        "Orders placed inside the planner tab still weren't shown clearly enough",
      ],
      shipped: false,
    },
    {
      number: 4,
      title: "Icon actions, loads and orders separated",
      pros: [
        "Kept loads and orders in their own sections",
        "Icon-based actions packed more into less horizontal space",
      ],
      cons: [
        "Risked growing into a full order-management system with its own status set",
        "Still too many steps for a planner to get through per action",
      ],
      shipped: false,
    },
    {
      number: 5,
      title: "Dedicated orders tab, no action center",
      pros: [
        "Orders got their own tab from day one, so it scales without bolting on new sections later",
        "Cut the redundant action center — the existing control tower plus pending-action indicators on each tab did that job already",
      ],
      cons: [],
      shipped: true,
    },
  ],
};

export const solutions = [
  {
    number: "Problem 1",
    title: "A trustworthy quality signal",
    problem: "Planners had no way to tell whether a given output from the algorithm was actually good.",
    solution:
      "Introduced freight cost as a percentage of order value — the lower the percentage, the better the plan — surfaced directly as green/yellow/red, so quality was legible at a glance instead of implied.",
    image: "plan",
  },
  {
    number: "Problem 2",
    title: "Seeing the load in 3D",
    problem:
      "Planners had no way to visualize how a truck was actually going to be loaded, or whether the suggested load packed it well by volume or weight.",
    solution:
      "Introduced a 3D truck planner view where planners can see exactly how every box is packed before committing to a plan.",
    image: "truck3d",
  },
  {
    number: "Problem 3",
    title: "A clear path when boxes don't fit",
    problem:
      "When a handful of boxes couldn't be planned, there was no reliable way to handle the failure or tell the planner what to do about it.",
    solution:
      "Built dedicated failure handling that flags exactly which boxes couldn't be planned and prescribes the next best action, instead of leaving planners to guess.",
    image: "summary",
  },
  {
    number: "Problem 4",
    title: "Fewer steps to a confirmed load",
    problem: "The old planner's flow had too many steps, making it too complex for new users to pick up.",
    solution:
      "Reduced and simplified the flow so that, in the ideal case, going from planning to indenting a load takes just two clicks.",
    image: "orderLoad",
  },
];

export const impact = {
  heading: "Time to flex our impact muscles",
  stats: [
    {
      icon: "trust",
      value: "18% → 72%",
      title: "4x surge in trust",
      text: "Auto-plan acceptance nearly quadrupled once the optimization logic became transparent instead of a black box.",
    },
    {
      icon: "cost",
      value: "TBD",
      title: "Freight cost saved",
      text: "The direct cost impact of planners actually shipping the algorithm's plan instead of re-planning by hand — figure to be added.",
      placeholder: true,
    },
    {
      icon: "time",
      value: "74% faster",
      title: "Faster execution",
      text: "Daily planning time dropped from 19 minutes to under 5, once the interface stopped fighting the algorithm.",
    },
    {
      icon: "onboarding",
      value: "100% self-serve",
      title: "Zero-friction onboarding",
      text: "Went from a tool that needed 2 weeks of training to one planners could pick up on their own.",
    },
  ],
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "Talk before you build",
      text: "Talk to your users before you build anything. This product wouldn't have been so flawed if the original team had run proper user interviews before building.",
    },
    {
      title: "Trust your gut (and act)",
      text: "Take initiative when your instincts nudge you. While reviewing old files, a hunch that a small change could help users turned out right — without acting on it, none of this impact would have happened.",
    },
  ],
};
