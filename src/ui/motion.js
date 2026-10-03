import { caps, setMotionPreference } from '../core/caps.js';

export function initMotionControl() {
  const button = document.querySelector('#motionToggle');
  if (!button) return;
  button.hidden = false;
  button.textContent = caps.reduced ? 'Enable animations' : 'Pause animations';
  button.setAttribute('aria-label', button.textContent);
  button.title = caps.reduced
    ? 'Animations are paused. Enable them for this website without changing your device settings.'
    : 'Pause the 3D scene and page animations.';
  button.addEventListener('click', () => {
    setMotionPreference(caps.reduced ? 'full' : 'reduced');
  });
}
