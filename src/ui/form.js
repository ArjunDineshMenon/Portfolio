/* ══════════════════════════════════════════════════════════════════════
   form — there is no backend behind this site, so the form hands the
   message to the visitor's own email app and says so plainly.
   ══════════════════════════════════════════════════════════════════════ */

import { toast } from './chrome.js';
import { $ } from '../core/util.js';

const TO = 'arjundineshmenon1@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initForm() {
  const form = $('#cform');
  if (!form) return;

  const note = $('#cformNote');
  const baseNote = note ? note.textContent : '';

  const fields = [
    { el: $('#fname'), label: 'name', test: (v) => v.trim().length >= 2 },
    { el: $('#femail'), label: 'email', test: (v) => EMAIL_RE.test(v.trim()) },
    { el: $('#fmsg'), label: 'message', test: (v) => v.trim().length >= 8 },
  ];

  const setNote = (text, kind) => {
    if (!note) return;
    note.textContent = text;
    note.classList.remove('is-good', 'is-bad');
    if (kind) note.classList.add(kind);
  };

  fields.forEach(({ el }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      el.closest('.field').classList.remove('is-bad');
      el.removeAttribute('aria-invalid');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const bad = fields.filter(({ el, test }) => !el || !test(el.value));
    fields.forEach(({ el }) => el && el.closest('.field').classList.remove('is-bad'));

    if (bad.length) {
      bad.forEach(({ el }) => {
        if (!el) return;
        el.closest('.field').classList.add('is-bad');
        el.setAttribute('aria-invalid', 'true');
      });
      const first = bad[0].el;
      if (first) first.focus({ preventScroll: false });
      const which = bad.map((b) => b.label).join(', ');
      setNote(`Still need a valid ${which}.`, 'is-bad');
      return;
    }

    const name = fields[0].el.value.trim();
    const email = fields[1].el.value.trim();
    const message = fields[2].el.value.trim();

    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}\n`;

    const href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Assigning location is what actually hands off to the mail app. If the
    // visitor has none registered nothing visible happens, so the fallback
    // below gives them the address to copy.
    window.location.href = href;

    setNote('Your email app should be opening with it ready to send.', 'is-good');
    toast('Handed to your email app · ' + TO);

    setTimeout(() => {
      setNote(baseNote, null);
    }, 9000);
  });
}
