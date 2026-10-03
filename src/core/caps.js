/* ══════════════════════════════════════════════════════════════════════
   caps — what this device can actually handle.
   Decided once at boot, then adjusted down at runtime if frames drop.
   ══════════════════════════════════════════════════════════════════════ */

function detectWebGL() {
  let gl = null;
  try {
    const c = document.createElement('canvas');
    // Three.js r169 requires WebGL 2. A WebGL 1 context cannot run the scene.
    gl = c.getContext('webgl2');
    if (!gl) return { available: false, software: false };
    // Software rendering can still animate. Start with the smallest budget
    // instead of hiding the entire world when hardware acceleration is off.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    let software = false;
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      software = /swiftshader|llvmpipe|software/.test(r);
    }
    return { available: true, software };
  } catch {
    return { available: false, software: false };
  } finally {
    // The probe is separate from the renderer's canvas; release its resources.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
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
const webgl = detectWebGL();

export const caps = {
  webgl: webgl.available,
  reduced: reduced.matches,
  touch: matchMedia('(hover: none), (pointer: coarse)').matches,
  tier: webgl.software ? 1 : pickTier(),
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
