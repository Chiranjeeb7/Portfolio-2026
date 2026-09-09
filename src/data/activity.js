// Placeholder activity data for the 2025–2026 activity grid. The user will
// supply real dated events later; until then this fills the grid densely
// with generic, non-specific category placeholders (never fabricated
// claims) so the layout can be reviewed at full density.
//
// Grid shape: 24 columns (one per month, Jan 2025 – Dec 2026) x 7 rows
// (roughly one per week) = 168 cells.

export const YEARS = [2025, 2026];
export const MONTHS_PER_YEAR = 12;
export const ROWS_PER_MONTH = 7;
export const TOTAL_COLUMNS = YEARS.length * MONTHS_PER_YEAR;

// "weight" skews the mix toward two common categories with two rarer accent
// categories popping through — same texture as a real contribution graph,
// where a couple of activity types dominate and the rest are occasional.
export const activityCategories = [
  { kind: "design", label: "Design milestone", weight: 5 },
  { kind: "research", label: "Research & prototyping", weight: 5 },
  { kind: "ship", label: "Shipped update", weight: 2 },
  { kind: "write", label: "Wrote something", weight: 2 },
];

const TOTAL_WEIGHT = activityCategories.reduce((sum, c) => sum + c.weight, 0);

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic PRNG (mulberry32) so the placeholder grid is stable across
// reloads instead of reshuffling on every render.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickCategory(rand) {
  let roll = rand() * TOTAL_WEIGHT;
  for (const category of activityCategories) {
    roll -= category.weight;
    if (roll <= 0) return category;
  }
  return activityCategories[activityCategories.length - 1];
}

const FILL_RATE = 0.97; // near-full — a real contribution graph has very few true gaps
const SEED = 20250101;

export function buildColumns() {
  const rand = mulberry32(SEED);
  const columns = [];
  let col = 0;
  for (const year of YEARS) {
    for (let m = 0; m < MONTHS_PER_YEAR; m++) {
      const cells = [];
      for (let r = 0; r < ROWS_PER_MONTH; r++) {
        const roll = rand();
        if (roll > FILL_RATE) {
          cells.push(null);
        } else {
          const category = pickCategory(rand);
          // 1–3 intensity level, purely visual (opacity), like a real
          // contribution graph's light/medium/heavy shading within one hue.
          const level = 1 + Math.floor(rand() * 3);
          cells.push({ ...category, level });
        }
      }
      columns.push({
        col,
        year,
        month: m,
        monthLabel: MONTH_NAMES[m],
        isYearStart: m === 0,
        cells,
      });
      col++;
    }
  }
  return columns;
}
