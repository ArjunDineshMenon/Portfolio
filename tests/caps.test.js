import assert from 'node:assert/strict';
import test from 'node:test';

async function withDevice({ renderer = 'Intel UHD Graphics', webgl2 = true, reduced = false, debug = true, preference = null, query = '', storageBlocked = false }, check) {
  let released = false;
  const requestedContexts = [];
  const gl = {
    getExtension(name) {
      if (name === 'WEBGL_debug_renderer_info') return debug ? { UNMASKED_RENDERER_WEBGL: 1 } : null;
      if (name === 'WEBGL_lose_context') return { loseContext() { released = true; } };
      return null;
    },
    getParameter() { return renderer; },
  };
  const globals = {
    document: { documentElement: { dataset: {} }, createElement: () => ({ getContext(name) {
      requestedContexts.push(name);
      return webgl2 ? gl : null;
    } }) },
    matchMedia: query => ({ matches: query.includes('prefers-reduced-motion') && reduced }),
    navigator: { hardwareConcurrency: 8, deviceMemory: 8 },
    innerWidth: 1440,
    innerHeight: 900,
    devicePixelRatio: 2,
    location: { href: `https://example.com/Portfolio/${query}` },
    localStorage: { getItem() {
      if (storageBlocked) throw new Error('Storage blocked');
      return preference;
    } },
  };
  const previous = new Map();
  for (const [name, value] of Object.entries(globals)) {
    previous.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value, configurable: true });
  }
  try {
    const { caps } = await import(`../src/core/caps.js?device=${encodeURIComponent(JSON.stringify({ renderer, webgl2, reduced, debug, preference, query, storageBlocked }))}`);
    await check(caps);
    assert.deepEqual(requestedContexts, ['webgl2']);
    assert.equal(released, webgl2);
  } finally {
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
}

for (const renderer of ['ANGLE (Google, SwiftShader Device)', 'Mesa llvmpipe', 'Software Rasterizer']) {
  test(`${renderer} keeps animations available with the smallest rendering budget`, async () => {
    await withDevice({ renderer }, caps => {
      assert.equal(caps.webgl, true);
      assert.equal(caps.tier, 1);
      assert.equal(caps.bloom, false);
      assert.equal(caps.grade, false);
      assert.equal(caps.dpr, 1.25);
      assert.equal(caps.reduced, false);
    });
  });
}

test('hardware WebGL retains the full rendering budget', async () => {
  await withDevice({}, caps => {
    assert.equal(caps.webgl, true);
    assert.equal(caps.tier, 3);
  });
});

test('WebGL works when renderer information is unavailable', async () => {
  await withDevice({ debug: false }, caps => assert.equal(caps.webgl, true));
});

test('a device without WebGL 2 uses the content fallback', async () => {
  await withDevice({ webgl2: false }, caps => assert.equal(caps.webgl, false));
});

test('software rendering still respects the reduced motion preference', async () => {
  await withDevice({ renderer: 'SwiftShader', reduced: true }, caps => {
    assert.equal(caps.webgl, true);
    assert.equal(caps.reduced, true);
  });
});

test('explicitly enabling animations overrides the device reduced-motion default', async () => {
  await withDevice({ reduced: true, preference: 'full' }, caps => {
    assert.equal(caps.reduced, false);
    assert.equal(document.documentElement.dataset.motion, 'full');
  });
});

test('explicitly pausing animations also works on devices with motion enabled', async () => {
  await withDevice({ preference: 'reduced' }, caps => assert.equal(caps.reduced, true));
});

test('the shareable animation link works when browser storage is blocked', async () => {
  await withDevice({ reduced: true, storageBlocked: true, query: '?motion=full' }, caps => assert.equal(caps.reduced, false));
});

test('the URL choice takes precedence over a previous saved choice', async () => {
  await withDevice({ preference: 'reduced', query: '?motion=full' }, caps => assert.equal(caps.reduced, false));
});

test('blocked storage and invalid URL preferences retain the accessible device default', async () => {
  await withDevice({ reduced: true, storageBlocked: true, query: '?motion=invalid' }, caps => assert.equal(caps.reduced, true));
});
