// Content for the Transporter auctions case study (V2). Unlike the V1 Framer
// page (which covered building the whole transporter app in 30 days), this
// one is about the follow-up redesign of the spot and long-term auction
// experience. Problems and solutions come straight from the project brief;
// the "before" screens are the V1 app as shown on the Framer page. Outcome
// metrics for the redesign are pending — marked as placeholders, not
// fabricated. Comparison slots with `src: null` render an "add screen"
// placeholder until the matching screen is supplied.

export const nav = [
  { id: "context", label: "Context" },
  { id: "problem", label: "Problem" },
  { id: "goals", label: "Goals" },
  { id: "solution", label: "Solution" },
  { id: "impact", label: "Impact" },
  { id: "learnings", label: "Learnings" },
];

export const hero = {
  tag: "B2B SaaS · Logistics · Mobile",
  titleLines: [
    { text: "Making auctions on the app", accent: false },
    { text: "feel like an auction", accent: true },
  ],
  role: "I led the redesign of the spot and long-term auction experience in TransportOne's transporter app — turning a generic bidding flow into a live auction room that pulls auctions off WhatsApp and phone calls and onto the app.",
  stats: [
    { icon: "scope", value: "Spot + long term", label: "both auction types redesigned end to end" },
    { icon: "typing", value: "Zero typing", label: "to place or revise a bid — tap +/– or a preset chip" },
    {
      icon: "participation",
      value: "TBD",
      label: "auction participation on the app after the redesign",
      placeholder: true,
    },
    {
      icon: "offline",
      value: "TBD",
      label: "auctions moved from WhatsApp and calls onto the app",
      placeholder: true,
    },
  ],
  screens: [
    { src: "newHome", alt: "Home with a live spot auction banner" },
    { src: "newSpotList", alt: "Spot auctions list with live, upcoming, won and lost tabs" },
    { src: "newAcceptTerms", alt: "Accept terms sheet with an AI summary before bidding" },
    { src: "newAuctionRoom", alt: "Dark auction room showing rank 3, a countdown and the revise bid card" },
  ],
};

export const context = {
  eyebrow: "A bit of context…",
  heading: "About TransportOne for transporters",
  paragraphs: [
    "TransportOne is Delhivery's Transport Management System (TMS) for enterprise shippers. Transporters join the platform to work with those shippers — accepting loads, assigning trucks and bidding for new business.",
    "We'd already shipped a transporter mobile app, and it was working: most load acceptance had moved onto it. Auctions were a different story — a lot of the bidding still happened offline, over WhatsApp and phone calls.",
  ],
  diagramHeading: "So, how does an auction work?",
  flow: [
    {
      icon: "gavel",
      title: "A shipper opens an auction",
      text: "Spot auctions fill a load that needs a truck soon; long-term auctions lock in rates on a lane for longer. Each comes with a ceiling price.",
    },
    {
      icon: "trend",
      title: "Transporters bid down, live",
      text: "Bids go under the ceiling. Transporters see their rank and revise their bid before the timer runs out.",
    },
    {
      icon: "trophy",
      title: "The winning bid is binding",
      text: "Winning is a commitment to move the load at the quoted price — the right truck, on time, or penalties apply.",
    },
  ],
};

export const problem = {
  eyebrow: "What was going wrong",
  heading: "Auctions were leaking offline",
  intro:
    "The app handled auctions, but transporters kept falling back to WhatsApp and phone calls. Looking at how the old flow worked, and at who our transporters are, a few problems stood out.",
  points: [
    {
      icon: "generic",
      title: "It felt like any other app",
      text: "Transporters aren't very tech-savvy and avoid juggling apps. A generic UI gave them no reason to stay instead of calling.",
    },
    {
      icon: "gamepad",
      title: "It didn't feel like an auction",
      text: "Many of them play online games like poker — they know what live competition feels like. The old flow felt like a form.",
    },
    {
      icon: "eyeOff",
      title: "Rank and bid were buried",
      text: "The two things that matter in an auction weren't highlighted, while less important details sat upfront and cluttered the screen.",
    },
  ],
};

