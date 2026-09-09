import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BookOpen, GraduationCap, Maximize2, Move, Users, ZoomIn, ZoomOut } from "lucide-react";
import byjusIcon from "../assets/logos/byjus-icon.svg";
import delhiveryIcon from "../assets/logos/delhivery-icon-onlight.png";
import omnirioLogo from "../assets/logos/omnirio-logo.png";
import communityPhoto from "../assets/photos/community-extended-pack.jpg";
import profilePhoto from "../assets/photos/profile.png";
import workshopPhoto from "../assets/photos/workshop-ai-design.jpg";
import { bio, community, education, research, skills, teaching, workExperience, writingNote } from "../data/content";
import styles from "./CanvasAbout.module.css";

// Icon-only marks (as opposed to CompanyLogo's wordmarks used elsewhere) for
// the compact Experience & Education timeline — same "badge on a white chip"
// treatment as the existing Omnirio icon, now applied consistently to all
// three so the row reads as one system instead of two mismatched styles.
const WORK_ICONS = {
  current: { src: delhiveryIcon, alt: "Delhivery" },
  previous: { src: byjusIcon, alt: "BYJU'S" },
  omnirio: { src: omnirioLogo, alt: "Omnirio" },
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.6;
const ZOOM_SPEED = 0.0016;
const ZOOM_STEP = 1.25;
const PAN_SLACK = 120;
const ZERO_OFFSET = { x: 0, y: 0 };

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// A single object on the board: selectable (click, shift-click to add to
// selection), draggable (click + drag, scaled by the canvas's current zoom
// so it tracks the cursor 1:1), and resettable (double-click drops it back
// to its sorted position). Selection renders a Figma-style accent outline
// with four corner handles — decorative (there's no resize here), but the
// same instantly-recognizable "this is selected" language.
function DraggableCard({ id, className, children, selected, offset, zoomRef, onSelect, onMove, onReset }) {
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e) => {
    e.stopPropagation();
    onSelect(id, e.shiftKey);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* invalid/inactive pointer id — capture is a nicety, not required */
    }
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const z = zoomRef.current || 1;
    const dx = (e.clientX - drag.startX) / z;
    const dy = (e.clientY - drag.startY) / z;
    onMove(id, { x: drag.startOffset.x + dx, y: drag.startOffset.y + dy });
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const onDoubleClick = (e) => {
    e.stopPropagation();
    onReset(id);
  };

  return (
    <div
      className={`${className} ${selected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        zIndex: isDragging ? 10 : selected ? 5 : "auto",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {children}
      {selected && (
        <>
          <span className={`${styles.handle} ${styles.handleTL}`} />
          <span className={`${styles.handle} ${styles.handleTR}`} />
          <span className={`${styles.handle} ${styles.handleBL}`} />
          <span className={`${styles.handle} ${styles.handleBR}`} />
        </>
      )}
    </div>
  );
}

function Frame({ label, children }) {
  return (
    <div className={styles.frame}>
      <span className={styles.frameLabel}>{label}</span>
      {children}
    </div>
  );
}

export default function CanvasAbout() {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const zoomRef = useRef(1);
  const viewRef = useRef({ zoom: 1, pan: { x: 0, y: 0 } });
  const [view, setView] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const [isPanning, setIsPanning] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [offsets, setOffsets] = useState({});
  const contentSize = useRef({ w: 1560, h: 900 });
  const pointers = useRef(new Map());
  const panState = useRef(null);
  const pinchState = useRef(null);
  zoomRef.current = view.zoom;
  viewRef.current = view;

  // Wheel and pointermove can fire far more often than the screen repaints
  // (a fast trackpad flick or a high-poll-rate mouse can outpace 60fps by a
  // lot). Committing a fresh setState on every single one of those events
  // means a full re-render of the whole board per event — under sustained
  // interaction that piles up fast enough to make the tab stutter or hang.
  // These two refs coalesce any number of updates within one frame into a
  // single commit, so render count is capped at the display's refresh
  // rate no matter how fast the raw events arrive; the math itself still
  // runs on every raw event (chained off the latest *pending* value, not
  // stale state), so nothing feels less responsive.
  const pendingView = useRef(null);
  const viewRafId = useRef(null);
  const pendingOffsets = useRef(null);
  const offsetsRafId = useRef(null);

  const commitView = useCallback((updater) => {
    const base = pendingView.current ?? viewRef.current;
    const next = typeof updater === "function" ? updater(base) : updater;
    pendingView.current = next;
    if (viewRafId.current == null) {
      viewRafId.current = requestAnimationFrame(() => {
        viewRafId.current = null;
        setView(pendingView.current);
        pendingView.current = null;
      });
    }
  }, []);

  const flushView = useCallback((next) => {
    if (viewRafId.current != null) {
      cancelAnimationFrame(viewRafId.current);
      viewRafId.current = null;
    }
    pendingView.current = null;
    setView(next);
  }, []);

  useEffect(
    () => () => {
      if (viewRafId.current != null) cancelAnimationFrame(viewRafId.current);
      if (offsetsRafId.current != null) cancelAnimationFrame(offsetsRafId.current);
    },
    []
  );

  const offsetsRef = useRef(offsets);
  offsetsRef.current = offsets;

  const getOffset = useCallback((id) => offsets[id] || ZERO_OFFSET, [offsets]);

  const moveCard = useCallback((id, pos) => {
    const base = pendingOffsets.current ?? offsetsRef.current;
    const next = { ...base, [id]: pos };
    pendingOffsets.current = next;
    if (offsetsRafId.current == null) {
      offsetsRafId.current = requestAnimationFrame(() => {
        offsetsRafId.current = null;
        setOffsets(pendingOffsets.current);
        pendingOffsets.current = null;
      });
    }
  }, []);

  const flushOffsets = useCallback((next) => {
    if (offsetsRafId.current != null) {
      cancelAnimationFrame(offsetsRafId.current);
      offsetsRafId.current = null;
    }
    pendingOffsets.current = null;
    setOffsets(next);
  }, []);

  const resetCard = useCallback(
    (id) => {
      const base = pendingOffsets.current ?? offsetsRef.current;
      if (!(id in base)) return;
      const next = { ...base };
      delete next[id];
      flushOffsets(next);
    },
    [flushOffsets]
  );

  const selectCard = useCallback((id, additive) => {
    setSelectedIds((prev) => {
      if (additive) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }
      return new Set([id]);
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearSelection]);

  const clampPanFor = useCallback((p, z, size) => {
    const vp = viewportRef.current;
    if (!vp) return p;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const scaledW = size.w * z;
    const scaledH = size.h * z;
    const minX = scaledW <= vw ? -PAN_SLACK : vw - scaledW - PAN_SLACK;
    const maxX = scaledW <= vw ? vw - scaledW + PAN_SLACK : PAN_SLACK;
    const minY = scaledH <= vh ? -PAN_SLACK : vh - scaledH - PAN_SLACK;
    const maxY = scaledH <= vh ? vh - scaledH + PAN_SLACK : PAN_SLACK;
    return { x: clamp(p.x, minX, maxX), y: clamp(p.y, minY, maxY) };
  }, []);

  const resetBoard = useCallback(() => {
    const vp = viewportRef.current;
    const content = contentRef.current;
    if (!vp || !content) return;
    const w = content.offsetWidth;
    const h = content.offsetHeight;
    contentSize.current = { w, h };
    const vw = vp.clientWidth;
    const scaledFit = (vw - 64) / w;
    const z = clamp(Math.min(scaledFit, 1), MIN_ZOOM, MAX_ZOOM);
    const scaledW = w * z;
    const px = scaledW <= vw ? (vw - scaledW) / 2 : 32;
    flushView({ zoom: z, pan: clampPanFor({ x: px, y: 32 }, z, { w, h }) });
    flushOffsets({});
    clearSelection();
  }, [clampPanFor, clearSelection, flushView, flushOffsets]);

  useLayoutEffect(() => {
    resetBoard();
    window.addEventListener("resize", resetBoard);
    return () => window.removeEventListener("resize", resetBoard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Button-driven zoom, for visitors without a wheel/trackpad (or who'd
  // rather click than scroll). Same anchor-under-a-point math as the wheel
  // handler below, just anchored at the viewport's center instead of the
  // cursor.
  const zoomBy = useCallback(
    (factor) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const cx = vp.clientWidth / 2;
      const cy = vp.clientHeight / 2;
      const prev = pendingView.current ?? viewRef.current;
      const newZoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const contentX = (cx - prev.pan.x) / prev.zoom;
      const contentY = (cy - prev.pan.y) / prev.zoom;
      const newPan = clampPanFor(
        { x: cx - contentX * newZoom, y: cy - contentY * newZoom },
        newZoom,
        contentSize.current
      );
      flushView({ zoom: newZoom, pan: newPan });
    },
    [clampPanFor, flushView]
  );

  // Native (non-passive) wheel listener — React's synthetic onWheel is
  // registered passive, so preventDefault() there is silently ignored.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      commitView((prev) => {
        const delta = -e.deltaY * ZOOM_SPEED;
        const newZoom = clamp(prev.zoom * (1 + delta), MIN_ZOOM, MAX_ZOOM);
        const contentX = (cx - prev.pan.x) / prev.zoom;
        const contentY = (cy - prev.pan.y) / prev.zoom;
        const newPan = clampPanFor(
          { x: cx - contentX * newZoom, y: cy - contentY * newZoom },
          newZoom,
          contentSize.current
        );
        return { zoom: newZoom, pan: newPan };
      });
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [clampPanFor, commitView]);

  const onPointerDown = useCallback(
    (e) => {
      if (e.target.closest("a,button")) return;
      clearSelection();
      const vp = viewportRef.current;
      try {
        vp.setPointerCapture(e.pointerId);
      } catch {
        /* invalid/inactive pointer id — capture is a nicety, not required */
      }
      const current = pendingView.current ?? viewRef.current;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) {
        panState.current = { startX: e.clientX, startY: e.clientY, startPan: current.pan };
        setIsPanning(true);
      } else if (pointers.current.size === 2) {
        panState.current = null;
        const pts = Array.from(pointers.current.values());
        const rect = vp.getBoundingClientRect();
        pinchState.current = {
          startDist: dist(pts[0], pts[1]),
          startZoom: current.zoom,
          startPan: current.pan,
          mid: { x: (pts[0].x + pts[1].x) / 2 - rect.left, y: (pts[0].y + pts[1].y) / 2 - rect.top },
        };
      }
    },
    [clearSelection]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2 && pinchState.current) {
        const pts = Array.from(pointers.current.values());
        const d = dist(pts[0], pts[1]);
        if (pinchState.current.startDist < 1) return; // degenerate gesture, no meaningful distance to scale from
        const scale = d / pinchState.current.startDist;
        const newZoom = clamp(pinchState.current.startZoom * scale, MIN_ZOOM, MAX_ZOOM);
        const { mid, startPan, startZoom } = pinchState.current;
        const contentX = (mid.x - startPan.x) / startZoom;
        const contentY = (mid.y - startPan.y) / startZoom;
        const newPan = clampPanFor(
          { x: mid.x - contentX * newZoom, y: mid.y - contentY * newZoom },
          newZoom,
          contentSize.current
        );
        commitView({ zoom: newZoom, pan: newPan });
        return;
      }

      if (panState.current && pointers.current.size === 1) {
        const dx = e.clientX - panState.current.startX;
        const dy = e.clientY - panState.current.startY;
        commitView((prev) => ({
          ...prev,
          pan: clampPanFor(
            { x: panState.current.startPan.x + dx, y: panState.current.startPan.y + dy },
            prev.zoom,
            contentSize.current
          ),
        }));
      }
    },
    [clampPanFor, commitView]
  );

  const onPointerUp = useCallback((e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchState.current = null;
    if (pointers.current.size === 0) {
      panState.current = null;
      setIsPanning(false);
    }
  }, []);

  const card = (id, className, children) => (
    <DraggableCard
      key={id}
      id={id}
      className={className}
      selected={selectedIds.has(id)}
      offset={getOffset(id)}
      zoomRef={zoomRef}
      onSelect={selectCard}
      onMove={moveCard}
      onReset={resetCard}
    >
      {children}
    </DraggableCard>
  );

  return (
    <section id="about" className={`container section ${styles.section}`}>
      <div>
        <h2 className={styles.heading}>Who I am, off the record</h2>
        <p className={styles.subheading}>
          Everything from the "About" page, sorted into a board instead of an accordion.
        </p>
      </div>

      <div
        className={`${styles.viewport} ${isPanning ? styles.panning : ""}`}
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className={styles.hint}>
          <Move size={12} /> drag to pan · scroll to zoom
        </div>

        <div className={styles.viewportToolbar}>
          <div className={styles.zoomGroup}>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => zoomBy(1 / ZOOM_STEP)}
              disabled={view.zoom <= MIN_ZOOM + 0.001}
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className={styles.zoomLevel}>{Math.round(view.zoom * 100)}%</span>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => zoomBy(ZOOM_STEP)}
              disabled={view.zoom >= MAX_ZOOM - 0.001}
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
          </div>
          <button type="button" className={styles.resetBtn} onClick={resetBoard}>
            <Maximize2 size={13} /> reset board
          </button>
        </div>

        <div
          className={styles.content}
          ref={contentRef}
          style={{ transform: `translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})` }}
        >
          <div className={styles.introRow}>
            {card(
              "photo",
              `${styles.card} ${styles.cardPhoto}`,
              <img src={profilePhoto} alt="Chiranjeeb Deb" />
            )}
            {card(
              "bio",
              `${styles.card} ${styles.cardBio}`,
              <>
                <span className={styles.cardName}>{"Hi, I'm Chiranjeeb Deb"}</span>
                {bio.replace("Hi, I'm Chiranjeeb — ", "")}
              </>
            )}
            {card(
              "skills",
              `${styles.card} ${styles.cardSkills}`,
              <>
                <span className={styles.cardLabel}>Tools &amp; craft</span>
                <div className={styles.skillChips}>
                  {skills.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={styles.groupsRow}>
            <Frame label="Experience & Education">
              {workExperience.map((w) =>
                card(
                  `work-${w.company}`,
                  `${styles.card} ${styles.cardWork}`,
                  <>
                    <span className={styles.workLogoWrap}>
                      <img
                        src={WORK_ICONS[w.logo].src}
                        alt={WORK_ICONS[w.logo].alt}
                        className={styles.workLogoImg}
                      />
                    </span>
                    <span className={styles.workInfo}>
                      <span className={styles.workRole}>
                        {w.role}, {w.company}
                      </span>
                      <span className={styles.workDates}>
                        {w.start} – {w.end}
                      </span>
                    </span>
                  </>
                )
              )}
              {card(
                "education",
                `${styles.card} ${styles.cardWork}`,
                <>
                  <span className={styles.eduIcon}>
                    <GraduationCap size={16} />
                  </span>
                  <span className={styles.workInfo}>
                    <span className={styles.workRole}>{education.degree}</span>
                    <span className={styles.workDates}>{education.institute}</span>
                  </span>
                </>
              )}
            </Frame>

            <Frame label="Research Papers">
              {research.map((r) =>
                card(
                  `research-${r.venue}`,
                  `${styles.card} ${styles.cardResearchItem}`,
                  <>
                    <span className={styles.researchVenue}>
                      <BookOpen size={12} /> {r.venue}
                    </span>
                    <span className={styles.researchTitle}>{r.title}</span>
                  </>
                )
              )}
            </Frame>

            <Frame label="Growing with the Community">
              {card(
                "community-text",
                `${styles.card} ${styles.cardTextFeature}`,
                <>
                  <Users size={18} className={styles.featureIcon} />
                  <span className={styles.featureHeading}>{community.heading}</span>
                  <p className={styles.featureBody}>{community.description}</p>
                </>
              )}
              {card(
                "community-photo",
                `${styles.card} ${styles.cardMiniPhoto}`,
                <img src={communityPhoto} alt="Extended Pack Collective meetup" />
              )}
            </Frame>

            <Frame label="Passion to Share Knowledge">
              {card(
                "teaching-text",
                `${styles.card} ${styles.cardTextFeature}`,
                <>
                  <GraduationCap size={18} className={styles.featureIcon} />
                  <span className={styles.featureHeading}>{teaching.heading}</span>
                  <p className={styles.featureBody}>{teaching.description}</p>
                </>
              )}
              {card("teaching-fact", `${styles.card} ${styles.cardFact}`, writingNote)}
              {card(
                "teaching-photo",
                `${styles.card} ${styles.cardMiniPhoto}`,
                <img src={workshopPhoto} alt="Leading a Designing with AI workshop" />
              )}
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
}
