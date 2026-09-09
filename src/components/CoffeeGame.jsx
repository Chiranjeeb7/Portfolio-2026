import { useCallback, useEffect, useRef, useState } from "react";
import { Coffee } from "lucide-react";
import CoffeeIcon from "./icons/CoffeeIcon";
import styles from "./CoffeeGame.module.css";

const STORAGE_KEY = "coffee-game-best-v1";
const LOGICAL_W = 520;
const LOGICAL_H = 300;
const CUP_W = 60;
const CUP_H = 34;
const GROUND_H = 30;
const START_LIVES = 3;

function readColors(canvas) {
  const cs = getComputedStyle(canvas);
  const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: pick("--bg-panel", "#f2efe8"),
    bgRaised: pick("--bg-panel-raised", "#ffffff"),
    ink: pick("--ink", "#17150f"),
    inkFaint: pick("--ink-faint", "#9a9384"),
    accent: pick("--accent", "#b8460b"),
    accentStrong: pick("--accent-strong", "#8a3406"),
    accentTint: pick("--accent-tint", "#fbe4dc"),
    line: pick("--line", "#e4ddd0"),
    lineStrong: pick("--line-strong", "#c7ced4"),
  };
}

function loadBest() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function freshGame() {
  return {
    cupX: LOGICAL_W / 2 - CUP_W / 2,
    tilt: 0,
    squish: 0,
    missFlash: 0,
    beans: [],
    particles: [],
    floats: [],
    lastSpawn: 0,
    spawnEvery: 950,
    fallSpeed: 90,
    lives: START_LIVES,
    score: 0,
    streak: 0,
    lastTime: 0,
    running: false,
  };
}

