/* peta-3d.js - Peta 3D Kelurahan Paslaten Satu (ilustrasi) */
(function () {
'use strict';
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

// ---------- konstanta & data (koordinat piksel peta asli) ----------
const S = 0.01, OX = 800, OY = 800;
const X0 = 40, X1 = 1670, Y0 = 40, Y1 = 1590;
const wx = px => (px - OX) * S, wz = py => (py - OY) * S;
const XMIN = wx(X0), XMAX = wx(X1), ZMIN = wz(Y0), ZMAX = wz(Y1);
const RW = XMAX - XMIN, RH = ZMAX - ZMIN;

const L = {
 1:{c:'#f08080',p:[[128,922],[188,925],[190,1018],[126,1015]]},
 2:{c:'#ffe95c',p:[[188,928],[215,928],[218,1020],[190,1020]]},
 3:{c:'#6cf56c',p:[[212,930],[235,930],[235,1022],[215,1022]]},
 4:{c:'#a0609f',p:[[235,905],[262,895],[290,920],[285,985],[300,1025],[235,1022]]},
 5:{c:'#fcdca0',p:[[133,883],[245,883],[268,895],[270,915],[250,922],[133,922]]},
 6:{c:'#5f9e73',p:[[1360,390],[1383,388],[1387,435],[1368,480],[1370,510],[1405,590],[1452,648],[905,1010],[858,1027],[856,1000],[820,920],[700,955],[612,968],[608,950],[560,945],[530,955],[415,998],[395,968],[350,985],[300,990],[300,1026],[290,985],[290,920],[270,880],[285,860],[295,820],[310,798],[360,793],[445,823],[520,770],[610,690],[700,630],[750,570],[800,568],[880,585],[1000,548],[1100,505],[1130,510],[1250,495],[1300,485],[1315,450],[1330,400]]},
 7:{c:'#a58cff',p:[[1452,648],[1510,712],[1565,770],[1580,830],[1585,882],[1480,940],[1400,975],[1275,1010],[1170,1060],[1000,1108],[910,1113],[826,1070],[826,1040],[740,1060],[718,1075],[590,1030],[540,1055],[520,1035],[415,1000],[333,1035],[300,1030],[300,990],[350,985],[395,968],[415,998],[530,955],[560,945],[608,950],[612,968],[700,955],[820,920],[858,1027],[905,1010]]}
};
const OUT = [[70,75],[300,52],[560,62],[820,48],[1100,58],[1400,50],[1640,64],[1632,300],[1648,520],[1612,560],[1640,760],[1630,1000],[1648,1200],[1636,1400],[1640,1565],[1300,1552],[1060,1570],[860,1545],[700,1566],[420,1556],[100,1568],[118,1380],[84,1180],[112,1000],[66,800],[96,560],[64,300]];
const arteri = [[130,915],[250,918],[280,880],[290,860],[295,820],[310,798],[360,793],[445,823],[495,873],[560,858],[630,838],[660,850],[700,858],[765,878],[795,880],[820,925],[850,985],[858,1027],[800,1038],[740,1060]];
const kolektor = [[445,823],[520,770],[610,690],[700,630],[750,570],[800,568],[880,585],[1000,548],[1100,505]];
const lokal = [
 [[1040,540],[1045,600],[1000,700],[940,820],[935,900],[910,1010]],
 [[880,585],[890,660]],
 [[300,915],[430,905],[520,910]],
 [[340,830],[345,900],[420,880]],
 [[385,800],[390,860],[440,860],[460,905]],
 [[610,970],[700,975],[700,1000]],
 [[1260,1000],[1100,1200],[1000,1300]],
 [[200,1020],[240,1100],[330,1180],[440,1250]]
];
const rivers = [
 [[1250,495],[1220,640],[1120,760],[1020,880],[930,960],[905,1010]],
 [[720,1390],[760,1300],[880,1230],[1000,1195],[1140,1262],[1300,1240],[1450,1185],[1560,1150]],
 [[200,330],[420,420],[640,480],[800,430],[950,340],[1100,300]],
 [[300,1190],[420,1265],[600,1235],[720,1305]],
 [[1200,1520],[1280,1405],[1400,1335],[1560,1325]],
 [[1000,1130],[1050,1190],[1000,1195]]
];
const WEST = [[300,990],[290,920],[290,860],[310,800],[360,793],[445,823],[520,900],[530,955],[415,998],[395,968],[350,985]];

// ---------- util ----------
function pip(pt, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if (((a[1] > pt[1]) != (b[1] > pt[1])) && (pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0])) c = !c; } return c; }
function hash(x, y) { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, o) { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); n += a; a *= .5; f *= 2.03; } return s / n; }
function ridge(x, y, o) { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { const v = 1 - Math.abs(2 * vnoise(x * f, y * f) - 1); s += a * v * v; n += a; a *= .5; f *= 2.1; } return s / n; }
function sstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function segDist(px, pz, ax, az, bx, bz) { const dx = bx - ax, dz = bz - az; let t = ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1); t = Math.max(0, Math.min(1, t)); const cx = ax + t * dx, cz = az + t * dz; return [Math.hypot(px - cx, pz - cz), cx, cz]; }

