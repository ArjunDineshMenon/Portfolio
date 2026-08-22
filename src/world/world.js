/* ══════════════════════════════════════════════════════════════════════
   world — assembles the single scene graph and ticks it. One update call,
   one render, in a fixed order.
   ══════════════════════════════════════════════════════════════════════ */

import { Group } from 'three';

import { stage } from '../gl/stage.js';
import { caps } from '../core/caps.js';
import { scroll } from '../core/scroll.js';
import { createSky, createDust, createSakura } from './environment.js';
import { createSea } from './sea.js';
import { createTorii } from './torii.js';
import { createSkillField } from './skillfield.js';
import { createMonoliths } from './monoliths.js';
import { createPath } from './path.js';
import { createHorizon } from './horizon.js';
import { createRig } from './camera.js';

export function createWorld(skills) {
  const { scene, camera } = stage;

  const root = new Group();
  root.name = 'world';
  scene.add(root);

  const sky = createSky();
  const sea = createSea();
  const dust = createDust();
  const torii = createTorii();
  const field = createSkillField(skills);
  const monoliths = createMonoliths();
  const path = createPath();
  const horizon = createHorizon();
  const sakura = caps.tier >= 2 ? createSakura() : null;

  const parts = [sky, sea, dust, torii, field, monoliths, path, horizon];
  if (sakura) parts.push(sakura);
  parts.forEach((p) => root.add(p));

  const rig = createRig(camera);
  rig.snap(scroll.p);

  const world = {
    root,
    rig,
    torii,
    api: {
      skills: field.userData.api,
      projects: monoliths.userData.api,
      path: path.userData.api,
      refreshLabels: path.userData.api.refreshLabels,
    },

    update(dt, t) {
      rig.update(dt);
      for (let i = 0; i < parts.length; i++) {
        const u = parts[i].userData.update;
        if (u) u(dt, t, camera);
      }
    },

    /** one exact frame with no easing, for reduced motion and for boot */
    freeze(t = 0) {
      rig.snap(scroll.p);
      torii.userData.form(1);
      for (let i = 0; i < parts.length; i++) {
        const u = parts[i].userData.update;
        if (u) u(0.016, t, camera);
      }
      // visibility gates read scroll.p, and a frozen frame still needs the
      // gate to have run once, so tick the rig one more time
      rig.snap(scroll.p);
    },

    remeasure() {
      rig.build();
    },

    dispose() {
      parts.forEach((p) => {
        if (p.userData.dispose) p.userData.dispose();
        root.remove(p);
      });
      scene.remove(root);
    },
  };

  return world;
}
