import { useEffect, useRef } from 'react';

/**
 * Brian's Brain: a three-state cellular automaton that behaves like a sheet of excitable cells.
 *   ready      → fires if exactly two neighbours are firing
 *   firing     → becomes refractory on the next step
 *   refractory → becomes ready again
 * Firing cells are drawn with the cuicui gradient (sky → violet → orange), refractory cells as faint grey dots.
 * Moving the pointer over the board stimulates the cells beneath it.
 */

const READY = 0;
const FIRING = 1;
const REFRACTORY = 2;

type Props = {
  cell?: number; // cell size in CSS pixels
  tickMs?: number; // time between generations
};

export default function NeuralBoard({ cell = 9, tickMs = 130 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);
    let colours: string[] = [];
    let timer: number | undefined;
    let visible = true;
    let quietSteps = 0;
    let pending: [number, number] | null = null; // last pointer position, applied once per tick
    let lastFiring = 0;
    const TARGET = 0.022; // homeostatic set point: the share of cells firing at once

    const idx = (x: number, y: number) => y * cols + x;

    // Seed a loose cluster of firing cells; the hero "grows" from it on load.
    const seed = (cx: number, cy: number, radius: number, density: number) => {
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y > radius * radius) continue;
          const gx = (cx + x + cols) % cols;
          const gy = (cy + y + rows) % rows;
          if (Math.random() < density) grid[idx(gx, gy)] = FIRING;
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const newCols = Math.max(1, Math.ceil(rect.width / cell));
      const newRows = Math.max(1, Math.ceil(rect.height / cell));
      if (newCols === cols && newRows === rows) return draw();

      cols = newCols;
      rows = newRows;
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);

      // Pre-compute one gradient colour per column: sky-400 → violet-500 → orange-400, left to right.
      const stops = [
        [56, 189, 248],
        [139, 92, 246],
        [251, 146, 60],
      ];
      colours = Array.from({ length: cols }, (_, x) => {
        const t = cols > 1 ? x / (cols - 1) : 0;
        const seg = t < 0.5 ? 0 : 1;
        const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
        const [r, g, b] = [0, 1, 2].map((i) => Math.round(stops[seg][i] + (stops[seg + 1][i] - stops[seg][i]) * u));
        return `rgb(${r} ${g} ${b})`;
      });

      seed(Math.floor(cols * 0.72), Math.floor(rows * 0.45), Math.max(4, Math.floor(rows * 0.12)), 0.35);
      draw();
    };

    const step = () => {
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
            // Homeostatic inhibition: when the board is too active, some cells are held back.
            if (n === 2 && (lastFiring <= TARGET || Math.random() < TARGET / lastFiring)) {
              next[mid + x] = FIRING;
              firing++;
            } else {
              next[mid + x] = READY;
            }
          }
        }
      }
      [grid, next] = [next, grid];
      lastFiring = firing / (cols * rows);

      // Spontaneous activity: now and then a pair of adjacent cells fires on its own,
      // which in Brian's Brain is enough to launch travelling waves.
      if (lastFiring < TARGET && Math.random() < 0.18) {
        const x = Math.floor(cols * (0.4 + Math.random() * 0.6));
        const y = Math.floor(rows * Math.random());
        const vertical = Math.random() < 0.5;
        grid[idx(x % cols, y % rows)] = FIRING;
        grid[idx((x + (vertical ? 0 : 1)) % cols, (y + (vertical ? 1 : 0)) % rows)] = FIRING;
      }

      // If activity dies out, re-seed a small cluster somewhere on the right half.
      quietSteps = firing < 3 ? quietSteps + 1 : 0;
      if (quietSteps > 12) {
        seed(
          Math.floor(cols * (0.55 + Math.random() * 0.4)),
          Math.floor(rows * Math.random()),
          4,
          0.4,
        );
        quietSteps = 0;
      }
    };

    const draw = () => {
      const w = cols * cell;
      const h = rows * cell;
      ctx.clearRect(0, 0, w, h);
      const size = cell - 2;
      const r = size / 2;

      // Refractory cells: faint grey dots
      ctx.fillStyle = 'rgb(250 250 250 / 0.11)';
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[idx(x, y)] === REFRACTORY) {
            ctx.moveTo(x * cell + 1 + size, y * cell + 1 + r);
            ctx.arc(x * cell + 1 + r, y * cell + 1 + r, r * 0.7, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      // Firing cells: gradient colour by column
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = colours[x];
        ctx.beginPath();
        let any = false;
        for (let y = 0; y < rows; y++) {
          if (grid[idx(x, y)] === FIRING) {
            ctx.moveTo(x * cell + 1 + size, y * cell + 1 + r);
            ctx.arc(x * cell + 1 + r, y * cell + 1 + r, r, 0, Math.PI * 2);
            any = true;
          }
        }
        if (any) ctx.fill();
      }
    };

    const tick = () => {
      if (visible && !document.hidden) {
        if (pending) {
          seed(pending[0], pending[1], 1, 0.7);
          pending = null;
        }
        step();
        draw();
      }
    };

    const stimulate = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cell);
      const y = Math.floor((event.clientY - rect.top) / cell);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return;
      if (reduceMotion) {
        seed(x, y, 1, 0.7);
        draw();
      } else {
        pending = [x, y];
      }
    };

    resize();

    if (reduceMotion) {
      // Show a settled, static frame instead of animating.
      for (let i = 0; i < 40; i++) step();
      draw();
    } else {
      timer = window.setInterval(tick, tickMs);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    // Listen on the parent so the text above the canvas does not block stimulation.
    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', stimulate);

    return () => {
      window.clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', stimulate);
    };
  }, [cell, tickMs]);

  return <canvas ref={canvasRef} aria-hidden="true" className="neural-board" />;
}
