/* ══════════════════════════════════════════════════════════════════════
   chrome — nav, drawer, scroll rail, anchor scrolling, active section.
   ══════════════════════════════════════════════════════════════════════ */

import { add } from '../core/ticker.js';
import { scroll, sections, scrollTo, getLenis } from '../core/scroll.js';
import { $, $$ } from '../core/util.js';

const ORDER = ['hero', 'about', 'skills', 'work', 'path', 'record', 'contact'];

export function initChrome() {
  const nav = $('#nav');
  const burger = $('#burger');
  const drawer = $('#drawer');
  const rail = $('.rail');
  const railFill = $('#railFill');
  const railLabel = $('#railLabel');
  const links = $$('[data-nav]');

  /* ── anchor clicks run through Lenis ──────────────────────── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    closeDrawer();
    scrollTo(el, { offset: id === '#hero' ? 0 : -10 });
  });

  /* ── drawer ───────────────────────────────────────────────── */
  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    const l = getLenis();
    if (l) l.stop();
    else document.body.classList.add('is-locked');
    const first = drawer.querySelector('a');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 220);
  }

  function closeDrawer() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    const l = getLenis();
    if (l) l.start();
    else document.body.classList.remove('is-locked');
  }

  burger.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) closeDrawer();
    else openDrawer();
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── per-frame chrome state ───────────────────────────────── */
  let stuck = false;
  let activeId = 'hero';
  let railOn = false;

  add(() => {
    // nav background appears once the hero has started leaving
    const wantStuck = scroll.y > 60;
    if (wantStuck !== stuck) {
      stuck = wantStuck;
      nav.classList.toggle('is-stuck', stuck);
    }

    // rail
    const wantRail = scroll.p > 0.02 && scroll.p < 0.995;
    if (wantRail !== railOn) {
      railOn = wantRail;
      rail.classList.toggle('is-on', railOn);
    }
    railFill.style.height = (scroll.p * 100).toFixed(2) + '%';

    // which section owns the middle of the screen
    const mid = scroll.y + innerHeight * 0.42;
    let found = 'hero';
    for (const s of sections) {
      if (mid >= s.top && mid < s.top + s.height) {
        found = s.el.id;
        break;
      }
      if (mid >= s.top) found = s.el.id;
    }

    if (found !== activeId) {
      activeId = found;
      const i = Math.max(0, ORDER.indexOf(activeId));
      railLabel.textContent = String(i).padStart(2, '0');
      links.forEach((l) => {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + activeId);
      });
    }
  }, 10);

  /* ── reveal the nav after boot ────────────────────────────── */
  return {
    show() {
      nav.animate(
        [
          { transform: 'translateY(-100%)' },
          { transform: 'translateY(0)' },
        ],
        { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
    },
    closeDrawer,
    get activeId() {
      return activeId;
    },
  };
}

/* ── toast ─────────────────────────────────────────────────────── */
let toastTimer = 0;
export function toast(msg, ms = 3600) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-up');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-up'), ms);
}
