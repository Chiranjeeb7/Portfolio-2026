// Content for the Transporter auctions case study (V2). Unlike the V1 Framer
// page (which covered building the whole transporter app in 30 days), this
// one is about the follow-up redesign of the spot and long-term auction
// experience on mobile. The "before" screens are the V1 app as shown on the
// Framer page; the Kiro screenshot and hand-held phone mockup come from
// there too. Remaining outcome metrics are pending and marked as
// placeholders, not fabricated. Screen slots with `src: null` render an
// "add screen" placeholder until the matching screen is supplied.

export const nav = [
  { id: "context", label: "Context" },
  { id: "research", label: "Research" },
  { id: "problem", label: "Problem" },
  { id: "goals", label: "Goals" },
  { id: "solution", label: "Solution" },
  { id: "build", label: "How we built it" },
  { id: "impact", label: "Impact" },
  { id: "learnings", label: "Learnings" },
];

export const hero = {
  tag: "B2B SaaS · Logistics · Mobile",
  titleLines: [
    { text: "Making auctions on the app", accent: false },
    { text: "feel like an auction", accent: true },
  ],
  role: "I led the redesign of spot and long-term auctions in TransportOne's transporter app, turning a generic flow into a **live auction room**. The PM and I vibe coded the UI refresh ourselves with Kiro.",
  stats: [
    { icon: "adoption", value: "6% → 50%", label: "of auction usage on the app, vs web and WhatsApp" },
    { icon: "typing", value: "Zero typing", label: "to place or revise a bid: tap + or −" },
    { icon: "scope", value: "Spot + long term", label: "both auction types redesigned end to end" },
    { icon: "build", value: "2 people", label: "the PM and I built the UI refresh with Kiro" },
  ],
  screens: [
    { src: "newHome", alt: "Home with a live spot auction banner" },
    { src: "newSpotList", alt: "Spot auctions list with live, upcoming, won and lost tabs" },
    { src: "newAcceptTerms", alt: "Accept terms sheet with an AI summary before bidding" },
    { src: "newAuctionRoom", alt: "Dark auction room showing rank 3, a countdown and the revise bid card" },
  ],
};

export const context = {
  heading: "About TransportOne for transporters",
  paragraphs: [
    "TransportOne is Delhivery's Transport Management System (TMS). Transporters use it to accept loads, assign trucks and **bid for new business**.",
    "Our transporter app already handled most load acceptance. Auctions didn't: bidding stayed on the web, WhatsApp and calls, with **only 6% on the app**.",
  ],
  diagramHeading: "How an auction works",
  flow: [
    {
      icon: "gavel",
      title: "A shipper opens an auction",
      text: "Spot auctions fill a load soon; long-term ones lock in lane rates. Each has a ceiling price.",
    },
    {
      icon: "trend",
      title: "Transporters bid down, live",
      text: "Bids drop in fixed steps: with a ₹500 decrement, ₹14,000 goes to ₹13,500, never ₹13,999.",
    },
    {
      icon: "trophy",
      title: "The winning bid is binding",
      text: "The winner moves the load at that price, on time, or pays penalties.",
    },
  ],
};

export const research = {
  heading: "We listened first",
  intro:
    "We called transporters to learn **how they bid and why they left the app**. Customer support, who talk to them daily, filled in the rest.",
  sources: [
    {
      icon: "phone",
      title: "Calls with transporters",
      text: "Before any screens, calls showed how they bid and what pushed them to WhatsApp.",
    },
    {
      icon: "support",
      title: "Customer support",
      text: "They knew the recurring complaints, and helped move transporters onto the app at launch.",
    },
  ],
};

export const problem = {
  heading: "Auctions were leaking off the app",
  intro:
    "Transporters kept falling back to the web, WhatsApp and calls. A few problems stood out.",
  points: [
    {
      icon: "eyeOff",
      title: "Rank and bid were buried",
      text: "What matters most was hidden under clutter.",
    },
    {
      icon: "leave",
      title: "Nothing brought them back",
      text: "They check in and leave. Nothing pulled them back to a live auction.",
    },
    {
      icon: "keyboard",
      title: "Bidding meant typing",
      text: "Typed amounts that broke the decrement got rejected.",
    },
    {
      icon: "lanes",
      title: "Many lanes, one small screen",
      text: "Bidding lane by lane on a phone was slow.",
    },
    {
      icon: "gamepad",
      title: "It didn't feel like an auction",
      text: "They play games like poker. The old flow felt like a form.",
    },
    {
      icon: "generic",
      title: "It felt like any other app",
      text: "A generic UI gave them no reason not to just call.",
    },
  ],
};

export const goals = {
  eyebrow: "The problem",
  business: {
    title: "Business problem",
    text: "Too much bidding happened off the app. We needed **more auctions on the app**.",
  },
  user: {
    title: "User problem",
    text: "The old flow **hid rank and bid**, made them type exact amounts, and never pulled them back.",
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "Bidding on the app took more effort and felt less alive than a call, so **transporters picked up the phone**.",
  },
  businessGoals: {
    title: "Business goals",
    items: [
      { title: "Move bidding onto the app", text: "Away from web, WhatsApp and calls." },
      { title: "More auctions on the app", text: "In both spot and long-term." },
      { title: "Keep transporters coming back", text: "While an auction is still live." },
    ],
  },
  designGoals: {
    title: "Design goals",
    items: [
      { title: "Put rank and bid first", text: "Every screen built around them." },
      { title: "Built for thumbs, not keyboards", text: "No typing, no invalid amounts." },
      { title: "Scale to many lanes", text: "Many lanes as quick as one." },
    ],
  },
};

