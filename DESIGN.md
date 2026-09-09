# Design

<!-- impeccable:design-schema 1 -->

## World

A technical, blueprint-flat system modeled directly on som.design's actual
computed styles (not an approximation from screenshots): sharp corners, zero
shadow anywhere, hairline borders, a cool slate ink color, and one coral
accent used only at decorative/large scale — never as a filled button or
body-text color. Three signature features carry the personality: a dense
activity grid, a freeform draggable "canvas" About section, and an original
coffee-themed footer mini-game.

This file replaces an earlier version written across several incremental
passes (typography-only, then chip-only, then logo-only) that had drifted
into a patchwork — rounded pill buttons next to sharp blueprint corners,
soft drop shadows next to a flat reference. This pass re-derived the system
from som.design's own DOM (background, border, radius, shadow, and accent
values pulled via computed-style inspection, not guessed) and reapplied it
everywhere in one coherent sweep, rather than patching individual
components.

## Palette

- `--bg` `#fafcfd` — a barely-there cool near-white. Matches som.design's
  own body background exactly; still reads as "white," not "off-white/cream"
  (the thing an earlier pass was told to remove).
- `--bg-panel` `#f1f4f6` recessed surfaces (tags, empty grid cells);
  `--bg-panel-raised` `#ffffff` cards — distinguished from the page only by
  a 1px border, never a shadow (som's own panel treatment exactly).
- `--ink` `#32404f` — a dark slate blue-gray, not black or warm brown. This
  is som's own body/heading text color, used everywhere.
- `--ink-muted` `#5b6b7a` / `--ink-faint` `#67747f` — both cleared for
  4.5:1+ AA against `--bg`.
- `--line` `#e5e8eb` / `--line-strong` `#c7ced4` — hairline borders, matches
  som's own border gray.
- `--accent` `#e86543` — som's own coral, used *only* at decorative or
  large-display scale (the "complexity" emphasis word, the logo-adjacent
  corner marks) where WCAG's large-text 3:1 threshold applies. It does not
  clear normal-text 4.5:1 (measured 3.2:1) — this is deliberate restraint,
  matching how sparingly som itself uses it (their logo + corner marks are
  the *only* two places it appears on their whole site; no filled buttons,
  no colored links).
- `--accent-strong` `#b8421f` — the AA-safe shade for anywhere accent must
  carry small text or a filled surface (stat values, hover states).
- `--accent-on-ink` `#ff8a5c` (light) / `#a03a1b` (dark) — a third variant
  specifically for accent text sitting on a `var(--ink)`-colored surface
  (the inverted tooltip chip), since that surface's actual color flips
  between light and dark mode.
- `--sage` / `--sky` / `--violet` — the only "full palette" exception,
  reserved for the activity grid's 4-way category legend. A categorical
  data-viz legend legitimately needs distinct hues; nothing else on the
  page uses them.
- `--radius-sm`/`--radius-md` `2px`, `--radius-lg` `0px` — sharp, technical.
  Matches som's own values exactly (0px on their "Key Moments" panel, 2px on
  their role-info box and buttons). No rounded pills or soft cards anywhere.
- No shadow tokens exist. Every card/panel/button is flat — a border is the
  only elevation cue, site-wide, including the playful canvas notes and the
  coffee-game panel. Hover feedback is a border-color change, never a lift
  + shadow.

All pairings re-verified against WCAG contrast math after this rewrite (see
conversion notes below) — nothing regressed from the earlier accessibility
pass.

## Buttons

No filled-color buttons anywhere (som has none either — their one visible
button is an outlined ghost in slate). `.btn-primary` is solid `--ink` with
`--bg-panel-raised`-colored text (inverts automatically between light/dark
mode since `--ink` flips), hovering to `--accent-strong` — the one moment
accent color touches an interactive surface. `.btn-secondary` is transparent
with a `--line-strong` border. Both sharp-cornered, Departure Mono uppercase.

## Type

- **Inter** (weights 400/500) carries every heading and body copy. Weight
  500 for h1–h4 and inline emphasis (som never goes above 500); tracking is
  `-0.04em` uniformly — som's own ratio across every size they use (36px,
  24px, 16px all resolve to the same -0.04em).
