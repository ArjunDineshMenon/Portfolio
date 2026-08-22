/* ══════════════════════════════════════════════════════════════════════
   environment — the fixed background layer that everything else sits in:
   a gradient dome that rides with the camera, a dust field spanning the
   whole journey, and sakura petals tumbling through the two ends of it.
   ══════════════════════════════════════════════════════════════════════ */

import {
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  BackSide,
  BufferGeometry,
  BufferAttribute,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  PlaneGeometry,
  Points,
  AdditiveBlending,
  NormalBlending,
  Color,
  Group,
  Vector3,
} from 'three';

import { caps } from '../core/caps.js';
import { scroll } from '../core/scroll.js';
import { mulberry32 } from '../core/util.js';
import { NOISE, SPRITE, FOGX, HASH } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';

/* ══ 1. sky dome ════════════════════════════════════════════════ */
export function createSky() {
  const geo = new SphereGeometry(520, 40, 26);
  const mat = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uLow: { value: new Color('#04050f') },
      uMid: { value: new Color(PAL.void) },
      uHigh: { value: new Color('#161c46') },
      uHaze: { value: new Color(PAL.ai) },
      uGoal: { value: new Color(PAL.shu) },
      uGoalK: { value: 0.0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec3 uLow, uMid, uHigh, uHaze, uGoal;
      uniform float uGoalK;
      varying vec3 vDir;

      ${NOISE}

      void main(){
        vec3 d = normalize(vDir);
        float h = d.y * 0.5 + 0.5;

        vec3 col = mix(uLow, uMid, smoothstep(0.18, 0.54, h));
        col = mix(col, uHigh, smoothstep(0.5, 1.0, h));

        // a band of indigo haze sitting on the horizon
        float band = exp(-pow((h - 0.505) * 9.0, 2.0));
        col += uHaze * band * 0.42;

        // very slow cloud drift, kept near the threshold of visible
        float n = snoise(vec3(d.xz * 2.6, uTime * 0.012)) * 0.5 + 0.5;
        col += uHaze * n * band * 0.3;
        col += uHigh * (snoise(vec3(d * 1.5 + vec3(0.0, uTime * 0.008, 0.0))) * 0.5 + 0.5) * 0.045;

        // the destination throws a faint glow back down the journey
        float ahead = max(-d.z, 0.0);
        col += uGoal * pow(ahead, 4.0) * uGoalK;
        col += uGoal * pow(max(ahead, 0.0), 22.0) * uGoalK * 1.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new Mesh(geo, mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  mesh.name = 'sky';

  mesh.userData.update = (dt, t, camera) => {
    mat.uniforms.uTime.value = t;
    // the vermillion ahead builds as the visitor gets closer to the end
    mat.uniforms.uGoalK.value = 0.05 + Math.pow(scroll.p, 2.2) * 0.5;
    mesh.position.copy(camera.position);
  };
  mesh.userData.dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return mesh;
}

/* ══ 2. dust ════════════════════════════════════════════════════ */
export function createDust() {
  const count = caps.dustCount;
  const rand = mulberry32(0xd057);

  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scale = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 190;
    pos[i * 3 + 1] = -10 + rand() * 62;
    pos[i * 3 + 2] = 40 - rand() * 500;
    seed[i] = rand();
    scale[i] = 0.35 + Math.pow(rand(), 3) * 2.1;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aScale', new BufferAttribute(scale, 1));

  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: caps.dpr },
      uFog: { value: FOG_DENSITY * 0.72 },
      uColA: { value: new Color(PAL.bone) },
      uColB: { value: new Color(PAL.cool) },
      uColC: { value: new Color(PAL.shuLift) },
      uOpacity: { value: 0.5 },
    },
    vertexShader: /* glsl */ `
      precision highp float;
      attribute float aSeed;
      attribute float aScale;
      uniform float uTime, uDpr, uFog;
      varying float vSeed, vAlpha;

      ${FOGX}

      void main(){
        vec3 p = position;
        // slow lateral drift, each speck on its own clock
        p.x += sin(uTime * 0.11 + aSeed * 30.0) * 1.5;
        p.y += cos(uTime * 0.08 + aSeed * 51.0) * 1.1;
        p.z += sin(uTime * 0.06 + aSeed * 17.0) * 1.4;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        gl_PointSize = clamp(aScale * uDpr * (11.0 / dist), 0.4, 10.0);

        vSeed = aSeed;
        vAlpha = (1.0 - fogAmount(dist, uFog)) * smoothstep(0.6, 6.0, dist);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uColA, uColB, uColC;
      varying float vSeed, vAlpha;

      ${SPRITE}

      void main(){
        float s = sprite(gl_PointCoord, 1.0);
        if (s <= 0.004) discard;
        float tw = 0.35 + 0.65 * pow(abs(sin(uTime * 0.9 + vSeed * 74.0)), 2.2);
        vec3 col = mix(uColA, uColB, vSeed);
        col = mix(col, uColC, step(0.93, vSeed));
        gl_FragColor = vec4(col, s * s * vAlpha * tw * uOpacity);
      }
    `,
  });

  const points = new Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 3;
  points.name = 'dust';

  points.userData.update = (dt, t) => {
    mat.uniforms.uTime.value = t;
  };
  points.userData.dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return points;
}

