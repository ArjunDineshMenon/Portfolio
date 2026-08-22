/* ══════════════════════════════════════════════════════════════════════
   skill field — the site's one hands-on moment. Every chip in the DOM has
   a node out here. Drag to turn the cluster, hover a chip to light its
   node, hover a node to light its chip. Four lobes, one per category.
   ══════════════════════════════════════════════════════════════════════ */

import {
  BufferGeometry,
  BufferAttribute,
  Points,
  LineSegments,
  ShaderMaterial,
  AdditiveBlending,
  Group,
  Vector3,
  Raycaster,
  Vector2,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  DynamicDrawUsage,
} from 'three';

import { caps } from '../core/caps.js';
import { pointer } from '../core/pointer.js';
import { scroll, sectionProgress } from '../core/scroll.js';
import { clamp, damp, mulberry32, smoothstep } from '../core/util.js';
import { SPRITE, FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';

export const FIELD_CENTER = new Vector3(0, 5.2, -60);

/* ── lobe layout: four categories placed around the centre ───── */
function lobeCenter(i, total) {
  const a = (i / total) * Math.PI * 2 - Math.PI * 0.36;
  return new Vector3(Math.cos(a) * 5.6, Math.sin(a) * 3.9, Math.sin(a * 1.7) * 2.4);
}

/** fibonacci placement inside a lobe so nodes never collide */
function lobePoint(i, n, radius, rand) {
  const gr = (1 + Math.sqrt(5)) / 2;
  const th = (2 * Math.PI * i) / gr;
  const ph = Math.acos(1 - (2 * (i + 0.5)) / n);
  const r = radius * (0.55 + 0.45 * Math.cbrt(rand()));
  return new Vector3(
    Math.sin(ph) * Math.cos(th) * r,
    Math.sin(ph) * Math.sin(th) * r * 0.82,
    Math.cos(ph) * r * 0.8
  );
}

export function createSkillField(skills) {
  const group = new Group();
  group.name = 'skillField';
  group.position.copy(FIELD_CENTER);

  const spin = new Group(); // everything that turns lives in here
  group.add(spin);

  const rand = mulberry32(0x51c1);
  const groupCount = Math.max(1, new Set(skills.map((s) => s.group)).size);

  /* ── node positions ───────────────────────────────────────── */
  const N = skills.length;
  const pos = new Float32Array(N * 3);
  const aOn = new Float32Array(N);
  const aSeed = new Float32Array(N);
  const aScale = new Float32Array(N);
  const litArr = new Float32Array(N);
  const litTarget = new Float32Array(N);
  const nodeVec = [];

  const byGroup = new Map();
  skills.forEach((s) => {
    if (!byGroup.has(s.group)) byGroup.set(s.group, []);
    byGroup.get(s.group).push(s);
  });

  let idx = 0;
  const lobeCenters = [];
  [...byGroup.keys()].sort((a, b) => a - b).forEach((g, gi) => {
    const list = byGroup.get(g);
    const c = lobeCenter(gi, groupCount);
    lobeCenters.push(c);
    list.forEach((s, i) => {
      const p = lobePoint(i, list.length, 2.35, rand).add(c);
      pos[idx * 3] = p.x;
      pos[idx * 3 + 1] = p.y;
      pos[idx * 3 + 2] = p.z;
      aOn[idx] = s.on ? 1 : 0;
      aSeed[idx] = rand();
      aScale[idx] = s.on ? 1.15 : 0.78;
      nodeVec.push(p.clone());
      s.node = idx;
      idx++;
    });
  });

  /* ── nodes ────────────────────────────────────────────────── */
  const nodeGeo = new BufferGeometry();
  nodeGeo.setAttribute('position', new BufferAttribute(pos, 3));
  nodeGeo.setAttribute('aOn', new BufferAttribute(aOn, 1));
  nodeGeo.setAttribute('aSeed', new BufferAttribute(aSeed, 1));
  nodeGeo.setAttribute('aScale', new BufferAttribute(aScale, 1));
  const litAttr = new BufferAttribute(litArr, 1);
  litAttr.setUsage(DynamicDrawUsage);
  nodeGeo.setAttribute('aLit', litAttr);
  nodeGeo.computeBoundingSphere();

  const nodeMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: caps.dpr },
      uFog: { value: FOG_DENSITY },
      uOpacity: { value: 0 },
      uOn: { value: PAL.shu.clone() },
      uOff: { value: PAL.cool.clone() },
      uHot: { value: PAL.boneWarm.clone() },
    },
    vertexShader: /* glsl */ `
      precision highp float;
      attribute float aOn, aSeed, aScale, aLit;
      uniform float uTime, uDpr, uFog;
      varying float vOn, vSeed, vLit, vAlpha;

      ${FOGX}

      void main(){
        vec3 p = position;
        // each node breathes on its own beat
        p += vec3(
          sin(uTime * 0.45 + aSeed * 30.0),
          cos(uTime * 0.38 + aSeed * 51.0),
          sin(uTime * 0.31 + aSeed * 17.0)
        ) * 0.14;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        float pulse = 1.0 + 0.12 * sin(uTime * 1.6 + aSeed * 44.0) + aLit * 1.5;
        gl_PointSize = clamp(aScale * pulse * uDpr * (78.0 / dist), 1.0, 74.0);

        vOn = aOn;
        vSeed = aSeed;
        vLit = aLit;
        vAlpha = 1.0 - fogAmount(dist, uFog);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uOn, uOff, uHot;
      varying float vOn, vSeed, vLit, vAlpha;

      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c) * 2.0;

        // a hard little core inside a soft halo
        float core = 1.0 - smoothstep(0.16, 0.34, d);
        float halo = pow(1.0 - smoothstep(0.0, 1.0, d), 2.6);
        // a thin ring for the "learning" state, so it reads as an outline
        float ring = smoothstep(0.5, 0.42, d) * smoothstep(0.3, 0.4, d);

        vec3 base = mix(uOff, uOn, vOn);
        vec3 col  = mix(base, uHot, vLit * 0.65 + core * 0.25);

        float a = mix(ring * 0.9 + halo * 0.3, core + halo * 0.55, vOn);
        a *= (0.55 + 0.45 * vOn) + vLit * 0.9;

        if (a <= 0.004) discard;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `,
  });

  const nodes = new Points(nodeGeo, nodeMat);
  nodes.frustumCulled = false;
  nodes.renderOrder = 7;
  spin.add(nodes);

  /* ── links ────────────────────────────────────────────────── */
  const links = [];
  idx = 0;
  [...byGroup.keys()].sort((a, b) => a - b).forEach((g, gi) => {
    const list = byGroup.get(g);
    const first = idx;
    // spine: every node in a lobe joins its lobe centre
    for (let i = 0; i < list.length; i++) {
      links.push([nodeVec[first + i], lobeCenters[gi], aOn[first + i]]);
      // and to the next node round the lobe, which makes the ring read
      const nx = first + ((i + 1) % list.length);
      links.push([nodeVec[first + i], nodeVec[nx], Math.min(aOn[first + i], aOn[nx]) * 0.7 + 0.3]);
    }
    // lobe centre to world centre
    links.push([lobeCenters[gi], new Vector3(0, 0, 0), 1]);
    idx += list.length;
  });
  // a couple of cross-lobe ties so it reads as one structure
  for (let i = 0; i < lobeCenters.length; i++) {
    links.push([lobeCenters[i], lobeCenters[(i + 1) % lobeCenters.length], 0.55]);
  }

  const lp = new Float32Array(links.length * 2 * 3);
  const lt = new Float32Array(links.length * 2);
  const ln = new Float32Array(links.length * 2);
  const lo = new Float32Array(links.length * 2);
  links.forEach((L, i) => {
    const [a, b, on] = L;
    lp[i * 6] = a.x; lp[i * 6 + 1] = a.y; lp[i * 6 + 2] = a.z;
    lp[i * 6 + 3] = b.x; lp[i * 6 + 4] = b.y; lp[i * 6 + 5] = b.z;
    lt[i * 2] = 0; lt[i * 2 + 1] = 1;
    ln[i * 2] = i; ln[i * 2 + 1] = i;
    lo[i * 2] = on; lo[i * 2 + 1] = on;
  });

  const linkGeo = new BufferGeometry();
  linkGeo.setAttribute('position', new BufferAttribute(lp, 3));
  linkGeo.setAttribute('aT', new BufferAttribute(lt, 1));
  linkGeo.setAttribute('aLine', new BufferAttribute(ln, 1));
  linkGeo.setAttribute('aOn', new BufferAttribute(lo, 1));

  const linkMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uFog: { value: FOG_DENSITY },
      uOpacity: { value: 0 },
      uBase: { value: PAL.ai.clone() },
      uHot: { value: PAL.shu.clone() },
    },
    vertexShader: /* glsl */ `
      precision highp float;
      attribute float aT, aLine, aOn;
      uniform float uFog;
      varying float vT, vLine, vOn, vAlpha;
      ${FOGX}
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        vT = aT; vLine = aLine; vOn = aOn;
        vAlpha = 1.0 - fogAmount(max(-mv.z, 0.001), uFog);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uBase, uHot;
      varying float vT, vLine, vOn, vAlpha;
      void main(){
        // one packet of light travelling each link, offset per link
        float phase = fract(uTime * 0.19 + vLine * 0.137);
        float d = abs(fract(vT - phase + 0.5) - 0.5) * 2.0;
        float pulse = pow(1.0 - d, 14.0);
        vec3 col = mix(uBase, uHot, pulse * vOn);
        float a = (0.2 + pulse * 1.1 * vOn) * vOn;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `,
  });

  const lines = new LineSegments(linkGeo, linkMat);
  lines.frustumCulled = false;
  lines.renderOrder = 6;
  spin.add(lines);

  /* ── centre glow ──────────────────────────────────────────── */
  const glow = makeGlowSprite();
  glow.scale.setScalar(9);
  spin.add(glow);

  /* ── rotation, drag, inertia ──────────────────────────────── */
  const ray = new Raycaster();
  ray.params.Points.threshold = 0.6;
  const ndc = new Vector2();

  let ry = 0;
  let rx = 0;
  let vy = 0.055; // idle drift
  let vx = 0;
  let hovered = -1;
  let active = false;
  let opacity = 0;

  const api = {
    /** hovered node index, or -1 */
    get hovered() {
      return hovered;
    },
    get active() {
      return active;
    },
    /** DOM asks for a node to light up */
    light(i, on) {
      if (i >= 0 && i < N) litTarget[i] = on ? 1 : 0;
    },
    clearLights() {
      litTarget.fill(0);
    },
  };

  group.userData.api = api;

  group.userData.update = (dt, t, camera) => {
    const sp = sectionProgress('field');
    // fade the whole cluster in around the skills section
    const near = smoothstep(0.24, 0.42, scroll.p) * (1 - smoothstep(0.62, 0.78, scroll.p));
    opacity = damp(opacity, near, 5, dt);
    group.visible = opacity > 0.005;
    nodeMat.uniforms.uOpacity.value = opacity;
    linkMat.uniforms.uOpacity.value = opacity * 0.9;
    glow.material.opacity = opacity * 0.5;
    if (!group.visible) {
      active = false;
      return;
    }

    nodeMat.uniforms.uTime.value = t;
    linkMat.uniforms.uTime.value = t;

    active = near > 0.45;

    // drag, with inertia when released
    if (active && pointer.dragging && !caps.touch) {
      vy += pointer.dx * 2.6;
      vx += -pointer.dy * 2.0;
    }
    vy = damp(vy, active && pointer.dragging ? vy : 0.055, 1.7, dt);
    vx = damp(vx, 0, 2.4, dt);
    ry += vy * dt;
    rx = clamp(rx + vx * dt, -0.5, 0.5);
    spin.rotation.y = ry;
    spin.rotation.x = rx;

    // hover test, only while the section is actually on screen
    if (active && pointer.inside && !caps.touch && !pointer.dragging) {
      ndc.set(pointer.sx, pointer.sy);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObject(nodes, false);
      hovered = hits.length ? hits[0].index : -1;
    } else {
      hovered = -1;
    }

    // ease every node's lit value toward its target
    let dirty = false;
    for (let i = 0; i < N; i++) {
      const target = Math.max(litTarget[i], i === hovered ? 1 : 0);
      const nv = damp(litArr[i], target, 9, dt);
      if (Math.abs(nv - litArr[i]) > 0.0005) {
        litArr[i] = nv;
        dirty = true;
      }
    }
    if (dirty) litAttr.needsUpdate = true;
  };

  group.userData.dispose = () => {
    nodeGeo.dispose();
    nodeMat.dispose();
    linkGeo.dispose();
    linkMat.dispose();
    // glowTex is shared with the monoliths and the path, so it is not
    // disposed here — see disposeGlowTexture()
    glow.material.dispose();
  };

  return group;
}

/* a soft radial sprite, drawn once into a small canvas */
let glowTex = null;
export function makeGlowSprite(color = '#ff7a5c') {
  if (!glowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.22, 'rgba(255,255,255,0.5)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    glowTex = new CanvasTexture(c);
  }
  const mat = new SpriteMaterial({
    map: glowTex,
    color,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    opacity: 0.5,
  });
  const s = new Sprite(mat);
  s.renderOrder = 4;
  return s;
}

/** the halo texture is shared by every glow sprite in the world */
export function disposeGlowTexture() {
  if (glowTex) {
    glowTex.dispose();
    glowTex = null;
  }
}
