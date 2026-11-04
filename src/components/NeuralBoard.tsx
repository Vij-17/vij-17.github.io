import { useEffect, useRef } from 'react';

/**
 * A simulated sheet of excitable cells, drawn the way calcium imaging shows real neurons.
 *
 * Dynamics: Brian's Brain, a three-state cellular automaton.
 *   ready      → fires if exactly two neighbours are firing
 *   firing     → becomes refractory on the next step
 *   refractory → becomes ready again
 * Two additions keep the sheet lively but calm:
 *   spontaneous firing — when the sheet is quiet, a random pair of cells fires and launches new waves;
 *   homeostatic inhibition — once ~2% of cells are active, new firing is suppressed.
 *
 * Rendering: each cell has a fluorescence value that jumps to 1 when it fires and decays
 * exponentially (like a calcium indicator), so activity leaves a fading trace instead of a drawing.
 * Moving the pointer over the board stimulates the cells beneath it.
 */

const READY = 0;
const FIRING = 1;
const REFRACTORY = 2;

const TARGET = 0.022; // homeostatic set point: share of cells firing at once
const DECAY_MS = 420; // fluorescence decay time constant
const LEVELS = 10; // brightness steps used when drawing
const STOPS = [
  [56, 189, 248], // sky-400
  [139, 92, 246], // violet-500
  [251, 146, 60], // orange-400
];

type Props = {
  cell?: number; // cell size in CSS pixels
  tickMs?: number; // time between generations
};