/* ══ 3. sakura ══════════════════════════════════════════════════
   Instanced quads that tumble as they fall. Two clusters: one around the
   gate at the start, one drifting through the horizon at the end.       */
function petalCluster({ count, box, seedNum, fallSpeed = 1 }) {
  const base = new PlaneGeometry(1, 1);
  const geo = new InstancedBufferGeometry();
  geo.index = base.index;
  geo.attributes.position = base.attributes.position;
  geo.attributes.uv = base.attributes.uv;

  const rand = mulberry32(seedNum);
  const off = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scale = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    off[i * 3] = box.x0 + rand() * (box.x1 - box.x0);
    off[i * 3 + 1] = box.y0 + rand() * (box.y1 - box.y0);
    off[i * 3 + 2] = box.z0 + rand() * (box.z1 - box.z0);
    seed[i] = rand();
    scale[i] = 0.12 + rand() * 0.2;
  }

  geo.setAttribute('aOffset', new InstancedBufferAttribute(off, 3));
  geo.setAttribute('aSeed', new InstancedBufferAttribute(seed, 1));
  geo.setAttribute('aScale', new InstancedBufferAttribute(scale, 1));

  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uFall: { value: fallSpeed },
      uSpan: { value: box.y1 - box.y0 },
      uY0: { value: box.y0 },
      uFog: { value: FOG_DENSITY * 0.9 },
      uColA: { value: new Color('#ffd8e0') },
      uColB: { value: new Color('#ff9fae') },
      uColC: { value: new Color(PAL.shuLift) },
      uOpacity: { value: 0.85 },
      uEnergy: { value: 0 },
    },
    vertexShader: /* glsl */ `
      precision highp float;
      attribute vec3  aOffset;
      attribute float aSeed;
      attribute float aScale;

      uniform float uTime, uFall, uSpan, uY0, uFog, uEnergy;

      varying vec2  vUv;
      varying float vSeed;
      varying float vAlpha;
      varying float vFace;

      ${FOGX}

      mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

      void main(){
        vUv = uv;
        vSeed = aSeed;

        float sp = 0.55 + aSeed * 0.9;
        float y = aOffset.y - mod(uTime * sp * uFall * 0.9, uSpan);
        if (y < uY0) y += uSpan;

        vec3 wp = vec3(
          aOffset.x + sin(uTime * (0.25 + aSeed * 0.4) + aSeed * 60.0) * 1.7,
          y,
          aOffset.z + cos(uTime * (0.2 + aSeed * 0.3) + aSeed * 33.0) * 1.4
        );

        vec4 mv = modelViewMatrix * vec4(wp, 1.0);

        // tumble: spin in screen space and squash on one axis to fake the
        // petal turning over
        float spin = uTime * (0.9 + aSeed * 1.7) + aSeed * 77.0;
        float flip = cos(spin * 0.7);
        vec2 q = position.xy * aScale * vec2(1.0, 1.35);
        q.x *= 0.35 + 0.65 * abs(flip);
        q = rot(spin) * q;
        mv.xy += q;

        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        vFace = abs(flip);
        vAlpha = (1.0 - fogAmount(dist, uFog)) * smoothstep(0.4, 4.0, dist);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3 uColA, uColB, uColC;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vSeed, vAlpha, vFace;

      float petal(vec2 uv){
        vec2 p = (uv - 0.5) * 2.0;
        float d = (p.x * p.x) / 0.58 + (p.y * p.y) / 1.0;
        float body = 1.0 - smoothstep(0.78, 1.02, d);
        // the little notch a sakura petal has at its tip
        float notch = smoothstep(0.0, 0.4, p.y - 0.52 + abs(p.x) * 1.55);
        return clamp(body - notch, 0.0, 1.0);
      }

      void main(){
        float a = petal(vUv);
        if (a <= 0.01) discard;
        vec3 col = mix(uColA, uColB, vSeed);
        col = mix(col, uColC, step(0.9, vSeed) * 0.5);
        col *= 0.62 + 0.38 * vFace;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `,
  });

  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  base.dispose();

  return { mesh, mat, geo };
}

export function createSakura() {
  const group = new Group();
  group.name = 'sakura';

  const n = caps.tier >= 3 ? 300 : caps.tier === 2 ? 170 : 80;

  const near = petalCluster({
    count: n,
    box: { x0: -22, x1: 22, y0: -3, y1: 22, z0: -26, z1: 16 },
    seedNum: 0x5a4a,
    fallSpeed: 1,
  });
  const far = petalCluster({
    count: Math.round(n * 0.7),
    box: { x0: -46, x1: 46, y0: 6, y1: 52, z0: -420, z1: -250 },
    seedNum: 0x7c7c,
    fallSpeed: 0.7,
  });

  group.add(near.mesh, far.mesh);

  group.userData.update = (dt, t) => {
    near.mat.uniforms.uTime.value = t;
    far.mat.uniforms.uTime.value = t;
    near.mat.uniforms.uEnergy.value = scroll.energy;
    near.mesh.visible = scroll.p < 0.3;
    far.mesh.visible = scroll.p > 0.6;
  };
  group.userData.dispose = () => {
    [near, far].forEach((c) => {
      c.geo.dispose();
      c.mat.dispose();
    });
  };

  return group;
}
