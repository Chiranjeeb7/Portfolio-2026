// Single source of truth for real content. Edit here, not in components.

export const profile = {
  name: "Chiranjeeb Deb",
  shortName: "Chiranjeeb",
  role: "Product Designer & Design Engineer",
  email: "chiranjeebdeb@gmail.com",
  linkedin: { handle: "@chiranjeeb-deb", url: "https://www.linkedin.com/in/chiranjeeb-deb/" },
  instagram: { handle: "@chiranjeeb7", url: "https://www.instagram.com/chiranjeeb7/" },
};

export const companies = {
  current: { name: "Delhivery", domain: "Logistics · B2B SaaS" },
  previous: { name: "BYJU'S", domain: "Ed-tech" },
};

// V1 case-study pages are live on the previous Framer site — linked here until
// dedicated V2 case-study pages are built.
const V1 = "https://chiranjeebdeb.framer.website";

export const projects = [
  {
    id: "planner",
    company: "current", // Delhivery
    tag: "B2B SaaS · Logistics",
    title: "74% faster logistics planning",
    description:
      "Redesigned an existing stock-control planner, cutting daily planning time and losses across the board.",
    stats: [
      { value: "19 min → <5 min", label: "daily planning time" },
      { value: "3×", label: "decrease in losses" },
    ],
    href: `${V1}/planner`,
  },
  {
    id: "transporter-mobile-app",
    company: "current", // Delhivery
    tag: "B2B SaaS · Logistics",
    title: "A transporter app, shipped in 30 days",
    description:
      "Took load acceptance and auction bidding out of the back office and onto transporters' phones.",
    stats: [
      { value: "80%", label: "of load acceptance now on app" },
      { value: "9–10% → 39%", label: "auction participation" },
    ],
    href: `${V1}/transporter-mobile-app`,
  },
  {
    id: "map-practice",
    company: "previous", // BYJU'S
    tag: "Ed-tech",
    title: "Learning maps for kids, the phygital way",
    description:
      "A phygital (physical + digital) application for practicing maps, built for how young kids actually learn.",
    stats: [{ value: "90%", label: "of kids tested found it highly engaging" }],
    href: `${V1}/map-practice`,
  },
];

// Real posts and links from Medium (medium.com/@chiranjeebdeb).
export const blogPosts = [
  {
    id: "designing-for-kids",
    title: "Designing for Kids: Know your Target Audience",
    excerpt:
      "Designing for kids means designing for parents and educators too — insights on diverse needs.",
    featuredIn: "Ed-Tech Talks",
    readTime: "5 min read",
    href: "https://medium.com/ed-tech-talks/designing-for-kids-know-your-target-audience-19fce8f24ee4",
  },
  {
    id: "designing-for-genz",
    title: "Designing for GenZ: The Impact of Short Attention Span",
    excerpt:
      "How the short attention span of GenZ is shaping most of the digital products we use today.",
    featuredIn: "UX Collective",
    readTime: "4 min read",
    href: "https://medium.com/user-experience-design-1/designing-for-genz-the-impact-of-short-attention-span-5e1e5a5041c7",
  },
  {
    id: "sole-designer-startup",
    title: "How to Ace as the Sole Designer in a Startup? 5 Practical Tips",
    excerpt:
      "Working as the sole designer in an organization can be a difficult mountain to climb — practices that help.",
    featuredIn: "Bootcamp",
    readTime: "6 min read",
    href: "https://medium.com/design-bootcamp/how-to-ace-as-the-sole-designer-in-a-startup-5-practical-tips-771b517036e3",
  },
];

export const skills = [
  "Product Design",
  "Design Systems",
  "Prototyping",
  "User Research",
  "Figma",
  "Claude",
  "Cursor",
  "Interaction Design",
];

export const education = { degree: "M.Des", institute: "IIIT Jabalpur" };

export const writingNote = "Also writes about design for UX Collective.";

export const bio =
  "Hi, I'm Chiranjeeb — a product designer who also ships code. I like problems where the interface has to hold up real operational complexity: fleets, planners, kids, and everything in between.";

// Real dates from the V1 site's About page. `logo` keys "current"/"previous"
// map to companies above (via CompanyLogo); "omnirio" has its own asset
// since it isn't part of the hero/work company set.
export const workExperience = [
  { company: "Delhivery", role: "Product Designer", start: "Jan 2023", end: "Present", logo: "current" },
  { company: "BYJU'S", role: "Product Designer", start: "Oct 2021", end: "Jan 2023", logo: "previous" },
  { company: "Omnirio", role: "UX Designer", start: "Nov 2020", end: "Sep 2021", logo: "omnirio" },
];

export const research = [
  {
    venue: "ICORD 2021",
    title: "A Novel User-Centric Assistive Device for Enhancing Luggage Security in Indian Railways",
  },
  {
    venue: "CoMSO 2020",
    title: "Approximating Non-intersecting Closed Curves Through Four-Bar Linkage Mechanism",
  },
];

export const community = {
  heading: "Growing with the community",
  description:
    "From Interaction Design Foundation (IDF) to UX India to Executive Pack Collective — talks, workshops, and conversations with fellow designers.",
};

export const teaching = {
  heading: "Sharing knowledge across",
  description:
    "Conducted workshops through GrowthSchool and within Delhivery, sharing practical design insights and real-world strategies with designers.",
};
