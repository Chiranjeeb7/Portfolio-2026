import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ToolsStrip from "./components/ToolsStrip";
import Work from "./components/Work";
import CanvasAbout from "./components/CanvasAbout";
import ErrorBoundary from "./components/ErrorBoundary";
import Writing from "./components/Writing";
import Footer from "./components/Footer";
import SmoothScroll from "./components/motion/SmoothScroll";
import { scrollToTarget, setScrollLocked } from "./components/motion/scroll";
import Preloader from "./components/intro/Preloader";
import { clearSectionAnchor, IntroContext, shouldPlayIntro } from "./components/intro/introState";
import ScrollProgress from "./components/motion/ScrollProgress";
import {
  MapPracticeCaseStudy,
  MilestonePage,
  PlannerCaseStudy,
  preloadAllPages,
  TransporterCaseStudy,
} from "./routes";
import { milestoneBySlug } from "./data/milestones";
import { useHashRoute } from "./hooks/useHashRoute";
import { useReveal } from "./hooks/useReveal";
import { profile } from "./data/content";

const CASE_STUDIES = {
  planner: { Page: PlannerCaseStudy, title: "Planner" },
  "map-practice": { Page: MapPracticeCaseStudy, title: "Map Practice" },
  transporter: { Page: TransporterCaseStudy, title: "Transporter auctions" },
};

const HOME_TITLE = `${profile.name}: ${profile.role}`;

function App() {
  const route = useHashRoute();

  // Intro loader (every homepage load or refresh). "running" hides
  // the timeline cells and holds the hero entrance until the pixels land.
  const [introPlayed] = useState(() => {
    const play = shouldPlayIntro();
    if (play) clearSectionAnchor();
    return play;
  });
  const [introRunning, setIntroRunning] = useState(introPlayed);
  // The hero copy may start rising as soon as the page begins fading in
  // around the finished timeline, overlapping the loader's last beat.
  const [introRevealing, setIntroRevealing] = useState(false);
  const intro = useMemo(
    () => ({ ready: !introRunning || introRevealing, played: introPlayed }),
    [introRunning, introRevealing, introPlayed]
  );
  useLayoutEffect(() => {
    // "played" (vs "done") tells CSS the loader placed the timeline cells,
    // so they skip their own pop-in entrance.
    document.documentElement.dataset.intro = introRunning ? "running" : introPlayed ? "played" : "done";
    setScrollLocked(introRunning);
  }, [introRunning, introPlayed]);
  // "#/moment/<slug>" routes to a milestone page; any other "#/<id>" to a
  // case study. Unknown ids fall through to the homepage.
  const milestone = route?.startsWith("moment/") ? milestoneBySlug[route.slice(7)] : null;
  const caseStudy = milestone ? null : CASE_STUDIES[route];
  const pageTitle = milestone
    ? `${milestone.title}: ${profile.name}`
    : caseStudy
      ? `${caseStudy.title} case study: ${profile.name}`
      : HOME_TITLE;
  const isHome = !milestone && !caseStudy;

  // Runs after the new route has rendered, so the target exists. A case
  // study always opens at its top; the homepage honours a section anchor
  // ("#work" from a case study's back link) or otherwise starts at the top.
  useLayoutEffect(() => {
    document.title = pageTitle;
    const anchor = isHome && window.location.hash.match(/^#([\w-]+)$/)?.[1];
    const target = anchor && document.getElementById(anchor);
    scrollToTarget(target || 0, { immediate: true });
  }, [route, pageTitle, isHome]);

  useReveal([route]);

  // Once the homepage (and its intro) has settled, fetch the other pages in
  // the background so opening one is instant.
  useEffect(() => {
    if (!isHome || introRunning) return;
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(preloadAllPages, { timeout: 4000 });
    return () => cancel(id);
  }, [isHome, introRunning]);

  const skipLink = (
    <a className="skip-link" href="#main" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("main")?.focus();
    }}>
      Skip to content
    </a>
  );

  const chrome = (
    <>
      <SmoothScroll />
      {skipLink}
    </>
  );

  if (milestone) {
    return (
      <>
        {chrome}
        <Suspense fallback={null}>
          <MilestonePage key={milestone.slug} slug={milestone.slug} />
        </Suspense>
      </>
    );
  }

  if (caseStudy) {
    const { Page } = caseStudy;
    return (
      <>
        {chrome}
        <Suspense fallback={null}>
          <Page />
        </Suspense>
      </>
    );
  }

  return (
    <IntroContext.Provider value={intro}>
      {chrome}
      {introRunning && (
        // A crash in the loader must never blank the site or leave scroll
        // locked: it just steps aside and the page shows as if it had ended.
        <ErrorBoundary silent onError={() => setIntroRunning(false)}>
          <Preloader onDone={() => setIntroRunning(false)} onReveal={() => setIntroRevealing(true)} />
        </ErrorBoundary>
      )}
      {/* Case study and milestone headers carry their own progress bar. */}
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <ToolsStrip />
        <Work />
        <ErrorBoundary message="The About board hit a snag.">
          <CanvasAbout />
        </ErrorBoundary>
        <Writing />
      </main>
      <Footer />
    </IntroContext.Provider>
  );
}

export default App;
