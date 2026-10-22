// Copy for the Story page (#/story). Edit here, not in the page component.
// `**phrase**` marks the one skim highlight a paragraph may carry (rich.jsx).

// The hero is drawn as an engineering sheet: the portrait is the "part",
// numbered balloons point at it, and the parts list explains each one.
export const storyHero = {
  eyebrow: "My story",
  title: "From sketching cars to designing *AI* agents.",
  // The headline word that gets a pencil scribble (hover it for the car).
  scribble: "sketching",
  scribbleNote: "From the margins of my 2015 notebooks",
  summary:
    "A mechanical engineer turned product designer, with **six years** across a startup, an ed-tech giant and logistics.",
  hello: "Hi, I'm Chiranjeeb",
};

// Balloons on the portrait. `point` is where the leader line lands and
// `balloon` where the numbered circle sits, both in the photo's own pixels
// (profile.webp is 480 x 600); balloons may sit outside the photo.
export const heroParts = [
  {
    n: 1,
    part: "Head",
    note: "Designs AI agents. Design Lead at Delhivery.",
    point: [178, 112],
    balloon: [44, 96],
  },
  {
    n: 2,
    part: "Heart",
    note: "Found design at IIT Guwahati in 2017. M.Des from IIIT Jabalpur.",
    point: [300, 300],
    balloon: [500, 196],
  },
  {
    n: 3,
    part: "Hands",
    note: "Sketching cars since 2015. B.Tech in mechanical engineering.",
    point: [380, 396],
    balloon: [500, 470],
  },
];

// The title block along the bottom of the sheet.
export const titleBlock = [
  { label: "Drawn by", value: "Chiranjeeb Deb" },
  { label: "In product design", value: "6 years", count: true, accent: true },
  { label: "Companies", value: "3", count: true },
  { label: "Now", value: "Design Lead, Delhivery" },
  { label: "Rev.", value: "2026" },
];

// The journey timeline, oldest first. One rail runs through all of it: the
// three years before design had a name, a break, the three jobs, and today.
// `year` and `place` feed the rolling year counter beside the rail.
// Each origin pairs with a sketch in components/story/Sketches.jsx. The 2018
// year is inferred from the CEED cycle after 2017; correct it if it differs.
export const origins = [
  {
    year: "2015",
    place: "B.Tech, Mechanical",
    sketch: "car",
    title: "Cars, craft and machines",
    body: [
      "I was studying mechanical engineering and filling notebooks with sketches of cars and machines.",
      "What pulled me in wasn't the engineering. It was **shaping a product so it felt right to use**. I had no idea that could be a job. It was just interest.",
    ],
  },
  {
    year: "2017",
    place: "IIT Guwahati",
    sketch: "bicycle",
    title: "The day it got a name",
    body: [
      "At IIT Guwahati I walked into a showcase by the design students. One project stopped me: **a number plate, designed for bicycles**. Small, ordinary, and rethought entirely around how people would actually see and use it.",
      "It was what I'd been doing in my notebooks, treated as real work. I read everything I could and talked to the students. That's how I learned design was a discipline, with a degree and a career at the end of it.",
    ],
  },
  {
    year: "2018",
    place: "IIIT Jabalpur",
    sketch: "disciplines",
    title: "CEED, then IIIT Jabalpur",
    body: [
      "I prepared for CEED and got into the M.Des programme at IIIT Jabalpur.",
      "I tried it all: industrial, then communication, then interaction design. Interaction is where I **fell in love with the work**.",
    ],
  },
];

export const journeyBreak = {
  title: "Then came the work",
  body: "A startup, a large ed-tech design team, and logistics at scale.",
};