// ---------- build scene ----------
function build(container, THREE) {
 const N = 320, M = 304;
 const Hf = new Float32Array((N + 1) * (M + 1));
 const riverW = rivers.map(r => r.map(([x, y]) => [wx(x), wz(y)]));
 const SET = [wx(215), wz(965)];
 function rawH(x, z) {
  const n1 = fbm(x * .23 + 3.1, z * .23 + 1.7, 5), r = ridge(x * .42 + 9, z * .42 + 4, 4);
  let h = 0.35 + 1.7 * n1 + 1.1 * r * (0.35 + n1);
  h -= 0.55 * sstep(1.2, 3.6, z) * 0.9;
  for (const rv of riverW) { for (let i = 0; i < rv.length - 1; i++) { const d = segDist(x, z, rv[i][0], rv[i][1], rv[i + 1][0], rv[i + 1][1])[0]; if (d < .5) h -= 0.45 * Math.exp(-(d * d) / 0.012); } }
  const dd = Math.hypot(x - SET[0], (z - SET[1]) * 1.2);
  const f = 1 - sstep(.9, 2.6, dd);
  h = h + (1.05 + 0.12 * n1 - h) * f;
  return Math.max(0.12, h);
 }
 for (let j = 0; j <= M; j++) for (let i = 0; i <= N; i++) Hf[j * (N + 1) + i] = rawH(XMIN + RW * i / N, ZMIN + RH * j / M);
 function heightAt(x, z) {
  const fx = (x - XMIN) / RW * N, fz = (z - ZMIN) / RH * M;
  const i = Math.max(0, Math.min(N - 1, Math.floor(fx))), j = Math.max(0, Math.min(M - 1, Math.floor(fz)));
  const u = fx - i, v = fz - j, k = j * (N + 1) + i;
  return Hf[k] * (1 - u) * (1 - v) + Hf[k + 1] * u * (1 - v) + Hf[k + N + 1] * (1 - u) * v + Hf[k + N + 2] * u * v;
 }
 const outW = OUT.map(([x, y]) => [wx(x), wz(y)]);
 function nearestOnOutline(x, z) { let best = 1e9, bx = x, bz = z; for (let i = 0; i < outW.length; i++) { const a = outW[i], b = outW[(i + 1) % outW.length]; const r = segDist(x, z, a[0], a[1], b[0], b[1]); if (r[0] < best) { best = r[0]; bx = r[1]; bz = r[2]; } } return [bx, bz]; }

 // DOM
 container.classList.add('peta3d');
 const canvas = document.createElement('canvas'); canvas.className = 'peta3d__canvas';
 container.appendChild(canvas);
 const ctrl = document.createElement('div'); ctrl.className = 'peta3d__ctrl';
 const mkBtn = t => { const b = document.createElement('button'); b.type = 'button'; b.className = 'peta3d__btn'; b.textContent = t; return b; };
 const rotBtn = mkBtn('Putar: OFF'), resetBtn = mkBtn('Reset'), topBtn = mkBtn('Tampak atas');
 const lab = document.createElement('label'); lab.className = 'peta3d__btn peta3d__range'; lab.append('Relief ');
 const range = document.createElement('input'); range.type = 'range'; range.min = '0.4'; range.max = '2.2'; range.step = '0.1'; range.value = '1'; range.setAttribute('aria-label', 'Tinggi relief');
 lab.appendChild(range);
 
 // Fullscreen btn
 const fsBtn = mkBtn('Layar Penuh');
 if (!document.fullscreenEnabled) fsBtn.style.display = 'none';
 fsBtn.onclick = () => {
   if (!document.fullscreenElement) {
     container.requestFullscreen().catch(err => {
       console.error(`Error attempting to enable full-screen mode: ${err.message}`);
     });
   } else {
     document.exitFullscreen();
   }
 };
 document.addEventListener('fullscreenchange', () => {
   if (document.fullscreenElement === container) {
     fsBtn.textContent = 'Keluar Layar Penuh';
   } else {
     fsBtn.textContent = 'Layar Penuh';
   }
 });
 
 ctrl.append(rotBtn, resetBtn, topBtn, lab, fsBtn);
 container.appendChild(ctrl);
 
 // Info button
 const infoBtn = document.createElement('button');
 infoBtn.type = 'button';
 infoBtn.className = 'peta3d__btn peta3d__info-btn';
 infoBtn.setAttribute('aria-label', 'Informasi peta');
 infoBtn.setAttribute('aria-expanded', 'false');
 infoBtn.setAttribute('aria-controls', 'peta3d-info-panel');
 infoBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
 container.appendChild(infoBtn);
 
 // Info panel
 const infoPanel = document.createElement('div');
 infoPanel.id = 'peta3d-info-panel';
 infoPanel.className = 'peta3d__info-panel';
 infoPanel.setAttribute('role', 'dialog');
 infoPanel.setAttribute('aria-label', 'Informasi peta');
 
 const closeInfoBtn = document.createElement('button');
 closeInfoBtn.type = 'button';
 closeInfoBtn.className = 'peta3d__btn peta3d__info-close';
 closeInfoBtn.setAttribute('aria-label', 'Tutup panel informasi');
 closeInfoBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
 infoPanel.appendChild(closeInfoBtn);
 
 const infoContent = document.createElement('div');
 infoContent.className = 'peta3d__info-content';
 infoPanel.appendChild(infoContent);
 container.appendChild(infoPanel);
 
 if (window.PETA3D_INFO) {
  const data = window.PETA3D_INFO;
  
  const scale = document.createElement('div'); scale.className = 'peta3d__info-scale';
  const stext = document.createElement('div'); stext.textContent = data.skala.teks; scale.appendChild(stext);
  const sbar = document.createElement('div'); sbar.className = 'peta3d__info-scalebar';
  for(let i=0; i<4; i++){ const sseg = document.createElement('div'); sseg.className='peta3d__info-scalesegment'; sseg.style.background = i%2===0?'#111':'#fff'; sbar.appendChild(sseg); }
  scale.appendChild(sbar);
  const slabels = document.createElement('div'); slabels.className = 'peta3d__info-scalelabels';
  data.skala.label.forEach(l => { const s = document.createElement('span'); s.textContent = l; slabels.appendChild(s); });
  scale.appendChild(slabels);
  const scaption = document.createElement('div'); scaption.className = 'peta3d__info-scalecaption'; scaption.textContent = data.skala.catatan; scale.appendChild(scaption);
  infoContent.appendChild(scale);
  
  const legTitle = document.createElement('div'); legTitle.className = 'peta3d__info-legend-title'; legTitle.textContent = 'KETERANGAN'; infoContent.appendChild(legTitle);
  const legGrid = document.createElement('div'); legGrid.className = 'peta3d__info-legend-grid';
  data.legenda.forEach(group => {
   const gdiv = document.createElement('div'); gdiv.className = 'peta3d__info-legend-group';
   const gt = document.createElement('div'); gt.className = 'peta3d__info-legend-grouptitle'; gt.textContent = group.judul; gdiv.appendChild(gt);
   group.item.forEach(it => {
    const item = document.createElement('div'); item.className = 'peta3d__info-legend-item';
    const swatch = document.createElement('div'); swatch.className = 'peta3d__info-legend-swatch';
    if(it.tipe === 'garis-putus') swatch.style.background = '#444';
    const swInner = document.createElement('div');
    if(it.tipe === 'kotak'){ swInner.style.width='100%'; swInner.style.height='100%'; swInner.style.background = it.warna; }
    else if(it.tipe === 'garis'){ swInner.style.width='100%'; swInner.style.height=it.tebal+'px'; swInner.style.background = it.warna; swInner.style.marginTop=((12-it.tebal)/2)+'px'; }
    else if(it.tipe === 'garis-putus'){ swInner.style.width='100%'; swInner.style.height=it.tebal+'px'; swInner.style.borderTop=it.tebal+'px dashed '+it.warna; swInner.style.marginTop=((12-it.tebal)/2)+'px'; }
    swatch.appendChild(swInner); item.appendChild(swatch);
    const l = document.createElement('span'); l.textContent = it.label; item.appendChild(l);
    gdiv.appendChild(item);
   });
   legGrid.appendChild(gdiv);
  });
  infoContent.appendChild(legGrid);
  
  const div2 = document.createElement('hr'); div2.className = 'peta3d__info-divider'; infoContent.appendChild(div2);
  const footer = document.createElement('div'); footer.className = 'peta3d__info-footer';
  data.produksi.forEach(p => { const d = document.createElement('div'); d.textContent = p; footer.appendChild(d); });
  const st = document.createElement('div'); st.style.marginTop='8px'; st.textContent='SUMBER:'; footer.appendChild(st);
  data.sumber.forEach(s => { const d = document.createElement('div'); d.textContent = '- '+s; footer.appendChild(d); });
  infoContent.appendChild(footer);
 }
 
 let infoOpen = false;
 function toggleInfo() {
  infoOpen = !infoOpen;
  if(infoOpen){
   infoPanel.classList.add('is-open');
   infoBtn.setAttribute('aria-expanded', 'true');
   closeInfoBtn.focus();
  } else {
   infoPanel.classList.remove('is-open');
   infoBtn.setAttribute('aria-expanded', 'false');
   infoBtn.focus();
  }
 }
 infoBtn.onclick = toggleInfo;
 closeInfoBtn.onclick = toggleInfo;
 
 ['pointerdown','pointermove','pointerup','wheel','touchstart','touchmove','touchend'].forEach(evt => {
  infoPanel.addEventListener(evt, e => e.stopPropagation(), {passive:false});
 });
 
 document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && infoOpen) toggleInfo();
 });
 canvas.addEventListener('pointerdown', e => {
  if(infoOpen && window.innerWidth >= 768) toggleInfo();
 });
 
 // Instructions text
 const instText = document.createElement('div');
 instText.className = 'peta3d__instructions';
 instText.textContent = window.innerWidth < 768 ? 'Geser untuk memutar, cubit untuk zoom' : 'Seret untuk memutar, scroll untuk zoom setelah klik peta';
 container.appendChild(instText);

 const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
 renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
 renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 const scene = new THREE.Scene();
 const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 300);
 scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a3a30, 0.55));
 const sun = new THREE.DirectionalLight(0xfff1dc, 1.05);
 sun.position.set(-9, 12, -7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
 Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 45 });
 sun.shadow.bias = -0.0006;
 scene.add(sun);
 const world = new THREE.Group(); scene.add(world);

 const BASE = -1.2;
 const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ opacity: .45 }));
 floor.rotation.x = -Math.PI / 2; floor.position.y = BASE - 0.005; floor.receiveShadow = true; scene.add(floor);

 // terrain geometry
 const pos = new Float32Array((N + 1) * (M + 1) * 3), uv = new Float32Array((N + 1) * (M + 1) * 2);
 for (let j = 0; j <= M; j++) for (let i = 0; i <= N; i++) {
  let x = XMIN + RW * i / N, z = ZMIN + RH * j / M;
  if (!pip([x, z], outW)) { const q = nearestOnOutline(x, z); x = q[0]; z = q[1]; }
  const k = j * (N + 1) + i;
  pos[k * 3] = x; pos[k * 3 + 1] = heightAt(x, z); pos[k * 3 + 2] = z;
  uv[k * 2] = (x - XMIN) / RW; uv[k * 2 + 1] = 1 - (z - ZMIN) / RH;
 }
 const idx = [];
 for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
 const tg = new THREE.BufferGeometry();
 tg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
 tg.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
 tg.setIndex(idx); tg.computeVertexNormals();

 function buildTexture() {
  const TW = window.innerWidth < 768 ? 1280 : 1792, TH = Math.round(TW * RH / RW);
  const cv = document.createElement('canvas'); cv.width = TW; cv.height = TH;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(TW, TH), d = img.data;
  const sx = (X1 - X0) / TW, sy = (Y1 - Y0) / TH;
  const gs = RW / N;
  const sunx = -0.55, sunz = -0.45;
  for (let ty = 0; ty < TH; ty++) {
   const py = Y0 + (ty + .5) * sy, z = wz(py);
   for (let tx = 0; tx < TW; tx++) {
    const px = X0 + (tx + .5) * sx, x = wx(px);
    const h = heightAt(x, z);
    const hx = heightAt(x + gs, z) - heightAt(x - gs, z), hz = heightAt(x, z + gs) - heightAt(x, z - gs);
    const nx = -hx / (2 * gs) * 0.7, nz = -hz / (2 * gs) * 0.7;
    const nl = Math.hypot(nx, 1, nz);
    const lit = (nx * sunx + 1 * 0.8 + nz * sunz) / nl;
    const slope = Math.hypot(hx, hz) / (2 * gs);
    const dn = vnoise(px * .09, py * .09), dn2 = vnoise(px * .3, py * .3), dn3 = vnoise(px * .9, py * .9);
    const t = Math.min(1, Math.max(0, (h - 0.2) / 3.2));
    let r = 62 - 34 * t + 18 * (1 - t), g = 96 - 22 * t + 10 * (1 - t), b = 40 - 8 * t;
    const tn = (dn - .5) * 26 + (dn2 - .5) * 22 + (dn3 - .5) * 20;
    r += tn * .8; g += tn; b += tn * .5;
    if (h < 1.25 && dn > 0.5) { const m = Math.min(1, (dn - .5) * 5); r += (120 - r) * m * .65; g += (150 - g) * m * .65; b += (62 - b) * m * .65; }
    if (slope > 0.8) { const m = Math.min(1, (slope - .8) * 1.3); r += (100 - r) * m * .5; g += (88 - g) * m * .5; b += (62 - b) * m * .5; }
    const sh = Math.max(.35, Math.min(1.35, 0.55 + 0.65 * lit)) * (0.85 + 0.15 * dn2);
    const o = (ty * TW + tx) * 4;
    d[o] = Math.max(0, Math.min(255, r * sh)); d[o + 1] = Math.max(0, Math.min(255, g * sh)); d[o + 2] = Math.max(0, Math.min(255, b * sh)); d[o + 3] = 255;
   }
  }
  ctx.putImageData(img, 0, 0);
  const kx = TW / (X1 - X0), ky = TH / (Y1 - Y0), K = (kx + ky) / 2;
  const T = ([x, y]) => [(x - X0) * kx, (y - Y0) * ky];
  const path = (c, poly) => { c.beginPath(); poly.forEach((p, i) => { const q = T(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); };
  const line = (c, pts, w, col, dash) => { c.beginPath(); pts.forEach((p, i) => { const q = T(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.strokeStyle = col; c.lineWidth = w * K; c.lineJoin = 'round'; c.lineCap = 'round'; c.setLineDash(dash || []); c.stroke(); };

  rivers.forEach(r => line(ctx, r, 3.2, 'rgba(70,170,235,.95)'));
  lokal.forEach(l => line(ctx, l, 2.4, 'rgba(215,215,205,.8)'));
  line(ctx, kolektor, 3.4, 'rgba(240,150,50,.95)');
  line(ctx, arteri, 5, 'rgba(222,80,35,.98)');

  [6, 7, 1, 2, 3, 4, 5].forEach(k => {
   path(ctx, L[k].p);
   ctx.fillStyle = k === 7 ? 'rgba(160,135,255,.34)' : k === 6 ? 'rgba(215,235,220,.15)' : L[k].c;
   if (k <= 5) ctx.globalAlpha = .88;
   ctx.fill(); ctx.globalAlpha = 1;
  });
  lokal.slice(0, 6).forEach(l => line(ctx, l, 2, 'rgba(235,235,225,.85)'));
  line(ctx, kolektor, 3.2, 'rgba(240,150,50,1)');
  line(ctx, arteri, 4.6, 'rgba(222,80,35,1)');
  [6, 7, 1, 2, 3, 4, 5].forEach(k => { path(ctx, L[k].p); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.8 * K; ctx.setLineDash([9 * K, 6 * K]); ctx.stroke(); });
  ctx.setLineDash([]);
  const lay = document.createElement('canvas'); lay.width = TW; lay.height = TH; const lc = lay.getContext('2d');
  lc.strokeStyle = '#fff'; lc.lineWidth = 11 * K; lc.setLineDash([22 * K, 12 * K]); lc.lineJoin = 'round';
  for (let k = 1; k <= 7; k++) { path(lc, L[k].p); lc.stroke(); }
  lc.setLineDash([]); lc.globalCompositeOperation = 'destination-out'; lc.fillStyle = '#000';
  for (let k = 1; k <= 7; k++) { path(lc, L[k].p); lc.fill(); }
  ctx.drawImage(lay, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return tex;
 }

 function strataTexture() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const c = cv.getContext('2d');
  c.fillStyle = '#4a3a2a'; c.fillRect(0, 0, 1024, 512);
  let y = 0;
  const pal = ['#5a4630', '#6b563b', '#40321f', '#775f42', '#4e3c27', '#34291a'];
  while (y < 512) { const h = 4 + Math.random() * 16; c.fillStyle = pal[Math.floor(Math.random() * pal.length)]; c.fillRect(0, y, 1024, h); y += h; }
  for (let i = 0; i < 2200; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? '20,12,6' : '150,120,80'},${Math.random() * .25})`; c.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 30 + 2, Math.random() * 2 + .5); }
  for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(40,60,28,${Math.random() * .4})`; c.fillRect(Math.random() * 1024, 0, Math.random() * 5 + 1, Math.random() * 60 + 10); }
  const g = c.createLinearGradient(0, 0, 0, 40); g.addColorStop(0, '#2a4a24'); g.addColorStop(.5, '#2f4f27'); g.addColorStop(1, 'rgba(47,79,39,0)');
  c.fillStyle = g; c.fillRect(0, 0, 1024, 40);
  const t = new THREE.CanvasTexture(cv); t.wrapS = THREE.RepeatWrapping; return t;
 }
 function buildWalls() {
  const pts = []; let cum = 0;
  for (let i = 0; i < outW.length; i++) {
   const a = outW[i], b = outW[(i + 1) % outW.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(len / 0.06));
   for (let s = 0; s < n; s++) { const t = s / n; pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, cum + len * t]); }
   cum += len;
  }
  pts.push([pts[0][0], pts[0][1], cum]);
  const p = [], u = [], id = [];
  pts.forEach((q, i) => {
   const h = heightAt(q[0], q[1]) - 0.01;
   p.push(q[0], h, q[1], q[0], BASE, q[1]);
   const uu = q[2] * 0.45; u.push(uu, 1, uu, 1 - (h - BASE) / 5);
   if (i < pts.length - 1) { const a = i * 2; id.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(u, 2));
  g.setIndex(id); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: strataTexture(), side: THREE.DoubleSide, roughness: 1 }));
  m.castShadow = true; m.receiveShadow = true; return m;
 }
 function buildBuildings() {
  const list = [];
  const add = (poly, sp, dens, laneEvery) => {
   let xs = 1e9, xe = -1e9, ys = 1e9, ye = -1e9; poly.forEach(p => { xs = Math.min(xs, p[0]); xe = Math.max(xe, p[0]); ys = Math.min(ys, p[1]); ye = Math.max(ye, p[1]); });
   let gi = 0;
   for (let x = xs; x < xe; x += sp, gi++) {
    let gj = 0;
    for (let y = ys; y < ye; y += sp, gj++) {
     if (laneEvery && (gi % laneEvery === 0 || gj % (laneEvery + 2) === 0)) continue;
     if (hash(gi * 7 + Math.round(xs), gj * 13 + Math.round(ys)) > dens) continue;
     const px = x + (hash(gi, gj) - .5) * sp * .5, py = y + (hash(gj, gi + 5) - .5) * sp * .5;
     if (pip([px, py], poly)) list.push([px, py]);
    }
   }
  };
  [1, 2, 3, 4, 5].forEach(k => add(L[k].p, 6.5, .82, 5));
  add(WEST, 12, .5, 0);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ roughness: .6, metalness: .05 });
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  list.forEach((q, i) => {
   const x = wx(q[0]), z = wz(q[1]), w = 0.035 + hash(i, 3) * 0.035, dp = 0.035 + hash(i, 9) * 0.035, hh = 0.03 + hash(i, 5) * 0.075;
   m4.compose(new THREE.Vector3(x, heightAt(x, z) + hh / 2, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (hash(i, 1) - .5) * .5), new THREE.Vector3(w, hh, dp));
   im.setMatrixAt(i, m4); col.setHSL(0.14 + hash(i, 2) * 0.03, 0.9, 0.5 + hash(i, 4) * 0.1); im.setColorAt(i, col);
  });
  im.castShadow = true; im.receiveShadow = true; return im;
 }

 const terrain = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ map: buildTexture(), roughness: .95, metalness: 0 }));
 terrain.castShadow = true; terrain.receiveShadow = true;
 world.add(terrain); world.add(buildWalls()); world.add(buildBuildings());

 // kontrol kamera
 const target = new THREE.Vector3(0.4, 0.5, 0.4);
 let th = 0.28, ph = 1.0, dist = 21, auto = false, ex = 1, active = false;
 let pts = new Map(), pinch = 0, pan = false;
 canvas.addEventListener('contextmenu', e => e.preventDefault());
 canvas.addEventListener('pointerdown', e => { 
  active = true; 
  canvas.setPointerCapture(e.pointerId); 
  pts.set(e.pointerId, [e.clientX, e.clientY]); 
  pan = e.button === 2 || e.shiftKey; 
  if (instText && instText.parentNode) {
    instText.style.opacity = '0';
    setTimeout(() => { if(instText.parentNode) instText.remove(); }, 500);
  }
 });
 canvas.addEventListener('pointerup', e => { pts.delete(e.pointerId); pinch = 0; });
 canvas.addEventListener('pointercancel', e => { pts.delete(e.pointerId); pinch = 0; });
 canvas.addEventListener('pointerleave', () => { if (!pts.size) active = false; });
 canvas.addEventListener('pointermove', e => {
  if (!pts.has(e.pointerId)) return;
  const p = pts.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; pts.set(e.pointerId, [e.clientX, e.clientY]);
  if (pts.size === 2) { const [a, b] = [...pts.values()]; const dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) dist = Math.min(60, Math.max(4, dist * pinch / dd)); pinch = dd; doPan(dx / 2, dy / 2); }
  else if (pan) doPan(dx, dy);
  else { th -= dx * 0.006; ph = Math.min(1.5, Math.max(0.03, ph - dy * 0.006)); }
 });
 function doPan(dx, dy) { const k = dist * 0.0017; const r = new THREE.Vector3(Math.cos(th), 0, -Math.sin(th)), f = new THREE.Vector3(-Math.sin(th), 0, -Math.cos(th)); target.addScaledVector(r, -dx * k); target.addScaledVector(f, dy * k); }
 canvas.addEventListener('wheel', e => { if (!active) return; e.preventDefault(); dist = Math.min(60, Math.max(4, dist * (1 + e.deltaY * 0.0012))); }, { passive: false });
 rotBtn.onclick = () => { auto = !auto; rotBtn.textContent = 'Putar: ' + (auto ? 'ON' : 'OFF'); };
 resetBtn.onclick = () => { th = 0.28; ph = 1.0; dist = 21; target.set(0.4, 0.5, 0.4); };
 topBtn.onclick = () => { ph = 0.03; th = 0; auto = false; rotBtn.textContent = 'Putar: OFF'; };
 range.oninput = e => { ex = +e.target.value; world.scale.y = ex; };

 function setCam() { cam.position.set(target.x + dist * Math.sin(ph) * Math.sin(th), target.y + dist * Math.cos(ph), target.z + dist * Math.sin(ph) * Math.cos(th)); cam.lookAt(target); }
 let W = 1, H = 1;
 function resize() {
  W = container.clientWidth; H = container.clientHeight;
  if (!W || !H) return;
  renderer.setSize(W, H, false);
  cam.aspect = W / H; cam.updateProjectionMatrix();
 }
 const ro = new ResizeObserver(resize); ro.observe(container);

 let running = false, rafId = 0;
 function frame() {
  if (!running) return;
  rafId = requestAnimationFrame(frame);
  if (auto) th += 0.003;
  setCam();
  renderer.setScissorTest(false); renderer.setViewport(0, 0, W, H); renderer.clear();
  renderer.render(scene, cam);
 }
 return {
  start() { if (running) return; running = true; resize(); frame(); },
  stop() { running = false; cancelAnimationFrame(rafId); }
 };
}

// ---------- API publik ----------
let inst = null, busy = false;
function loadThree() {
 return new Promise((res, rej) => {
  if (window.THREE) return res();
  const s = document.createElement('script'); s.src = THREE_URL; s.onload = res; s.onerror = rej; document.head.appendChild(s);
 });
}
window.Peta3D = {
 open(container) {
  if (inst) { inst.start(); return; }
  if (busy) return;
  busy = true;
  const msg = document.createElement('div'); msg.className = 'peta3d__loading'; msg.textContent = 'Membangun medan 3D…';
  container.appendChild(msg);
  loadThree().then(() => {
   setTimeout(() => {
    try {
     inst = build(container, window.THREE);
     msg.remove(); inst.start();
    } catch (err) {
     console.error(err); msg.textContent = 'Peta 3D belum bisa ditampilkan di perangkat ini.';
    }
    busy = false;
   }, 30);
  }).catch(() => { msg.textContent = 'Gagal memuat peta 3D. Periksa koneksi internet lalu coba lagi.'; busy = false; });
 },
 close() { if (inst) inst.stop(); }
};
})();
