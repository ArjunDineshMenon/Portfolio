/* ══════════════════════════════════════════════════════════════════════
   KUMO — Arjun Dinesh Menon's portfolio
   One WebGL world, one continuous camera flight, one page of real content
   layered over it.

   Boot order matters: measure the page, build the world, compile the
   shaders, land one frame, then lift the curtain. Nothing is shown before
   it is genuinely ready, and the page is complete even if WebGL never
   starts.
   ══════════════════════════════════════════════════════════════════════ */

import gsap from 'gsap';

import { caps, onReducedChange } from './core/caps.js';
import { add, start as startTicker } from './core/ticker.js';
import { initPointer } from './core/pointer.js';
import { initScroll, measure, scroll, stopScroll, startScrollInput } from './core/scroll.js';
import { $, wait } from './core/util.js';

import { initStage, stage, render, resize, watchPerf } from './gl/stage.js';
import { createWorld } from './world/world.js';

import { initPreloader } from './ui/preloader.js';
import { initReveal, ScrollTrigger } from './ui/reveal.js';
import { initChrome, toast } from './ui/chrome.js';
import { initCursor } from './ui/cursor.js';
import { initForm } from './ui/form.js';
import { initMotionControl } from './ui/motion.js';
import { readSkills, initBridge } from './ui/bridge.js';

/* the flight is designed to start at the gate, so a restored scroll
   position would drop the visitor into the middle of a shot */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const pre = initPreloader();
let world = null;

/** never let a blocked font CDN hold the page hostage */
function fontsReady(ms = 2600) {
  if (!document.fonts || !document.fonts.ready) return wait(0);
  return Promise.race([document.fonts.ready, wait(ms)]);
}

async function boot() {
  pre.set(0.08, 'starting up');

  /* ── 1. input and scrolling ───────────────────────────────── */
  initPointer();
  window.scrollTo(0, 0);
  initScroll(() => ScrollTrigger.update());
  stopScroll();

  /* ── 2. page chrome and choreography ──────────────────────── */
  const chrome = initChrome();
  const cursor = initCursor();
  const reveal = initReveal();
  initForm();
  initMotionControl();

  startTicker();
  pre.set(0.2, 'laying out the page');

  /* ── 3. type ──────────────────────────────────────────────── */
  await fontsReady();
  measure();
  ScrollTrigger.refresh();
  pre.set(0.34, 'type loaded');

  /* ── 4. the world, if this device can run it ───────────────── */
  if (!caps.webgl) {
    document.body.classList.add('no-gl');
    pre.set(1, 'ready');
    await finishBoot(chrome, cursor, reveal);
    toast('Running without 3D on this device. Everything else works.');
    return;
  }

  try {
    const canvas = $('#gl');
    initStage(canvas);
    pre.set(0.46, 'compiling shaders');
    await wait(16);

    const skills = readSkills();
    world = createWorld(skills);
    pre.set(0.62, 'building the gate');
    await wait(16);

    // force every shader through the compiler before the first visible
    // frame, so the reveal never stutters
    stage.renderer.compile(stage.scene, stage.camera);
    pre.set(0.82, 'warming up');
    await wait(16);

    world.api.refreshLabels();

    // land one real frame while the curtain is still down
    world.rig.snap(0);
    world.update(0.016, 0);
    render();
    pre.set(0.94, 'first frame');
    await wait(16);

    initBridge(world, skills);
    canvas.classList.add('is-ready');

    if (caps.reduced) {
      /* Reduced motion: the world becomes one composed still behind the
         page instead of a flight. Re-rendered only on resize. */
      world.freeze(0);
      render();
      addEventListener('resize', () => {
        resize();
        world.freeze(0);
        render();
      });
    } else {
      let t = 0;
      add((dt) => {
        t += dt;
        world.update(dt, t);
        if (stage.grade) {
          stage.grade.uniforms.uTime.value = t;
          stage.grade.uniforms.uEnergy.value = scroll.energy;
        }
        render();
        watchPerf(dt, (tier) => {
          // silent by design; the visitor should feel it get smoother, not
          // read an apology
          if (world) world.remeasure();
        });
      }, 50);
    }

    /* keep the rail, the reveals and the shot list agreeing with the DOM */
    let rz = 0;
    addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => {
        measure();
        if (world) world.remeasure();
        ScrollTrigger.refresh();
      }, 160);
    });

    onReducedChange(() => location.reload());

    pre.set(1, 'ready');
    await finishBoot(chrome, cursor, reveal);

    /* ── the gate assembles as the curtain lifts ─────────────── */
    if (!caps.reduced) {
      const u = { v: 0 };
      gsap.to(u, {
        v: 1,
        duration: 3.1,
        ease: 'power2.inOut',
        onUpdate: () => world.torii.userData.form(u.v),
      });
    } else {
      world.torii.userData.form(1);
    }
  } catch (err) {
    // A shader that will not compile, or a driver that gives up, must not
    // take the content down with it.
    console.error('[kumo] world failed to start:', err);
    document.body.classList.add('no-gl');
    const canvas = $('#gl');
    if (canvas) canvas.classList.remove('is-ready');
    pre.set(1, 'ready');
    await finishBoot(chrome, cursor, reveal);
  }
}

async function finishBoot(chrome, cursor, reveal) {
  await pre.finish();
  startScrollInput();
  chrome.show();
  cursor.show();
  reveal.hero();
  measure();
  ScrollTrigger.refresh();
  document.documentElement.classList.add('is-booted');
}

boot();
