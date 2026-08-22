/* ══════════════════════════════════════════════════════════════════════
   caps — what this device can actually handle.
   Decided once at boot, then adjusted down at runtime if frames drop.
   ══════════════════════════════════════════════════════════════════════ */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    // A software rasteriser will technically pass, so bail on the known ones.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      if (r.includes('swiftshader') || r.includes('llvmpipe') || r.includes('software')) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function pickTier() {
  const coarse = matchMedia('(hover: none), (pointer: coarse)').matches;
  const narrow = Math.min(innerWidth, innerHeight) < 620;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;

  if (coarse || narrow) return 1;
  if (cores <= 4 || mem <= 4) return 2;
  return 3;
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export const caps = {
  webgl: hasWebGL(),
  reduced: reduced.matches,
  touch: matchMedia('(hover: none), (pointer: coarse)').matches,
  tier: pickTier(),
  dpr: 1,

  /* per-tier budgets, read by the world modules */
  get toriiCount() {
    return this.tier >= 3 ? 42000 : this.tier === 2 ? 22000 : 9000;
  },
  get seaSegments() {
    return this.tier >= 3 ? 200 : this.tier === 2 ? 128 : 72;
  },
  get dustCount() {
    return this.tier >= 3 ? 2600 : this.tier === 2 ? 1500 : 700;
  },
  get bloom() {
    return this.tier >= 2;
  },
  get grade() {
    return this.tier >= 2;
  },
  get shadows() {
    return false; // never worth the cost here
  },
  get maxDpr() {
    return this.tier >= 3 ? 1.75 : this.tier === 2 ? 1.5 : 1.25;
  },
};

caps.dpr = Math.min(devicePixelRatio || 1, caps.maxDpr);

/** Called by the perf watchdog when the frame budget is being missed. */
export function downgrade() {
  if (caps.tier <= 1) return false;
  caps.tier -= 1;
  caps.dpr = Math.min(devicePixelRatio || 1, caps.maxDpr);
  return true;
}

/** The visitor can flip reduced-motion mid-session. */
export function onReducedChange(fn) {
  const h = (e) => {
    caps.reduced = e.matches;
    fn(e.matches);
  };
  if (reduced.addEventListener) reduced.addEventListener('change', h);
  else reduced.addListener(h);
}
