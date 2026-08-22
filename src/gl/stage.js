/* ══════════════════════════════════════════════════════════════════════
   stage — one renderer, one scene, one camera, one composer.
   Bloom for the vermillion, then a grade pass for aberration, grain,
   vignette and the indigo/warm split-tone that ties the world together.
   ══════════════════════════════════════════════════════════════════════ */

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  FogExp2,
  Vector2,
  ACESFilmicToneMapping,
  SRGBColorSpace,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { caps, downgrade } from '../core/caps.js';
import { perf } from '../core/ticker.js';
import { PAL, FOG_DENSITY } from './palette.js';
import { GradeShader } from './passes/grade.js';

export const stage = {
  renderer: null,
  scene: null,
  camera: null,
  composer: null,
  bloom: null,
  grade: null,
  width: 0,
  height: 0,
  usePost: true,
};

export function initStage(canvas) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: caps.tier >= 3,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });
  renderer.setClearColor(PAL.voidDeep, 1);
  renderer.setPixelRatio(caps.dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.autoClear = true;

  const scene = new Scene();
  scene.fog = new FogExp2(PAL.void.getHex(), FOG_DENSITY);

  const camera = new PerspectiveCamera(60, 1, 0.1, 900);
  camera.position.set(0, 3, 15);

  stage.renderer = renderer;
  stage.scene = scene;
  stage.camera = camera;

  buildComposer();
  resize();
  addEventListener('resize', resize, { passive: true });
  addEventListener('orientationchange', resize, { passive: true });

  // Losing the context should degrade to the designed still page, not a blank hole.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    document.body.classList.add('no-gl');
    canvas.classList.remove('is-ready');
  });

  return stage;
}

function buildComposer() {
  const { renderer, scene, camera } = stage;

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(caps.dpr);
  composer.addPass(new RenderPass(scene, camera));

  if (caps.bloom) {
    const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.62, 0.72, 0.58);
    composer.addPass(bloom);
    stage.bloom = bloom;
  } else {
    stage.bloom = null;
  }

  if (caps.grade) {
    const grade = new ShaderPass(GradeShader);
    composer.addPass(grade);
    stage.grade = grade;
  } else {
    stage.grade = null;
  }

  composer.addPass(new OutputPass());

  stage.composer = composer;
  stage.usePost = caps.bloom || caps.grade;
}

export function resize() {
  const w = innerWidth;
  const h = innerHeight;
  stage.width = w;
  stage.height = h;

  stage.camera.aspect = w / h;
  stage.camera.updateProjectionMatrix();

  stage.renderer.setPixelRatio(caps.dpr);
  stage.renderer.setSize(w, h, false);

  if (stage.composer) {
    stage.composer.setPixelRatio(caps.dpr);
    stage.composer.setSize(w, h);
  }
  if (stage.grade) stage.grade.uniforms.uRes.value.set(w * caps.dpr, h * caps.dpr);
  if (stage.bloom) stage.bloom.setSize(w, h);
}

export function render() {
  if (stage.usePost && stage.composer) stage.composer.render();
  else stage.renderer.render(stage.scene, stage.camera);
}

/* ── perf watchdog ──────────────────────────────────────────────
   Two seconds of missed frames costs one tier. Better a simpler
   world at 60 than the full one at 28.                          */
let bad = 0;
let checked = 0;
export function watchPerf(dt, onDowngrade) {
  checked += dt;
  if (checked < 1) return;
  checked = 0;

  if (perf.fps < 44) bad += 1;
  else bad = Math.max(0, bad - 1);

  if (bad >= 2) {
    bad = 0;
    if (downgrade()) {
      stage.renderer.setPixelRatio(caps.dpr);
      const passes = stage.composer ? stage.composer.passes.length : 0;
      if (!caps.bloom && stage.bloom && passes) {
        stage.composer.removePass(stage.bloom);
        stage.bloom.dispose();
        stage.bloom = null;
      }
      if (!caps.grade && stage.grade) {
        stage.composer.removePass(stage.grade);
        stage.grade.dispose();
        stage.grade = null;
        stage.usePost = !!stage.bloom;
      }
      resize();
      if (onDowngrade) onDowngrade(caps.tier);
    }
  }
}
