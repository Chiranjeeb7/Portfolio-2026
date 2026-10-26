import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { boardZones } from "../../data/board";
import StorySketch from "../story/Sketches";
import styles from "./BoardExtras.module.css";

const TILTS = ["tiltA", "tiltB", "tiltC", "tiltD"];

// A FigJam-style comment: an avatar pin that opens a speech bubble on hover,
// focus or tap. It's a button, so the board's pan handler leaves it alone.
function CommentPin({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.commentWrap}>
      <button
        type="button"
        className={styles.pin}
        aria-expanded={open}
        aria-label="Comment from Chiranjeeb"
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        CD
      </button>
      <div className={`${styles.bubble} ${open ? styles.bubbleOpen : ""}`} role="note">
        <span className={styles.bubbleName}>Chiranjeeb</span>
        {text}
      </div>
    </div>
  );
}

function Sticky({ note }) {
  return (
    <>
      {note.sketch && <StorySketch name={note.sketch} className={styles.stickySketch} />}
      <span className={styles.stickyText}>{note.text}</span>
      {note.body && <span className={styles.stickyBody}>{note.body}</span>}
      {note.meta && <span className={styles.stickyMeta}>{note.meta}</span>}
    </>
  );
}

// A hand-drawn coral ring, or a highlighter stroke, over part of a photo
// (e.g. a name on a slide). Placed in % of the image, so it stays on target
// at any size.
function Mark({ mark }) {
  const box = { left: `${mark.x}%`, top: `${mark.y}%`, width: `${mark.w}%`, height: `${mark.h}%` };
  if (mark.kind === "marker") return <span className={styles.marker} style={box} aria-hidden="true" />;
  return (
    <span className={styles.ring} style={box} aria-hidden="true">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none">
        <path d="M8 26 C6 10 40 3 62 5 C88 7 98 17 95 29 C92 42 60 48 38 46 C16 44 4 36 10 20 C13 13 22 9 30 8" />
      </svg>
      {mark.label && <span className={styles.ringLabel}>{mark.label}</span>}
    </span>
  );
}

function Photo({ photo }) {
  return (
    <>
      <span className={styles.tape} aria-hidden="true" />
      <span className={styles.photoFrame}>
        <img src={photo.src} alt={photo.caption} draggable="false" loading="lazy" />
        {photo.mark && <Mark mark={photo.mark} />}
      </span>
      <span className={styles.photoCaption}>{photo.caption}</span>
      <span className={styles.photoFoot}>
        <span>{photo.meta}</span>
        {photo.href && (
          // Stops the card's drag from capturing the pointer, which would
          // retarget the click away from this link.
          <a href={photo.href} className={styles.photoLink} onPointerDown={(e) => e.stopPropagation()}>
            Open <ArrowUpRight size={12} />
          </a>
        )}
      </span>
    </>
  );
}

const photoClass = (photo, i) =>
  `${styles.item} ${styles.polaroid} ${photo.wide ? styles.polaroidWide : ""} ${
    photo.detail ? styles.polaroidDetail : ""
  } ${styles[TILTS[i % 4]]}`;

const stickyClass = (note, i, zoneId) =>
  `${styles.item} ${styles.sticky} ${styles[note.tone]} ${note.wide ? styles.stickyWide : ""} ${
    styles[TILTS[(i + zoneId.length) % 4]]
  }`;

// The off-screen areas of the About board: side projects, moments, how I
// work, off the clock, design school, UX India, and a note at the far edge. Positioned absolutely in
// board space around the core card sort, so they never change its measured
// size (which is what the default view and "reset board" fit to). `card` is
// the board's own wrapper, so these select, drag and reset like every other
// card. Each zone carries `data-zone` so the board can measure the whole
// world for panning limits and the map. `shown` fades them in with the
// rest of the board.
export default function BoardExtras({ card, shown }) {
  return boardZones.map((zone) => (
    <section
      key={zone.id}
      data-zone={zone.id}
      className={`${styles.zone} ${shown ? styles.zoneIn : ""}`}
      style={{ left: zone.x, top: zone.y }}
      aria-label={zone.label}
    >
      <span className={styles.zoneLabel}>{zone.label}</span>

      <div className={styles.items} style={{ "--cols": zone.cols }}>
        {zone.kind === "mixed"
          ? zone.items.map((item, i) =>
              item.type === "photo"
                ? card(`${zone.id}-${i}`, photoClass(item, i), <Photo photo={item} />)
                : card(`${zone.id}-${i}`, stickyClass(item, i, zone.id), <Sticky note={item} />)
            )
          : zone.kind === "photos"
            ? zone.photos.map((photo, i) => card(`${zone.id}-${i}`, photoClass(photo, i), <Photo photo={photo} />))
            : zone.notes.map((note, i) => card(`${zone.id}-${i}`, stickyClass(note, i, zone.id), <Sticky note={note} />))}
      </div>

      {zone.stamp && (
        <span className={styles.stamp} aria-hidden="true">
          {zone.stamp}
        </span>
      )}
      {zone.comment && <CommentPin text={zone.comment} />}
    </section>
  ));
}