export const goals = {
  eyebrow: "So the problem is clear now,",
  business: {
    title: "Business problem",
    text: "Too many auctions happened offline, over WhatsApp and phone calls. We needed adoption of the app to grow, and more auctions to actually run on it.",
  },
  user: {
    title: "User problem",
    text: "For transporters who aren't very tech-savvy, the old auction flow felt generic, hid their rank and bid behind clutter, and never created the urgency of a live auction.",
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "Bidding on the app took more effort and felt less alive than picking up the phone — so transporters picked up the phone.",
  },
  businessGoals: {
    title: "Business goals",
    emoji: "📈",
    items: [
      { title: "Bring offline auctions onto the app", text: "Move bidding that happens over WhatsApp and calls into the product." },
      { title: "More auctions on the app", text: "Grow participation in spot and long-term auctions." },
      { title: "Drive app adoption", text: "Give transporters a reason to open the app, not their phone dialer." },
    ],
  },
  designGoals: {
    title: "Design goals",
    emoji: "🎨",
    items: [
      { title: "Make it feel like an auction", text: "Urgency and competition, through visual design and copy." },
      { title: "Put rank and bid first", text: "Surface what matters; move the rest out of the way." },
      { title: "Built for thumbs, not keyboards", text: "Fewer clicks and no typing to place or revise a bid." },
    ],
  },
};

// `before` / `after` screens per solution. `src` keys map to imported images
// in the page; `null` renders a placeholder slot for a screen still to come.
export const solutions = [
  {
    number: "Solution 1",
    title: "An auction room, not a form",
    problem:
      "The old auction screen looked like every other page in the app — light, generic, and quiet. Nothing about it said a live auction was happening.",
    solution:
      "Entering an auction now takes transporters into a dedicated auction room with a dark-mode treatment. A big rank badge, a live countdown and copy like \"You're falling behind!\" create the urgency to place or revise a bid.",
    before: [{ src: "oldAuctionDetail", label: "Old auction details" }],
    after: [
      { src: "newAcceptTerms", label: "Accept terms to enter" },
      { src: "newAuctionRoom", label: "Live auction room" },
    ],
  },
  {
    number: "Solution 2",
    title: "Always one tap back into the room",
    problem:
      "If a transporter tapped back or left the app mid-auction, there was no easy way back — the auction was out of sight, and out of mind.",
    solution:
      "Designed notifications and a live-auction banner on the home page that shows their current rank and nudges them to revise, plus clearer live and upcoming tabs with \"ends in\" timers on the auction list.",
    before: [{ src: "oldHome", label: "Old home" }],
    after: [
      { src: "newHome", label: "Home with live auction banner" },
      { src: "newSpotList", label: "Auction list" },
    ],
  },
  {
    number: "Solution 3",
    title: "Fewer clicks to a bid",
    problem:
      "Placing a bid meant working through fields that most bids didn't need, and starting the amount from scratch every time.",
    solution:
      "Moved secondary inputs like remarks into additional actions, and prefilled the bid with the ceiling price — so a transporter can start bidding immediately instead of filling out a form.",
    before: [{ src: null, label: "Old place bid" }],
    after: [{ src: null, label: "New place bid" }],
  },
  {
    number: "Solution 4",
    title: "A bid card built for mobile",
    problem:
      "Bidding meant tapping into a field and typing an amount on the keyboard — slow and error-prone on a phone, especially mid-auction.",
    solution:
      "Redesigned the place/revise bid card around mobile interactions: tap + or – to step the amount, or use predefined chips to drop it by a set value. No keyboard needed.",
    before: [{ src: null, label: "Old place/revise bid" }],
    after: [{ src: "newBidCard", label: "New revise bid card", crop: true }],
  },
];

export const impact = {
  heading: "Time to flex our impact muscles",
  stats: [
    {
      icon: "participation",
      value: "TBD",
      title: "Auction participation",
      text: "Share of auctions transporters bid on through the app, before vs after the redesign — figure to be added.",
      placeholder: true,
    },
    {
      icon: "offline",
      value: "TBD",
      title: "Offline auctions moved to the app",
      text: "Bidding that used to happen over WhatsApp and phone calls, now on the app — figure to be added.",
      placeholder: true,
    },
    {
      icon: "typing",
      value: "TBD",
      title: "Faster bids",
      text: "Taps or time to place and revise a bid with the new bid card — figure to be added.",
      placeholder: true,
    },
    {
      icon: "revise",
      value: "TBD",
      title: "Bid revisions",
      text: "How often transporters revise a bid once the room tells them they're falling behind — figure to be added.",
      placeholder: true,
    },
  ],
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "Borrow from what users already love",
      text: "Our transporters play online games like poker. Designing the auction room around that familiar sense of a live contest mattered more than any new feature.",
    },
    {
      title: "On mobile, typing is friction",
      text: "Replacing a keyboard field with +/– and preset chips is a small change on paper, but it's what makes bidding feel quick in the middle of someone's day.",
    },
  ],
};
