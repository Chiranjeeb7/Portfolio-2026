// Detail pages for the three teal milestones in the hero's Key Moments grid.
// Each `slug` matches the `slug` on its event in data/activity.js, which is
// what makes the teal cell link here (route: #/moment/<slug>).
//
// All three stories, facts and images are the author's own, dates
// included. An image with `src: null` renders as a labelled "Photo to be added"
// slot; `fit: "contain"` shows a screenshot uncropped.
import firstPrDesktop from "../assets/photos/first-pr-auction-desktop.webp";
import firstPrGithub from "../assets/photos/first-pr-github.webp";
import firstPrMobile from "../assets/photos/first-pr-auction-mobile.webp";
import spaceCheckerClean from "../assets/photos/space-checker-clean.webp";
import spaceCheckerInFigma from "../assets/photos/space-checker-in-figma.webp";
import spaceCheckerIssues from "../assets/photos/space-checker-issues.webp";
import spaceCheckerStart from "../assets/photos/space-checker-start.webp";
import aiWorkshopDemo from "../assets/photos/ai-workshop-demo.webp";
import aiWorkshopHelping from "../assets/photos/ai-workshop-helping.webp";
import aiWorkshopTask from "../assets/photos/ai-workshop-task.webp";
import aiWorkshopTitle from "../assets/photos/ai-workshop-title.webp";

export const milestones = [
  {
    slug: "spacing-checker",
    kind: "Figma plugin",
    title: "First Figma plugin: Spacing Checker",
    summary: "A Figma plugin, **built in a day**, that checks screens against the 4px/8px grid and suggests fixes.",
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
          "Select elements and run it. It flags **any gap or padding that isn't a multiple of 4px or 8px**.",
          "Each issue names the layer and the fix, like 10px padding that should be 8px. Click one to jump to it.",
        ],
      },
      {
        heading: "How it came together",
        body: [
          "After a workshop on Figma plugins, I **built my own with Cursor in a day** for Delhivery's design team.",
        ],
      },
      {
        heading: "Why it mattered",
        body: [
          "My first time building something on my own, and **the team actually used it**.",
        ],
      },
      {
        heading: "More plugins since",
        body: [
          "Since then: Data Genie, Audit, Square and Custom Shapes.",
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
    summary: "Engineering had no bandwidth to make auction screens work on mobile, so **I made them responsive myself**.",
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
          "Transporters bid through a desktop web portal. There was no app yet, and **not every transporter has a desktop**.",
          "Tech had no bandwidth, so instead of waiting in the queue, I made the changes myself.",
        ],
      },
      {
        heading: "How I built it",
        body: [
          "Each wide table row **became a card** on phones: ID and status on top, details as rows, actions at the bottom.",
        ],
        steps: [
          "Cloned the repo and ran the frontend locally",
          "Designed a few mobile cards in Figma",
          "Brought them into code with the Figma MCP",
          "Built the rest in Cursor, prompt by prompt",
          "Raised the pull request",
        ],
      },
      {
        heading: "Why it mattered",
        body: [
          "My first change shipped with **no dependency on tech**: designed, built and raised by me.",
          "Desktop-only to phone-ready in 3 days.",
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
    summary: "A hands-on session at our design offsite on **turning Figma mocks into working code**.",
    date: "April 2026",
    timeLabel: "Duration",
    time: "A few hours",
    place: "Delhivery design offsite",
    cover: { src: aiWorkshopTitle, alt: "Opening the Designing with AI session" },
    sections: [
      {
        heading: "The setting",
        body: [
          "Delhivery's designers from Bengaluru and Gurugram, together at our offsite.",
          "I led it as **the first on the team to adopt this process**.",
        ],
      },
      {
        heading: "What I covered",
        body: [
          "Figma to code with the Figma MCP:",
        ],
        steps: [
          "The basics of the Figma MCP",
          "Nuances and best practices",
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
