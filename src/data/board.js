// Off-screen areas of the About board (components/board/BoardExtras.jsx).
// They sit outside the core card sort, so the default view and "reset board"
// frame exactly what they always did; visitors find these by panning or
// zooming out, or through the board map.
//
// Coordinates are board pixels, from the core's top-left corner. The core
// is 1560px wide and about 710px tall. Every area sits to its RIGHT (from x
// 1700), never below: the default fit always ends just past the core's
// right edge, but on narrow screens (fit zoom clamped at 50%) it shows well
// below the core, so anything placed there would leak into the first view.
// Two columns: x 1700 and x 2520, plus the edge note at x 3120; the design
// school and UX India areas sit below them (still right of x 1700, so still
// out of every first view). Everything here is real, from the story, the Key
// Moments log, the milestone pages and photos from design school.
//
// Zone kinds: "stickies" (notes), "photos" (taped photos) and "mixed"
// (`items`, each { type: "photo" | "sticky", ... }). A photo can be `wide`
// (shown whole, uncropped) and can carry a `mark`: a coral "circle" or
// highlighter "marker" over part of the image, in % of its width/height.

import spacingCheckerShot from "../assets/photos/space-checker-in-figma.webp";
import firstPrShot from "../assets/photos/first-pr-github.webp";
import workshopShot from "../assets/photos/ai-workshop-title.webp";
import schoolProjectWall from "../assets/photos/school-project-wall.webp";
import schoolVideoEdit from "../assets/photos/school-video-edit.webp";
import schoolIconTest from "../assets/photos/school-icon-test.webp";
import schoolAffinityMap from "../assets/photos/school-affinity-map.webp";
import schoolWorkshopSaw from "../assets/photos/school-workshop-saw.webp";
import schoolWoodForms from "../assets/photos/school-wood-forms.webp";
import uxIndiaTeam from "../assets/photos/uxindia-team.webp";
import uxIndiaFinalists from "../assets/photos/uxindia-finalists.webp";
import uxIndiaDetail from "../assets/photos/uxindia-finalists-detail.webp";
import { offClock, principles } from "./story";

export const boardZones = [
  {
    id: "side-projects",
    label: "Side projects",
    x: 1700,
    y: 0,
    kind: "stickies",
    cols: 3,
    stamp: "Ships code",
    notes: [
      { tone: "yellow", text: "Spacing Checker, my first Figma plugin", meta: "Sep 2025" },
      { tone: "coral", text: "A split-expense app for colleagues", meta: "Dec 2025" },
      { tone: "sage", text: "A Lego block game", meta: "Dec 2025" },
      { tone: "sage", text: "An education website", meta: "Mar 2026" },
      { tone: "yellow", text: "A SaaS app", meta: "Jun 2026" },
      { tone: "coral", text: "A personal finance tracker", meta: "Sep 2026" },
    ],
  },
  {
    id: "moments",
    label: "Moments",
    x: 1700,
    y: 470,
    kind: "photos",
    cols: 3,
    comment: "Each of these has its own page. Open one, or click the teal squares in Key Moments.",
    photos: [
      { src: spacingCheckerShot, caption: "Spacing Checker, in Figma", meta: "Sep 2025", href: "#/moment/spacing-checker" },
      { src: firstPrShot, caption: "My first pull request", meta: "Feb 2026", href: "#/moment/first-pull-request" },
      { src: workshopShot, caption: "Running an AI design workshop", meta: "Apr 2026", href: "#/moment/ai-design-workshop" },
    ],
  },
  {
    id: "how-i-work",
    label: "How I work",
    x: 2520,
    y: 0,
    kind: "stickies",
    cols: 2,
    notes: principles.map((p, i) => ({
      tone: ["coral", "yellow", "sage", "yellow"][i % 4],
      text: p.title,
      body: p.body,
      meta: `From ${p.from}`,
      wide: true,
    })),
  },
  {
    id: "off-the-clock",
    label: "Off the clock",
    x: 2520,
    y: 560,
    kind: "stickies",
    cols: 2,
    notes: offClock.map((h, i) => ({
      tone: i ? "sage" : "coral",
      text: h.title,
      body: h.body,
      sketch: h.sketch,
      wide: true,
    })),
  },
  {
    id: "edge",
    label: "The edge",
    x: 3120,
    y: 300,
    kind: "stickies",
    cols: 1,
    comment: "This board went through three redesigns before it settled into a card sort.",
    notes: [{ tone: "yellow", text: "You found the edge of the board. Thanks for exploring!", meta: "Chiranjeeb" }],
  },
  {
    id: "design-school",
    label: "Design school days",
    x: 1700,
    y: 860,
    kind: "mixed",
    cols: 3,
    comment: "Industrial, communication, interaction: design school is where I tried it all.",
    items: [
      { type: "photo", src: schoolWorkshopSaw, caption: "In the wood workshop", meta: "M.Des" },
      { type: "photo", src: schoolWoodForms, caption: "Forms from the wood workshop", meta: "Industrial" },
      { type: "photo", src: schoolProjectWall, caption: "Project wall, from ideation to a working device", meta: "Product" },
      { type: "photo", src: schoolAffinityMap, caption: "Affinity mapping on a classroom table", meta: "Research" },
      { type: "photo", src: schoolIconTest, caption: "Testing icon recognition with paper cut-outs", meta: "Interaction" },
      { type: "photo", src: schoolVideoEdit, caption: "Editing a comic-style video, research wall behind", meta: "Communication" },
      { type: "sticky", tone: "yellow", text: "M.Des, IIIT Jabalpur", meta: "Design school" },
      { type: "sticky", tone: "sage", text: "Industrial, then communication, then interaction design" },
      { type: "sticky", tone: "coral", text: "Learned by making: wood, paper, circuits and video" },
    ],
  },
  {
    id: "ux-india",
    label: "UX India 2019",
    x: 2520,
    y: 960,
    kind: "mixed",
    cols: 3,
    items: [
      { type: "photo", wide: true, src: uxIndiaTeam, caption: "Team Friction at UX India 2019", meta: "#uxi19" },
      {
        type: "photo",
        wide: true,
        src: uxIndiaFinalists,
        caption: "Named in the Design X Social finalists",
        meta: "Top 5",
        mark: { kind: "circle", x: 56.5, y: 37.5, w: 14, h: 8.5, label: "That's me" },
      },
      {
        type: "photo",
        src: uxIndiaDetail,
        caption: "Detail: Team Friction",
        meta: "Zoomed in",
        detail: true,
        mark: { kind: "marker", x: 6, y: 33, w: 62, h: 14 },
      },
      { type: "sticky", tone: "coral", text: "Top 5 finalists at Design X Social, UX India 2019", meta: "2019" },
      { type: "sticky", tone: "yellow", text: "Team Friction: Arif, Tushar, Abhishek, Gaurav and me" },
      { type: "sticky", tone: "sage", text: "Five of us on the #uxi19 stage, certificate in hand" },
    ],
  },
];
