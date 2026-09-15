// Content for the Map Practice case study (V2, replacing the old Framer page).
// Structure mirrors the Planner case study. Facts come from the V1 Framer page
// plus the research team's Notion write-up (interview counts, teacher
// observations, usability-test results, post-test changes). Notion sections
// copied in from an unrelated typing project were ignored.

export const nav = [
  { id: "context", label: "Context" },
  { id: "stakes", label: "Why maps" },
  { id: "research", label: "Research" },
  { id: "insights", label: "Insights" },
  { id: "problem", label: "Problem" },
  { id: "approach", label: "Buy-in" },
  { id: "solution", label: "Solution" },
  { id: "testing", label: "Testing" },
  { id: "impact", label: "Impact" },
  { id: "learnings", label: "Learnings" },
];

export const hero = {
  tag: "Ed-tech · Phygital",
  titleLines: [
    { text: "Learning maps for kids,", accent: false },
    { text: "the phygital way", accent: true },
  ],
  role: "I worked with the UX Research team to define the research scope, sat in on student and teacher interviews, and turned what we heard into actionable insights — then worked with the design team to build and ship a phygital (physical + digital) map-practice app for BYJU'S LearnStation.",
  stats: [
    { icon: "engagement", value: "90%", label: "of kids tested found map practice highly engaging" },
    { icon: "phygital", value: "Paper + screen", label: "interactions built for both the physical and digital world" },
    { icon: "research", value: "28+ interviews", label: "with students and social-studies teachers" },
    { icon: "timeline", value: "3 months", label: "design timeline, research to final UI" },
  ],
};

export const context = {
  eyebrow: "A bit of context…",
  heading: "About BYJU'S LearnStation",
  paragraphs: [
    'The BYJU\'S LearnStation is a custom-built, "phygital" (physical + digital) learning tablet designed to give students in classes 4 to 10 a distraction-free, personalised place to learn.',
    "It pairs a dedicated learning OS and pre-loaded BYJU'S content with hardware built for real study — most notably a downward-facing camera that lets the device see a student's workbook on the desk.",
  ],
  diagramHeading: "So, how does map practice work?",
  flow: [
    {
      icon: "map",
      title: "Place a real map sheet",
      text: "Students put a BYJU'S printed outline map — India political, India physical, or world — in front of LearnStation.",
    },
    {
      icon: "scan",
      title: "The camera reads the paper",
      text: "The downward-facing camera detects the sheet, so every question on screen is tied to the map on the desk.",
    },
    {
      icon: "pencil",
      title: "Mark by hand, get feedback on screen",
      text: "Students shade, draw or point on paper just like in an exam, then submit — with hints, a score and the correct answer on screen.",
    },
  ],
};

export const stakes = {
  eyebrow: "Let's deep dive into the problem",
  heading: "Why map practice matters",
  paragraphs: [
    "Map work is one of the most sought-after skills for students in grades 6 to 10 — it shows up in almost every social-studies paper, typically worth 2–4 marks each time.",
    "Yet there was no established way to learn or practise it. The most common approach was simply trying to memorise every location and event.",
  ],
  stats: [
    { icon: "marks", value: "2–4 marks", label: "per paper, across grades 6–10" },
    { icon: "marks", value: "10 marks", label: "for map work in ICSE grade 10 geography" },
    { icon: "marks", value: "5 + 3 marks", label: "in CBSE grade 10 — geography plus history" },
  ],
  figureCaption: "Students get tested on three kinds of outline map.",
};

