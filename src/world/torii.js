/* ══════════════════════════════════════════════════════════════════════
   torii — the hero centerpiece. A myōjin-style gate sampled as a solid
   volume into ~42k points, drifting on a curl field, scattering away from
   the cursor, assembling on load and dispersing as the camera flies
   through it.

   Layout note: the gate stands at the world origin so the whole journey
   runs down -Z from here.
   ══════════════════════════════════════════════════════════════════════ */

import {
  BufferGeometry,
  BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  Vector3,
  Color,
} from 'three';

import { caps } from '../core/caps.js';
import { pointer } from '../core/pointer.js';
import { scroll } from '../core/scroll.js';
import { clamp, damp, smoothstep, mulberry32, inSphere } from '../core/util.js';
import { NOISE, SPRITE, FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';

/* ── proportions ─────────────────────────────────────────────── */
const H = {
  pillarX: 3.05,
  pillarTop: 5.68,
  pillarR0: 0.325,
  pillarR1: 0.255,
  lean: 0.11,

  daiwaY: 5.66,
  daiwaR: 0.40,
  daiwaH: 0.2,

  nukiY: 4.74,
  nukiW: 7.5,
  nukiT: 0.36,
  nukiD: 0.46,

  strutY: 5.42,
  strutH: 1.0,
  strutS: 0.33,

  shimakiY: 5.96,
  shimakiW: 8.7,
  shimakiT: 0.26,
  shimakiD: 0.52,
  shimakiRise: 0.2,

  kasagiY: 6.32,
  kasagiW: 9.5,
  kasagiT: 0.36,
  kasagiD: 0.66,
  kasagiRise: 0.42,
};

export const TORII_CENTER = new Vector3(0, 3.3, 0);

/* PART ids drive the colour split: 0 pillar, 1 beam, 2 strut/collar */
function buildPoints(count) {
  const rand = mulberry32(0x5eed17);

  /* relative sampling weights, roughly volume with the top lintel pushed
     up a little because it is the silhouette people read first */
  const parts = [
    { w: 1.55, part: 0, fn: pillar(-1) },
    { w: 1.55, part: 0, fn: pillar(1) },
    { w: 0.14, part: 2, fn: daiwa(-1) },
    { w: 0.14, part: 2, fn: daiwa(1) },
    { w: 1.28, part: 1, fn: nuki },
    { w: 0.14, part: 2, fn: strut },
    { w: 1.34, part: 1, fn: beam(H.shimakiW, H.shimakiY, H.shimakiT, H.shimakiD, H.shimakiRise) },
    { w: 2.36, part: 1, fn: beam(H.kasagiW, H.kasagiY, H.kasagiT, H.kasagiD, H.kasagiRise) },
  ];

  const total = parts.reduce((s, p) => s + p.w, 0);
  let assigned = 0;
  parts.forEach((p, i) => {
    p.n = i === parts.length - 1 ? count - assigned : Math.round((p.w / total) * count);
    assigned += p.n;
  });

  const pos = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scale = new Float32Array(count);
  const part = new Float32Array(count);

  let k = 0;
  for (const grp of parts) {
    for (let i = 0; i < grp.n; i++, k++) {
      // 68% through the volume, 32% pushed toward the surface so the
      // silhouette stays crisp instead of foggy
      const surf = rand() > 0.68;
      const p = grp.fn(rand, surf);
      pos[k * 3] = p[0];
      pos[k * 3 + 1] = p[1];
      pos[k * 3 + 2] = p[2];

      // where this point starts before the gate assembles: a wide shell,
      // biased toward the camera so they sweep in past the viewer
      const s = inSphere(rand);
      const rad = 17 + rand() * 21;
      scatter[k * 3] = s[0] * rad;
      scatter[k * 3 + 1] = TORII_CENTER.y + s[1] * rad * 0.6;
      scatter[k * 3 + 2] = s[2] * rad + 6 + rand() * 12;

      seed[k] = rand();
      scale[k] = 0.55 + Math.pow(rand(), 2.2) * 1.5;
      part[k] = grp.part;
    }
  }

  return { pos, scatter, seed, scale, part };
}

/* ── samplers, each returns [x, y, z] ───────────────────────── */
function pillar(sign) {
  return (rand, surf) => {
    const u = rand();
    const y = u * H.pillarTop;
    const r = H.pillarR0 + (H.pillarR1 - H.pillarR0) * u;
    const rr = surf ? r * (0.87 + rand() * 0.13) : r * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    const x = sign * (H.pillarX - H.lean * u) + Math.cos(a) * rr;
    const z = Math.sin(a) * rr;
    return [x, y, z];
  };
}

function daiwa(sign) {
  return (rand, surf) => {
    const a = rand() * Math.PI * 2;
    const rr = surf ? H.daiwaR * (0.88 + rand() * 0.12) : H.daiwaR * Math.sqrt(rand());
    return [
      sign * (H.pillarX - H.lean) + Math.cos(a) * rr,
      H.daiwaY + (rand() - 0.5) * H.daiwaH,
      Math.sin(a) * rr,
    ];
  };
}

function nuki(rand, surf) {
  return boxSample(rand, surf, 0, H.nukiY, 0, H.nukiW, H.nukiT, H.nukiD);
}

function strut(rand, surf) {
  return boxSample(rand, surf, 0, H.strutY, 0, H.strutS, H.strutH, H.strutS);
}

function boxSample(rand, surf, cx, cy, cz, sx, sy, sz) {
  let x = (rand() - 0.5) * sx;
  let y = (rand() - 0.5) * sy;
  let z = (rand() - 0.5) * sz;
  if (surf) {
    // snap one axis to a face
    const pick = Math.floor(rand() * 3);
    const s = rand() > 0.5 ? 0.5 : -0.5;
    if (pick === 0) x = s * sx;
    else if (pick === 1) y = s * sy;
    else z = s * sz;
  }
  return [cx + x, cy + y, cz + z];
}

/** the curved top lintels: thickness tapers and the ends lift, the way a
    myōjin kasagi does */
function beam(width, baseY, thick, depth, rise) {
  const half = width / 2;
  return (rand, surf) => {
    const tx = rand() * 2 - 1; // -1..1 along the beam
    const ax = Math.abs(tx);
    const x = tx * half;
    const lift = rise * Math.pow(ax, 2.35);
    const taper = 1 - 0.3 * Math.pow(ax, 3.2);
    const th = thick * taper;
    const dp = depth * taper;

    let y = (rand() - 0.5) * th;
    let z = (rand() - 0.5) * dp;
    if (surf) {
      const s = rand() > 0.5 ? 0.5 : -0.5;
      if (rand() > 0.42) y = s * th;
      else z = s * dp;
    }
    return [x, baseY + lift + y, z];
  };
}

/* ══ the object ═════════════════════════════════════════════════ */
export function createTorii() {
  const count = caps.toriiCount;
  const { pos, scatter, seed, scale, part } = buildPoints(count);

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aScatter', new BufferAttribute(scatter, 3));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aScale', new BufferAttribute(scale, 1));
  geo.setAttribute('aPart', new BufferAttribute(part, 1));
  geo.boundingSphere = null;
  geo.computeBoundingSphere();

  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uForm: { value: 0 },
      uDisperse: { value: 0 },
      // Fewer particles need larger sprites to keep the gate's silhouette
      // visible on the lowest tier, which also has no bloom pass.
      uSize: { value: caps.tier >= 3 ? 1.0 : caps.tier === 2 ? 1.35 : 2.2 },
      uDpr: { value: caps.dpr },
      uOpacity: { value: 0.62 },
      uPointer: { value: new Vector3(0, 3.2, 400) },
      uPointerK: { value: 0 },
      uFog: { value: FOG_DENSITY },
      uColLo: { value: new Color(PAL.shuDeep) },
      uColHi: { value: new Color(PAL.shu) },
      uColHot: { value: new Color(PAL.boneWarm) },
      uColBeam: { value: new Color(PAL.shuLift) },
      uEnergy: { value: 0 },
    },

    vertexShader: /* glsl */ `
      precision highp float;

      attribute vec3  aScatter;
      attribute float aSeed;
      attribute float aScale;
      attribute float aPart;

      uniform float uTime;
      uniform float uForm;
      uniform float uDisperse;
      uniform float uSize;
      uniform float uDpr;
      uniform vec3  uPointer;
      uniform float uPointerK;
      uniform float uFog;
      uniform float uEnergy;

      varying float vSeed;
      varying float vPart;
      varying float vH;
      varying float vAlpha;
      varying float vHeat;

      ${NOISE}
      ${FOGX}

      void main(){
        vec3 home = position;

        // ── assembly. Each point has its own slightly different arrival
        //    so the gate builds instead of snapping.
        float lag  = 0.32 * aSeed;
        float f    = clamp((uForm - lag) / max(1.0 - lag, 0.001), 0.0, 1.0);
        f = f * f * (3.0 - 2.0 * f);
        vec3 p = mix(aScatter, home, f);

        // ── curl drift, always on, stronger before the gate has formed
        vec3 flow = curl(home * 0.185 + vec3(0.0, 0.0, uTime * 0.075));
        float amp = (0.075 + 0.135 * aSeed) * (0.4 + 0.6 * f) + (1.0 - f) * 1.4;
        p += flow * amp;

        // ── a slow breath so it never looks frozen
        p.y += sin(uTime * 0.62 + aSeed * 41.0) * 0.016;
        p += flow * uEnergy * 0.22;

        // ── cursor pushes the dust aside
        vec3 toP = p - uPointer;
        float d2 = dot(toP, toP);
        float rep = uPointerK * exp(-d2 * 0.048);
        p += normalize(toP + vec3(1e-4)) * rep * 2.1;

        // ── and it comes apart as the camera flies through
        vec3 out3 = normalize(home - vec3(0.0, 3.3, 0.0) + vec3(1e-4));
        p += out3 * uDisperse * (3.0 + aSeed * 3.4);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        float ps = uSize * aScale * uDpr * (15.5 / dist);
        gl_PointSize = clamp(ps, 0.55, 30.0);

        vSeed  = aSeed;
        vPart  = aPart;
        vH     = clamp(home.y / 6.9, 0.0, 1.0);
        vHeat  = pow(aSeed, 5.5);
        vAlpha = f * (1.0 - uDisperse * 0.82) * (1.0 - fogAmount(dist, uFog));
      }
    `,

    fragmentShader: /* glsl */ `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform vec3  uColLo;
      uniform vec3  uColHi;
      uniform vec3  uColHot;
      uniform vec3  uColBeam;

      varying float vSeed;
      varying float vPart;
      varying float vH;
      varying float vAlpha;
      varying float vHeat;

      ${SPRITE}

      void main(){
        float s = sprite(gl_PointCoord, 0.95);
        if (s <= 0.003) discard;
        s = pow(s, 1.45);

        vec3 col = mix(uColLo, uColHi, smoothstep(0.0, 0.85, vH));
        col = mix(col, uColBeam, step(0.5, vPart) * step(vPart, 1.5) * 0.5);
        // a scattering of white-hot embers, which is what the bloom catches
        col = mix(col, uColHot, vHeat * (0.55 + 0.45 * sin(uTime * 1.9 + vSeed * 57.0)));

        float flick = 0.82 + 0.18 * sin(uTime * 2.6 + vSeed * 83.0);

        gl_FragColor = vec4(col * flick, s * vAlpha * uOpacity);
      }
    `,
  });

  const points = new Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 6;
  points.name = 'torii';

  /* ── per-frame ────────────────────────────────────────────── */
  const pWorld = new Vector3(0, 3.2, 400);
  const ndc = new Vector3();
  let pk = 0;

  points.userData.update = (dt, t, camera) => {
    const u = mat.uniforms;
    u.uTime.value = t;
    u.uEnergy.value = scroll.energy;

    // the gate is only in frame for the first stretch of the journey
    const gone = smoothstep(0.055, 0.175, scroll.p);
    u.uDisperse.value = gone;
    points.visible = scroll.p < 0.235 && u.uForm.value > 0.001;
    if (!points.visible) return;

    // where the cursor lands on the plane the gate stands in
    let strength = 0;
    if (pointer.inside && !caps.touch) {
      ndc.set(pointer.sx, pointer.sy, 0.5).unproject(camera);
      ndc.sub(camera.position);
      if (Math.abs(ndc.z) > 1e-4) {
        const k = -camera.position.z / ndc.z;
        if (k > 0 && k < 400) {
          pWorld.copy(camera.position).addScaledVector(ndc, k);
          strength = 1;
        }
      }
    }
    strength *= 1 - gone;
    pk = damp(pk, strength * 1.35, 6, dt);
    u.uPointerK.value = pk;
    u.uPointer.value.copy(pWorld);
  };

  points.userData.form = (v) => {
    mat.uniforms.uForm.value = clamp(v);
  };

  points.userData.dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return points;
}
