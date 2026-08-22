/* ── small math + dom helpers used everywhere ─────────────────── */

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

export const lerp = (a, b, t) => a + (b - a) * t;

export const invLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));

/** frame-rate independent exponential smoothing */
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

export const smoothstep = (a, b, v) => {
  const t = clamp(invLerp(a, b, v));
  return t * t * (3 - 2 * t);
};

export const smootherstep = (a, b, v) => {
  const t = clamp(invLerp(a, b, v));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** uniform catmull-rom through p0..p3 at local u (0..1 between p1 and p2) */
export const catmull = (p0, p1, p2, p3, u) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    ((2 * p1) +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
};

/** deterministic pseudo-random so the world is identical every load */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** point uniformly inside a unit sphere */
export function inSphere(rand) {
  let x, y, z, d;
  do {
    x = rand() * 2 - 1;
    y = rand() * 2 - 1;
    z = rand() * 2 - 1;
    d = x * x + y * y + z * z;
  } while (d > 1 || d === 0);
  return [x, y, z];
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