// The three jobs, oldest first. `visual` picks the illustration beside each
// (see StoryPage.jsx). `logo` matches the keys used elsewhere.
export const chapters = [
  {
    id: "omnirio",
    year: "2020",
    company: "Omnirio",
    logo: "omnirio",
    role: "Founding Product Designer",
    dates: "Nov 2020 - Sep 2021",
    visual: "startup",
    title: "Doing everything, from zero to one",
    body: [
      "I joined a team of 25 as the founding product designer and did whatever needed doing: the product, the website, marketing. Our users were across South-East Asia.",
      "We grew from **6 customers to 100**, and I worked on every step of it.",
    ],
    learned: "A startup mindset. How to design from zero to one, and ship before it's perfect.",
  },
  {
    id: "byjus",
    year: "2021",
    company: "BYJU'S",
    logo: "previous",
    role: "Product Designer",
    dates: "Oct 2021 - Jan 2023",
    visual: "studio",
    title: "Going deep on craft",
    body: [
      "I wanted to work in a large team, and I got one: about 80 designers and researchers, with 12 in my pod.",
      "I was lucky to work with **Osmo on phygital products**, where kids play with physical pieces and a screen together.",
    ],
    learned: "Working in a large organisation: managing stakeholders, and caring about the smallest details.",
    caseStudy: { label: "Map Practice case study", href: "#/map-practice" },
  },
  {
    id: "delhivery",
    year: "2023",
    company: "Delhivery",
    logo: "current",
    role: "Product Designer to Design Lead",
    dates: "Jan 2023 - Present",
    visual: "agents",
    title: "Building products, then the team behind them",
    body: [
      "I joined as a product designer and, over four years, grew into a design lead. Today I lead the SaaS and agentic team.",
      "I scaled our in-house design system and worked on projects that touch **thousands of shipments**. Now I'm a product builder: I ship stories end to end and shape the UX of our in-house AI agents, the next big bet in logistics.",
    ],
    learned: "Leading people and systems, and shipping the work myself instead of handing it off.",
    caseStudy: { label: "Planner case study", href: "#/planner" },
  },
];

// Where the rail ends: the bookend back to 2015.
export const today = {
  year: "2026",
  place: "Today",
  sketch: "evolution",
  title: "Same instinct, new material",
  body: [
    "In 2015 it was a car in a notebook. Today it's AI agents for logistics.",
    "The instinct hasn't changed: **shape the thing so it's easy to use**.",
  ],
};

// Drafted from the story above. Rewrite in your own words if any feel off.
export const principles = [
  {
    icon: "hand",
    from: "industrial design",
    title: "Start with how it's used",
    body: "Industrial design taught me a product is judged in use, not in a render. I still start there.",
  },
  {
    icon: "rocket",
    from: "Omnirio",
    title: "Get to one, fast",
    body: "At a 25-person startup, the best design was the one that shipped this week and taught us something.",
  },
  {
    icon: "scan",
    from: "BYJU'S",
    title: "The details are the work",
    body: "Kids notice everything. So do operators moving thousands of shipments. Small things decide trust.",
  },
  {
    icon: "blocks",
    from: "Delhivery",
    title: "Systems over screens",
    body: "A good design system lets a small team move like a big one. One decision, every product.",
  },
];

// Real outcomes only: each figure appears in a case study or in the story.
export const impact = [
  {
    company: "Delhivery",
    logo: "current",
    items: [
      { value: "19 → <5 min", label: "daily planning time, Planner" },
      { value: "6% → 50%", label: "of auction usage moved to the app" },
    ],
    links: [
      { label: "Planner", href: "#/planner" },
      { label: "Transporter", href: "#/transporter" },
    ],
  },
  {
    company: "BYJU'S",
    logo: "previous",
    items: [
      { value: "90%", label: "of kids tested found Map Practice highly engaging" },
      { value: "Phygital", label: "products built with Osmo, paper and screen together" },
    ],
    links: [{ label: "Map Practice", href: "#/map-practice" }],
  },
  {
    company: "Omnirio",
    logo: "omnirio",
    items: [
      { value: "6 → 100", label: "customers while I was the founding designer" },
      { value: "0 → 1", label: "product, website and marketing, designed end to end" },
    ],
    links: [],
  },
];

export const offClock = [
  {
    sketch: "badminton",
    title: "Badminton",
    body: "I play a bit whenever I can find a court and a partner.",
  },
  {
    sketch: "cooking",
    title: "Cooking",
    body: "Started recently, just for fun. Same loop as design: try, taste, adjust.",
  },
];