export default function NeuralBoard({ cell = 9, tickMs = 120 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);
    let glow = new Float32Array(0);
    let palette: string[][] = []; // palette[column][brightness level]
    let lattice: HTMLCanvasElement | null = null; // faint "culture dish" grid, drawn once per resize

    let visible = true;
    let quietSteps = 0;
    let lastFiring = 0;
    let pending: [number, number, number] | null = null; // x, y, radius of the latest stimulation
    let raf = 0;
    let lastTime = 0;
    let acc = 0;
    let awakeUntil = 0; // with reduced motion, the sheet only runs briefly after you touch it

    const idx = (x: number, y: number) => y * cols + x;

    const seed = (cx: number, cy: number, radius: number, density: number) => {
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y > radius * radius) continue;
          const gx = (cx + x + cols) % cols;
          const gy = (cy + y + rows) % rows;
          if (grid[idx(gx, gy)] === READY && Math.random() < density) {
            grid[idx(gx, gy)] = FIRING;
            glow[idx(gx, gy)] = 1;
          }
        }
      }
    };

    const buildPalette = () => {
      palette = Array.from({ length: cols }, (_, x) => {
        const t = cols > 1 ? x / (cols - 1) : 0;
        const seg = t < 0.5 ? 0 : 1;
        const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
        const [r, g, b] = [0, 1, 2].map((i) => Math.round(STOPS[seg][i] + (STOPS[seg + 1][i] - STOPS[seg][i]) * u));
        return Array.from({ length: LEVELS }, (_, l) => `rgb(${r} ${g} ${b} / ${((l + 1) / LEVELS) * 0.95})`);
      });
    };

    const buildLattice = (dpr: number) => {
      lattice = document.createElement('canvas');
      lattice.width = canvas.width;
      lattice.height = canvas.height;
      const l = lattice.getContext('2d');
      if (!l) return;
      l.setTransform(dpr, 0, 0, dpr, 0, 0);
      l.fillStyle = 'rgb(250 250 250 / 0.045)';
      l.beginPath();
      const r = 0.9;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cx = x * cell + cell / 2;
          const cy = y * cell + cell / 2;
          l.moveTo(cx + r, cy);
          l.arc(cx, cy, r, 0, Math.PI * 2);
        }
      }
      l.fill();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const newCols = Math.max(1, Math.ceil(width / cell));
      const newRows = Math.max(1, Math.ceil(height / cell));
      if (newCols !== cols || newRows !== rows) {
        cols = newCols;
        rows = newRows;
        grid = new Uint8Array(cols * rows);
        next = new Uint8Array(cols * rows);
        glow = new Float32Array(cols * rows);
        buildPalette();
        seed(Math.floor(cols * 0.72), Math.floor(rows * 0.45), Math.max(4, Math.floor(rows * 0.12)), 0.35);
      }
      buildLattice(dpr);
      draw();
    };

    const step = () => {
      if (pending) {
        seed(pending[0], pending[1], pending[2], 0.7);
        pending = null;
      }

      let firing = 0;
      for (let y = 0; y < rows; y++) {
        const up = ((y - 1 + rows) % rows) * cols;
        const mid = y * cols;
        const down = ((y + 1) % rows) * cols;
        for (let x = 0; x < cols; x++) {
          const state = grid[mid + x];
          if (state === FIRING) {
            next[mid + x] = REFRACTORY;
          } else if (state === REFRACTORY) {
            next[mid + x] = READY;
          } else {
            const l = (x - 1 + cols) % cols;
            const r = (x + 1) % cols;
            const n =
              (grid[up + l] === FIRING ? 1 : 0) +
              (grid[up + x] === FIRING ? 1 : 0) +
              (grid[up + r] === FIRING ? 1 : 0) +
              (grid[mid + l] === FIRING ? 1 : 0) +
              (grid[mid + r] === FIRING ? 1 : 0) +
              (grid[down + l] === FIRING ? 1 : 0) +
              (grid[down + x] === FIRING ? 1 : 0) +
              (grid[down + r] === FIRING ? 1 : 0);
            if (n === 2 && (lastFiring <= TARGET || Math.random() < TARGET / lastFiring)) {
              next[mid + x] = FIRING;
              glow[mid + x] = 1;
              firing++;
            } else {
              next[mid + x] = READY;
            }
          }
        }
      }
      [grid, next] = [next, grid];
      lastFiring = firing / (cols * rows);

      if (reduceMotion) return; // no spontaneous activity: the sheet only answers your input

      if (lastFiring < TARGET && Math.random() < 0.18) {
        const x = Math.floor(cols * (0.4 + Math.random() * 0.6));
        const y = Math.floor(rows * Math.random());
        const vertical = Math.random() < 0.5;
        for (const [dx, dy] of [[0, 0], vertical ? [0, 1] : [1, 0]]) {
          const i = idx((x + dx) % cols, (y + dy) % rows);
          if (grid[i] === READY) {
            grid[i] = FIRING;
            glow[i] = 1;
          }
        }
      }

      quietSteps = firing < 3 ? quietSteps + 1 : 0;
      if (quietSteps > 12) {
        seed(Math.floor(cols * (0.55 + Math.random() * 0.4)), Math.floor(rows * Math.random()), 4, 0.4);
        quietSteps = 0;
      }
    };

    const decay = (ms: number) => {
      const k = Math.exp(-ms / DECAY_MS);
      for (let i = 0; i < glow.length; i++) {
        if (glow[i] > 0) glow[i] = glow[i] < 0.02 ? 0 : glow[i] * k;
      }
    };

    /** Returns true while any cell is still glowing. */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (lattice) ctx.drawImage(lattice, 0, 0, width, height);

      const maxR = cell / 2 - 1;
      let lit = false;
      for (let x = 0; x < cols; x++) {
        const shades = palette[x];
        for (let level = 0; level < LEVELS; level++) {
          const lo = level / LEVELS;
          const hi = (level + 1) / LEVELS;
          let any = false;
          for (let y = 0; y < rows; y++) {
            const g = glow[idx(x, y)];
            if (g <= lo || g > hi || g < 0.04) continue;
            if (!any) {
              ctx.fillStyle = shades[level];
              ctx.beginPath();
              any = true;
            }
            const r = maxR * (0.45 + 0.55 * g);
            const cx = x * cell + cell / 2;
            const cy = y * cell + cell / 2;
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
          if (any) {
            ctx.fill();
            lit = true;
          }
        }
      }
      return lit;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = lastTime ? Math.min(now - lastTime, 100) : 16;
      lastTime = now;
      if (!visible || document.hidden) {
        lastTime = 0;
        return; // resumed by the visibility observers
      }

      const running = !reduceMotion || now < awakeUntil;
      if (running) {
        acc += dt;
        while (acc >= tickMs) {
          step();
          acc -= tickMs;
        }
      }
      decay(dt);
      const lit = draw();

      // Keep animating while the sheet runs or traces are still fading.
      if (running || lit) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) {
        lastTime = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const stimulate = (event: PointerEvent, radius: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cell);
      const y = Math.floor((event.clientY - rect.top) / cell);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return;
      pending = [x, y, radius];
      if (reduceMotion) awakeUntil = performance.now() + 2500;
      wake();
    };
    const onMove = (e: PointerEvent) => stimulate(e, 1);
    const onDown = (e: PointerEvent) => stimulate(e, 3);

    resize();

    if (reduceMotion) {
      // A settled, static frame until someone interacts with it.
      for (let i = 0; i < 30; i++) {
        step();
        decay(tickMs);
      }
      draw();
    } else {
      wake();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion) wake();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && !reduceMotion) wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Listen on the parent so the text above the canvas does not block stimulation.
    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerdown', onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
    };
  }, [cell, tickMs]);

  return <canvas ref={canvasRef} aria-hidden="true" className="neural-board" />;
}
