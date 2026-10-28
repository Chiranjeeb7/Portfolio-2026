// Unlisted interview decks, shown on the private /presentations page.
// Add a deck here (plus its route in routes.jsx and App.jsx) to list it.
import truckPoster from "../assets/photos/3d-truck-poster.webp";
import aiPoster from "../assets/photos/ai-ingestion-list.webp";

export const decks = [
  {
    slug: "ai-deck",
    title: "From error files to an agent that asks",
    tag: "Agentic AI · Delhivery TMS",
    summary:
      "Order upload redesigned around a data ingestion agent that reads any source, asks people when it's unsure and opens a spreadsheet editor when there's a lot to fix.",
    chapters: ["The old way", "The shift", "The experience", "Demo", "What changed", "Learnings"],
    thumb: aiPoster,
  },
  {
    slug: "planner-deck",
    title: "How we got planners to trust the algorithm",
    tag: "B2B SaaS · Delhivery TMS",
    summary:
      "The planner revamp: auto-plan acceptance from 18% to 72% once the interface showed why a plan was good.",
    chapters: ["The setting", "What went wrong", "Listening", "Framing", "Exploring", "The fixes", "Impact", "Learnings"],
    thumb: truckPoster,
  },
];
