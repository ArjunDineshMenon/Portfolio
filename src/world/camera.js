/* ══════════════════════════════════════════════════════════════════════
   camera rig — one continuous flight. Each DOM section owns two camera
   states, an arrival and a departure, anchored to that section's measured
   scroll range so the 3D can never drift out of sync with the words.
   Between keys it runs a Catmull-Rom, then damps toward the result so a
   fast flick has weight instead of snapping.
   ══════════════════════════════════════════════════════════════════════ */

import { Vector3, Euler, Quaternion } from 'three';

import { pointer } from '../core/pointer.js';
import { scroll, sections } from '../core/scroll.js';
import { caps } from '../core/caps.js';
import { clamp, damp, catmull } from '../core/util.js';

/* ── the shot list. Everything runs down -Z from the gate at the origin. */
export const SHOTS = {
  torii: {
    in:  { pos: [0.0, 3.05, 15.5], look: [0.0, 3.30, 0.0],   fov: 58 },
    out: { pos: [1.5, 3.70, -2.2], look: [0.5, 3.00, -16.0], fov: 49 },
  },
  sea: {
    in:  { pos: [2.7, 2.35, -19.0], look: [1.1, 1.35, -34.0], fov: 57 },
    out: { pos: [1.2, 4.40, -40.0], look: [0.0, 5.00, -56.0], fov: 57 },
  },
  field: {
    in:  { pos: [-1.6, 5.10, -48.0], look: [0.2, 5.20, -60.0], fov: 62 },
    out: { pos: [-6.4, 6.10, -80.0], look: [2.0, 7.00, -104.0], fov: 60 },
  },
  monoliths: {
    in:  { pos: [-7.4, 6.40, -96.0],  look: [3.5, 8.50, -120.0], fov: 58 },
    out: { pos: [6.2, 7.60, -142.0],  look: [-3.0, 8.00, -164.0], fov: 58 },
  },
  path: {
    in:  { pos: [-1.4, 3.40, -176.0], look: [0.0, 9.00, -202.0], fov: 58 },
    out: { pos: [2.6, 17.00, -244.0], look: [0.0, 25.00, -276.0], fov: 54 },
  },
  record: {
    in:  { pos: [1.4, 24.00, -268.0], look: [0.0, 25.50, -292.0], fov: 52 },
    out: { pos: [0.6, 28.00, -288.0], look: [0.0, 24.00, -360.0], fov: 49 },
  },
  horizon: {
    in:  { pos: [0.4, 29.00, -298.0], look: [-1.0, 23.00, -400.0], fov: 47 },
    out: { pos: [0.0, 30.50, -312.0], look: [-3.0, 21.00, -448.0], fov: 45 },
  },
};

const V = (a) => new Vector3(a[0], a[1], a[2]);