export const research = {
  eyebrow: "Straight from the research",
  heading: "What we set out to learn",
  method:
    "Alongside the UX Research team, we ran qualitative interviews with 15+ students and 13+ social-studies teachers across boards.",
  findings: [
    { value: "52%", label: "know the state or location, but find it hard to mark the exact point" },
    { value: "42%", label: "confuse the names of rivers and states" },
    { value: "49%", label: "use certain tricks to learn maps" },
    { value: "39%", label: "rely on visual aids to remember" },
  ],
  teachersHeading: "What teachers told us",
  teacherPoints: [
    { icon: "school", title: "Weak map skills overall", text: "Map working skills are inadequate" },
    { icon: "compass", title: "Poor sense of direction", text: "Weak spatial and directional knowledge" },
    { icon: "pin", title: "Lost without labels", text: "Can't fill in a map without names" },
    { icon: "book", title: "Legends get skipped", text: "Little grasp of legends and key locations" },
    { icon: "ruler", title: "Scales are a blind spot", text: "Poor understanding of map scales" },
    { icon: "pencil", title: "Shaky drawing", text: "Poor map-drawing skills" },
  ],
};

export const insights = {
  eyebrow: "What it all added up to",
  heading: "Key insights",
  stats: [
    { icon: "clock", value: "4 in 5", label: "students leave map learning until right before the exam" },
    { icon: "timer", value: "30–60 min", label: "spent on maps right before an exam, on average" },
  ],
  perceptionHeading: "Perception of students",
  grades: [
    {
      id: "younger",
      title: "Younger grades",
      range: "Class 6–7",
      points: [
        "Have a higher curiosity around map learning.",
        "The topic is new, and the content is simpler to explore and learn.",
        "Classroom interaction is higher — they ask more doubts because they want to visualise.",
      ],
    },
    {
      id: "elder",
      title: "Elder grades",
      range: "Class 8–10",
      points: [
        "Interest in map learning drops in higher grades.",
        "Map work starts to feel like an extra burden.",
        "Maps only get real attention just before the exam.",
      ],
    },
  ],
  priorityCaption:
    "Map learning sits at low priority for months, then spikes the day before the exam — when repetitive practice, quick tips and YouTube take over.",
  methodsHeading: "How students learn maps today",
  methods: [
    { icon: "repeat", title: "Repeated practice", text: "Re-drawing the same topic on multiple blank sheets." },
    { icon: "book", title: "Theory-based learning", text: "Connecting related theory topics to specific locations." },
    { icon: "story", title: "Remembering stories", text: "Stories tied to a topic help them locate the place." },
    { icon: "shapes", title: "Pattern-based learning", text: "Using visual aids and recognising shapes and patterns." },
  ],
};

export const problem = {
  eyebrow: "So the problem is clear now,",
  business: {
    title: "Business problem",
    text: "Map work carries real marks from grade 6 to 10, yet there was no product to help students practise it — a clear gap for a device built to bring the workbook and the screen together.",
  },
  user: {
    title: "User problem",
    text: "Students crammed maps by rote right before exams — they roughly knew where a place was but couldn't mark it accurately, mixed up rivers and states, and had nothing but blank sheets to practise on.",
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "Map work is a hands-on, spatial skill, but students were treating it as last-minute memorisation — with no feedback on whether a mark was actually right.",
  },
  goalCards: [
    {
      title: "Practice maps",
      emoji: "🗺️",
      items: [
        { title: "Mark on real paper", text: "Shade, draw and point on the same outline maps used in exams." },
        { title: "Chapter-by-chapter revision", text: "Practise as chapters are taught, not only the night before." },
        { title: "Know if a mark is right", text: "Hints, scores and the correct answer for every question." },
      ],
    },
    {
      title: "Learn tips & tricks",
      emoji: "💡",
      items: [
        { title: "Quick tips and tricks", text: "The shortcuts students were already hunting for before exams." },
        { title: "A video for each location", text: "Short clips showing where and how to mark." },
        { title: "Think spatially", text: "Help students remember places, not just memorise names." },
      ],
    },
  ],
};

export const approach = {
  eyebrow: "Testing initial ideas",
  heading: "Getting buy-in from leadership",
  paragraphs: [
    "Before polishing anything, we built small prototypes and shared them with leadership for early reviews.",
    "A working mock made the concept far easier to explain than a deck ever could — and it got us buy-in quickly.",
  ],
  video: { id: "2tK-9OfaXpw", title: "Map Practice Mock", ratio: "16 / 9" },
  videoCaption: "The early mock we shared with leadership.",
};

