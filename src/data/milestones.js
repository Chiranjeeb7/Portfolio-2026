// Detail pages for the three gold milestones in the hero's Key Moments grid.
// Each `slug` matches the `slug` on its event in data/activity.js, which is
// what makes the gold cell link here (route: #/moment/<slug>).
//
// All three stories, facts and images are the author's own, dates
// included. An image with `src: null` renders as a labelled "Photo to be added"
// slot; `fit: "contain"` shows a screenshot uncropped.
import firstPrDesktop from "../assets/photos/first-pr-auction-desktop.webp";
import firstPrGithub from "../assets/photos/first-pr-github.png";
import firstPrMobile from "../assets/photos/first-pr-auction-mobile.png";
import spaceCheckerClean from "../assets/photos/space-checker-clean.png";
import spaceCheckerInFigma from "../assets/photos/space-checker-in-figma.png";
import spaceCheckerIssues from "../assets/photos/space-checker-issues.png";
import spaceCheckerStart from "../assets/photos/space-checker-start.png";
import aiWorkshopDemo from "../assets/photos/ai-workshop-demo.webp";
import aiWorkshopHelping from "../assets/photos/ai-workshop-helping.webp";
import aiWorkshopTask from "../assets/photos/ai-workshop-task.webp";
import aiWorkshopTitle from "../assets/photos/ai-workshop-title.webp";

export const milestones = [
  {
    slug: "spacing-checker",
    kind: "Figma plugin",
    title: "First Figma plugin: Spacing Checker",
    summary: "A Figma plugin, built in a day for the Delhivery design team, that checks any screen against the 4px/8px spacing grid, flags every break, and suggests the fix.",
    date: "September 2025",
    timeLabel: "Time taken",
    time: "1 day",
    place: "Delhivery",
    // Hero shows a whole run, left to right: ready, issues found, clean.
    cover: {
      set: [
        { src: spaceCheckerStart, alt: "Ready to run: select elements and analyze" },
        { src: spaceCheckerIssues, alt: "A run that found 8 padding issues, each with a suggested fix" },
        { src: spaceCheckerClean, alt: "After fixing: no spacing issues found" },
      ],
    },
    sections: [
      {
        heading: "What it does",
        body: [
          "Select the elements to check and run it. Spacing Checker analyzes the gaps between elements and their padding, and flags anything that isn't a multiple of 4px or 8px.",
          "Each issue names the layer, the rule it breaks and the fix, like a 10px top padding that should be 8px. You can step through issues one by one or click an issue to jump to it on the canvas.",
        ],
      },
      {
        heading: "How it came together",
        body: [
          "I attended a workshop on building Figma plugins, back when AI was just getting started. Afterwards I built my own with Cursor, in a single day, for the design team at Delhivery.",
        ],
      },
      {
        heading: "Why it mattered",
        body: [
          "It was my first taste of building something on my own, and the plugin turned out to be useful for the team.",
        ],
      },
      {
        heading: "More plugins since",
        body: [
          "Spacing Checker was the first. Since then I've built more plugins across different use cases, from Data Genie and Audit to Square and Custom Shapes.",
        ],
      },
    ],
    galleryLayout: "single",
    gallery: [
      { src: spaceCheckerInFigma, alt: "The plugins I've built, in Figma's development plugins list", fit: "contain" },
    ],
  },
  {
    slug: "first-pull-request",
    kind: "Pull request",
    title: "First pull request",
    summary: "Engineering had no bandwidth to make the transporter auction screens work on mobile, so I made them responsive myself.",
    date: "February 2026",
    // A duration rather than a clock time, so the fact is labelled to match.
    timeLabel: "Time taken",
    time: "3 days",
    place: "Delhivery",
    cover: { src: firstPrGithub, alt: "GitHub's first pull request celebration", fit: "contain" },
    sections: [
      {
        heading: "The problem",
        body: [
          "Transporters bid on spot auctions through a web portal built for desktop. We didn't have a mobile app yet, and not every transporter has a desktop to bid from.",
          "The screens needed to be mobile responsive, and the tech team didn't have the bandwidth to pick it up. So instead of waiting in the queue, I made the changes myself.",
        ],
      },
      {
        heading: "How I built it",
        body: [
          "The desktop list lays each auction out as a wide table row. On a phone that becomes a card: auction ID and status on top, then load, route, truck type and place-by time as label and value rows, with the actions pinned at the bottom.",
        ],
        steps: [
          "Set up the frontend locally and cloned the repo",
          "Designed a few of the mobile cards in Figma",
          "Used the Figma MCP to bring those designs into the codebase",
          "Built the rest in Cursor, iterating through a lot of prompts to reach the final design",
          "Raised the pull request",
        ],
      },
      {
        heading: "Why it mattered",
        body: [
          "It was the first time I shipped a change without any dependency on tech. I designed it, built it and raised the pull request myself.",
          "The auction screens went from desktop-only to usable on a phone, in 3 days, without waiting on the engineering roadmap.",
        ],
      },
    ],
    // The same screen at desktop and phone width, both shown uncropped.
    galleryLayout: "wideTall",
    gallery: [
      { src: firstPrDesktop, alt: "Desktop: the spot auction list", fit: "contain" },
      { src: firstPrMobile, alt: "Mobile: the same list as cards, the version I built", fit: "contain" },
    ],
  },
  {
    slug: "ai-design-workshop",
    kind: "Workshop",
    title: "Ran an AI design workshop",
    summary: "Designing (and building) with AI: a hands-on session on turning Figma mocks into functional code, for Delhivery's designers at our design offsite.",
    date: "April 2026",
    timeLabel: "Duration",
    time: "A few hours",
    place: "Delhivery design offsite",
    cover: { src: aiWorkshopTitle, alt: "Opening the Designing with AI session" },
    sections: [
      {
        heading: "The setting",
        body: [
          "The workshop was part of our design offsite and catch-up, where Delhivery's designers from Bengaluru and Gurugram came together in one place.",
          "I led the session because I was the first on the team to learn and adopt this process.",
        ],
      },
      {
        heading: "What I covered",
        body: [
          "How to take a design from Figma to code using the Figma MCP. The session ran like this:",
        ],
        steps: [
          "The basics: from a Figma design to code with the Figma MCP",
          "The nuances and best practices, explained along the way",
          "The whole process, step by step",
          "A hands-on task for everyone in the room",
        ],
      },
    ],
    // One large photo with two stacked beside it.
    gallery: [
      { src: aiWorkshopHelping, alt: "Working through the task with attendees" },
      { src: aiWorkshopDemo, alt: "Walking through the build, step by step" },
      { src: aiWorkshopTask, alt: "Everyone on the hands-on task" },
    ],
  },
];

export const milestoneBySlug = Object.fromEntries(milestones.map((m) => [m.slug, m]));
