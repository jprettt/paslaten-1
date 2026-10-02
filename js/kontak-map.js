(() => {
  "use strict";
  const frame = document.getElementById("paslaten-map-frame");
  if (!frame || frame.dataset.mapInitialized) return;
  frame.dataset.mapInitialized = "true";
  const canvas = document.getElementById("paslaten-map-canvas");
  const status = document.getElementById("paslaten-map-status");
  const message = document.getElementById("paslaten-map-message");
  const controls = [...frame.querySelectorAll("[data-map-action]")];
  let currentBasemap = "satellite", currentDimension = "3d";
  const statistics = {
    1: [274, 123, 151, 104],
    2: [381, 179, 202, 130],
    3: [483, 251, 232, 160],
    4: [263, 127, 136, 89],
    5: [340, 174, 166, 115],
    6: [967, 495, 472, 316],
    7: [505, 247, 258, 164],
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const markers = [];
  let map, maplibre, pointBounds, finalCamera, observer, resizeObserver, activePopup;
  let visible = false, ready = false, introPlayed = false, introRunning = false, failed = false;
  let terrainEnabled = false, terrainTimer, loadingTimer, satelliteTimer, markerTimer;
  let overlaysReady = false, fallbackActive = false, satelliteErrors = 0;
  const handlers = ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate", "touchPitch"];

  function setInteraction(enabled) {
    handlers.forEach(name => map[name]?.[enabled ? "enable" : "disable"]());
    controls.forEach(button => { button.disabled = !enabled || (button.dataset.mapAction === "3d" && !terrainEnabled); });
    canvas.classList.toggle("map-intro-running", !enabled);
  }

  function fail(webgl = false) {
    if (failed) return;
    failed = true;
    clearTimeout(loadingTimer);
    clearTimeout(terrainTimer);
    clearTimeout(satelliteTimer);
    clearTimeout(markerTimer);
    observer?.disconnect();
    resizeObserver?.disconnect();
    if (map) { map.remove(); map = null; }
    controls.forEach(button => { button.disabled = true; });
    status.hidden = false;
    status.classList.remove("is-ready");
    status.querySelector("strong").textContent = "Peta belum dapat dimuat.";
    message.textContent = webgl
      ? "Browser ini belum mendukung WebGL 2. Coba browser lain untuk membuka peta."
      : "Data wilayah tidak berhasil dimuat.";
    frame.setAttribute("aria-busy", "false");
  }

  async function loadJSON(url, timeout = 15000) {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!response.ok) throw new Error("Map data unavailable");
    return response.json();
  }

  function popup(number) {
    const [population, men, women, families] = statistics[number];
    return `<article class="lingkungan-popup">
      <h3>LINGKUNGAN ${number}</h3><p>Paslaten 1</p>
      <dl><div><dt>Penduduk</dt><dd>${population} jiwa</dd></div>
      <div><dt>Laki-laki</dt><dd>${men}</dd></div>
      <div><dt>Perempuan</dt><dd>${women}</dd></div>
      <div><dt>Kartu Keluarga</dt><dd>${families}</dd></div></dl>
      <small>Data Penduduk 2026</small></article>`;
  }

  // Interpolate compact sizes without changing coordinates or marker offsets.
  function layoutMarkers() {
    const zoom = map.getZoom();
    const size = zoom < 14 ? 19 : zoom < 15.5
      ? 19 + (zoom - 14) * 2 : Math.min(25, 22 + (zoom - 15.5) * 2);
    canvas.style.setProperty("--marker-size", size.toFixed(2) + "px");
    canvas.style.setProperty("--marker-font", (size * .44).toFixed(2) + "px");
    canvas.style.setProperty("--marker-border", (size * .07).toFixed(2) + "px");
  }

  function updateControls() {
    controls.forEach(button => {
      const action = button.dataset.mapAction;
      if (action !== "center") button.setAttribute("aria-pressed",
        String(action === currentBasemap || action === currentDimension));
      button.disabled = failed || !ready || introRunning || (action === "3d" && !terrainEnabled);
    });
  }

  function switchBasemap(mode) {
    if (!map || failed) return;
    currentBasemap = mode;
    if (mode === "satellite") { fallbackActive = false; satelliteErrors = 0; }
    map.setLayoutProperty("satellite", "visibility", mode === "satellite" ? "visible" : "none");
    map.setLayoutProperty("osm", "visibility", mode === "map" ? "visible" : "none");
    updateControls();
  }

  function dimensionCamera() {
    return { ...finalCamera, pitch: currentDimension === "2d" ? 0 : 58,
      bearing: currentDimension === "2d" ? 0 : 20 };
  }

  function switchDimension(mode) {
    if (!map || failed || (mode === "3d" && !terrainEnabled)) return;
    currentDimension = mode;
    map.setTerrain(mode === "3d" ? { source: "paslaten-terrain", exaggeration: 1 } : null);
    const camera = { pitch: mode === "2d" ? 0 : 58, bearing: mode === "2d" ? 0 : 20 };
    if (reducedMotion.matches) map.jumpTo(camera);
    else map.easeTo({ ...camera, duration: mode === "2d" ? 600 : 700 });
    updateControls();
  }

  function closePopup() {
    activePopup?.popup.remove();
    markers.forEach(item => item.element.classList.remove("is-selected"));
    activePopup = null;
  }

  function showPopup(item) {
    closePopup();
    const panel = new maplibre.Popup({
      className: "paslaten-statistics-popup", maxWidth: "230px",
      offset: 14, focusAfterOpen: false,
    }).setLngLat(item.coordinates).setHTML(popup(item.number)).addTo(map);
    activePopup = { popup: panel, number: item.number };
    item.element.classList.add("is-selected");
    panel.on("close", () => item.element.classList.remove("is-selected"));
    // Keep the compact popup inside the map on narrow screens without zooming.
    requestAnimationFrame(() => {
      if (!panel.isOpen()) return;
      const box = panel.getElement().getBoundingClientRect();
      const area = canvas.getBoundingClientRect();
      const dx = box.left < area.left + 10 ? box.left - area.left - 10
        : box.right > area.right - 10 ? box.right - area.right + 10 : 0;
      const dy = box.top < area.top + 10 ? box.top - area.top - 10
        : box.bottom > area.bottom - 28 ? box.bottom - area.bottom + 28 : 0;
      if (dx || dy) map.panBy([dx, dy], { duration: reducedMotion.matches ? 0 : 300 });
    });
  }

  function createMarkers(points) {
    [...points.features].sort((a, b) => a.properties.Name.localeCompare(b.properties.Name)).forEach(feature => {
      const number = Number(/^Lingkungan ([1-7])$/.exec(feature.properties.Name)[1]);
      const coordinates = feature.geometry.coordinates.slice(0, 2);
      const element = document.createElement("button");
      element.type = "button";
      element.className = "lingkungan-marker";
      element.setAttribute("aria-label", `Lingkungan ${number}, statistik penduduk 2026`);
      element.disabled = true;
      element.innerHTML = `<span class="lingkungan-marker-face">${number}</span>`;
      const marker = new maplibre.Marker({ element, anchor: "center", pitchAlignment: "viewport", rotationAlignment: "viewport" })
        .setLngLat(coordinates).addTo(map);
      const item = { marker, element, coordinates, number };
      element.addEventListener("click", event => { event.stopPropagation(); showPopup(item); });
      markers.push(item);
    });
    map.on("zoom", layoutMarkers);
    layoutMarkers();
  }

  function cameraForPoints() {
    const mobile = canvas.clientWidth <= 640;
    const padding = mobile ? { top: 110, bottom: 65, left: 32, right: 32 }
      : { top: 80, bottom: 65, left: 70, right: 70 };
    const camera = map.cameraForBounds(pointBounds, { padding, maxZoom: 15.1, bearing: currentDimension === "2d" ? 0 : 20 });
    if (!camera) throw new Error("Camera unavailable");
    const result = { center: camera.center, zoom: camera.zoom, bearing: currentDimension === "2d" ? 0 : 20, pitch: currentDimension === "2d" ? 0 : 58 };
    // cameraForBounds computes a flat fit. Check the real pitched projection,
    // including terrain, so all seven points also fit the final perspective.
    for (let attempt = 0; attempt < 10; attempt++) {
      map.jumpTo(result);
      const fits = markers.every(item => {
        const p = map.project(item.coordinates);
        return p.x >= padding.left && p.x <= canvas.clientWidth - padding.right
          && p.y >= padding.top && p.y <= canvas.clientHeight - padding.bottom;
      });
      if (fits) break;
      result.zoom -= 0.15;
    }
    return result;
  }

  function initialCamera() {
    // Keep the local approach exactly one zoom level wider than the fitted view.
    return { ...finalCamera, zoom: finalCamera.zoom - 1.0, pitch: currentDimension === "2d" ? 0 : 35, bearing: currentDimension === "2d" ? 0 : 15 };
  }

  function finishIntro() {
    if (!introRunning || failed) return;
    introRunning = false;
    map.off("moveend", finishIntro);
    clearTimeout(markerTimer);
    canvas.classList.add("map-markers-visible");
    markers.forEach(item => { item.element.disabled = false; });
    layoutMarkers();
    setInteraction(true);
  }

  function playIntro() {
    if (!ready || !visible || introPlayed || failed) return;
    introPlayed = true;
    observer?.disconnect();
    introRunning = true;
    if (reducedMotion.matches) {
      map.jumpTo(finalCamera);
      finishIntro();
    } else {
      map.once("moveend", finishIntro);
      markerTimer = setTimeout(() => {
        if (!failed) canvas.classList.add("map-markers-visible");
      }, 1400);
      map.flyTo({ ...finalCamera, duration: 2000, curve: 1, essential: false });
    }
  }

  function makeReady() {
    if (ready || failed || !overlaysReady) return;
    const basemap = currentBasemap === "map" ? "osm" : "satellite";
    if (!map.isSourceLoaded(basemap) || !map.isSourceLoaded("paslaten-lines")
      || !map.isSourceLoaded("paslaten-points")) return;
    clearTimeout(satelliteTimer);
    clearTimeout(loadingTimer);
    clearTimeout(terrainTimer);
    map.off("render", makeReady);
    try {
      finalCamera = cameraForPoints();
      map.jumpTo(initialCamera());
      ready = true;
      frame.setAttribute("aria-busy", "false");
      status.classList.add("is-ready");
      setTimeout(() => { if (!failed) status.hidden = true; }, reducedMotion.matches ? 0 : 350);
      playIntro();
    } catch { fail(); }
  }

  function disableTerrain() {
    if (!map || failed || !terrainEnabled) return;
    terrainEnabled = false;
    currentDimension = "2d";
    map.setTerrain(null);
    if (finalCamera) finalCamera = dimensionCamera();
    if (ready) map.jumpTo({ pitch: 0, bearing: 0 });
    updateControls();
    if (map.getSource("paslaten-terrain")) map.removeSource("paslaten-terrain");
    if (!ready) map.on("render", makeReady);
  }

  function useFallback() {
    if (!map || failed || fallbackActive) return;
    fallbackActive = true;
    clearTimeout(satelliteTimer);
    switchBasemap("map");
  }

  async function initialize() {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2");
    if (!gl) { fail(true); return; }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const [library, lines, points, dem] = await Promise.all([
      import("https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs"),
      loadJSON("../mygeodata/Line.geojson"),
      loadJSON("../mygeodata/Point.geojson"),
      loadJSON("https://tiles.mapterhorn.com/tilejson.json", 6000).catch(() => null),
    ]);
    if (failed) return;
    maplibre = library;
    if (lines.type !== "FeatureCollection" || !lines.features?.length
      || lines.features.some(f => f.geometry?.type !== "LineString")) throw new Error("Invalid lines");
    if (points.type !== "FeatureCollection" || points.features?.length !== 7) throw new Error("Invalid points");
    const numbers = points.features.map(feature => {
      const match = /^Lingkungan ([1-7])$/.exec(feature.properties?.Name);
      const coordinates = feature.geometry?.coordinates;
      if (!match || feature.geometry.type !== "Point" || !coordinates?.slice(0, 2).every(Number.isFinite)) throw new Error("Invalid lingkungan");
      return Number(match[1]);
    });
    if (new Set(numbers).size !== 7) throw new Error("Missing lingkungan");
    pointBounds = new maplibre.LngLatBounds();
    points.features.forEach(feature => pointBounds.extend(feature.geometry.coordinates.slice(0, 2)));
    map = new maplibre.Map({
      container: canvas, center: pointBounds.getCenter(), zoom: 13, pitch: 35, bearing: 15,
      maxZoom: 19, maxPitch: 70, cooperativeGestures: true,
      attributionControl: { compact: false },
      style: {
        version: 8,
        sources: { satellite: {
          type: "raster",
          tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"],
          tileSize: 256, maxzoom: 14,
          attribution: '<a href="https://maps.eox.at/">Sentinel-2 cloudless by EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
        }, osm: {
          type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256, maxzoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        } },
        layers: [
          { id: "satellite", type: "raster", source: "satellite" },
          { id: "osm", type: "raster", source: "osm", layout: { visibility: "none" } },
        ],
      },
    });
    setInteraction(false);
    map.addControl(new maplibre.NavigationControl({ visualizePitch: true, showZoom: true, showCompass: true }), "top-left");
    map.on("error", event => {
      if (event.sourceId === "paslaten-terrain") disableTerrain();
      else if (event.sourceId === "satellite") {
        satelliteErrors++;
        // Allow slow tiles and transient errors to recover before switching.
        if (!satelliteTimer) satelliteTimer = setTimeout(() => {
          satelliteTimer = null;
          if (satelliteErrors >= 3 && map && !failed) useFallback();
        }, 10000);
      } else if (event.sourceId === "paslaten-lines" || event.sourceId === "paslaten-points") fail();
    });
    map.getCanvas().addEventListener("webglcontextlost", () => fail(true));
    map.once("style.load", () => {
      try {
        map.addSource("paslaten-lines", { type: "geojson", data: lines });
        map.addLayer({ id: "paslaten-boundaries-outline", type: "line", source: "paslaten-lines",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#183c32", "line-width": 4.5, "line-opacity": 0.7 } });
        map.addLayer({ id: "paslaten-boundaries", type: "line", source: "paslaten-lines",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#e1b93f", "line-width": 2.8, "line-opacity": 0.95 } });
        map.addSource("paslaten-points", { type: "geojson", data: points });
        map.addLayer({ id: "paslaten-locations", type: "circle", source: "paslaten-points",
          paint: { "circle-radius": 3, "circle-color": "#1a5c50", "circle-stroke-color": "#c9a84c", "circle-stroke-width": 1 } });
        createMarkers(points);
        finalCamera = cameraForPoints();
        map.jumpTo(initialCamera());
        if (dem?.tiles?.length) {
          terrainEnabled = true;
          map.addSource("paslaten-terrain", {
            type: "raster-dem", url: "https://tiles.mapterhorn.com/tilejson.json", tileSize: dem.tileSize || 512,
            encoding: dem.encoding || "terrarium", maxzoom: 12,
            attribution: dem.attribution || '<a href="https://mapterhorn.com/attribution/">Mapterhorn</a>',
          });
          map.setTerrain({ source: "paslaten-terrain", exaggeration: 1 });
        }
        if (!terrainEnabled) {
          currentDimension = "2d";
          finalCamera = dimensionCamera();
          map.jumpTo(initialCamera());
        }
        updateControls();
        overlaysReady = true;
        map.on("render", makeReady);
        satelliteTimer = setTimeout(() => {
          satelliteTimer = null;
          if (!ready && map && !failed && !map.isSourceLoaded("satellite")) useFallback();
        }, 15000);
        // A stalled DEM must never leave the usable basemap under a loader.
        terrainTimer = setTimeout(() => { if (!ready) disableTerrain(); makeReady(); }, 8000);
      } catch { fail(); }
    });
    controls.forEach(button => button.addEventListener("click", () => {
      if (!ready || introRunning || failed || button.disabled) return;
      const action = button.dataset.mapAction;
      if (action === "satellite" || action === "map") { switchBasemap(action); return; }
      if (action === "2d" || action === "3d") { switchDimension(action); return; }
      closePopup();
      if (reducedMotion.matches) map.jumpTo(dimensionCamera());
      else map.flyTo({ ...dimensionCamera(), duration: 1100, curve: 1, essential: false });
    }));
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (!ready || failed) return;
        map.resize();
        const wasRunning = introRunning;
        if (wasRunning) { map.off("moveend", finishIntro); map.stop(); }
        finalCamera = cameraForPoints();
        map.jumpTo(introPlayed ? finalCamera : initialCamera());
        if (wasRunning) { map.jumpTo(finalCamera); finishIntro(); }
        layoutMarkers();
      });
      resizeObserver.observe(canvas);
    }
  }

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.35);
      playIntro();
    }, { threshold: 0.35 });
    observer.observe(frame);
  } else { visible = true; }
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && introRunning) { map.jumpTo(finalCamera); finishIntro(); }
  });
  loadingTimer = setTimeout(() => fail(), 30000);
  initialize().catch(() => fail());
})();
