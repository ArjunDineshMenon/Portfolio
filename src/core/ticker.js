/* ══════════════════════════════════════════════════════════════════════
   ticker — one rAF for the whole page. Nothing else may start a loop.
   Rests when the tab is hidden, and clamps dt after a long stall so the
   world never jumps on return.
   ══════════════════════════════════════════════════════════════════════ */

const subs = [];
let raf = 0;
let last = 0;
let elapsed = 0;
let running = false;

/* rolling frame-time average, read by the perf watchdog */
let avg = 16.7;
export const perf = {
  get fps() {
    return 1000 / avg;
  },
  get ms() {
    return avg;
  },
};

function frame(now) {
  raf = requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;

  if (dt > 0.1) dt = 0.1; // returned from a stall: pretend it was one slow frame
  if (dt <= 0) return;

  elapsed += dt;
  avg += (dt * 1000 - avg) * 0.06;

  for (let i = 0; i < subs.length; i++) subs[i].fn(dt, elapsed);
}

export function start() {
  if (running) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

export function stop() {
  running = false;
  cancelAnimationFrame(raf);
}

/** add(fn, order) — lower order runs first */
export function add(fn, order = 0) {
  subs.push({ fn, order });
  subs.sort((a, b) => a.order - b.order);
  return () => remove(fn);
}

export function remove(fn) {
  const i = subs.findIndex((s) => s.fn === fn);
  if (i > -1) subs.splice(i, 1);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
  else start();
});
