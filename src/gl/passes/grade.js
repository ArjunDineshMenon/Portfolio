/* ══════════════════════════════════════════════════════════════════════
   grade — the final look. Radial chromatic aberration that opens up when
   the visitor scrolls fast, a whisper of grain, split-toning that pushes
   shadows to indigo and highlights to warm, and a vignette.
   ══════════════════════════════════════════════════════════════════════ */

import { Vector2, Vector3 } from 'three';

export const GradeShader = {
  name: 'KumoGrade',
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uAberration: { value: 1.0 },
    uGrain: { value: 0.038 },
    uVignette: { value: 0.9 },
    uShadowTint: { value: new Vector3(0.055, 0.07, 0.185) },
    uHighTint: { value: new Vector3(1.03, 0.985, 0.94) },
    uFade: { value: 0 },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform vec2  uRes;
    uniform float uTime;
    uniform float uEnergy;
    uniform float uAberration;
    uniform float uGrain;
    uniform float uVignette;
    uniform vec3  uShadowTint;
    uniform vec3  uHighTint;
    uniform float uFade;

    varying vec2 vUv;

    float hash(vec2 p){
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main(){
      vec2 uv = vUv;
      vec2 c  = uv - 0.5;
      float r = length(c);

      // ── chromatic aberration, radial, stronger at the edges and while
      //    the visitor is moving fast
      float amt = (0.0016 + uEnergy * 0.0075) * uAberration;
      vec2 dir  = c * (r * 1.35 + 0.22);
      vec3 col;
      col.r = texture2D(tDiffuse, uv - dir * amt).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + dir * amt).b;

      // ── gentle S-curve for contrast without crushing the indigo
      col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);

      // ── split tone
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadow = col * uShadowTint * 3.4;
      vec3 high   = col * uHighTint;
      col = mix(mix(shadow, col, smoothstep(0.0, 0.36, lum)), high, smoothstep(0.52, 1.0, lum));

      // ── vignette
      float vig = smoothstep(0.98, 0.24, r * uVignette);
      col *= mix(1.0, vig, 0.72);

      // ── grain, animated, scaled down in the highlights so it stays a whisper
      float g = hash(uv * uRes + fract(uTime) * 137.13) - 0.5;
      col += g * uGrain * (1.0 - lum * 0.62);

      // ── boot fade
      col *= (1.0 - uFade);

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};
