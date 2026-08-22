/* ══════════════════════════════════════════════════════════════════════
   scroll — Lenis for the feel, one measured progress value for the world,
   and per-section ranges so the 3D always lines up with the DOM.
   ══════════════════════════════════════════════════════════════════════ */

import Lenis from 'lenis';
import { add } from './ticker.js';
import { caps } from './caps.js';
import { clamp, invLerp } from './util.js';

export const scroll = {
  y: 0,
  max: 1,
  /** 0..1 across the whole document */
  p: 0,
  /** signed velocity in px/sec, smoothed */
  v: 0,
  /** 0..1 how fast the visitor is flicking, for motion blur style effects */
  energy: 0,
  dir: 1,
};

/** [{ id, el, start, end }] in DOM order, fractions of total scroll */
export const sections = [];

let lenis = null;
let lastY = 0;

export function measure() {
  scroll.max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  sections.length = 0;
  document.querySelectorAll('[data-scene]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scroll.y;
    sections.push({
      id: el.dataset.scene,
      el,
      top,
      height: rect.height,
      start: clamp(top / scroll.max),
      end: clamp((top + rect.height) / scroll.max),
    });
  });
}

/** 0..1 progress through a named section (0 = its top hits the top) */
export function sectionProgress(id) {
  const s = sections.find((x) => x.id === id);
  if (!s) return 0;
  return clamp(invLerp(s.start, s.end, scroll.p));
}

export function getLenis() {
  return lenis;
}

export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.35, ...opts });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

export function initScroll(onScroll) {
  if (!caps.reduced) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      syncTouch: false,
      autoResize: true,
    });
  }

  scroll.y = window.scrollY || 0;
  lastY = scroll.y;
  measure();

  add((dt) => {
    if (lenis) lenis.raf(performance.now());

    const y = lenis ? lenis.scroll : window.scrollY || 0;
    const raw = (y - lastY) / dt;
    lastY = y;

    scroll.y = y;
    scroll.p = clamp(y / scroll.max);
    scroll.v += (raw - scroll.v) * Math.min(1, dt * 9);
    if (Math.abs(raw) > 4) scroll.dir = raw > 0 ? 1 : -1;

    const e = clamp(Math.abs(scroll.v) / 2600);
    scroll.energy += (e - scroll.energy) * Math.min(1, dt * 6);

    if (onScroll) onScroll(scroll);
  }, -10);

  let rt = 0;
  const remeasure = () => {
    clearTimeout(rt);
    rt = setTimeout(measure, 140);
  };
  addEventListener('resize', remeasure);
  addEventListener('orientationchange', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  // Late layout shifts (images, font swap, revealed sections) invalidate the map.
  if ('ResizeObserver' in window) {
    new ResizeObserver(remeasure).observe(document.body);
  }

  return lenis;
}

export function stopScroll() {
  if (lenis) lenis.stop();
  else document.body.classList.add('is-locked');
}

export function startScrollInput() {
  if (lenis) lenis.start();
  else document.body.classList.remove('is-locked');
}
