/* ══════════════════════════════════════════════════════════════════════
   horizon — where the journey rests. A low sun over the sea, layered
   ridges, and a second torii in silhouette against it, so the last frame
   answers the first one.
   ══════════════════════════════════════════════════════════════════════ */

import {
  PlaneGeometry,
  CylinderGeometry,
  BoxGeometry,
  Mesh,
  Group,
  ShaderMaterial,
  AdditiveBlending,
  DoubleSide,
  Color,
} from 'three';

import { scroll } from '../core/scroll.js';
import { smoothstep, damp } from '../core/util.js';
import { NOISE, FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';
import { SEA_Y } from './sea.js';

export function createHorizon() {
  const group = new Group();
  group.name = 'horizon';

  /* ── 1. the sun ───────────────────────────────────────────── */
  const sunGeo = new PlaneGeometry(150, 150);
  const sunMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uK: { value: 0 },
      uCore: { value: new Color('#ffd7bd') },
      uMid: { value: new Color(PAL.shu) },
      uOuter: { value: new Color(PAL.shuDeep) },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uK;
      uniform vec3 uCore, uMid, uOuter;
      varying vec2 vUv;
      ${NOISE}
      void main(){
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);

        // the disc, with a soft shimmering edge
        float wob = snoise(vec3(p * 5.0, uTime * 0.09)) * 0.012;
        float disc = 1.0 - smoothstep(0.185 + wob, 0.215 + wob, r);

        // corona
        float halo = pow(max(1.0 - r / 0.95, 0.0), 3.4);
        float bloom2 = pow(max(1.0 - r / 0.42, 0.0), 1.6);

        // anamorphic streak across the horizon line
        float streak = exp(-pow(p.y * 34.0, 2.0)) * exp(-pow(p.x * 1.05, 2.0));

        vec3 col = uCore * disc * 1.5;
        col += uMid * bloom2 * 0.75;
        col += uOuter * halo * 0.5;
        col += uMid * streak * 0.55;

        float a = clamp(disc * 1.2 + bloom2 * 0.55 + halo * 0.3 + streak * 0.35, 0.0, 1.0);
        gl_FragColor = vec4(col, a * uK);
      }
    `,
  });
  const sun = new Mesh(sunGeo, sunMat);
  sun.position.set(-6, 11, -462);
  sun.renderOrder = 0;
  sun.frustumCulled = false;
  group.add(sun);

  /* ── 2. ridge layers ──────────────────────────────────────── */
  const ridgeSpecs = [
    { z: -444, w: 660, h: 92, base: 0.2, amp: 0.16, freq: 2.1, seed: 1.3, col: '#0d1230', a: 1.0 },
    { z: -428, w: 560, h: 74, base: 0.15, amp: 0.13, freq: 3.4, seed: 5.7, col: '#090c22', a: 1.0 },
    { z: -412, w: 470, h: 56, base: 0.11, amp: 0.1, freq: 5.2, seed: 9.1, col: '#06081a', a: 1.0 },
  ];

  const ridges = ridgeSpecs.map((r) => {
    const geo = new PlaneGeometry(r.w, r.h);
    const mat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: {
        uK: { value: 0 },
        uBase: { value: r.base },
        uAmp: { value: r.amp },
        uFreq: { value: r.freq },
        uSeed: { value: r.seed },
        uCol: { value: new Color(r.col) },
        uEdge: { value: new Color(PAL.ai) },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uK, uBase, uAmp, uFreq, uSeed;
        uniform vec3 uCol, uEdge;
        varying vec2 vUv;
        ${NOISE}
        void main(){
          float n  = snoise(vec3(vUv.x * uFreq, uSeed, 0.0)) * 0.5 + 0.5;
          float n2 = snoise(vec3(vUv.x * uFreq * 3.7, uSeed * 2.0, 0.0)) * 0.5 + 0.5;
          float ridge = uBase + n * uAmp + n2 * uAmp * 0.34;
          if (vUv.y > ridge) discard;
          // a lit rim right on the skyline
          float rim = smoothstep(ridge - 0.006, ridge, vUv.y);
          vec3 col = mix(uCol, uEdge, rim * 0.85);
          gl_FragColor = vec4(col, uK);
        }
      `,
    });
    const m = new Mesh(geo, mat);
    m.position.set(0, SEA_Y + r.h / 2 - r.h * 0.5 + r.h * 0.5 - 1.0, r.z);
    m.position.y = SEA_Y - 1.0 + r.h / 2;
    m.renderOrder = 1;
    m.frustumCulled = false;
    group.add(m);
    return { mesh: m, mat };
  });

  /* ── 3. the far torii, in silhouette ──────────────────────── */
  const farTorii = buildSilhouette();
  farTorii.position.set(3, SEA_Y - 0.4, -398);
  farTorii.scale.setScalar(3.1);
  group.add(farTorii);

  /* ── frame ────────────────────────────────────────────────── */
  let k = 0;
  group.userData.update = (dt, t) => {
    const target = smoothstep(0.5, 0.86, scroll.p);
    k = damp(k, target, 3.5, dt);
    group.visible = k > 0.004;
    if (!group.visible) return;

    sunMat.uniforms.uTime.value = t;
    sunMat.uniforms.uK.value = k * 0.92;
    ridges.forEach((r, i) => {
      r.mat.uniforms.uK.value = k;
    });
    farTorii.userData.setK(k, t);
  };

  group.userData.dispose = () => {
    sunGeo.dispose();
    sunMat.dispose();
    ridges.forEach((r) => {
      r.mesh.geometry.dispose();
      r.mat.dispose();
    });
    farTorii.userData.dispose();
  };

  return group;
}

