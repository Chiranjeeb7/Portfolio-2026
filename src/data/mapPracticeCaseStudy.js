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
  role: "I scoped research with the UX Research team, sat in on interviews, and turned the insights into a **phygital (physical + digital) map-practice app** for BYJU'S LearnStation.",
  stats: [
    { icon: "engagement", value: "90%", label: "of kids tested found map practice highly engaging" },
    { icon: "phygital", value: "Paper + screen", label: "interactions built for both the physical and digital world" },
    { icon: "research", value: "28+ interviews", label: "with students and social-studies teachers" },
    { icon: "timeline", value: "3 months", label: "design timeline, research to final UI" },
  ],
};

export const context = {
  heading: "About BYJU'S LearnStation",
  paragraphs: [
    "BYJU'S LearnStation is a **distraction-free learning tablet** for students in classes 4 to 10.",
    "Its **downward-facing camera** can see a student's workbook on the desk.",
  ],
  diagramHeading: "How map practice works",
  flow: [
    {
      icon: "map",
      title: "Place a real map sheet",
      text: "A printed outline map (India political, physical or world) goes in front of the device.",
    },
    {
      icon: "scan",
      title: "The camera reads the paper",
      text: "The camera detects the sheet and ties each question to it.",
    },
    {
      icon: "pencil",
      title: "Mark by hand, get feedback on screen",
      text: "Students mark on paper like in an exam, then get hints, a score and the answer on screen.",
    },
  ],
};

export const stakes = {
  heading: "Why map practice matters",
  paragraphs: [
    "Map work shows up in almost every social-studies paper for grades 6 to 10, usually **worth 2-4 marks**.",
    "Yet there was no real way to practise it. **Most students just memorised.**",
  ],
  stats: [
    { icon: "marks", value: "2-4 marks", label: "per paper, across grades 6-10" },
    { icon: "marks", value: "10 marks", label: "for map work in ICSE grade 10 geography" },
    { icon: "marks", value: "5 + 3 marks", label: "in CBSE grade 10: geography plus history" },
  ],
  figureCaption: "Students get tested on three kinds of outline map.",
};

export const research = {
  heading: "What we set out to learn",
  method:
    "With the UX Research team, we interviewed **15+ students and 13+ social-studies teachers** across boards.",
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
  heading: "Key insights",
  stats: [
    { icon: "clock", value: "4 in 5", label: "students leave map learning until right before the exam" },
    { icon: "timer", value: "30-60 min", label: "spent on maps right before an exam, on average" },
  ],
  perceptionHeading: "Perception of students",
  grades: [
    {
      id: "younger",
      title: "Younger grades",
      range: "Class 6-7",
      points: [
        "More curious about maps.",
        "The topic is new and simpler.",
        "They ask more doubts, wanting to visualise.",
      ],
    },
    {
      id: "elder",
      title: "Elder grades",
      range: "Class 8-10",
      points: [
        "Interest drops.",
        "Maps feel like an extra burden.",
        "Attention comes **only before the exam**.",
      ],
    },
  ],
  priorityCaption:
    "Low priority for months, then a spike the day before the exam: repetition, quick tips and YouTube.",
  methodsHeading: "How students learn maps today",
  methods: [
    { icon: "repeat", title: "Repeated practice", text: "Re-drawing on blank sheets." },
    { icon: "book", title: "Theory-based learning", text: "Linking theory to locations." },
    { icon: "story", title: "Remembering stories", text: "Stories that anchor a place." },
    { icon: "shapes", title: "Pattern-based learning", text: "Visual aids, shapes and patterns." },
  ],
};

export const problem = {
  eyebrow: "The problem",
  business: {
    title: "Business problem",
    text: "Maps carry real marks, but **no product helped students practise** them: a clear gap for a device that joins workbook and screen.",
  },
  user: {
    title: "User problem",
    text: "Students crammed before exams, **couldn't mark places accurately**, mixed up rivers and states, and had only blank sheets.",
  },
  core: {
    tag: "Defined problem to solve",
    title: "The core problem",
    text: "Map work is a hands-on skill, but students treated it as last-minute memorisation, with **no feedback on whether a mark was right**.",
  },
  goalCards: [
    {
      title: "Practice maps",
      items: [
        { title: "Mark on real paper", text: "The same outline maps used in exams." },
        { title: "Chapter-by-chapter revision", text: "As chapters are taught, not the night before." },
        { title: "Know if a mark is right", text: "Hints, scores and answers." },
      ],
    },
    {
      title: "Learn tips & tricks",
      items: [
        { title: "Quick tips and tricks", text: "What students hunt for before exams." },
        { title: "A video for each location", text: "Where and how to mark." },
        { title: "Think spatially", text: "Remember places, not just names." },
      ],
    },
  ],
};

