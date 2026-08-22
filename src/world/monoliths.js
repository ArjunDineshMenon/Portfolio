/* ══════════════════════════════════════════════════════════════════════
   monoliths — one slab per project, standing in the deep. Dark indigo
   glass with a fresnel rim in the project's status colour, drifting scan
   bands, and crisp additive edges. They rise into place as the work
   section arrives, and the matching slab flares when a card is hovered.
   ══════════════════════════════════════════════════════════════════════ */

import {
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
  Mesh,
  Group,
  ShaderMaterial,
  LineBasicMaterial,
  AdditiveBlending,
  PlaneGeometry,
  Color,
  Vector3,
} from 'three';

import { scroll, sectionProgress } from '../core/scroll.js';
import { clamp, damp, smoothstep } from '../core/util.js';
import { NOISE, FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';
import { makeGlowSprite } from './skillfield.js';

const SLABS = [
  { x: -9.0, z: -106, w: 6.4, h: 19.0, d: 2.3, tint: PAL.green,   rot: 0.16 },
  { x: 8.6,  z: -128, w: 7.2, h: 24.0, d: 2.6, tint: PAL.shu,     rot: -0.2 },
  { x: -5.4, z: -152, w: 5.6, h: 15.0, d: 2.1, tint: PAL.cool,    rot: 0.1 },
];

export function createMonoliths() {
  const group = new Group();
  group.name = 'monoliths';

  const items = SLABS.map((s, i) => {
    const holder = new Group();
    holder.position.set(s.x, 0, s.z);
    holder.rotation.y = s.rot;

    const geo = new BoxGeometry(s.w, s.h, s.d, 1, 12, 1);
    const mat = new ShaderMaterial({
      transparent: true,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uFog: { value: FOG_DENSITY },
        uH: { value: s.h },
        uTint: { value: new Color(s.tint) },
        uBase: { value: new Color('#0a0d24') },
        uLine: { value: new Color(PAL.aiSoft) },
        uFogCol: { value: new Color(PAL.void) },
        uHot: { value: 0 },
        uRise: { value: 0 },
        uSeed: { value: i * 3.7 },
      },
      vertexShader: /* glsl */ `
        precision highp float;
        uniform float uRise, uH;
        varying vec3 vWorld, vNrm, vLocal;
        varying float vDist;
        void main(){
          vLocal = position;
          vec3 p = position;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          vNrm = normalize(mat3(modelMatrix) * normal);
          vec4 mv = viewMatrix * world;
          vDist = max(-mv.z, 0.001);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uTime, uFog, uH, uHot, uRise, uSeed;
        uniform vec3 uTint, uBase, uLine, uFogCol;
        varying vec3 vWorld, vNrm, vLocal;
        varying float vDist;

        ${NOISE}
        ${FOGX}

        void main(){
          float hy = clamp((vLocal.y + uH * 0.5) / uH, 0.0, 1.0);

          // the slab builds upward as it rises into place
          float built = smoothstep(hy - 0.06, hy + 0.02, uRise);
          if (built <= 0.001) discard;

          vec3 V = normalize(cameraPosition - vWorld);
          float fres = pow(1.0 - clamp(dot(vNrm, V), 0.0, 1.0), 2.6);

          vec3 col = mix(uBase * 0.55, uBase, hy);

          // fine grid, like a rack elevation
          vec2 g = vec2(vWorld.x * 1.9 + vWorld.z * 1.9, vLocal.y * 2.6);
          vec2 gl = abs(fract(g) - 0.5);
          float grid = smoothstep(0.47, 0.5, max(gl.x, gl.y));
          col += uLine * grid * 0.1;

          // scan bands crawling up the face
          float band = fract(vLocal.y * 0.34 - uTime * 0.1 + uSeed);
          float scan = pow(smoothstep(0.86, 1.0, band), 2.0);
          col += uTint * scan * 0.28;

          // a slower, wider sweep for life
          float sweep = exp(-pow((fract(vLocal.y * 0.055 - uTime * 0.028 + uSeed * 0.3) - 0.5) * 5.0, 2.0));
          col += uTint * sweep * 0.14;

          // flicker at the threshold of visible
          col += uTint * (snoise(vec3(vWorld.xz * 0.6, uTime * 0.6)) * 0.5 + 0.5) * 0.035;

          // rim
          col += uTint * fres * (0.75 + uHot * 1.4);
          col += vec3(1.0) * pow(fres, 5.0) * 0.28 * (0.4 + uHot);

          // top cap glows
          col += uTint * smoothstep(0.93, 1.0, hy) * (0.4 + uHot * 0.8);

          float fog = fogAmount(vDist, uFog);
          col = mix(col, uFogCol, fog);

          float a = (0.78 + fres * 0.22) * (1.0 - fog * 0.5);
          gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
        }
      `,
    });

    const mesh = new Mesh(geo, mat);
    mesh.position.y = s.h / 2 - 2.4;
    holder.add(mesh);

    // crisp additive edges so the silhouette never mushes into the fog
    const edges = new LineSegments(
      new EdgesGeometry(geo, 20),
      new LineBasicMaterial({
        color: new Color(s.tint),
        transparent: true,
        opacity: 0.34,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    edges.position.copy(mesh.position);
    holder.add(edges);

    // the status light on the face
    const barGeo = new PlaneGeometry(s.w * 0.42, 0.12);
    const barMat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uTint: { value: new Color(s.tint) }, uK: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uTime; uniform vec3 uTint; uniform float uK;
        varying vec2 vUv;
        void main(){
          float run = fract(vUv.x - uTime * 0.32);
          float head = pow(smoothstep(0.7, 1.0, run), 2.5);
          float glow = 1.0 - smoothstep(0.0, 0.55, abs(vUv.y - 0.5));
          gl_FragColor = vec4(uTint * (0.35 + head * 2.2), (0.3 + head) * glow * uK);
        }
      `,
    });
    const bar = new Mesh(barGeo, barMat);
    bar.position.set(0, s.h - 4.2, s.d / 2 + 0.02);
    holder.add(bar);

    const glow = makeGlowSprite('#' + new Color(s.tint).getHexString());
    glow.scale.setScalar(s.w * 2.2);
    glow.position.set(0, s.h - 3.0, 0);
    glow.material.opacity = 0;
    holder.add(glow);

    group.add(holder);

    return { holder, mesh, mat, edges, barMat, glow, spec: s, hot: 0, hotTarget: 0 };
  });

  /* ── DOM hover boosts its slab ─────────────────────────────── */
  group.userData.api = {
    hover(i, on) {
      if (items[i]) items[i].hotTarget = on ? 1 : 0;
    },
    clear() {
      items.forEach((it) => (it.hotTarget = 0));
    },
  };

  group.userData.update = (dt, t) => {
    const sp = sectionProgress('monoliths');
    const near = smoothstep(0.44, 0.58, scroll.p) * (1 - smoothstep(0.84, 0.94, scroll.p));
    group.visible = near > 0.004;
    if (!group.visible) return;

    items.forEach((it, i) => {
      // staggered rise, driven by where the visitor is in the section
      const stagger = i * 0.16;
      const rise = clamp((sp * 1.55 - stagger) / 0.5);
      const eased = rise * rise * (3 - 2 * rise);

      it.hot = damp(it.hot, it.hotTarget, 7, dt);

      it.mat.uniforms.uTime.value = t;
      it.mat.uniforms.uRise.value = eased;
      it.mat.uniforms.uHot.value = it.hot;
      it.barMat.uniforms.uTime.value = t;
      it.barMat.uniforms.uK.value = eased * near;
      it.edges.material.opacity = (0.16 + it.hot * 0.5) * eased * near;
      it.glow.material.opacity = (0.1 + it.hot * 0.4) * eased * near;

      // a slow drift so they never feel like static props
      it.holder.position.y = Math.sin(t * 0.24 + i * 2.1) * 0.22;
      it.holder.rotation.y = it.spec.rot + Math.sin(t * 0.14 + i) * 0.03;
    });
  };

  group.userData.dispose = () => {
    items.forEach((it) => {
      it.mesh.geometry.dispose();
      it.mat.dispose();
      it.edges.geometry.dispose();
      it.edges.material.dispose();
      it.barMat.dispose();
      it.glow.material.dispose();
    });
  };

  return group;
}
