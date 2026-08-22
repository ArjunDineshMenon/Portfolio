/* ══════════════════════════════════════════════════════════════════════
   preloader — nothing here is fake. The meter tracks the real work:
   fonts resolving, shaders compiling, the first frame landing. It holds a
   short floor only so the gate's assembly is not cut off mid-build.
   ══════════════════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { $ } from '../core/util.js';

export function initPreloader() {
  const el = $('#preloader');
  const fill = $('#plFill');
  const pct = $('#plPct');
  const stageEl = $('#plStage');

  let shown = 0;
  let target = 0;
  let raf = 0;

  const paint = () => {
    shown += (target - shown) * 0.14;
    if (target - shown < 0.004) shown = target;
    fill.style.width = (shown * 100).toFixed(1) + '%';
    pct.textContent = String(Math.round(shown * 100)).padStart(2, '0');
    if (shown < target - 0.0005 || shown < 1) raf = requestAnimationFrame(paint);
  };

  const api = {
    set(p, stage) {
      target = Math.max(target, Math.min(1, p));
      if (stage && stageEl) stageEl.textContent = stage;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    },

    /** returns once the curtain is fully out of the way */
    async finish() {
      api.set(1, 'ready');
      await new Promise((r) => setTimeout(r, 320));

      el.classList.add('is-gone');

      await gsap
        .timeline()
        .to('.preloader__inner', { y: -22, opacity: 0, duration: 0.55, ease: 'power2.in' })
        .to(
          el,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.0,
            ease: 'expo.inOut',
          },
          '-=0.2'
        )
        .then();

      el.style.display = 'none';
      cancelAnimationFrame(raf);
    },
  };

  return api;
}
