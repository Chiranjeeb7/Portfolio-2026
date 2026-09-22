import plannerThumbnail from "../assets/photos/planner-thumbnail.webp";
import transporterThumbnail from "../assets/photos/transporter-thumbnail.webp";
import mapPracticeThumbnail from "../assets/photos/map-practice-thumbnail.webp";
import plannerPlan from "../assets/photos/planner-plan.webp";
import plannerOrders from "../assets/photos/planner-orders.webp";
import plannerLoadDetail from "../assets/photos/planner-load-detail.webp";
import mapPracticeQuestion from "../assets/photos/map-practice-question-app.webp";
import transporterHome from "../assets/photos/transporter-new-home.webp";
import transporterSpotList from "../assets/photos/transporter-new-spot-list.webp";
import transporterAuctionRoom from "../assets/photos/transporter-new-auction-room.webp";
import transporterAcceptTerms from "../assets/photos/transporter-new-accept-terms.webp";

// Shared by the homepage Work cards and each case study's "More work" row.
export const THUMBNAILS = {
  planner: plannerThumbnail,
  "transporter-mobile-app": transporterThumbnail,
  "map-practice": mapPracticeThumbnail,
};

// Thumbnails that already fill their own frame (own background) render full-bleed
// instead of floating over the accent gradient like a bare screenshot does.
export const COVER_THUMBNAILS = new Set(["transporter-mobile-app"]);

// Projects whose homepage card shows real product screens that cycle on
// hover instead of a single thumbnail. Desktop/tablet screens pile up
// (ScreenStack; first screen on top, all sharing one aspect ratio); phone
// screens stand in a row (`phones: true` → PhoneCarousel; first screen is the
// hero, second its right neighbour, last its left). `tone` picks the stage
// colour, matched to each product's own palette.
export const SCREEN_STACKS = {
  planner: { screens: [plannerPlan, plannerOrders, plannerLoadDetail], aspect: "1152 / 648", tone: "periwinkle" },
  "transporter-mobile-app": {
    phones: true,
    // Opens on the live auction room, the heart of the redesign; the row still
    // runs in journey order (spot list → auction → terms → home).
    screens: [transporterAuctionRoom, transporterAcceptTerms, transporterHome, transporterSpotList],
    tone: "sand",
  },
  "map-practice": { screens: [mapPracticeThumbnail, mapPracticeQuestion], aspect: "16 / 10", tone: "lavender" },
};