- **Departure Mono** (self-hosted, SIL OFL license — see
  `public/fonts/DepartureMono-LICENSE.txt`, by Helena Zhang /
  departuremono.com) carries every label, control, and piece of meta/data
  text: nav links, buttons, tags, stat values *and* labels, role-chip text,
  footer social links, all captions/hints. Always uppercase, weight 400 (the
  family ships one weight only). Tracking scales inversely with size:
  - `--tracking-mono-tight` (`-0.02em`) — ~16px mono (wordmark)
  - `--tracking-mono` (`normal`) — ~14–15px mono (nav links, buttons)
  - `--tracking-mono-loose` (`0.04em`) — ~11–13px mono (tags, labels, hints)
  - `--tracking-mono-wide` (`0.09em`) — the footer fine-print line only
- Body measure capped at `~68ch` via `.measure`.
- Detector note (accepted, not a bug): `detect.mjs` flags Inter as an
  "overused font." Expected and deliberately kept — it's the pinned brief
  ("same typography as som.design"), which itself uses Inter. Departure Mono
  plus the sharp/flat material language are the offsetting distinctive
  choices; don't swap Inter for a "safer" face without the user reopening
  this decision.

## Components & composition

- **Nav**: sticky, blurred, mono wordmark + role line; a sharp icon button
  toggles dark mode (`useTheme.js` — three states: explicit light, explicit
  dark via `data-theme` + localStorage, or unset/follows system); mobile
  hamburger with a full slide-down panel.
- **Hero**: `HEY, I'M CHIRANJEEB.` (mono greeting) → Inter pitch heading →
  subhead → two sharp-cornered "Currently Working with [logo]" / "Previously
  Worked with [logo]" chips (plain Inter text, real company logos — see
  Third-party brand assets below), no CTA buttons in the hero itself. The
  text column and the activity panel stretch to equal height
  (`align-items: stretch` on the hero grid).
- **Activity grid** (`MilestonesGrid.jsx` + `data/activity.js`): scoped to
  2025–2026, 24 columns × 7 rows, ~97% filled. Categories are weighted
  (design/research common, ship/write rare accents) with a 1–3 opacity
  "level" per cell, so the field reads as two dominant hues with occasional
  pops rather than four equally-loud flat colors. The grid vertically
  centers within its panel so extra height (from matching the hero's other
  column) distributes as balanced space, not one dead gap before the
  legend. `data/activity.js` currently generates deterministic (seeded,
  stable across reloads) placeholder entries with *generic* category labels
  only — never a fabricated specific claim. Swap `buildColumns()` for real
  dated events when the user provides them.
- **ToolsStrip**: a slim hairline-bordered band between Hero and Work —
  "TOOLS & CRAFT" + the skill tags already in `data/content.js`, rendered as
  the shared `.tag` chip. Added specifically to close a large whitespace gap
  the user flagged between the hero and the work list, rather than just
  shrinking padding — content that earns the space instead of empty band.
