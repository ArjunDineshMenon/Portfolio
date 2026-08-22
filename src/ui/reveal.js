/* ══════════════════════════════════════════════════════════════════════
   reveal — the page's own choreography. Split-type entrances, per-section
   staggers, counters, and a different entrance for each kind of block so
   no two moments arrive the same way.
   ══════════════════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { caps } from '../core/caps.js';
import { $$ } from '../core/util.js';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const EASE = 'expo.out';

/** hero entrances are held back until the preloader has cleared */
const heroTweens = [];

/* ── split plain text into words then characters ──────────────── */
export function splitText(el) {
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  if (!text) return [];

  el.setAttribute('aria-label', text);
  el.textContent = '';
  el.style.perspective = '620px';

  const chars = [];
  const words = text.split(' ');

  words.forEach((word, wi) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.setAttribute('aria-hidden', 'true');
    for (const ch of word) {
      const c = document.createElement('span');
      c.className = 'ch';
      c.textContent = ch;
      w.appendChild(c);
      chars.push(c);
    }
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });

  return chars;
}

/* ══ the whole page's reveal set ═════════════════════════════════ */
export function initReveal() {
  if (caps.reduced) {
    document.body.classList.add('no-motion');
    return { hero: () => {} };
  }

  const trig = (el, start = 'top 82%') => ({
    trigger: el,
    start,
    once: true,
  });

  /* ── 1. split titles ──────────────────────────────────────── */
  $$('[data-split]').forEach((el) => {
    const chars = splitText(el);
    if (!chars.length) return;
    const isHero = el.closest('.hero') !== null;

    const tween = gsap.fromTo(
      chars,
      { yPercent: 116, opacity: 0, rotateX: -62 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.08,
        ease: EASE,
        stagger: { each: isHero ? 0.032 : 0.016 },
        paused: isHero,
      }
    );

    if (isHero) {
      heroTweens.push(tween);
    } else {
      tween.pause();
      ScrollTrigger.create({ ...trig(el, 'top 86%'), onEnter: () => tween.play() });
    }
  });

  /* ── 2. rising blocks ─────────────────────────────────────── */
  $$('[data-rise]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    const isHero = el.closest('.hero') !== null;

    const tween = gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.15, ease: EASE, delay: isHero ? delay : delay * 0.6, paused: true }
    );

    if (isHero) heroTweens.push(tween);
    else ScrollTrigger.create({ ...trig(el), onEnter: () => tween.play() });
  });

  /* ── 3. staggered card grids ──────────────────────────────── */
  $$('[data-stagger]').forEach((wrap) => {
    const kids = $$('[data-fact]', wrap);
    if (!kids.length) return;
    const tween = gsap.fromTo(
      kids,
      { y: 34, opacity: 0, scale: 0.975 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: EASE,
        stagger: { each: 0.07, from: 'start' },
        paused: true,
      }
    );
    ScrollTrigger.create({ ...trig(wrap, 'top 80%'), onEnter: () => tween.play() });
  });

  /* ── 4. project slabs, wiping in from the left edge ───────── */
  $$('[data-proj]').forEach((el, i) => {
    const tween = gsap.fromTo(
      el,
      { x: -26, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      {
        x: 0,
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.25,
        ease: 'expo.inOut',
        paused: true,
      }
    );
    ScrollTrigger.create({ ...trig(el, 'top 84%'), onEnter: () => tween.play() });
  });

  /* ── 5. timeline rows, each with its dot popping after ────── */
  $$('.tl__item').forEach((el) => {
    const tween = gsap.fromTo(
      el,
      { x: 22, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.0, ease: EASE, paused: true }
    );
    ScrollTrigger.create({ ...trig(el, 'top 88%'), onEnter: () => tween.play() });
  });

  /* ── 6. education entries ─────────────────────────────────── */
  $$('.edu__item').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    const tween = gsap.fromTo(
      el,
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.05, ease: EASE, delay: delay * 0.6, paused: true }
    );
    ScrollTrigger.create({ ...trig(el, 'top 86%'), onEnter: () => tween.play() });
  });

  /* ── 7. counters ──────────────────────────────────────────── */
  $$('[data-count]').forEach((el) => {
    const raw = el.dataset.count;
    const target = parseFloat(raw);
    if (!isFinite(target)) return;
    const decimals = (raw.split('.')[1] || '').length;
    const obj = { v: 0 };

    const tween = gsap.to(obj, {
      v: target,
      duration: 1.9,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals);
      },
      onComplete: () => {
        el.textContent = raw;
      },
    });

    el.textContent = (0).toFixed(decimals);
    ScrollTrigger.create({ ...trig(el, 'top 92%'), onEnter: () => tween.play() });
  });

  return {
    /** run the hero's entrance once the preloader is out of the way */
    hero() {
      heroTweens.forEach((t) => t.delay((t.vars.delay || 0) + 0.06).play());
    },
    refresh() {
      ScrollTrigger.refresh();
    },
  };
}

export { ScrollTrigger };
