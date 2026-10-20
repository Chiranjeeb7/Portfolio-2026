import { useEffect, useRef } from "react";
import { profile } from "../../data/content";
import styles from "./Preloader.module.css";

// Intro loader: "the page shatters into the timeline".
//
// 1. Solid: the screen is a plain page (the site's background colour),
//    with the name fading in and out at the centre.
// 2. Crack: the page breaks into a grid of pixel tiles, in a wave from the
//    centre out to every edge. Tiles loosen, shrink and tilt, so the seams
//    open onto a plain background (the page stays hidden: nothing else
//    competes with the timeline forming).
// 3. Merge: one tile per timeline day, picked from all over the screen,
//    glides on a soft curve into its exact cell, shrinking to cell size and
//    shifting to its real colour. Every other tile drifts and dissolves.
// 4. The finished timeline holds a beat on its own, then the rest of the
//    page fades in around it and the real cells take over, pixel for pixel.
//
// Everything eases in and out and the phases overlap, so it never snaps.
// One canvas, one rAF loop, no React state per frame. Click or any key
// skips. The merge waits for the page to be ready (fonts + load, 6s cap).

const SOLID_MS = 650; // plain page before it starts to break
const CRACK_MS = 1100; // one tile's crack
const CRACK_WAVE_MS = 700; // centre-to-edge delay across the wave
const MERGE_AFTER_MS = SOLID_MS + 900; // earliest the merge can start
const MERGE_MS = 1900; // one pixel's glide into its cell
const MERGE_STAGGER_MS = 800;
const DISSOLVE_MS = 1300;
const DISSOLVE_STAGGER_MS = 900;
const MAX_WAIT_MS = 6000;
const SETTLE_MS = 300; // finished timeline alone on the plain page
const REVEAL_MS = 900; // the rest of the page fading in around it
const REMEASURE_MS = 250;

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)"]);

// Computed colours come back as "rgb(r, g, b)" (0-255), or, for anything
// defined with color-mix(), as "color(srgb r g b)" with 0-1 channels.
// Channels can also come back in exponent form ("1e-05"), so match that too.
function parseRgb(css) {
  const m = css.match(/-?[\d.]+(?:e-?\d+)?/gi);
  if (!m) return [255, 255, 255];
  const channels = m.slice(0, 3).map(Number);
  return css.trim().startsWith("color(") ? channels.map((v) => v * 255) : channels;
}
const mix = (a, b, t) => `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(lerp(a[2], b[2], t))})`;