/* a solid, near-black gate with a thin vermillion rim */
function buildSilhouette() {
  const g = new Group();

  const mat = new ShaderMaterial({
    transparent: true,
    uniforms: {
      uK: { value: 0 },
      uTime: { value: 0 },
      uFog: { value: FOG_DENSITY },
      uBody: { value: new Color('#04050f') },
      uRim: { value: new Color(PAL.shu) },
      uFogCol: { value: new Color(PAL.void) },
    },
    vertexShader: /* glsl */ `
      precision highp float;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      void main(){
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vNrm = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * world;
        vDist = max(-mv.z, 0.001);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uK, uTime, uFog;
      uniform vec3 uBody, uRim, uFogCol;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${FOGX}
      void main(){
        vec3 V = normalize(cameraPosition - vWorld);
        float fres = pow(1.0 - clamp(dot(vNrm, V), 0.0, 1.0), 3.2);
        vec3 col = uBody + uRim * fres * 0.9;
        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol * 0.5, fog * 0.5);
        gl_FragColor = vec4(col, uK * (0.88 + fres * 0.12));
      }
    `,
  });

  const geos = [];
  const add = (geo, x, y, z) => {
    const m = new Mesh(geo, mat);
    m.position.set(x, y, z);
    m.frustumCulled = false;
    m.renderOrder = 2;
    g.add(m);
    geos.push(geo);
    return m;
  };

  const pillar = new CylinderGeometry(0.26, 0.33, 5.7, 10);
  add(pillar, -3.05, 2.85, 0);
  add(pillar.clone(), 3.05, 2.85, 0);
  add(new BoxGeometry(7.5, 0.36, 0.5), 0, 4.74, 0);
  add(new BoxGeometry(0.33, 1.0, 0.33), 0, 5.42, 0);
  add(new BoxGeometry(8.7, 0.28, 0.55), 0, 5.96, 0);
  const kasagi = add(new BoxGeometry(9.5, 0.38, 0.7), 0, 6.36, 0);
  kasagi.rotation.z = 0;

  g.userData.setK = (k, t) => {
    mat.uniforms.uK.value = k;
    mat.uniforms.uTime.value = t;
  };
  g.userData.dispose = () => {
    geos.forEach((x) => x.dispose());
    mat.dispose();
  };

  return g;
}
