// Content for the Planner case study (V2, built to replace the old Framer
// page). Reframed from the V1 story ("we made planning 74% faster") to the
// trust story underneath it: planners were quietly bypassing the algorithm's
// output and replanning by hand, so speed on paper never showed up as speed
// on the ground until the redesign made the output legible enough to trust.
// Every fact/quote below is carried over unchanged from the V1 page; only
// emphasis and ordering changed. The cost-savings figure is a real follow-up
// item - marked as a placeholder, not fabricated.

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
  role: "I led the planner revamp: a simple SaaS interface on top of a decade of logistics data, and **planners' trust rebuilt** in an algorithm they'd worked around for a year.",
  stats: [
    {
      icon: "trust",
      value: "18% → 72%",
      label: "auto-plan acceptance: planners choosing the algorithm's output over a manual plan",
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
  heading: "About Delhivery TMS",
  paragraphs: [
    "Delhivery is India's largest fully integrated logistics provider: **19,000+ pin codes** and 4 billion+ shipments since 2011.",
    "TransportOne is its SaaS bet: a Transport Management System (TMS) that moves enterprise shippers from **manual data entry to automated execution**.",
  ],
  diagramHeading: "What is a planner?",
  flow: [
    {
      icon: "orders",
      title: "Intelligent order orchestration",
      text: "Orders come in as raw data: weight, volume, delivery windows.",
    },
    {
      icon: "core",
      title: "The optimization core (our USP)",
      text: "An algorithm built on 10 years of data groups orders by customer, weight/volume use and route.",
    },
    {
      icon: "output",
      title: "An output planners had to decide whether to trust",
      text: "Ready-to-dispatch loads that fill trucks and cut cost, on paper. Whether planners shipped them was another question.",
    },
  ],
};

export const story = {
  heading: "How it started",
  beats: [
    {
      title: "The forgotten planner",
      text: "Built a year earlier, then left untouched.",
    },
    {
      title: "A better algorithm, a few months back",
      text: "Data science shipped a sharper algorithm, behind the same old interface.",
    },
    {
      title: "Leadership wanted to see it end to end",
      text: "A full walkthrough, from first click to confirmed load.",
    },
    {
      title: "The review didn't go well",
      text: "Broken flows, confusing screens, steps that didn't match real work.",
    },
    {
      title: "No one had answers",
      text: "The old team had left. No designer owned it.",
    },
    {
      title: "So what was the big problem?",
      text: "Underneath the broken flows, **planners didn't trust the output**.",
    },
    {
      title: "Leadership wanted trust, and savings to prove it",
      text: "Get planners to trust the output, and show savings over planning by hand.",
    },
    {
      title: "That's where I stepped in",
      text: "I joined the TMS team and led it end to end.",
    },
  ],
};

// Distilled from real interviews (4 planners, 3 plant heads across current
// customers) plus internal conversations with customer support, sales, and
// business teams - short, scannable findings rather than quotes or full
// sentences, since the point here is what the research surfaced, not how
// any one person phrased it.
export const insights = {
  heading: "What we found",
  method:
    "I interviewed **4 planners and 3 plant heads**, plus our support, sales and business teams.",
  stats: [
    { icon: "gauge", value: "80%", label: "truck utilization plant heads wanted before cost improved" },
    { icon: "clock", value: "15-20 min", label: "to plan, update, and confirm a single load" },
  ],
  points: [
    { icon: "eyeOff", title: "Orders were invisible", text: "Not visible inside TMS at all" },
    { icon: "box", title: "A black-box output", text: "No visibility into plan logic" },
    { icon: "sheet", title: "Excel still won", text: "Exported to SAP, grouped by hand" },
    { icon: "tabs", title: "Tabs everywhere", text: "Orders, plan, loads: all separate" },
    { icon: "split", title: "Roles got blurred", text: "Planning and dispatch, one flow" },
    { icon: "swap", title: "Structured backwards", text: "Orders on top, plan below" },
  ],
};

export const problem = {
  eyebrow: "The problem",
  business: {
    title: "Business problem",
    text: "Plant heads couldn't see lower freight costs, and a **training-heavy tool** couldn't scale as SaaS.",
  },
  user: {
    title: "User problem",
    text: "Planners faced a steep learning curve and a fragmented, **black-box interface** they couldn't trust.",
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "A strong 10-year algorithm was trapped behind an interface too complex to scale and **too opaque to trust**.",
  },
  // Each problem statement above, broken into the concrete goals it implied -
  // same facts as business/user problem, restructured as a checklist.
  businessGoals: {
    title: "Business goals",
    items: [
      { title: "Lower freight costs", text: "Real savings, not just efficiency on paper." },
      { title: "Cut the support & training load", text: "Self-serve, not two weeks of training." },
      { title: "Stronger market position", text: "A differentiator, not a liability." },
    ],
  },
  designGoals: {
    title: "Design goals",
    items: [
      { title: "Faster plan creation", text: "Raw orders to a plan in minutes, not 15-20." },
      { title: "Persona-based tasks", text: "Planning and dispatch are different jobs." },
      { title: "An interface planners could trust", text: "Output planners understand and believe." },
    ],
  },
};

export const iterations = {
  heading: "Iterations",
  eyebrow: "Five concepts before this shipped",
  intro: "Every pass asked two things: where do a planner's actions live, and can it scale without becoming a second control tower? **Concept 5 answered both**, so it shipped.",
  concepts: [
    {
      number: 1,
      title: "Continuous plan + reporting layer",
      pros: [
        "Plan auto-refreshed, always showing the latest run",
        "Unassigned orders fell back to LTL automatically",
      ],
      cons: [
        "Buried planners' actions a layer deep",
        "The performance view suited plant managers, not planners",
      ],
      shipped: false,
    },
    {
      number: 2,
      title: "Loads up front, no analytics layer",
      pros: ["Dropped reporting and put loads up front"],
      cons: [
        "Failed and new orders sat in separate tabs",
        "Accepted and confirmed loads shared a tab",
      ],
      shipped: false,
    },
    {
      number: 3,
      title: "Action center + performance graph",
      pros: ["Clear next steps instead of a passive table"],
      cons: [
        "Duplicated the control tower: every module would need one",
        "Orders in the planner tab still weren't clear",
      ],
      shipped: false,
    },
    {
      number: 4,
      title: "Icon actions, loads and orders separated",
      pros: [
        "Loads and orders in separate sections",
        "Icon actions saved horizontal space",
      ],
      cons: [
        "Risked becoming a full order-management system",
        "Still too many steps per action",
      ],
      shipped: false,
    },
    {
      number: 5,
      title: "Dedicated orders tab, no action center",
      pros: [
        "Orders got their own tab, so it **scales without new sections**",
        "Dropped the action center: the control tower and **pending-action badges** already did that job",
      ],
      cons: [],
      shipped: true,
    },
  ],
};

export const solutions = [
  {
    number: "Solution 1",
    title: "A trustworthy quality signal",
    problem: "Planners couldn't tell if a plan was any good.",
    solution:
      "We show **freight cost as a % of order value**, coloured green, yellow or red. Lower is better, readable at a glance.",
    image: "plan",
  },
  {
    number: "Solution 2",
    title: "Seeing the load in 3D",
    problem:
      "Planners couldn't see how a truck would be packed, or how well.",
    solution:
      "A **3D truck view** shows every box in place before planners commit.",
    image: "truck3d",
  },
  {
    number: "Solution 3",
    title: "A clear path when boxes don't fit",
    problem:
      "When boxes couldn't be planned, nothing told planners what to do.",
    solution:
      "Failures now flag **exactly which boxes** didn't fit, with the next best action.",
    image: "summary",
  },
  {
    number: "Solution 4",
    title: "Fewer steps to a confirmed load",
    problem: "Too many steps for new users to pick up.",
    solution:
      "Planning to indenting a load now takes **just two clicks**, in the ideal case.",
    image: "orderLoad",
  },
];

export const impact = {
  heading: "Impact",
  stats: [
    {
      icon: "trust",
      value: "18% → 72%",
      title: "4x surge in trust",
      text: "Auto-plan acceptance nearly quadrupled once the logic stopped being a black box.",
    },
    {
      icon: "cost",
      value: "TBD",
      title: "Freight cost saved",
      text: "Savings from shipping the algorithm's plan instead of re-planning by hand. Figure to be added.",
      placeholder: true,
    },
    {
      icon: "time",
      value: "74% faster",
      title: "Faster execution",
      text: "Daily planning dropped from 19 minutes to under 5.",
    },
    {
      icon: "onboarding",
      value: "100% self-serve",
      title: "Zero-friction onboarding",
      text: "From 2 weeks of training to picking it up alone.",
    },
  ],
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "A better algorithm isn't a better product",
      text: "A sharper algorithm changed nothing. Acceptance rose **from 18% to 72%** only once the interface showed why a plan was good.",
    },
    {
      title: "Explain in the user's units, not the model's",
      text: "Planners didn't need the logic. They needed **one number they already trusted**: freight cost as a share of order value.",
    },
    {
      title: "Trust breaks at the edges",
      text: "One plan that quietly drops boxes undoes every good one. **The failure path** is where planners decide to rely on the tool.",
    },
    {
      title: "Interviews find what reviews miss",
      text: "The review found broken flows. Interviews found the real problem: **a black box planners worked around in Excel**.",
    },
  ],
};
