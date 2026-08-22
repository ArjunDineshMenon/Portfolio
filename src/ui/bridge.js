/* ══════════════════════════════════════════════════════════════════════
   bridge — the wiring between the page and the world. Every link runs
   both ways: hover a chip and its node lights, hover a node and its chip
   lights. Same for the project slabs and the roadmap milestones.
   ══════════════════════════════════════════════════════════════════════ */

import { add } from '../core/ticker.js';
import { caps } from '../core/caps.js';
import { $$ } from '../core/util.js';

/** read the skill chips straight out of the DOM so there is one source */
export function readSkills() {
  const out = [];
  $$('[data-skgroup]').forEach((groupEl, g) => {
    $$('.chip[data-skill]', groupEl).forEach((el) => {
      out.push({
        id: el.dataset.skill,
        el,
        on: el.classList.contains('is-on'),
        group: g,
        node: -1,
      });
    });
  });
  return out;
}

export function initBridge(world, skills) {
  const { api } = world;

  /* ── skills ───────────────────────────────────────────────── */
  const pinned = new Set();

  skills.forEach((s) => {
    const enter = () => api.skills.light(s.node, true);
    const leave = () => {
      if (!pinned.has(s.node)) api.skills.light(s.node, false);
    };

    s.el.addEventListener('pointerenter', enter);
    s.el.addEventListener('pointerleave', leave);
    s.el.addEventListener('focus', enter);
    s.el.addEventListener('blur', leave);

    s.el.addEventListener('click', () => {
      if (pinned.has(s.node)) {
        pinned.delete(s.node);
        s.el.classList.remove('is-lit');
        api.skills.light(s.node, false);
      } else {
        pinned.add(s.node);
        s.el.classList.add('is-lit');
        api.skills.light(s.node, true);
      }
    });

    s.el.setAttribute('aria-pressed', 'false');
  });

  // 3D → DOM: whatever node the pointer is over lights its chip
  let lastHover = -1;
  if (!caps.touch) {
    add(() => {
      const h = api.skills.hovered;
      if (h === lastHover) return;
      if (lastHover >= 0) {
        const prev = skills.find((s) => s.node === lastHover);
        if (prev && !pinned.has(prev.node)) prev.el.classList.remove('is-lit');
      }
      if (h >= 0) {
        const now = skills.find((s) => s.node === h);
        if (now) now.el.classList.add('is-lit');
      }
      lastHover = h;
    }, 15);
  }

  // keep aria-pressed honest
  const syncPressed = () => {
    skills.forEach((s) => s.el.setAttribute('aria-pressed', pinned.has(s.node) ? 'true' : 'false'));
  };
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('.chip')) syncPressed();
  });

  /* ── projects ─────────────────────────────────────────────── */
  $$('[data-proj]').forEach((el, i) => {
    const idx = parseInt(el.dataset.tint || String(i), 10);
    el.addEventListener('pointerenter', () => api.projects.hover(idx, true));
    el.addEventListener('pointerleave', () => api.projects.hover(idx, false));
    // keyboard users get the same feedback through the link inside the card
    el.addEventListener('focusin', () => api.projects.hover(idx, true));
    el.addEventListener('focusout', () => api.projects.hover(idx, false));
  });

  /* ── roadmap ──────────────────────────────────────────────── */
  const tlItems = $$('.tl__item');

  tlItems.forEach((el, i) => {
    el.addEventListener('pointerenter', () => api.path.highlight(i, true));
    el.addEventListener('pointerleave', () => api.path.highlight(i, false));
  });

  // world → DOM: as the climb passes each milestone, its row goes live
  api.path.onReach((top) => {
    tlItems.forEach((el, i) => {
      el.classList.toggle('is-live', i <= top);
    });
  });

  return {
    clear() {
      api.skills.clearLights();
      api.projects.clear();
      api.path.clear();
      pinned.clear();
    },
  };
}
