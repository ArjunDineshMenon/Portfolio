/* ══════════════════════════════════════════════════════════════════════
   cursor — a hard dot that tracks exactly and a ring that trails behind
   it. Grows over anything clickable, goes dashed over the draggable field.
   Desktop only; touch devices never see it.
   ══════════════════════════════════════════════════════════════════════ */

import { add } from '../core/ticker.js';
import { pointer } from '../core/pointer.js';
import { caps } from '../core/caps.js';
import { damp } from '../core/util.js';
import { $ } from '../core/util.js';

const HOT = 'a, button, input, textarea, label, .chip, .fact, .dlink, [data-proj], .cert';

export function initCursor() {
  if (caps.touch || caps.reduced) return { show() {} };

  const el = $('#cursor');
  const dot = el.querySelector('.cursor__dot');
  const ring = el.querySelector('.cursor__ring');
  if (!el) return { show() {} };

  document.documentElement.classList.add('has-cursor');

  let rx = innerWidth / 2;
  let ry = innerHeight / 2;
  let hot = false;
  let drag = false;

  addEventListener(
    'pointerover',
    (e) => {
      const t = e.target;
      const isHot = t instanceof Element && t.closest(HOT) !== null;
      if (isHot !== hot) {
        hot = isHot;
        el.classList.toggle('is-hot', hot);
      }
      const inField = t instanceof Element && t.closest('#skills') !== null;
      if (inField !== drag) {
        drag = inField;
        el.classList.toggle('is-drag', drag);
      }
    },
    { passive: true }
  );

  add((dt) => {
    dot.style.transform = `translate(${pointer.px}px, ${pointer.py}px) translate(-50%, -50%)`;
    rx = damp(rx, pointer.px, 13, dt);
    ry = damp(ry, pointer.py, 13, dt);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  }, 20);

  return {
    show() {
      el.classList.add('is-on');
    },
  };
}
