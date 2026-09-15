import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ToolsStrip from "./components/ToolsStrip";
import Work from "./components/Work";
import CanvasAbout from "./components/CanvasAbout";
import ErrorBoundary from "./components/ErrorBoundary";
import Writing from "./components/Writing";
import Footer from "./components/Footer";
import PlannerCaseStudy from "./pages/PlannerCaseStudy";
import MapPracticeCaseStudy from "./pages/MapPracticeCaseStudy";
import TransporterCaseStudy from "./pages/TransporterCaseStudy";
import { useHashRoute } from "./hooks/useHashRoute";

function App() {
  const route = useHashRoute();

  if (route === "planner") {
    return <PlannerCaseStudy />;
  }

  if (route === "map-practice") {
    return <MapPracticeCaseStudy />;
  }

  if (route === "transporter") {
    return <TransporterCaseStudy />;
  }

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ToolsStrip />
        <Work />
        <ErrorBoundary message="The About board hit a snag.">
          <CanvasAbout />
        </ErrorBoundary>
        <Writing />
      </main>
      <Footer />
    </>
  );
}

export default App;
