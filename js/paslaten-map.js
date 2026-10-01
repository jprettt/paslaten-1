(() => {
  "use strict";
  const frame = document.getElementById("paslaten-map-frame");
  if (!frame) return;
  const canvas = document.getElementById("paslaten-map-canvas");
  const status = document.getElementById("paslaten-map-status");
  const message = document.getElementById("paslaten-map-message");
  const buttons = [...frame.querySelectorAll("[data-map-action]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const location = { lat: 1.32778, lng: 124.85722 };
  // center altitude is metres above sea level. Use ground-relative altitude for
  // the final flight rather than assuming Tomohon's terrain elevation.
  const initialCamera = { center: { ...location, altitude: 800 }, range: 18000, tilt: 15, heading: 0 };
  const finalCamera = { center: { ...location, altitude: 25 }, altitudeMode: "RELATIVE_TO_GROUND", range: 3200, tilt: 62, heading: 325 };
  let map, marker, maps3d, observer;
  let initialized = false, visible = false, ready = false, started = false, intro = false, failed = false;
  let readyTimeout;

  function setControls(enabled) {
    buttons.forEach(button => { button.disabled = !enabled; });
    const fullscreen = buttons.find(button => button.dataset.mapAction === "fullscreen");
    fullscreen.disabled = !enabled || !frame.requestFullscreen;
  }
  function fail() {
    failed = true;
    clearTimeout(readyTimeout);
    intro = false;
    setControls(false);
    status.hidden = false;
    frame.setAttribute("aria-busy", "false");
    message.textContent = "Peta 3D belum dapat ditampilkan. Anda tetap dapat melihat lokasi Paslaten 1 melalui Google Maps.";
  }
  function loadGoogleMaps(config) {
    if (window.google?.maps?.importLibrary) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = setTimeout(() => finish(new Error("Maps load timed out")), 20000);
      function finish(error) {
        clearTimeout(timeout);
        delete window.__paslatenMapsLoaded;
        if (error) reject(error); else resolve();
      }
      window.__paslatenMapsLoaded = () => finish();
      script.src = "https://maps.googleapis.com/maps/api/js?" + new URLSearchParams({
        key: config.apiKey, v: config.version || "alpha", loading: "async",
        callback: "__paslatenMapsLoaded", language: "id", region: "ID",
      });
      script.async = true;
      script.onerror = () => finish(new Error("Maps script failed"));
      document.head.append(script);
    });
  }
  function revealMarker() {
    if (!marker.isConnected && !failed) map.append(marker);
    // 3D markers are rasterized by Google; CSS fades on the host don't animate
    // the rendered marker. Add it on animationend for reliable delayed reveal.
  }
  function finishIntro() {
    if (!intro || failed) return;
    intro = false;
    revealMarker();
    setControls(true);
  }
  function startIntro() {
    if (!ready || !visible || started || failed) return;
    started = true;
    observer?.disconnect();
    intro = true;
    setControls(false);
    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({ endCamera: finalCamera, durationMillis: reducedMotion.matches ? 0 : 6000 });
      } else {
        // The starting center uses an estimated sea-level elevation. Retain the
        // map's resolved center if this SDK has no ground-relative flight API.
        Object.assign(map, { range: finalCamera.range, tilt: finalCamera.tilt, heading: finalCamera.heading });
        finishIntro();
      }
    } catch { fail(); }
  }
  async function initialize() {
    if (initialized) return;
    initialized = true;
    const config = window.PASLATEN_MAPS_CONFIG || {};
    if (!config.apiKey?.trim()) { fail(); return; }
    message.textContent = "Menyiapkan perjalanan menuju Paslaten 1…";
    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => { fail(); previousAuthFailure?.(); };
    try {
      await loadGoogleMaps(config);
      maps3d = await google.maps.importLibrary("maps3d");
      if (failed) return;
      const { Map3DElement, Marker3DElement } = maps3d;
      map = new Map3DElement({
        ...initialCamera, mode: "SATELLITE", gestureHandling: "COOPERATIVE",
        defaultUIHidden: true,
        // Hide native buttons in favour of custom controls. Google's attribution
        // at the bottom is untouched by our overlays and CSS.
        description: "Peta tiga dimensi Paslaten 1, Tomohon Timur",
      });
      marker = new Marker3DElement({
        position: location, altitudeMode: "CLAMP_TO_GROUND",
        collisionBehavior: "REQUIRED", sizePreserved: true, drawsWhenOccluded: true,
      });
      const template = document.createElement("template");
      template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="48" viewBox="0 0 132 48">
        <path d="M60 34L66 44L72 34" fill="#103f38" stroke="#f0d080" stroke-width="2"/>
        <rect x="2" y="2" width="128" height="34" rx="17" fill="#103f38" stroke="#f0d080" stroke-width="2"/>
        <circle cx="18" cy="19" r="4" fill="#f0d080"/>
        <text x="77" y="24" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="13">Paslaten 1</text>
      </svg>`;
      marker.setAttribute("aria-label", "Paslaten 1");
      marker.append(template);
      map.addEventListener("gmp-error", fail);
      map.addEventListener("gmp-animationend", finishIntro);
      map.addEventListener("gmp-steadychange", event => {
        if (!event.isSteady || ready || failed) return;
        ready = true;
        if (!maps3d.MapMode?.ROADMAP) {
          const roadmapButton = frame.querySelector('[data-map-action="roadmap"]');
          roadmapButton.hidden = true;
        }
        clearTimeout(readyTimeout);
        status.hidden = true;
        frame.setAttribute("aria-busy", "false");
        startIntro();
      });
      map.addEventListener("gmp-tiltchange", () => {
        frame.querySelector('[data-map-action="tilt"]').setAttribute("aria-pressed", String(map.tilt > 10));
      });
      readyTimeout = setTimeout(fail, 45000);
      canvas.append(map);
    } catch { fail(); }
  }
  buttons.forEach(button => button.addEventListener("click", async () => {
    if (!ready || intro || failed) return;
    const action = button.dataset.mapAction;
    map.stopCameraAnimation?.();
    switch (action) {
      case "satellite":
      case "roadmap": {
        if (action === "roadmap" && !maps3d.MapMode?.ROADMAP) {
          return;
        }
        map.mode = action === "satellite" ? "SATELLITE" : maps3d.MapMode.ROADMAP;
        ["satellite", "roadmap"].forEach(mode => frame.querySelector(`[data-map-action="${mode}"]`).setAttribute("aria-pressed", String(mode === action)));
        break;
      }
      case "tilt": map.tilt = map.tilt > 10 ? 0 : 62; break;
      case "center":
        map.flyCameraTo({ endCamera: { ...finalCamera, tilt: map.tilt > 10 ? 62 : 0 }, durationMillis: reducedMotion.matches ? 0 : 1800 });
        break;
      case "zoom-in": map.range = Math.max(250, map.range / 1.5); break;
      case "zoom-out": map.range = Math.min(80000, map.range * 1.5); break;
      case "north": map.heading = 0; break;
      case "fullscreen":
        try {
          if (document.fullscreenElement === frame) await document.exitFullscreen();
          else await frame.requestFullscreen();
        } catch { /* Browser may decline fullscreen; map remains interactive. */ }
        break;
    }
  }));
  document.addEventListener("fullscreenchange", () => {
    frame.querySelector('[data-map-action="fullscreen"]').setAttribute("aria-label", document.fullscreenElement === frame ? "Keluar layar penuh" : "Buka layar penuh");
  });
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { initialize(); startIntro(); }
    }, { threshold: .2 });
    observer.observe(frame);
  } else { visible = true; initialize(); }
})();