- **Work**: three project cards, full width, image always on the left. Went
  through two zigzag attempts (first flipping art/body left-right per card,
  then keeping the image left but staggering each card's own horizontal
  position at 94% width via alternating `margin-left`/`-right: auto`) —
  both reverted per explicit feedback that the offset read as a width
  inconsistency rather than an intentional rhythm. Settled on plain
  full-width cards, image-left, in a simple vertical stack. Each card
  names the company it shipped at via a small bordered badge overlaid on
  the thumbnail's bottom-left corner (`CompanyLogo.jsx` — a shared version
  of the real Delhivery/BYJU'S logo lockups already built for the hero
  chips, reused here via a `company: "current" | "previous"` field per
  project in `data/content.js`). This moved out of the text-meta row (where
  it first launched, inline next to the tag) into its own visual slot on
  the image per explicit feedback that it needed a different placement.
  Titles were rewritten to lead with the outcome ("74%
  faster logistics planning", "A transporter app, shipped in 30 days")
  instead of a "How we…" framing that buried the number mid-sentence — same
  facts, no new claims. Stats moved from a plain footer row into their own
  bordered tiles (`--radius-sm`, `--bg-panel`) with a larger
  (1.3rem) numeric value, making the metric the thing the eye lands on, per
  explicit request — this is the one place the "hero-metric tile" pattern
  the craft floor otherwise flags is deliberately earned. The abstract SVG
  illustrations from the previous pass are gone; each card now shows
  `ThumbnailPlaceholder.jsx` (dashed border, same visual language as the
  About canvas's photo slot) since the user will supply real thumbnails
  later — a marked placeholder rather than art that could be mistaken for
  finished.
- **Canvas About** (`CanvasAbout.jsx`): went through three iterations before
  landing on its current form. Pass 1 was a lightweight freeform-drag set of
  bio/skills/fun-fact/company-chip notes. Pass 2 expanded it to carry every
  fact from the V1 Framer site's About page (work history, research papers,
  community, teaching) and fixed a messy default scatter into a
  non-overlapping pinned-note grid. Pass 3 (current) dropped the
  freeform-drag/pin-dot metaphor entirely in favor of an explicit **card-sort
  board on an infinite pan/zoom canvas**, per direct request ("like how we do
  card sorting in UX design... figma style cursor... infinite canvas").
  Content is now grouped into four fixed, non-draggable columns — real
  UX-research categories, not a scatter the user rearranges:
  - Experience & Education (Delhivery, BYJU'S, Omnirio + M.Des/IIIT Jabalpur)
  - Research Papers (ICORD 2021, CoMSO 2020)
  - Growing with the Community (community blurb + a real photo — the
    Extended Pack Collective meetup, `assets/photos/community-extended-pack.jpg`)
  - Passion to Share Knowledge (teaching blurb + the UX Collective writing
    note, moved here from the old standalone "fun facts" + a real photo —
    leading a "Designing with AI" workshop,
    `assets/photos/workshop-ai-design.jpg`)
  An intro row (photo placeholder, bio, tools/craft) sits above the four
  columns so "who I am" still reads first. Each column is a `Frame` — a
  dashed-border box with a small tag label sitting on its top edge, echoing
  a Figma frame name — and its cards stack in normal flex flow (no absolute
  positioning, no rotation, no per-card drag: the whole point of a sorted
  board is that the grouping is the fixed, considered part).
  - **Pan/zoom mechanics**: the group content lives in a fixed 1560px-wide
    `.content` layer inside a `.viewport` window, moved via a single
    `translate(...) scale(...)` transform. Wheel = zoom (explicitly
    requested, overriding the more common "wheel pans, ctrl+wheel zooms"
    convention), always anchored under the cursor so the point you're
    scrolling over stays put — same math as Figma/Miro-style canvases.
    Click-drag anywhere on the canvas pans; two-finger touch does pinch-zoom
    (anchored at the touch midpoint) via manual pointer-event tracking,
    since Pointer Events don't give multi-touch gestures for free. The wheel
    listener is attached as a **native** `addEventListener` in a `useEffect`
    rather than React's `onWheel` — React registers wheel listeners as
    passive by default, which silently no-ops `preventDefault()` and lets
    the page scroll *and* zoom at once; a manual `{ passive: false }`
    listener was required to actually stop that.
  - **Bounded, not actually infinite**: zoom is clamped to 0.5x–1.6x and pan
    is clamped to the content's measured bounding box plus 120px of slack —
    "a limit to infinite canvas," per explicit request, so a visitor can't
    scroll-zoom or drag their way into empty void. On load (and on
    "reset view"), the board fits to the viewport's width (measuring the
    content layer's real `offsetWidth`/`offsetHeight`, unaffected by the
    CSS transform) and anchors to the left edge rather than centering, so
    the intro row and the first column are what's actually visible first —
    on narrow mobile screens this means only part of the board fits at the
    0.5x zoom floor, and the visitor pans/pinches to see the rest, which is
    the intended "explore the board" feel of an infinite canvas rather than
    a forced-responsive single column.
  - **Click-to-zoom controls**: per explicit request, wheel/pinch zoom
    isn't the only way in — a small `[− | 50% | +]` segmented control sits
    next to "reset board" (`zoomBy()`, a button-driven sibling of the wheel
    handler's own math, just anchored at the viewport's *center* instead of
    the cursor position, since a button click has no cursor-over-canvas
    position to anchor to). The live percentage comes straight from `view.
    zoom`, and each button disables itself at the 0.5x/1.6x clamp instead of
    letting a visitor click a no-op.
  - **Controls live inside the canvas, not above it**: per explicit
    follow-up request, the hint caption and the zoom/reset toolbar moved
    from a header row *above* `.viewport` to floating overlays *inside*
    it — `position: absolute` siblings of `.content` (not children of it,
    so they stay fixed to the window instead of panning/zooming with the
    board), top-left and bottom-right respectively, the common
    Figma/Miro placement. Both get a blurred translucent backdrop
    (`color-mix` + `backdrop-filter: blur`) since they now float over
    live board content — dot-grid, cards — rather than sitting on the
    page's flat background. The hint caption is `pointer-events: none`
    (it's static text, no controls) so a drag starting on top of it still
    pans the canvas instead of hitting a dead zone; the toolbar's buttons
    keep normal pointer events and are excluded from the pan-start handler
    the same way any other in-canvas button already was
    (`e.target.closest("a,button")`). The caption copy was shortened
    ("drag to pan · scroll to zoom", dropping the "drag a card to move it"
    clause) and shrunk to one line once it had to fit inside the canvas
    instead of a full-width header — at the old 3-line length it covered
    most of the intro row's photo and bio cards.
  - **Cursor**: a hand-authored SVG arrow (`.viewport`'s `cursor: url(...)`)
    replaces the OS pointer while hovering the canvas, swapping to the
    browser's built-in `grabbing` cursor mid-drag. It has real light/dark
    variants (dark-ink-on-white-outline vs. white-on-dark-outline) via the
    same `data-theme` pattern used everywhere else on the site, rather than
    one cursor color that would wash out on one of the two themes.
  - **Space to escape the canvas**: since a wheel-over-canvas now zooms
    instead of scrolling the page, the section keeps a fixed-height viewport
    (640px desktop / 520px mobile, well short of full section height) and
    generous bottom padding, so a visitor can move the cursor just outside
    the dashed border and resume normal page scroll down to Writing. The
    grey panel background lives on the `.viewport` itself now, not the
    whole `.section` — an explicit correction from an earlier pass where
    the entire section (heading, hint row, canvas) sat on one grey band;
    now only the canvas reads as its own recessed surface, with the
    heading area back on the page's normal background.
  - **Select and move, Figma-style**: every card — intro row included — is
    individually selectable (click) and draggable (click + drag), on top
    of the canvas's own pan/zoom, per explicit request ("add interactions
    from figma"). A card stays in normal flex flow (so frame sizing never
    has to be hand-measured — see the card-sort board's history above)
    and a drag only adds a `translate(dx, dy)` on top of that flow
    position, with `dx`/`dy` divided by the current zoom so a dragged card
    tracks the cursor 1:1 regardless of zoom level. Selection shows an
    accent-colored border plus four small square corner handles
    (`.handle`, sharp not circular — matches this site's flat system
    rather than copying Figma's literal rounded ones); the handles are
    decorative, since nothing here actually resizes. Shift-click adds to
    the selection (multiple cards can show selected at once); clicking
    empty canvas clears it; double-clicking a card snaps it back to its
    sorted position; Escape clears selection from the keyboard. "Reset
    board" (renamed from "reset view," since it now does more) clears
    every card's dragged offset in addition to re-fitting pan/zoom — one
    control that fully restores the original sorted layout.
  - `setPointerCapture` calls (both the canvas-level one for panning and
    the per-card one for dragging) are wrapped in `try/catch` — a pointer
    id can be invalid or already inactive in edge cases (rapid multi-touch
    handoff, some synthetic-input paths), and capture is a nicety for
    tracking the gesture outside element bounds, not a requirement; letting
    it throw uncaught would abort the rest of the handler and silently
    drop the select/drag that should still happen.
  - **Reliability pass, after a real reported crash** ("the screen goes
    white, I have to reload"): two changes, both in `CanvasAbout.jsx`.
    First, wheel and pointermove events can fire far faster than the
    screen repaints — a fast trackpad flick or a high-poll-rate mouse
    easily outpaces 60fps — and every pan/zoom/drag tick was committing a
    fresh `setState` straight from the raw event, which means a full
    re-render of the whole board (every card) per event; under sustained
    interaction ("playing around with the canvas," which is exactly what
    was reported) that piles up fast enough to stall the tab. Pan/zoom
    (`view` state) and card-drag (`offsets` state) now coalesce through a
    ref-backed "pending value, committed via one `requestAnimationFrame`
    per frame" pattern — the math still runs on every raw event (chained
    off the latest pending value, not stale committed state, so nothing
    feels less responsive), but only one `setState` — and so one
    re-render — happens per frame no matter how many raw events arrived.
    A degenerate two-finger pinch starting with both touches at the exact
    same point (`startDist` near 0) is also guarded explicitly, since
    `distance / ~0` can produce `NaN` zoom otherwise.
    Second, and more importantly: this site had no error boundary
    anywhere, so any single render-phase exception in this experimental,
    gesture-heavy feature would unmount the *entire* page to a blank
    screen — matching the reported symptom exactly (a plain white page is
    what's left once React tears down the tree and only the light-mode
    `--bg` shows through). `ErrorBoundary.jsx` (a small class component —
    the one place React still requires a class, since there's no hook
    equivalent) now wraps `<CanvasAbout />` in `App.jsx`. A crash inside it
    degrades to a small inline "This section hit a snag / try again" panel
    — verified by temporarily forcing a throw — while Nav, Work, Writing,
    and the footer keep working normally and the visitor never needs a
    hard reload. This doesn't claim to be the exact root cause (extensive
    fuzzing — rapid wheel bursts, degenerate pinch, interleaved
    select/drag/zoom — didn't reproduce the original crash), but it closes
    off the entire *class* of "one bug anywhere in this component blanks
    the whole site" failure, which is the actual complaint.
- **Omnirio logo** (`assets/logos/omnirio-logo.png`): sourced from
  omnirio.com, transparent PNG, navy wordmark + four brand-colored dots.
  Unlike Delhivery/BYJU'S, no separate light/dark SVG variant was built —
  recoloring five distinct colors wasn't practical for one secondary logo
  in a timeline row. Instead it sits in a small fixed white backing chip
  (`.workLogoWrap`, `background: #ffffff`) inside the work-timeline card, so
  it stays legible in dark mode without touching the source art. This is
  the same workaround BYJU'S used before its own SVG variants were built;
  it was accepted here for Omnirio since it's a minor, single-appearance
  logo rather than a hero-level brand mark.
- **Writing**: three real posts pulled from the author's Medium profile
  (`medium.com/@chiranjeebdeb`), replacing the earlier single disabled
  teaser. Rendered as compact horizontal cards in a 3-up grid (stacking to
  one column under 760px) — each card is a single link (the whole card is
  clickable, `target="_blank"`) with the publication's real logo as a small
  bordered square badge on the left, title, and a corner arrow icon, no
  excerpt — dropped specifically to keep each card short (~105px tall on
  desktop) instead of the earlier full-width single-card layout, per
  explicit feedback that space was disproportionate and the text-only cards
  read as a wireframe. Publication logos (`assets/logos/ux-collective.png`,
  `bootcamp.png`, `ed-tech-talks.png`) are each publication's real square
  profile icon as Medium itself renders it, sourced from
  miro.medium.com — same "real third-party mark for factual attribution"
  precedent as the Delhivery/BYJU'S logos. They carry their own background
  color (cyan, black, violet) so, like the Omnirio logo, no separate
  light/dark variant was needed. Post data lives in `data/content.js`'s
  `blogPosts` array (was a single `blogPost` object).
- **Footer + CoffeeGame**: contact block, and an original mini-game ("Catch
  the Coffee") distinct from som.design's pixel platformer by concept,
  mechanic, and visual language. Reworked from a plain outline-icon/flat-canvas
  version per direct feedback that it "feels like a wireframe":
  - **`CoffeeIcon.jsx`**: a new hand-authored line-art cup with three CSS-
    animated steam wisps (rise + fade loop, staggered, `prefers-reduced-
    motion`-aware), added to the same single-stroke grammar as
    `SocialIcons.jsx`. Reused in two places — a bordered tile next to the
    "Coffee's on me." heading, and the game's idle/game-over overlay — so it
    reads as one deliberate motif rather than a one-off.
  - **Contact links and the heading**: the plain 18px inline glyphs (mail,
    LinkedIn, Instagram) are now each in their own bordered square tile
    (`.iconTile`, `.coffeeTile`) — the same "bordered chip carries visual
    weight" language already used for `CompanyLogo` and the Writing section's
    publication badges — rather than a bare icon floating next to text.
  - **CoffeeGame canvas**: rebuilt for higher fidelity, still flat/no-
    gradient per the system's material rules. Added: a dot-grid backdrop
    (reusing the About canvas's dotted-canvas texture for cohesion), a
    filled counter/ground (was a single 1px line), two-tone shaded beans
    that tumble (rotate) as they fall, a rounded cup with a rim highlight
    and a body-sheen stroke, a squash-and-tilt cup animation (squashes on a
    catch, leans into movement direction), a catch particle burst + rising
    "+1" text, a miss dust puff + brief accent-tinted screen flash, and a
    "Combo ×N" HUD readout for consecutive catches (`streak`, reset on any
    miss). `LOGICAL_H` grew 260→300 to give the new effects room.
  - **Bug fixed in the same pass**: the idle/game-over overlay text was
    clipping against the canvas's top edge on narrow (mobile) widths,
    because `.stage`'s height was driven purely by the canvas's 2:1
    aspect-ratio with no floor — at ~280px wide that's only ~140px tall,
    too short for the overlay's title/subtitle/button to fit without
    `overflow:hidden` cutting it off top and bottom. Fixed by giving
    `.stage` a `min-height` and letting the canvas fill it (`position:
    absolute; inset:0`) rather than sizing itself. That in turn required
    `.wrap { min-width: 0 }` — without it, the grid item's automatic
    minimum size (derived from `.stage`'s aspect-ratio + min-height, ~381px)
    was forcing the whole card to overflow its `1fr` grid column on mobile,
    a classic CSS Grid "aspect-ratio content overflows a flex/grid track"
    trap. Also tightened the miss condition to fire the instant a bean
    passes the ground line (`b.y > groundY`) instead of well below it
    (`LOGICAL_H + 12`), so beans no longer visually fell through the new
    solid counter bar before being counted as missed.

## Icons

lucide-react (single stroke, weight 2); two hand-authored icons
(`SocialIcons.jsx`) for LinkedIn/Instagram, since lucide-react ships no
trademarked brand marks.

## Third-party brand assets (`src/assets/logos/`)

Real company logos for factual "worked at" attribution — standard practice,
same as som's own Atlassian mark.

- **Delhivery**: sourced from delhivery.com, which ships white-on-transparent
  (built for a dark navbar). Recolored programmatically to `--ink`
  (white → slate, red brand accent preserved exactly) for light-mode
  legibility; the original white version is used in dark mode. Swapped via
  the same `data-theme` pattern as the color tokens.
- **BYJU'S**: gone through several sourcing passes (byjus.com's corporate
  SVG, its "EarlyLearn" sub-brand asset, two user-supplied URLs — a
  Wikimedia Commons file whose "BYJU'S" wordmark paths render light-gray and
  illegible on both the thumbnail and the actual source SVG, and a
  boundaryholding.com repost). **Current**: back to byjus.com's own
  corporate `byjus_learningapp_logo.svg` (tagline + `®` mark stripped, same
  as pass 1), but now shipped as real SVG with two color variants instead of
  a single raster PNG with a white backing-chip workaround, per explicit
  request. `byjus-onlight.svg` is the untouched vector; `byjus-ondark.svg`
  is a targeted recolor — only the wordmark-letter path (identified by its
  unique start coordinate, `d="M 155.433 46.03…"`) and the 14 wordmark
  shading paths (`rgb(160,84,160)`, confirmed via coordinate dump to never
  appear inside the icon) were relightened; the icon square, its white "B"
  cutout, and inner shadow are byte-identical between both variants, since
  the icon carries its own opaque background and never needed to change.
  Swapped via the same `.logoLight`/`.logoDark` `data-theme` pattern as
  Delhivery. Dark-mode wordmark clears 6.77:1 against `--bg` in dark mode.
- **BYJU'S, pass N+1**: user supplied a cleaner Illustrator-exported vector
  (`byjus-logo-vector.zip`, extracted to a 652×652-viewBox SVG) to replace
  the above everywhere `CompanyLogo` renders it — the hero "previously
  worked with" chip and the Work card's "shipped at" badge (not the
  separate `byjus-icon.svg` crop used in the About canvas's timeline,
  which was out of scope and still points at the older file). Same
  icon-stays/wordmark-recolors split as before, done freshly for this
  file's different path structure: the icon square is 4 `<path>` elements
  (classes `st1`/`st2`/`st3`) whose leading `M` x-coordinate is `<150`; the
  wordmark is the remaining 10 paths (classes `st0`/`st1`, min-x `>=150`)
  — found by parsing every path's leading move-command coordinate, not by
  hand. `byjus-ondark.svg` renames only the wordmark paths' classes to
  `st0d`/`st1d` and adds two lighter fill rules for them (`#D9AEDD`,
  `#C48ED0`); the icon's 4 paths are untouched, same "own opaque
  background, no dark variant needed" reasoning as Omnirio and the
  previous BYJU'S pass. One real bug this pass caught: the source SVG's
  652×652 viewBox has the actual logo content (icon + wordmark) sitting in
  only a 614×143 slice of it (`getBBox()`-verified) — at the shared
  `height: 0.85rem` sizing every `CompanyLogo` uses, that near-6:1 ratio of
  empty-to-content viewBox made BYJU'S render roughly a third the visual
  size of the Delhivery wordmark next to it. Fixed by tightening both
  files' `viewBox` to the real content bounds (`16 250 614 143`) rather
  than special-casing BYJU'S sizing in CSS.
- Delhivery is unmodified in logotype/iconography beyond its light/dark
  recolor; BYJU'S required more work only because the "same size as text"
  and "no subtext" requests, plus a fixed-purple raster with no dark
  variant, needed solving together.
- **Icon-only marks** (`delhivery-icon-onlight.png`, `byjus-icon.svg`), used
  only in the About canvas's Experience & Education timeline, per explicit
  request to match the row's existing Omnirio treatment instead of the
  wordmarks used elsewhere. Both are crops of the existing wordmark assets
  above rather than separately sourced: the Delhivery icon is a pixel-exact
  crop of the "D" glyph's own bounding box (found by scanning
  `delhivery-onlight.png` for non-transparent column runs — 9 segments, one
  per letter); the BYJU'S icon is the same `byjus-onlight.svg` with its
  `viewBox` narrowed to the icon square's own bounds (`0 16 47 46`) rather
  than a re-export, so it stays a lossless vector. Both sit on the existing
  `.workLogoWrap` white chip (same as Omnirio), so — like Omnirio — neither
  needed a dark-mode variant; a `delhivery-icon-ondark.png` (white D,
  cropped the same way) was made but deleted unused once the white-chip
  approach made it unnecessary, since the chip is always white regardless
  of page theme.

## Personal photos (`src/assets/photos/`)

Three real photos, all user-supplied via the project's `public/` folder,
moved into `src/assets/photos/` (as ES module imports, same convention as
the brand logos, rather than `public/` string paths) and downsized with
`sips` since the originals were oversized for their display size:

- **Community/teaching** (`community-extended-pack.jpg`,
  `workshop-ai-design.jpg`): `sips -Z 900` plus JPEG re-encode — the
  originals (a 1.2MB PNG screenshot and an 81KB JPEG) were larger than a
  ~180px-tall card thumbnail needs; both are now under 120KB.
  `.cardMiniPhoto` changed from a dashed placeholder (icon + "coming soon"
  text) to an actual image container: zero padding, `overflow: hidden`,
  fixed height, `object-fit: cover`, so the photo fills the card
  edge-to-edge behind its rounded border instead of sitting inset with
  padding like a text card.
- **Intro-row profile photo** (`profile.png`): a pre-cut transparent-PNG
  portrait (arms crossed, background already removed) rather than a plain
  rectangular photo, so it gets different treatment from the two above —
  `object-fit: contain` (not `cover`) with `object-position: bottom`,
  keeping the whole cutout intact and anchored to the card's base like a
  standing figure, letting the transparent background blend into
  `.cardPhoto`'s own `--bg-panel` fill rather than being cropped like a
  rectangular photo would be. Downsized `1121×1403` → `479×600` via
  `sips -Z 600` (alpha channel confirmed intact after resize); the dashed
  placeholder border was dropped in favor of the card system's normal
  solid border now that it holds real content.

## Known follow-ups (left for the user, not fabricated here)

- Real thumbnails for the three Work cards (currently `ThumbnailPlaceholder.jsx`)
- Real dated events for the 2025–2026 activity grid (`src/data/activity.js`)
- V2 case-study pages (Work cards currently link to the V1 Framer pages)
- If the About board's "screen goes white" crash recurs despite the
  reliability pass above, the exact repro steps (browser, input device —
  mouse/trackpad/touch — and roughly what you were doing right before it
  happened) would help pin down the actual root cause, since it wasn't
  conclusively reproduced during this pass.

## Verification notes

Verified via live dev server (Vite): WCAG contrast math for every token
pairing (including the new accent/accent-strong/accent-on-ink split),
sharp-corner and zero-shadow application across every component, dark-mode
toggle + persistence, and responsive layout at mobile (375px) and desktop
(1440px) widths.
