// A route table, not a component module: fast refresh never needs to keep
// its state, so mixing components and helpers here is fine.
/* oxlint-disable react/only-export-components */
import { lazy } from "react";

// Case studies and milestone pages ship as their own chunks, so the
// homepage's first load carries only the homepage. Each page renders
// synchronously once its chunk has arrived (not just via React.lazy, which
// suspends for a tick even on a cached module): the route change runs inside
// a view transition that snapshots the new page immediately, and a Suspense
// fallback there would be captured as a blank frame.
function lazyPage(loader) {
  let Loaded = null;
  let pending = null;
  // A failed fetch (flaky network, or a deploy that replaced the chunk)
  // clears the cache, so the next attempt retries instead of failing forever.
  const preload = () =>
    (pending ??= loader().then(
      (m) => {
        Loaded = m.default;
      },
      (err) => {
        pending = null;
        throw err;
      },
    ));
  const Suspending = lazy(() => preload().then(() => ({ default: Loaded })));
  function Page(props) {
    return Loaded ? <Loaded {...props} /> : <Suspending {...props} />;
  }
  Page.preload = preload;
  return Page;
}

export const PlannerCaseStudy = lazyPage(() => import("./pages/PlannerCaseStudy"));
export const MapPracticeCaseStudy = lazyPage(() => import("./pages/MapPracticeCaseStudy"));
export const TransporterCaseStudy = lazyPage(() => import("./pages/TransporterCaseStudy"));
export const MilestonePage = lazyPage(() => import("./pages/MilestonePage"));
export const StoryPage = lazyPage(() => import("./pages/StoryPage"));
// Interview decks: unlisted, so they are left out of preloadAllPages below
// and only fetched when someone opens "#/planner-deck" or "#/ai-deck" directly.
export const PlannerDeck = lazyPage(() => import("./pages/PlannerDeck"));
export const AiDeck = lazyPage(() => import("./pages/AiDeck"));
const DECK_PAGES = { "planner-deck": PlannerDeck, "ai-deck": AiDeck };
// Private index of the decks (/presentations). Unlisted like them, so it is
// not preloaded either.
export const PresentationsPage = lazyPage(() => import("./pages/PresentationsPage"));

const PAGES = {
  planner: PlannerCaseStudy,
  "map-practice": MapPracticeCaseStudy,
  transporter: TransporterCaseStudy,
  story: StoryPage,
  presentations: PresentationsPage,
};

// "#/<deck>" and "#/<deck>/<slide>" both open a deck. Returns the deck slug.
export const deckOf = (route) => {
  const slug = route?.split("/")[0];
  return slug && DECK_PAGES[slug] ? slug : null;
};

// Resolves once the page for a route (as returned by useHashRoute) is ready
// to render synchronously. The homepage and unknown routes resolve at once.
export function preloadRoute(route) {
  const page = route?.startsWith("moment/")
    ? MilestonePage
    : deckOf(route)
      ? DECK_PAGES[deckOf(route)]
      : PAGES[route];
  return page ? page.preload().catch(() => {}) : Promise.resolve();
}

// Warms every page chunk once the homepage has settled, so a click on a case
// study rarely has to wait on the network at all.
export function preloadAllPages() {
  [PlannerCaseStudy, MapPracticeCaseStudy, TransporterCaseStudy, MilestonePage, StoryPage].forEach((p) =>
    p.preload().catch(() => {}),
  );
}