export default function CoffeeGame() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const colorsRef = useRef(null);
  const keysRef = useRef(new Set());
  const gameRef = useRef(freshGame());

  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(loadBest);

  const draw = useCallback((ctx) => {
    const g = gameRef.current;
    const c = colorsRef.current;
    const groundY = LOGICAL_H - GROUND_H;

    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    // dot-grid texture, matching the About canvas's dotted-canvas motif
    ctx.fillStyle = c.line;
    ctx.globalAlpha = 0.6;
    const step = 26;
    for (let y = step / 2; y < groundY; y += step) {
      for (let x = step / 2; x < LOGICAL_W; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // counter / ground, as two flat layers for cheap depth (no gradients)
    ctx.fillStyle = c.line;
    ctx.fillRect(0, groundY, LOGICAL_W, GROUND_H);
    ctx.strokeStyle = c.lineStrong;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(LOGICAL_W, groundY);
    ctx.stroke();

    // ground-impact dust particles + catch sparks
    for (const p of g.particles) {
      ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // beans, two-tone shaded with a slow tumble
    for (const b of g.beans) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = c.accentStrong;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.accentTint;
      ctx.beginPath();
      ctx.ellipse(-2, -3, 2.4, 3.2, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.stroke();
      ctx.restore();
    }

    // cup: rounded silhouette, leans into movement and squashes on a catch
    const cupCenterX = g.cupX + CUP_W / 2;
    const cupBaseY = groundY;
    const squashY = 1 - 0.22 * g.squish;
    const squashX = 1 + 0.14 * g.squish;
    ctx.save();
    ctx.translate(cupCenterX, cupBaseY);
    ctx.rotate(g.tilt);
    ctx.scale(squashX, squashY);
    ctx.translate(-cupCenterX, -cupBaseY);

    const cy = cupBaseY - CUP_H;
    const left = g.cupX;
    const right = g.cupX + CUP_W;
    const r = 6;
    ctx.fillStyle = c.ink;
    ctx.beginPath();
    ctx.moveTo(left, cy);
    ctx.lineTo(right, cy);
    ctx.lineTo(right - 6, cupBaseY - r);
    ctx.quadraticCurveTo(right - 8, cupBaseY, right - 8 - r, cupBaseY);
    ctx.lineTo(left + 8 + r, cupBaseY);
    ctx.quadraticCurveTo(left + 8, cupBaseY, left + 6, cupBaseY - r);
    ctx.closePath();
    ctx.fill();

    // rim highlight + body sheen (flat two-tone, no gradient)
    ctx.strokeStyle = c.lineStrong;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, cy);
    ctx.lineTo(right, cy);
    ctx.stroke();
    ctx.strokeStyle = c.bgRaised;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left + 10, cy + 5);
    ctx.lineTo(left + 8, cupBaseY - 8);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // handle
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(right + 5, cy + CUP_H / 2, 9, -Math.PI * 0.62, Math.PI * 0.62);
    ctx.stroke();
    ctx.restore();

    // catch sparks drawn above the cup
    for (const p of g.floats) {
      ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
      ctx.fillStyle = c.accentStrong;
      ctx.font = "600 15px 'Departure Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;

    if (g.missFlash > 0) {
      ctx.fillStyle = c.accent;
      ctx.globalAlpha = g.missFlash * 0.22;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
      ctx.globalAlpha = 1;
    }
  }, []);

  const stop = useCallback(() => {
    gameRef.current.running = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const loop = useCallback(
    (time) => {
      const g = gameRef.current;
      const canvas = canvasRef.current;
      if (!g.running || !canvas) return;
      const ctx = canvas.getContext("2d");
      const dt = g.lastTime ? Math.min(time - g.lastTime, 48) : 16;
      g.lastTime = time;

      const speed = 3.8 * (dt / 16);
      let dir = 0;
      if (keysRef.current.has("ArrowLeft")) {
        g.cupX -= speed;
        dir = -1;
      }
      if (keysRef.current.has("ArrowRight")) {
        g.cupX += speed;
        dir = 1;
      }
      g.cupX = Math.min(Math.max(g.cupX, 0), LOGICAL_W - CUP_W);
      g.tilt += (dir * 0.16 - g.tilt) * 0.25;
      g.squish = Math.max(g.squish - 0.07 * (dt / 16), 0);
      g.missFlash = Math.max(g.missFlash - 0.06 * (dt / 16), 0);

      if (time - g.lastSpawn > g.spawnEvery) {
        g.lastSpawn = time;
        g.beans.push({
          x: 24 + Math.random() * (LOGICAL_W - 48),
          y: -10,
          rot: 0,
          spin: (Math.random() - 0.5) * 0.08,
        });
        g.spawnEvery = Math.max(380, g.spawnEvery - 14);
      }

      const groundY = LOGICAL_H - GROUND_H;
      const cupTop = groundY - CUP_H;
      const next = [];
      for (const b of g.beans) {
        b.y += g.fallSpeed * (dt / 1000);
        b.rot += b.spin * (dt / 16);
        const caught =
          b.y >= cupTop - 4 &&
          b.y <= groundY &&
          b.x > g.cupX - 6 &&
          b.x < g.cupX + CUP_W + 6;
        if (caught) {
          g.score += 1;
          g.streak += 1;
          g.squish = 1;
          g.fallSpeed = Math.min(260, g.fallSpeed + 4);
          setScore(g.score);
          setCombo(g.streak);
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            g.particles.push({
              x: b.x,
              y: cupTop,
              vx: Math.cos(a) * 1.4,
              vy: Math.sin(a) * 1.4 - 1,
              life: 340,
              maxLife: 340,
              r: 2.4,
              color: Math.random() > 0.5 ? colorsRef.current.accent : colorsRef.current.accentStrong,
            });
          }
          g.floats.push({ x: b.x, y: cupTop - 4, vy: -0.5, life: 620, maxLife: 620, text: "+1" });
          continue;
        }
        if (b.y > groundY) {
          g.lives -= 1;
          g.streak = 0;
          g.missFlash = 1;
          setLives(g.lives);
          setCombo(0);
          for (let i = 0; i < 5; i++) {
            g.particles.push({
              x: b.x,
              y: groundY,
              vx: (Math.random() - 0.5) * 1.6,
              vy: -Math.random() * 0.8,
              life: 280,
              maxLife: 280,
              r: 2,
              color: colorsRef.current.inkFaint,
            });
          }
          continue;
        }
        next.push(b);
      }
      g.beans = next;

      g.particles = g.particles.filter((p) => {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.vy += 0.05 * (dt / 16);
        p.life -= dt;
        return p.life > 0;
      });
      g.floats = g.floats.filter((f) => {
        f.y += f.vy * (dt / 16);
        f.life -= dt;
        return f.life > 0;
      });

      draw(ctx);

      if (g.lives <= 0) {
        g.running = false;
        setStatus("over");
        setBest((prevBest) => {
          const newBest = Math.max(prevBest, g.score);
          try {
            localStorage.setItem(STORAGE_KEY, String(newBest));
          } catch {
            /* storage unavailable — best score just won't persist */
          }
          return newBest;
        });
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [draw]
  );

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    colorsRef.current = readColors(canvas);
    gameRef.current = { ...freshGame(), running: true };
    setScore(0);
    setLives(START_LIVES);
    setCombo(0);
    setStatus("playing");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        keysRef.current.add(e.key);
        if (status === "playing") e.preventDefault();
      }
      if (e.key === " " && status !== "playing") {
        e.preventDefault();
        start();
      }
    };
    const onKeyUp = (e) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [status, start]);

  const onPointerMove = useCallback((e) => {
    if (!gameRef.current.running) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ratio = LOGICAL_W / rect.width;
    const x = (e.clientX - rect.left) * ratio;
    gameRef.current.cupX = Math.min(Math.max(x - CUP_W / 2, 0), LOGICAL_W - CUP_W);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.scale(dpr, dpr);
    colorsRef.current = readColors(canvas);
    draw(ctx);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = () => {
      colorsRef.current = readColors(canvas);
      if (!gameRef.current.running) draw(ctx);
    };
    mq.addEventListener("change", onThemeChange);
    return () => mq.removeEventListener("change", onThemeChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.hud}>
        <div className={styles.hudScores}>
          <span className="numeric">Score {score}</span>
          <span className="numeric">Best {best}</span>
          {combo >= 2 && <span className={styles.combo}>Combo ×{combo}</span>}
        </div>
        <span className={styles.lives} aria-label={`${lives} lives left`}>
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <Coffee key={i} size={14} strokeWidth={2} style={{ opacity: i < lives ? 1 : 0.25 }} />
          ))}
        </span>
      </div>

      <div className={styles.stage} style={{ aspectRatio: `${LOGICAL_W} / ${LOGICAL_H}` }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerMove={onPointerMove}
          onClick={() => status !== "playing" && start()}
          role="img"
          aria-label="Catch the Coffee mini game"
        />

        {status !== "playing" && (
          <div className={styles.overlay}>
            <span className={styles.overlayIcon}>
              <CoffeeIcon size={30} />
            </span>
            <p className={styles.overlayTitle}>
              {status === "idle" ? "Catch the Coffee" : `Game over — you caught ${score}`}
            </p>
            <p className={styles.overlaySubtitle}>
              Move the cup with ← → (or drag) and catch as many drops as you can. Miss three and
              it's game over.
            </p>
            <button type="button" className="btn btn-primary" onClick={start}>
              {status === "idle" ? "Play" : "Play again"}
            </button>
          </div>
        )}
      </div>

      <p className={styles.hint}>← → or drag to move · space to (re)start</p>
    </div>
  );
}