// onReveal fires once, as the page starts fading in around the timeline, so
// the hero copy can rise during the fade instead of after it.
export default function Preloader({ onDone, onReveal }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const doneRef = useRef(onDone);
  const revealRef = useRef(onReveal);
  useEffect(() => {
    doneRef.current = onDone;
    revealRef.current = onReveal;
  }, [onDone, onReveal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cells = Array.from(document.querySelectorAll("[data-intro-hide] > *"));
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current();
    };
    if (cells.length === 0) {
      finish();
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bg = parseRgb(getComputedStyle(document.body).backgroundColor);
    // Cracked tiles take on a faint line tint so the break reads even
    // against a same-coloured page underneath. Resolved through a probe
    // element, since the token itself is a hex string.
    const probe = document.createElement("span");
    probe.style.color = "var(--line-strong)";
    document.body.appendChild(probe);
    const tint = parseRgb(getComputedStyle(probe).color);
    probe.remove();
    const quietCell = cells.find((c) => c.dataset.kind === "quiet");
    const quiet = quietCell ? getComputedStyle(quietCell).backgroundColor : `rgb(${bg.join(",")})`;

    // A viewport with no area (a pane still opening, a collapsed iframe)
    // has nowhere to draw: skip straight to the page.
    if (W < 1 || H < 1) {
      finish();
      return;
    }

    // Tile grid covering the screen. Tiles shrink on small screens so there
    // are always more tiles than timeline days: every day-cell needs a tile
    // of its own, so the size is capped by the area, not a fixed floor.
    const fit = Math.floor(Math.sqrt((W * H) / (cells.length * 1.3)));
    const T = Math.max(1, Math.min(W < 600 ? 22 : 28, fit));
    const nx = Math.ceil(W / T);
    const ny = Math.ceil(H / T);
    const cx0 = W / 2;
    const cy0 = H / 2;
    const maxD = Math.hypot(cx0, cy0);

    const tiles = [];
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        const x = ix * T + T / 2;
        const y = iy * T + T / 2;
        const d = Math.hypot(x - cx0, y - cy0) / maxD;
        tiles.push({
          x,
          y,
          crackDelay: d * CRACK_WAVE_MS + Math.random() * 180,
          rot: (Math.random() - 0.5) * 0.9,
          shrink: 0.18 + Math.random() * 0.2,
          driftX: (Math.random() - 0.5) * 40,
          driftY: 10 + Math.random() * 30,
          dissolveDelay: Math.random() * DISSOLVE_STAGGER_MS,
          target: null,
        });
      }
    }

    // One tile per day-cell, drawn from all over the screen.
    const order = tiles.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (tiles.length < cells.length) {
      finish();
      return;
    }
    const movers = cells.map((cell, i) => {
      const tile = tiles[order[i]];
      let color = getComputedStyle(cell).backgroundColor;
      const faint = TRANSPARENT.has(color);
      if (faint) color = quiet;
      const mover = {
        tile,
        cell,
        rgb: parseRgb(color),
        alpha: faint ? 0.45 : 1,
        delay: Math.random() * MERGE_STAGGER_MS,
        bend: (Math.random() - 0.5) * 0.6,
        tx: 0,
        ty: 0,
        ts: 0,
      };
      tile.target = mover;
      return mover;
    });

    const measure = () => {
      for (const m of movers) {
        const r = m.cell.getBoundingClientRect();
        m.tx = r.left + r.width / 2;
        m.ty = r.top + r.height / 2;
        m.ts = r.width;
      }
    };
    measure();

    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let fontsReady = !document.fonts;
    document.fonts?.ready.then(() => (fontsReady = true));

    // A real resize (rotation, window drag) skips, since every target cell
    // moves. Height-only changes don't: a phone's address bar showing or
    // hiding fires resize too, and would cut the intro short.
    const onResize = () => {
      if (Math.abs(window.innerWidth - W) > 1) finish();
    };
    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    window.addEventListener("resize", onResize);

    const t0 = performance.now();
    let mergeStart = 0;
    let lastMeasure = 0;
    let revealed = false;
    let raf = 0;

    const drawTile = (x, y, size, rot, color, alpha) => {
      if (alpha <= 0.01 || size <= 0.3) return;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      if (Math.abs(rot) > 0.001) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      } else {
        // +0.5 overlap so the solid page shows no hairline seams.
        ctx.fillRect(x - size / 2, y - size / 2, size + 0.5, size + 0.5);
      }
    };

    const frame = (now) => {
      if (finished) return;
      const t = now - t0;

      if (!mergeStart && t > MERGE_AFTER_MS && ((loaded && fontsReady) || t > MAX_WAIT_MS)) {
        mergeStart = t;
        measure();
      }
      if (mergeStart && t - lastMeasure > REMEASURE_MS) {
        lastMeasure = t;
        measure(); // follow the grid if late fonts shift the layout
      }
      // Reveal: only once every pixel has landed and settled.
      const mergeEnd = mergeStart ? mergeStart + MERGE_STAGGER_MS + MERGE_MS : Infinity;
      const reveal = clamp((t - mergeEnd - SETTLE_MS) / REVEAL_MS);
      if (reveal === 1) {
        finish();
        return;
      }

      ctx.clearRect(0, 0, W, H);
      if (reveal > 0) {
        if (!revealed) {
          revealed = true;
          revealRef.current?.();
        }
        // The overlay's own backdrop hands over to one the canvas can fade.
        rootRef.current.style.background = "transparent";
        ctx.globalAlpha = 1 - easeInOutSine(reveal);
        ctx.fillStyle = `rgb(${bg.join(",")})`;
        ctx.fillRect(0, 0, W, H);
      }
      const bgCss = `rgb(${bg.join(",")})`;
      const tintCss = (c) => mix(bg, tint, c);

      for (const tile of tiles) {
        // Crack: loosen, shrink, tilt, take on the faint tint.
        const c = easeInOut(clamp((t - SOLID_MS - tile.crackDelay) / CRACK_MS));
        const size = T * (1 - tile.shrink * c);
        const rot = tile.rot * c * 0.35;
        const m = tile.target;

        if (!m) {
          // Leftover tile: drift down and away, shrinking to nothing.
          const q = mergeStart ? easeInOutSine(clamp((t - mergeStart + 200 - tile.dissolveDelay) / DISSOLVE_MS)) : 0;
          drawTile(
            tile.x + tile.driftX * q,
            tile.y + tile.driftY * q,
            size * (1 - q),
            rot * (1 + q),
            c === 0 ? bgCss : tintCss(c),
            1 - q * 0.6
          );
          continue;
        }

        // Timeline pixel: glide on a soft curve into its cell.
        const p = mergeStart ? easeInOut(clamp((t - mergeStart - m.delay) / MERGE_MS)) : 0;
        if (p === 0) {
          drawTile(tile.x, tile.y, size, rot, c === 0 ? bgCss : tintCss(c), 1);
          continue;
        }
        const sx = tile.x;
        const sy = tile.y;
        const dx = m.tx - sx;
        const dy = m.ty - sy;
        const kx = (sx + m.tx) / 2 - dy * m.bend;
        const ky = (sy + m.ty) / 2 + dx * m.bend;
        const u = 1 - p;
        const x = u * u * sx + 2 * u * p * kx + p * p * m.tx;
        const y = u * u * sy + 2 * u * p * ky + p * p * m.ty;
        // Colour settles a little ahead of position, so it arrives "lit".
        const colorT = easeInOutSine(clamp(p * 1.4));
        const from = mix(bg, tint, c);
        const fromRgb = parseRgb(from);
        drawTile(x, y, lerp(size, m.ts, p), rot * u, mix(fromRgb, m.rgb, colorT), lerp(1, m.alpha, colorT));
      }
      ctx.globalAlpha = 1;

      if (t > SOLID_MS) nameRef.current.classList.add(styles.nameOut);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <p className="visually-hidden" role="status">
        Loading
      </p>
      <div ref={rootRef} className={styles.root} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvas} />
        <span ref={nameRef} className={styles.name}>
          {profile.name}
        </span>
      </div>
    </>
  );
}