export const solution = {
  eyebrow: "Crafting the final solution",
  heading: "Solution",
  intro: "The prototype, end to end — from scanning a map sheet to marking an answer.",
  video: { id: "4Q3oWsj8hJI", title: "Map Prototype", ratio: "4 / 3" },
};

export const testing = {
  eyebrow: "Usability testing at BYJU'S Tuition Centre",
  heading: "Putting it in front of students",
  method:
    "We ran a central-location test with a batch of students at a BYJU'S Tuition Centre in Bangalore, recording every session to observe how kids actually used map practice — and how they handled the device and the paper together.",
  meta: [
    { label: "Method", value: "Central location test" },
    { label: "Goal", value: "How kids use map practice" },
    { label: "Format", value: "Observational, recorded" },
  ],
  findings: [
    {
      tone: "positive",
      title: "Good response to the product",
      text: "Most students had fun drawing markers on the map for each question and stayed highly engaged.",
    },
    {
      tone: "issue",
      title: "Placing the map was difficult",
      text: "The map had to sit where the camera could detect it, and most students needed time to adjust.",
    },
    {
      tone: "issue",
      title: "Hints were hard to find",
      text: "Some students got stuck on a few questions and didn't realise hints were there.",
    },
  ],
  resultsHeading: "What else surfaced",
  results: [
    {
      title: "Content planning",
      text: "Students found continent-level questions hard — content needed closer planning with the content team to stay targeted.",
    },
    {
      title: "Instruction clarity",
      text: "Instructions and hints weren't explicit enough. Students didn't know they had to long-press to submit an answer.",
    },
    {
      title: "Optimisation",
      text: "Sheet and table sizes, the number of markings per sheet, and shading instructions all needed tuning.",
    },
  ],
  changesHeading: "What we changed after testing",
  changes: [
    {
      number: "Change 1",
      title: "A clearer question screen",
      problem: "Students missed hints, didn't discover the long-press to submit, and had to parse wordy questions.",
      solution:
        "Cut each question down to the place name, gave hints more prominence, added a question grid to retry any question, matched the layout to portrait maps, and spelled out how to submit. The first-time video got clearer instructions too.",
      image: "question",
    },
    {
      number: "Change 2",
      title: "A safe spot for the device, printed on the sheet",
      problem: "Lining the map up with the camera took time, and maps shifted mid-question.",
      solution:
        'Added a "Place LearnStation here" band to the top of every map sheet — so the device and paper line up the same way every time, and the map stays flat and straight in front of it.',
      image: "sheet",
      tall: true,
    },
  ],
};

export const impact = {
  heading: "The impact",
  stats: [
    {
      icon: "engagement",
      value: "90%",
      title: "Highly engaging",
      text: "90% of the kids we tested found map practice highly engaging — most had fun marking maps question by question.",
    },
    {
      icon: "phygital",
      value: "Paper + screen",
      title: "Interactions in both worlds",
      text: "Built interactions that span a real paper map and the digital screen, powered by LearnStation's downward-facing camera.",
    },
    {
      icon: "research",
      value: "28+",
      title: "Voices behind the design",
      text: "15+ student and 13+ teacher interviews shaped what we built, and recorded testing sessions shaped how we refined it.",
    },
    {
      icon: "timeline",
      value: "3 months",
      title: "Research to final UI",
      text: "Research, prototyping, testing and the final designs, delivered on a three-month design timeline.",
    },
  ],
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "Research tells you when, not just what",
      text: "Learning that students spend their map time right before exams — hunting for quick tips and visual aids — shaped the whole product, not just the screens.",
    },
    {
      title: "Content is half the product",
      text: "Students struggled with continent-level questions. Planning closely with the content team mattered as much as the interface.",
    },
    {
      title: "Watch kids, don't just ask them",
      text: "Recorded test sessions surfaced things no interview would have: missed hints, an undiscovered long-press, maps that wouldn't sit still.",
    },
    {
      title: "Design for the age group",
      text: "An easy-to-use interface for grades 6–10, with rewards and a bit of gamification, is what keeps engagement up.",
    },
  ],
};
