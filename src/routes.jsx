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

const PAGES = {
  planner: PlannerCaseStudy,
  "map-practice": MapPracticeCaseStudy,
  transporter: TransporterCaseStudy,
};

// Resolves once the page for a route (as returned by useHashRoute) is ready
// to render synchronously. The homepage and unknown routes resolve at once.
export function preloadRoute(route) {
  const page = route?.startsWith("moment/") ? MilestonePage : PAGES[route];
  return page ? page.preload().catch(() => {}) : Promise.resolve();
}

// Warms every page chunk once the homepage has settled, so a click on a case
// study rarely has to wait on the network at all.
export function preloadAllPages() {
  [PlannerCaseStudy, MapPracticeCaseStudy, TransporterCaseStudy, MilestonePage].forEach((p) =>
    p.preload().catch(() => {}),
  );
}