export function createRig(camera) {
  /** built from measured section ranges, rebuilt on resize */
  let keys = [];

  const curPos = new Vector3().copy(camera.position);
  const curLook = new Vector3(0, 3.3, 0);
  let curFov = 58;
  let roll = 0;

  const tPos = new Vector3();
  const tLook = new Vector3();
  const prevPos = new Vector3();
  const right = new Vector3();
  const up = new Vector3();
  const fwd = new Vector3();

  function build() {
    keys = [];
    const list = sections.filter((s) => SHOTS[s.id]);
    if (!list.length) {
      keys = [
        { at: 0, pos: V(SHOTS.torii.in.pos), look: V(SHOTS.torii.in.look), fov: SHOTS.torii.in.fov },
        { at: 1, pos: V(SHOTS.horizon.out.pos), look: V(SHOTS.horizon.out.look), fov: SHOTS.horizon.out.fov },
      ];
      return;
    }

    list.forEach((s, i) => {
      const shot = SHOTS[s.id];
      const span = Math.max(s.end - s.start, 0.0001);
      const a = i === 0 ? 0 : s.start + span * 0.12;
      const b = i === list.length - 1 ? 1 : s.start + span * 0.9;
      keys.push({ at: a, pos: V(shot.in.pos), look: V(shot.in.look), fov: shot.in.fov });
      keys.push({ at: b, pos: V(shot.out.pos), look: V(shot.out.look), fov: shot.out.fov });
    });

    keys.sort((x, y) => x.at - y.at);
    // guarantee strictly increasing so the segment search can never divide by zero
    for (let i = 1; i < keys.length; i++) {
      if (keys[i].at <= keys[i - 1].at) keys[i].at = keys[i - 1].at + 0.0006;
    }
    keys[0].at = 0;
    keys[keys.length - 1].at = Math.max(1, keys[keys.length - 1].at);
  }

  /** exact keyframe sample at t, no damping */
  function sample(t, outPos, outLook) {
    const n = keys.length;
    if (n < 2) return 58;

    let i = 0;
    while (i < n - 2 && t > keys[i + 1].at) i++;

    const k1 = keys[i];
    const k2 = keys[i + 1];
    const k0 = keys[Math.max(0, i - 1)];
    const k3 = keys[Math.min(n - 1, i + 2)];
    const u = clamp((t - k1.at) / (k2.at - k1.at));

    outPos.set(
      catmull(k0.pos.x, k1.pos.x, k2.pos.x, k3.pos.x, u),
      catmull(k0.pos.y, k1.pos.y, k2.pos.y, k3.pos.y, u),
      catmull(k0.pos.z, k1.pos.z, k2.pos.z, k3.pos.z, u)
    );
    outLook.set(
      catmull(k0.look.x, k1.look.x, k2.look.x, k3.look.x, u),
      catmull(k0.look.y, k1.look.y, k2.look.y, k3.look.y, u),
      catmull(k0.look.z, k1.look.z, k2.look.z, k3.look.z, u)
    );
    return catmull(k0.fov, k1.fov, k2.fov, k3.fov, u);
  }

  build();

  const rig = {
    build,
    /** put the camera exactly on the rail with no easing (boot, reduced motion) */
    snap(t = 0) {
      const fov = sample(t, tPos, tLook);
      curPos.copy(tPos);
      curLook.copy(tLook);
      curFov = fov;
      roll = 0;
      camera.position.copy(curPos);
      camera.up.set(0, 1, 0);
      camera.lookAt(curLook);
      camera.fov = fov;
      camera.updateProjectionMatrix();
    },

    update(dt) {
      const fov = sample(scroll.p, tPos, tLook);

      prevPos.copy(curPos);

      // Damping is what gives the flight weight. Higher when the visitor is
      // dragging the scrollbar fast so the camera never falls a mile behind.
      const k = 5.0 + scroll.energy * 7.0;
      curPos.x = damp(curPos.x, tPos.x, k, dt);
      curPos.y = damp(curPos.y, tPos.y, k, dt);
      curPos.z = damp(curPos.z, tPos.z, k, dt);
      curLook.x = damp(curLook.x, tLook.x, k * 0.9, dt);
      curLook.y = damp(curLook.y, tLook.y, k * 0.9, dt);
      curLook.z = damp(curLook.z, tLook.z, k * 0.9, dt);
      curFov = damp(curFov, fov, 3.4, dt);

      // ── mouse look. A small offset of the aim point, in camera space,
      //    so the world answers the pointer without ever fighting the rail.
      fwd.copy(curLook).sub(curPos).normalize();
      right.crossVectors(fwd, camera.up).normalize();
      up.crossVectors(right, fwd).normalize();

      const par = caps.touch ? 0 : 1;
      const amt = 2.1 * par;

      camera.position.copy(curPos);
      camera.position.addScaledVector(right, pointer.sx * 0.42 * par);
      camera.position.addScaledVector(up, pointer.sy * 0.3 * par);

      const aim = tLook.copy(curLook);
      aim.addScaledVector(right, pointer.sx * amt);
      aim.addScaledVector(up, pointer.sy * amt * 0.72);

      camera.up.set(0, 1, 0);
      camera.lookAt(aim);

      // ── bank into the turn, from the rig's own lateral velocity
      const lateral = (curPos.x - prevPos.x) / Math.max(dt, 0.0001);
      const targetRoll = clamp(-lateral * 0.012, -0.09, 0.09) + pointer.sx * 0.012;
      roll = damp(roll, targetRoll, 3.2, dt);
      camera.rotateZ(roll);

      if (Math.abs(camera.fov - curFov) > 0.002) {
        camera.fov = curFov;
        camera.updateProjectionMatrix();
      }
    },
  };

  return rig;
}