// `before` / `after` screens per solution. `src` keys map to imported images
// in the page; `null` renders a placeholder slot for a screen still to come.
// An empty `before` means the feature is new, so it shows as "Redesign" only.
export const solutions = [
  {
    number: "Solution 1",
    title: "Information hierarchy, rebuilt around the auction",
    problem:
      "Every detail had the same weight, so rank and bid got lost.",
    solution:
      "The list splits into live, upcoming, won and lost, each with a timer. The auction room leads with a **big rank badge, a countdown and the bid**; the rest moves behind more actions.",
    before: [{ src: "oldAuctionDetail", label: "Old auction details" }],
    after: [
      { src: "newSpotList", label: "Auction list" },
      { src: "newAuctionRoom", label: "Live auction room" },
    ],
  },
  {
    number: "Solution 2",
    title: "Bringing transporters back to the app",
    problem:
      "Transporters check in and leave, and the auction moves on without them.",
    solution:
      "A **live-auction banner** on home shows their rank and nudges them to revise. Snackbars, push and WhatsApp bring them back while it's still running.",
    before: [{ src: "oldHome", label: "Old home" }],
    after: [{ src: "newHome", label: "Home with live auction banner" }],
  },
  {
    number: "Solution 3",
    title: "A bid you tap, not type",
    problem:
      "Bids were typed into a form, and amounts off the fixed step got rejected.",
    solution:
      "Tap − or + to move one step, or a chip to jump several. **Every amount is a valid bid**, and nothing needs the keyboard.",
    before: [{ src: "oldBidForm", label: "Old bid form" }],
    after: [
      { src: "newAuctionRoom", label: "Bid card in the auction room" },
      { src: "newBidCard", label: "Close-up: tap − or +, or a preset chip", crop: true },
    ],
  },
  {
    number: "Solution 4",
    title: "A head start on the first bid",
    problem:
      "Every first bid started blank, so transporters had to work out an opening rate.",
    solution:
      "The first bid is **preloaded** from the lane's past rates or the ceiling price. Adjust with a tap or two.",
    before: [{ src: "oldBidForm", label: "Old place bid" }],
    after: [{ src: "newPreloadedBid", label: "First bid preloaded, ready to submit" }],
  },
  {
    number: "Solution 5",
    title: "Pre-bids and bookmarks for multi-lane auctions",
    problem:
      "When bidding opened, transporters raced to find their lanes and bid on each.",
    solution:
      "**Pre-bids** put them in the race before it opens, and bookmarks take them straight to their lanes.",
    before: [],
    after: [
      { src: "newLongTermList", label: "Bookmark from the auction list" },
      { src: "newEarlyBid", label: "Pre-bid before the auction" },
      { src: "newLaneBookmarked", label: "Bookmarked lane in the auction" },
    ],
  },
  {
    number: "Solution 6",
    title: "Swipe between lanes",
    problem:
      "Changing lanes meant going back to the list, every time, mid-auction.",
    solution:
      "**Swipe left or right** to change lanes, like flipping through cards.",
    before: [],
    // Not a still: an animated demo of the swipe, built from the auction room screen.
    after: [{ demo: "laneSwipe", label: "Swipe left or right to change lanes" }],
  },
];

export const build = {
  heading: "Vibe coded by the PM and me",
  paragraphs: [
    "The APIs already existed. Only the experience was missing, so **the PM and I built the UI refresh ourselves** instead of queueing it for engineering.",
    "We vibe coded it with Kiro, from my designs to the auction room and bid card.",
  ],
  image: { src: "kiroBuild", alt: "The app running on a phone next to a Kiro session editing the React Native screens" },
  caption: "The app on a phone, and the Kiro session building it.",
};

export const impact = {
  heading: "Impact",
  intro:
    "With customer support backing the rollout, the app's share of auction usage grew **from 6% to 50%**.",
  // Share of auction usage on the app, before and after. The rest is web and
  // WhatsApp combined, since those are the only other channels measured.
  adoption: { before: 6, after: 50 },
  stats: [
    {
      icon: "adoption",
      value: "6% → 50%",
      title: "Auctions on the mobile app",
      text: "The app's share of auction usage, against web and WhatsApp.",
    },
    {
      icon: "participation",
      value: "TBD",
      title: "Auction participation",
      text: "Auctions transporters bid on through the app, before vs after. Figure to be added.",
      placeholder: true,
    },
    {
      icon: "typing",
      value: "TBD",
      title: "Faster bids",
      text: "Taps or time to place and revise a bid. Figure to be added.",
      placeholder: true,
    },
    {
      icon: "revise",
      value: "TBD",
      title: "Bid revisions",
      text: "How often they revise once told they're falling behind. Figure to be added.",
      placeholder: true,
    },
  ],
  showcase: { src: "newHome", alt: "The new home screen, with the live auction banner, on a phone held in hand" },
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "Borrow from what users already love",
      text: "Transporters play games like poker. **That feeling of a live contest** mattered more than any new feature.",
    },
    {
      title: "On mobile, typing is friction",
      text: "Swapping a keyboard for + and − **removed invalid bids entirely** and made bidding quick.",
    },
    {
      title: "Getting users back is part of the design",
      text: "People don't live in a B2B app. **The nudges did as much for adoption** as the screens.",
    },
    {
      title: "Designers can ship the UI",
      text: "With APIs in place, the PM and I took a UI refresh **to production without engineering**.",
    },
  ],
};
