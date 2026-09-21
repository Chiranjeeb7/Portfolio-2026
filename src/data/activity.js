// Real activity for the hero grid — replaces the earlier seeded placeholder
// data. Dates the user gave as "N months back" are recorded at month
// precision (plus which week of that month the cell sits in), never as an
// invented exact day, and tooltips only ever claim the month.
//
// Grid shape: a horizontal contribution grid — one square per day, running
// left to right across the window, with only the years labelled along the
// top. The days come out as one flat list and CSS decides how many rows to
// wrap them into (grid-auto-flow: column), so the block can be shorter on a
// wide screen and taller on a phone — where fewer rows would mean more
// columns and unreadably small squares — without the data changing at all.

export const WINDOW_WEEKS = 58;
export const TOTAL_DAYS = WINDOW_WEEKS * 7;

// Fixed points, exactly as briefed: the first Figma plugin, first pull
// request 7 months back, the AI workshop 5 months back, and each build and
// community event on its own stated month. The commits and pull requests
// that came with a count but no date are weighted toward recent months, so
// the field reads as someone getting busier rather than ticking along at a
// flat rate.
//
// `milestone: true` is the only thing that changes a cell's colour (gold).
export const activityEvents = [
  // — Sep 2025: where the code story starts
  { month: "2025-09", week: 1, kind: "Community", label: "EPC dinner" },
  { month: "2025-09", week: 2, kind: "Figma plugin", label: "First plugin: Spacing Checker", milestone: true, slug: "spacing-checker" },
  { month: "2025-09", week: 3, kind: "Community", label: "ServiceNow summit" },

  { month: "2025-11", week: 2, kind: "Code", label: "Commits" },

  { month: "2025-12", week: 1, kind: "Build", label: "Split-expense app for colleagues" },
  { month: "2025-12", week: 3, kind: "Build", label: "Lego block game" },

  { month: "2026-01", week: 2, kind: "Code", label: "Commits" },

  { month: "2026-02", week: 1, kind: "Pull request", label: "First pull request", milestone: true, slug: "first-pull-request" },

  { month: "2026-03", week: 1, kind: "Code", label: "Commits" },
  { month: "2026-03", week: 3, kind: "Build", label: "Education website" },

  { month: "2026-04", week: 1, kind: "Workshop", label: "Ran an AI design workshop", milestone: true, slug: "ai-design-workshop" },
  { month: "2026-04", week: 3, kind: "Pull request", label: "Pull request merged" },

  { month: "2026-05", week: 2, kind: "Code", label: "Commits" },

  // — The ramp: more shipping, more often, from here on
  { month: "2026-06", week: 0, kind: "Code", label: "Commits" },
  { month: "2026-06", week: 1, kind: "Build", label: "SaaS app" },
  { month: "2026-06", week: 3, kind: "Pull request", label: "Pull request merged" },

  { month: "2026-07", week: 0, kind: "Pull request", label: "Pull request merged" },
  { month: "2026-07", week: 1, kind: "Code", label: "Commits" },
  { month: "2026-07", week: 2, kind: "Community", label: "EPC meetup" },
  { month: "2026-07", week: 3, kind: "Code", label: "Commits" },

  { month: "2026-08", week: 0, kind: "Code", label: "Commits" },
  { month: "2026-08", week: 1, kind: "Pull request", label: "Pull request merged" },
  { month: "2026-08", week: 2, kind: "Community", label: "EPC meetup" },
  { month: "2026-08", week: 3, kind: "Code", label: "Commits" },

  { month: "2026-09", week: 0, kind: "Community", label: "EPC meetup" },
  { month: "2026-09", week: 1, kind: "Build", label: "Personal finance tracker" },
  { month: "2026-09", week: 1, kind: "Pull request", label: "Pull request merged" },
  { month: "2026-09", week: 2, kind: "Code", label: "Commits" },

  // — Design work at Delhivery. The activities come from the Planner and
  // Transporter case studies (and the animations in assets/photos), but
  // the MONTHS BELOW ARE PLACEHOLDERS spread across the window: confirm or
  // correct each one, since the case studies don't give dates.
  { month: "2025-08", week: 3, kind: "Design", label: "User interviews: 4 planners, 3 plant heads" },
  { month: "2025-09", week: 0, kind: "Design", label: "Research synthesis: why planners bypassed auto-plan" },
  { month: "2025-10", week: 1, kind: "Design", label: "Planner concepts 1-2 reviewed with planners" },
  { month: "2025-10", week: 3, kind: "Design", label: "On-field research day at a plant" },
  { month: "2025-11", week: 0, kind: "Design", label: "Planner concepts 3-5 explored" },
  { month: "2025-11", week: 3, kind: "Design", label: "Usability testing: planner concept 5" },
  { month: "2025-12", week: 2, kind: "Design", label: "Planner redesign shipped" },
  { month: "2026-01", week: 3, kind: "Design", label: "Auto-plan acceptance crossed 70%" },
  { month: "2026-02", week: 2, kind: "Design", label: "Field visits: how transporters bid over WhatsApp" },
  { month: "2026-03", week: 2, kind: "Design", label: "Auction room concepts" },
  { month: "2026-04", week: 2, kind: "Design", label: "Created a 3D truck animation" },
  { month: "2026-05", week: 0, kind: "Design", label: "Usability testing: bidding with +/- and preset chips" },
  { month: "2026-05", week: 3, kind: "Design", label: "Order-loading animation for the transporter app" },
  { month: "2026-06", week: 2, kind: "Design", label: "Auction room shipped" },
  { month: "2026-07", week: 2, kind: "Design", label: "Hit the quarter's app adoption target" },
  { month: "2026-08", week: 3, kind: "Design", label: "On-field research day with transporters" },
  { month: "2026-09", week: 2, kind: "Design", label: "Redesigned this portfolio" },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Stable small hash, so an event always lands on the same square.
function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// A day-grid needs a day, but the brief only gave months. Each event is
// placed inside the week it belongs to, deterministically, so the square
// never moves between renders — the tooltip still says only the month,
// which is all we actually know.
function placeEvent(event) {
  const [year, month] = event.month.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.min(event.week * 7 + 1 + (hash(event.label + event.month) % 5), daysInMonth);
  return new Date(year, month - 1, day);
}

export function buildGrid(now = new Date()) {
  const byDate = new Map();
  for (const event of activityEvents) {
    const key = dateKey(placeEvent(event));
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(event);
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // The window ends on the Saturday of the current week and runs back a
  // whole number of weeks, so the rows stay weekday-aligned.
  const end = addDays(today, 6 - today.getDay());
  const start = addDays(end, -(WINDOW_WEEKS * 7 - 1));

  const days = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = addDays(start, i);
    const events = byDate.get(dateKey(date)) ?? [];
    days.push({
      key: dateKey(date),
      index: i,
      monthLabel: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear(),
      events,
      milestone: events.some((e) => e.milestone),
      isFuture: date.getTime() > today.getTime(),
    });
  }

  // Only the years are labelled. Position is a fraction of the way along the
  // row rather than a column index, since the column count now depends on
  // however many rows CSS is wrapping into at this width.
  const yearLabels = [];
  let previousYear = null;
  for (const day of days) {
    if (day.year !== previousYear) {
      yearLabels.push({ year: day.year, at: day.index / TOTAL_DAYS });
      previousYear = day.year;
    }
  }

  return { days, yearLabels, from: days[0], to: days[TOTAL_DAYS - 1] };
}

export const totalEvents = activityEvents.length;
