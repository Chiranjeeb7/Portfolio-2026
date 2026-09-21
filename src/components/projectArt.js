import plannerThumbnail from "../assets/photos/planner-thumbnail.webp";
import transporterThumbnail from "../assets/photos/transporter-thumbnail.webp";
import mapPracticeThumbnail from "../assets/photos/map-practice-thumbnail.webp";

// Shared by the homepage Work cards and each case study's "More work" row.
export const THUMBNAILS = {
  planner: plannerThumbnail,
  "transporter-mobile-app": transporterThumbnail,
  "map-practice": mapPracticeThumbnail,
};

// Thumbnails that already fill their own frame (own background) render full-bleed
// instead of floating over the accent gradient like a bare screenshot does.
export const COVER_THUMBNAILS = new Set(["transporter-mobile-app"]);
