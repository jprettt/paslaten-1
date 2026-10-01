const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/paslaten-map.js'), 'utf8');

function setup({ key = 'test-key', reducedMotion = false } = {}) {
  class Element {
    constructor() { this.listeners = {}; this.attributes = {}; this.children = []; this.disabled = true; }
    addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
    emit(name, event = {}) { this.listeners[name]?.forEach(callback => callback(event)); }
    setAttribute(name, value) { this.attributes[name] = value; }
    append(child) { this.children.push(child); child.isConnected = true; }
  }
  const buttons = ['satellite', 'roadmap', 'tilt', 'center', 'zoom-in', 'zoom-out', 'north', 'fullscreen'].map(action => {
    const button = new Element(); button.dataset = { mapAction: action }; return button;
  });
  const frame = new Element();
  frame.querySelectorAll = () => buttons;
  frame.querySelector = selector => buttons.find(button => selector.includes(`"${button.dataset.mapAction}"`));
  const canvas = new Element(), status = new Element(), message = new Element();
  let map, marker, observer;
  class Map3DElement extends Element {
    constructor(options) { super(); Object.assign(this, options); this.flights = []; map = this; }
    flyCameraTo(options) { this.flights.push(options); }
    stopCameraAnimation() {}
  }
  class Marker3DElement extends Element {
    constructor(options) { super(); Object.assign(this, options); marker = this; }
  }
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; observer = this; }
    observe() {}
    disconnect() { this.disconnected = true; }
    scroll(isIntersecting) { this.callback([{ isIntersecting }]); }
  }
  const google = { maps: { importLibrary: async () => ({ Map3DElement, Marker3DElement, MapMode: { ROADMAP: 'ROADMAP' } }) } };
  const window = { google, IntersectionObserver, PASLATEN_MAPS_CONFIG: { apiKey: key }, matchMedia: () => ({ matches: reducedMotion }) };
  const document = {
    getElementById: id => ({ 'paslaten-map-frame': frame, 'paslaten-map-canvas': canvas, 'paslaten-map-status': status, 'paslaten-map-message': message })[id],
    createElement: () => new Element(), addEventListener() {},
  };
  vm.runInNewContext(source, { window, document, google, IntersectionObserver, setTimeout: () => 1, clearTimeout() {} });
  return { frame, canvas, status, message, buttons, get map() { return map; }, get marker() { return marker; }, observer };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('Loads only on visibility, flies once after readiness, then reveals marker', async () => {
  const app = setup();
  assert.equal(app.map, undefined);
  app.observer.scroll(true);
  await flush();
  assert.equal(app.map.flights.length, 0);
  assert.equal(app.marker.isConnected, undefined);
  app.map.emit('gmp-steadychange', { isSteady: true });
  assert.equal(app.map.flights.length, 1);
  assert.equal(app.map.flights[0].durationMillis, 6000);
  assert.equal(app.map.flights[0].endCamera.center.lat, 1.32778);
  assert.equal(app.map.flights[0].endCamera.center.lng, 124.85722);
  assert.equal(app.buttons[0].disabled, true);
  assert.equal(app.marker.isConnected, undefined);
  app.map.emit('gmp-animationend');
  assert.equal(app.marker.isConnected, true);
  assert.equal(app.buttons[0].disabled, false);
  app.observer.scroll(false); app.observer.scroll(true);
  app.map.emit('gmp-steadychange', { isSteady: true });
  assert.equal(app.map.flights.length, 1);
  assert.equal(app.map.children.length, 1);
});

test('Waits to fly if visitor scrolls away during loading', async () => {
  const app = setup();
  app.observer.scroll(true); app.observer.scroll(false);
  await flush();
  app.map.emit('gmp-steadychange', { isSteady: true });
  assert.equal(app.map.flights.length, 0);
  app.observer.scroll(true);
  assert.equal(app.map.flights.length, 1);
});

test('Controls switch map mode, tilt, zoom and recenter after intro', async () => {
  const app = setup(); app.observer.scroll(true); await flush();
  app.map.emit('gmp-steadychange', { isSteady: true }); app.map.emit('gmp-animationend');
  const click = action => app.buttons.find(button => button.dataset.mapAction === action).emit('click');
  click('roadmap'); assert.equal(app.map.mode, 'ROADMAP');
  click('satellite'); assert.equal(app.map.mode, 'SATELLITE');
  click('tilt'); assert.equal(app.map.tilt, 0);
  click('tilt'); assert.equal(app.map.tilt, 62);
  const range = app.map.range;
  click('zoom-in'); assert.equal(app.map.range, range / 1.5);
  click('zoom-out'); assert.equal(app.map.range, range);
  click('north'); assert.equal(app.map.heading, 0);
  click('center'); assert.equal(app.map.flights[1].durationMillis, 1800);
});

test('Missing key and SDK errors show fallback and disable controls', async () => {
  const missing = setup({ key: '' }); missing.observer.scroll(true);
  assert.equal(missing.map, undefined);
  assert.equal(missing.status.hidden, false);
  assert.equal(missing.frame.attributes['aria-busy'], 'false');
  const app = setup(); app.observer.scroll(true); await flush();
  app.map.emit('gmp-error'); app.map.emit('gmp-steadychange', { isSteady: true });
  assert.equal(app.map.flights.length, 0);
  assert.equal(app.status.hidden, false);
  assert.ok(app.buttons.every(button => button.disabled));
});

test('Reduced motion skips the six-second fly animation', async () => {
  const app = setup({ reducedMotion: true }); app.observer.scroll(true); await flush();
  app.map.emit('gmp-steadychange', { isSteady: true });
  assert.equal(app.map.flights[0].durationMillis, 0);
});
