/* ══════════════════════════════════════════════════════════════════════
   pointer — one source of truth for where the visitor is pointing,
   smoothed, plus drag state for the skill field.
   ══════════════════════════════════════════════════════════════════════ */

import { add } from './ticker.js';
import { damp } from './util.js';

export const pointer = {
  /* raw normalised device coords, -1..1 */
  x: 0,
  y: 0,
  /* smoothed, what the world should actually read */
  sx: 0,
  sy: 0,
  /* pixels */
  px: innerWidth / 2,
  py: innerHeight / 2,
  /* velocity magnitude in ndc/sec, used to add energy to particles */
  speed: 0,
  down: false,
  dragging: false,
  dx: 0, // drag delta this frame, ndc
  dy: 0,
  inside: false,
};

let lastX = 0;
let lastY = 0;
let downX = 0;
let downY = 0;
let accX = 0;
let accY = 0;

function setFromEvent(e) {
  pointer.px = e.clientX;
  pointer.py = e.clientY;
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -((e.clientY / innerHeight) * 2 - 1);
  pointer.inside = true;
}

export function initPointer() {
  addEventListener(
    'pointermove',
    (e) => {
      setFromEvent(e);
      if (pointer.down) {
        accX += pointer.x - lastX;
        accY += pointer.y - lastY;
        if (!pointer.dragging && Math.hypot(e.clientX - downX, e.clientY - downY) > 5) {
          pointer.dragging = true;
        }
      }
      lastX = pointer.x;
      lastY = pointer.y;
    },
    { passive: true }
  );

  addEventListener(
    'pointerdown',
    (e) => {
      setFromEvent(e);
      lastX = pointer.x;
      lastY = pointer.y;
      downX = e.clientX;
      downY = e.clientY;
      pointer.down = true;
    },
    { passive: true }
  );

  const up = () => {
    pointer.down = false;
    // dragging stays true for one more frame so click handlers can check it
    requestAnimationFrame(() => {
      pointer.dragging = false;
    });
  };
  addEventListener('pointerup', up, { passive: true });
  addEventListener('pointercancel', up, { passive: true });
  addEventListener('blur', up);

  document.addEventListener('pointerleave', () => {
    pointer.inside = false;
  });

  add((dt) => {
    const k = 7.5;
    const nx = damp(pointer.sx, pointer.inside ? pointer.x : 0, k, dt);
    const ny = damp(pointer.sy, pointer.inside ? pointer.y : 0, k, dt);
    pointer.speed = Math.hypot(nx - pointer.sx, ny - pointer.sy) / dt;
    pointer.sx = nx;
    pointer.sy = ny;

    pointer.dx = accX;
    pointer.dy = accY;
    accX = 0;
    accY = 0;
  }, -20);
}