export const approach = {
  heading: "Getting buy-in from leadership",
  paragraphs: [
    "We shared small prototypes with leadership early. **A working mock explained it better than any deck**, and won buy-in fast.",
  ],
  video: { id: "2tK-9OfaXpw", title: "Map Practice Mock", ratio: "16 / 9" },
  videoCaption: "The early mock we shared with leadership.",
};

export const solution = {
  heading: "Solution",
  intro: "End to end, from scanning a sheet to marking an answer.",
  video: { id: "4Q3oWsj8hJI", title: "Map Prototype", ratio: "4 / 3" },
};

export const testing = {
  eyebrow: "Usability testing at BYJU'S Tuition Centre",
  heading: "Putting it in front of students",
  method:
    "We tested with students at a BYJU'S Tuition Centre in Bangalore, **recording every session** to watch how they handled device and paper together.",
  meta: [
    { label: "Method", value: "Central location test" },
    { label: "Goal", value: "How kids use map practice" },
    { label: "Format", value: "Observational, recorded" },
  ],
  findings: [
    {
      tone: "positive",
      title: "Good response to the product",
      text: "Most had fun marking the map and stayed engaged.",
    },
    {
      tone: "issue",
      title: "Placing the map was difficult",
      text: "Lining it up with the camera took time.",
    },
    {
      tone: "issue",
      title: "Hints were hard to find",
      text: "Stuck students didn't notice hints existed.",
    },
  ],
  resultsHeading: "What else surfaced",
  results: [
    {
      title: "Content planning",
      text: "Continent-level questions were hard; content needed closer planning.",
    },
    {
      title: "Instruction clarity",
      text: "Students didn't know to long-press to submit.",
    },
    {
      title: "Optimisation",
      text: "Sheet sizes, markings per sheet and shading needed tuning.",
    },
  ],
  changesHeading: "What we changed after testing",
  changes: [
    {
      number: "Change 1",
      title: "A clearer question screen",
      problem: "Missed hints, a hidden long-press, wordy questions.",
      solution:
        "Questions **cut to the place name**, hints made prominent, a grid to retry any question, and clear submit instructions.",
      image: "question",
    },
    {
      number: "Change 2",
      title: "A safe spot for the device, printed on the sheet",
      problem: "Maps took time to line up, and shifted mid-question.",
      solution:
        'A **"Place LearnStation here" band** on every sheet lines device and paper up the same way, every time.',
      image: "sheet",
      tall: true,
    },
  ],
};

export const impact = {
  heading: "Impact",
  stats: [
    {
      icon: "engagement",
      value: "90%",
      title: "Highly engaging",
      text: "Of the kids we tested, 90% found it highly engaging.",
    },
    {
      icon: "phygital",
      value: "Paper + screen",
      title: "Interactions in both worlds",
      text: "One flow across a paper map and the screen.",
    },
    {
      icon: "research",
      value: "28+",
      title: "Voices behind the design",
      text: "15+ students and 13+ teachers shaped what we built.",
    },
    {
      icon: "timeline",
      value: "3 months",
      title: "Research to final UI",
      text: "Research, prototypes, testing and final designs.",
    },
  ],
};

export const learnings = {
  heading: "What this project taught me",
  items: [
    {
      title: "Research tells you when, not just what",
      text: "Knowing students study maps **right before exams** shaped the whole product, not just the screens.",
    },
    {
      title: "Content is half the product",
      text: "Continent-level questions tripped students up. **Content mattered as much as the interface.**",
    },
    {
      title: "Watch kids, don't just ask them",
      text: "Recordings caught what **no interview would**: missed hints, a hidden long-press, shifting maps.",
    },
    {
      title: "Design for the age group",
      text: "A simple interface with **rewards and light gamification** keeps grades 6-10 engaged.",
    },
  ],
};
