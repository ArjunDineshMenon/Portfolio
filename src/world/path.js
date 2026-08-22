/* ══════════════════════════════════════════════════════════════════════
   path — the 2026 → 2032 roadmap as a line of light climbing out of the
   sea toward Japan. It draws itself as the visitor scrolls, and each
   milestone ignites when its year is reached, in both directions: the 3D
   node lights the DOM row and the DOM row lights the node.
   ══════════════════════════════════════════════════════════════════════ */

import {
  CatmullRomCurve3,
  TubeGeometry,
  Mesh,
  Group,
  ShaderMaterial,
  OctahedronGeometry,
  TorusGeometry,
  MeshBasicMaterial,
  AdditiveBlending,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  Color,
  Vector3,
} from 'three';

import { caps } from '../core/caps.js';
import { scroll, sectionProgress } from '../core/scroll.js';
import { clamp, damp, smoothstep } from '../core/util.js';
import { FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';
import { makeGlowSprite } from './skillfield.js';

const CTRL = [
  new Vector3(0.0, -1.6, -184),
  new Vector3(-5.6, 3.2, -203),
  new Vector3(4.9, 8.4, -222),
  new Vector3(-4.4, 13.8, -243),
  new Vector3(3.7, 19.6, -265),
  new Vector3(0.0, 26.8, -291),
];

const YEARS = ['2026', '2027', '2028', '2029', '2030', '2032'];

export function createPath() {
  const group = new Group();
  group.name = 'path';

  const curve = new CatmullRomCurve3(CTRL, false, 'catmullrom', 0.35);

  /* ── the line itself ──────────────────────────────────────── */
  const segs = caps.tier >= 3 ? 260 : 140;
  const coreGeo = new TubeGeometry(curve, segs, 0.06, 7, false);
  const glowGeo = new TubeGeometry(curve, segs, 0.42, 9, false);

  const tubeUniforms = () => ({
    uTime: { value: 0 },
    uFog: { value: FOG_DENSITY },
    uProgress: { value: 0 },
    uBase: { value: new Color(PAL.ai) },
    uHot: { value: new Color(PAL.shu) },
    uWhite: { value: new Color(PAL.boneWarm) },
    uFogCol: { value: new Color(PAL.void) },
    uOpacity: { value: 1 },
  });

  const TUBE_VERT = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    varying vec3 vWorld, vNrm;
    varying float vDist;
    void main(){
      vUv = uv;
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      vNrm = normalize(mat3(modelMatrix) * normal);
      vec4 mv = viewMatrix * world;
      vDist = max(-mv.z, 0.001);
      gl_Position = projectionMatrix * mv;
    }
  `;

  const coreMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: tubeUniforms(),
    vertexShader: TUBE_VERT,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uFog, uProgress, uOpacity;
      uniform vec3 uBase, uHot, uWhite, uFogCol;
      varying vec2 vUv;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${FOGX}
      void main(){
        // the line draws itself as the visitor climbs
        float drawn = smoothstep(uProgress + 0.012, uProgress - 0.03, vUv.x);
        if (drawn <= 0.002) discard;

        vec3 col = uBase * 1.5;

        // dashes running up the line
        float flow = fract(vUv.x * 42.0 - uTime * 0.5);
        float dash = smoothstep(0.36, 0.5, flow) * smoothstep(1.0, 0.66, flow);
        col = mix(col, uHot, dash * 0.9);

        // one bright packet making the trip
        float head = exp(-pow((fract(vUv.x - uTime * 0.07) - 0.5) * 26.0, 2.0));
        col += uWhite * head * 1.4;

        // the leading tip while it is still being drawn
        float tip = exp(-pow((vUv.x - uProgress) * 90.0, 2.0));
        col += uWhite * tip * 2.2;

        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol, fog * 0.55);

        gl_FragColor = vec4(col, (0.65 + dash * 0.35) * drawn * uOpacity * (1.0 - fog * 0.4));
      }
    `,
  });

  const glowMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: tubeUniforms(),
    vertexShader: TUBE_VERT,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uFog, uProgress, uOpacity;
      uniform vec3 uBase, uHot, uFogCol;
      varying vec2 vUv;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${FOGX}
      void main(){
        float drawn = smoothstep(uProgress + 0.012, uProgress - 0.05, vUv.x);
        if (drawn <= 0.002) discard;

        vec3 V = normalize(cameraPosition - vWorld);
        float rim = pow(1.0 - abs(dot(vNrm, V)), 2.2);

        vec3 col = mix(uBase, uHot, 0.35 + 0.4 * sin(vUv.x * 8.0 + uTime * 0.4));
        float fog = fogAmount(vDist, uFog);

        gl_FragColor = vec4(col * rim, rim * 0.42 * drawn * uOpacity * (1.0 - fog * 0.5));
      }
    `,
  });

  const core = new Mesh(coreGeo, coreMat);
  const glow = new Mesh(glowGeo, glowMat);
  core.frustumCulled = false;
  glow.frustumCulled = false;
  core.renderOrder = 8;
  glow.renderOrder = 7;
  group.add(glow, core);

  /* ── milestones ───────────────────────────────────────────── */
  const stones = YEARS.map((year, i) => {
    const t = i / (YEARS.length - 1);
    const p = curve.getPointAt(t);
    const isGoal = i === YEARS.length - 1;

    const holder = new Group();
    holder.position.copy(p);

    const size = isGoal ? 0.62 : 0.34;
    const coreMesh = new Mesh(
      new OctahedronGeometry(size, 0),
      new MeshBasicMaterial({
        color: isGoal ? PAL.shu : PAL.aiSoft,
        transparent: true,
        opacity: 0.9,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    holder.add(coreMesh);

    const ring = new Mesh(
      new TorusGeometry(isGoal ? 1.5 : 0.95, 0.018, 6, 56),
      new MeshBasicMaterial({
        color: PAL.shuLift,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    holder.add(ring);

    let ring2 = null;
    if (isGoal) {
      ring2 = new Mesh(
        new TorusGeometry(2.3, 0.014, 6, 64),
        new MeshBasicMaterial({
          color: PAL.boneWarm,
          transparent: true,
          opacity: 0,
          blending: AdditiveBlending,
          depthWrite: false,
        })
      );
      holder.add(ring2);
    }

    const halo = makeGlowSprite(isGoal ? '#ff4d2e' : '#7f92d4');
    halo.scale.setScalar(isGoal ? 8 : 3.6);
    halo.material.opacity = 0;
    holder.add(halo);

    const label = makeLabel(year, isGoal);
    label.position.set(i % 2 ? 2.4 : -2.4, 0.9, 0);
    label.material.opacity = 0;
    holder.add(label);

    group.add(holder);

    return { holder, coreMesh, ring, ring2, halo, label, t, isGoal, lit: 0, litTarget: 0, year, i };
  });

  /* ── api for the DOM to talk to ───────────────────────────── */
  let onReach = null;
  group.userData.api = {
    /** DOM hover / in-view highlights a stone */
    highlight(i, on) {
      if (stones[i]) stones[i].litTarget = on ? 1 : 0;
    },
    clear() {
      stones.forEach((s) => (s.litTarget = 0));
    },
    /** fires with the index each time the climb passes a milestone */
    onReach(fn) {
      onReach = fn;
    },
    refreshLabels() {
      stones.forEach((s) => {
        const tex = makeLabelTexture(s.year, s.isGoal);
        s.label.material.map.dispose();
        s.label.material.map = tex;
        s.label.material.needsUpdate = true;
      });
    },
  };

  let reached = -1;

  group.userData.update = (dt, t) => {
    const near =
      smoothstep(0.62, 0.72, scroll.p) * (1 - smoothstep(0.985, 1.0, scroll.p) * 0.35);
    group.visible = near > 0.004;
    if (!group.visible) return;

    // the line is drawn by the path section, then held complete after it
    const sp = sectionProgress('path');
    const drawn = clamp(sp * 1.28);

    coreMat.uniforms.uTime.value = t;
    glowMat.uniforms.uTime.value = t;
    coreMat.uniforms.uProgress.value = drawn;
    glowMat.uniforms.uProgress.value = drawn;
    coreMat.uniforms.uOpacity.value = near;
    glowMat.uniforms.uOpacity.value = near;

    let top = -1;
    stones.forEach((s, i) => {
      const arrived = drawn >= s.t - 0.004 ? 1 : 0;
      if (arrived) top = i;

      const target = Math.max(arrived, s.litTarget);
      s.lit = damp(s.lit, target, 6, dt);

      const pulse = 0.85 + 0.15 * Math.sin(t * 2.0 + i * 1.7);
      s.coreMesh.material.opacity = (0.2 + s.lit * 0.8) * near * pulse;
      s.coreMesh.rotation.y = t * 0.35 + i;
      s.coreMesh.rotation.x = t * 0.22;
      s.coreMesh.scale.setScalar(1 + s.lit * 0.35);

      s.ring.material.opacity = s.lit * 0.7 * near;
      s.ring.rotation.z = t * (s.isGoal ? 0.28 : 0.5) * (i % 2 ? 1 : -1);
      s.ring.rotation.x = 0.9 + Math.sin(t * 0.3 + i) * 0.2;

      if (s.ring2) {
        s.ring2.material.opacity = s.lit * 0.45 * near;
        s.ring2.rotation.z = -t * 0.18;
        s.ring2.rotation.y = t * 0.24;
      }

      s.halo.material.opacity = s.lit * (s.isGoal ? 0.55 : 0.3) * near * pulse;
      s.label.material.opacity = s.lit * 0.95 * near;
      s.label.scale.set(2.1 * (s.isGoal ? 1.25 : 1), 0.72 * (s.isGoal ? 1.25 : 1), 1);
    });

    if (top !== reached) {
      reached = top;
      if (onReach) onReach(top);
    }
  };

  group.userData.dispose = () => {
    coreGeo.dispose();
    glowGeo.dispose();
    coreMat.dispose();
    glowMat.dispose();
    stones.forEach((s) => {
      s.coreMesh.geometry.dispose();
      s.coreMesh.material.dispose();
      s.ring.geometry.dispose();
      s.ring.material.dispose();
      if (s.ring2) {
        s.ring2.geometry.dispose();
        s.ring2.material.dispose();
      }
      s.halo.material.dispose();
      s.label.material.map.dispose();
      s.label.material.dispose();
    });
  };

  return group;
}

/* ── year labels, drawn into a canvas ───────────────────────── */
function makeLabelTexture(text, hot) {
  const w = 256;
  const h = 88;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.clearRect(0, 0, w, h);

  g.font = '500 46px "JetBrains Mono", ui-monospace, monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.letterSpacing = '6px';

  g.shadowColor = hot ? 'rgba(255,77,46,0.85)' : 'rgba(127,146,212,0.6)';
  g.shadowBlur = 22;
  g.fillStyle = hot ? '#ffd9cf' : '#dfe4f6';
  g.fillText(text, w / 2, h / 2 + 2);
  g.shadowBlur = 0;
  g.fillText(text, w / 2, h / 2 + 2);

  const tex = new CanvasTexture(c);
  tex.anisotropy = 2;
  return tex;
}

function makeLabel(text, hot) {
  const mat = new SpriteMaterial({
    map: makeLabelTexture(text, hot),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    opacity: 0,
  });
  const s = new Sprite(mat);
  s.scale.set(2.1, 0.72, 1);
  s.renderOrder = 9;
  return s;
}
