/* ══════════════════════════════════════════════════════════════════════
   sea — the floor of the whole world. Gerstner-ish swell in the vertex
   stage, seigaiha (青海波) wave-scale pattern in the fragment stage, with
   a moonpath streak running toward the horizon the journey ends at.
   ══════════════════════════════════════════════════════════════════════ */

import { PlaneGeometry, Mesh, ShaderMaterial, DoubleSide, Color, Vector3 } from 'three';

import { caps } from '../core/caps.js';
import { scroll } from '../core/scroll.js';
import { NOISE, FOGX } from '../gl/glsl/common.js';
import { PAL, FOG_DENSITY } from '../gl/palette.js';

export const SEA_Y = -2.6;
const SIZE = 760;
const CENTER_Z = -170;

const WAVE = /* glsl */ `
float waveH(vec2 p, float t){
  float h = 0.0;
  h += sin(p.x * 0.088 + t * 0.52) * 0.26;
  h += sin(p.y * 0.126 - t * 0.40) * 0.19;
  h += sin((p.x * 0.205 + p.y * 0.163) + t * 0.78) * 0.105;
  h += sin((p.x * -0.298 + p.y * 0.262) - t * 1.02) * 0.058;
  h += snoise(vec3(p * 0.055, t * 0.105)) * 0.2;
  return h;
}
`;

export function createSea() {
  const seg = caps.seaSegments;
  const geo = new PlaneGeometry(SIZE, SIZE, seg, seg);
  geo.rotateX(-Math.PI / 2);

  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uFog: { value: FOG_DENSITY },
      uScale: { value: 3.4 },
      uAmp: { value: 1 },
      uColDeep: { value: new Color(PAL.voidDeep) },
      uColBase: { value: new Color('#141c46') },
      uColLine: { value: new Color(PAL.aiSoft) },
      uColFoam: { value: new Color(PAL.cool) },
      uColHot: { value: new Color(PAL.shu) },
      uFogCol: { value: new Color(PAL.void) },
      uSun: { value: new Vector3(0, 16, -430) },
      uOpacity: { value: 1 },
      uEnergy: { value: 0 },
    },

    vertexShader: /* glsl */ `
      precision highp float;

      uniform float uTime;
      uniform float uAmp;

      varying vec3  vWorld;
      varying float vHeight;
      varying vec3  vNormal2;
      varying float vDist;

      ${NOISE}
      ${WAVE}

      void main(){
        vec3 p = position;
        vec2 xz = vec2(p.x, p.z);

        float h = waveH(xz, uTime) * uAmp;
        p.y += h;

        // analytic-ish normal from three samples of the same field
        float e = 1.4;
        float hx = waveH(xz + vec2(e, 0.0), uTime) * uAmp;
        float hz = waveH(xz + vec2(0.0, e), uTime) * uAmp;
        vec3 n = normalize(vec3(h - hx, e, h - hz));

        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld   = world.xyz;
        vHeight  = h;
        vNormal2 = n;

        vec4 mv = viewMatrix * world;
        vDist = max(-mv.z, 0.001);
        gl_Position = projectionMatrix * mv;
      }
    `,

    fragmentShader: /* glsl */ `
      precision highp float;

      uniform float uTime;
      uniform float uFog;
      uniform float uScale;
      uniform vec3  uColDeep;
      uniform vec3  uColBase;
      uniform vec3  uColLine;
      uniform vec3  uColFoam;
      uniform vec3  uColHot;
      uniform vec3  uFogCol;
      uniform vec3  uSun;
      uniform float uOpacity;
      uniform float uEnergy;

      varying vec3  vWorld;
      varying float vHeight;
      varying vec3  vNormal2;
      varying float vDist;

      ${FOGX}

      /* one grid of concentric rings, masked to its circle */
      float ringField(vec2 p){
        vec2 c = fract(p) - 0.5;
        float d = length(c);
        if (d > 0.5) return 0.0;
        float r = d * 2.0;
        float rings = fract(r * 3.0 + 0.02);
        float band = smoothstep(0.58, 0.94, rings) * smoothstep(0.98, 0.62, rings * 1.02);
        return band * smoothstep(0.5, 0.4, d);
      }

      /* seigaiha: two staggered grids of overlapping circles */
      float seigaiha(vec2 p){
        float a = ringField(p);
        float b = ringField(p + vec2(0.5, 0.5));
        float c = ringField(p + vec2(0.25, 0.5));
        return max(a, max(b, c * 0.55));
      }

      void main(){
        vec2 g = vWorld.xz / uScale;
        g.y += uTime * 0.035;                       // the pattern drifts with the swell
        g.x += sin(vWorld.z * 0.02 + uTime * 0.2) * 0.06;

        float pat = seigaiha(g);

        // the pattern dissolves with distance so it never aliases into noise
        float patFade = smoothstep(240.0, 46.0, vDist);
        pat *= patFade;

        float crest = smoothstep(0.05, 0.42, vHeight);
        float trough = smoothstep(0.0, -0.34, vHeight);

        vec3 col = mix(uColDeep, uColBase, 0.42 + crest * 0.58);
        col = mix(col, uColLine, pat * 0.72);
        col += uColFoam * pat * crest * 0.5;

        // moonpath: a specular streak toward the horizon light
        vec3 toSun = normalize(uSun - vWorld);
        vec3 toEye = normalize(cameraPosition - vWorld);
        vec3 hv = normalize(toSun + toEye);
        float spec = pow(max(dot(vNormal2, hv), 0.0), 46.0);
        float lane = exp(-pow(vWorld.x * 0.026, 2.0));
        col += uColHot * spec * lane * 1.5;
        col += uColFoam * spec * 0.28;

        // a rim of vermillion on the crests, the accent in a rare dose
        col += uColHot * crest * pat * 0.16;
        col = mix(col, uColDeep, trough * 0.4);

        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol, fog);

        // soft radial falloff so the plane never shows an edge
        float edge = 1.0 - smoothstep(210.0, 372.0, length(vWorld.xz - vec2(0.0, ${CENTER_Z.toFixed(1)})));
        float a = uOpacity * edge * (1.0 - fog * 0.35);

        gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
      }
    `,
  });

  const mesh = new Mesh(geo, mat);
  mesh.position.set(0, SEA_Y, CENTER_Z);
  mesh.renderOrder = 1;
  mesh.frustumCulled = false;
  mesh.name = 'sea';

  mesh.userData.update = (dt, t) => {
    mat.uniforms.uTime.value = t;
    mat.uniforms.uEnergy.value = scroll.energy;
    // the swell picks up a little while the visitor is moving
    mat.uniforms.uAmp.value = 1 + scroll.energy * 0.35;
  };

  mesh.userData.dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return mesh;
}
