const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js/kontak-map.js'),'utf8').replace(/import\("https:[^\n]+?"\)/,'Promise.resolve(mockLibrary)').replace('initialize().catch(() => fail());', 'initialize().catch(e => { diagnostic(e); fail(); });');
async function setup(reduced=false,width=390) {
  const classes=()=>({add(){},remove(){},toggle(){}});
  const element=()=>({dataset:{},classList:classes(),attributes:{},style:{values:{},setProperty(n,v){this.values[n]=v;}},setAttribute(n,v){this.attributes[n]=v;},addEventListener(n,f){this[n]=f;},querySelector(){return {textContent:''};},getContext(){return {getExtension(){}};}});
  const frame=element(),canvas=element(),status=element(),button=element();
  const buttons=Object.fromEntries(["center","satellite","map","2d","3d"].map(a=>{const e=a==="center"?button:element();e.dataset.mapAction=a;return [a,e];}));
  canvas.clientWidth=width;canvas.clientHeight=450;frame.querySelector=()=>button;frame.querySelectorAll=()=>Object.values(buttons);
  const timers=[]; let map,observer;
  class Map {
    constructor(o){this.options=o;this.sources={...o.style.sources};this.events={};this.flights=[];this.layers=Object.fromEntries(o.style.layers.map(l=>[l.id,{...l,layout:{...l.layout}}]));this.markerInstances=[];map=this;for(const n of ['scrollZoom','boxZoom','dragRotate','dragPan','keyboard','doubleClickZoom','touchZoomRotate','touchPitch'])this[n]={enable(){},disable(){}};}
    on(n,f){(this.events[n] ||= []).push(f);} once(n,f){const one=()=>{this.off(n,one);f();};this.on(n,one);} off(n,f){this.events[n]=(this.events[n]||[]).filter(x=>x!==f);} emit(n,e){for(const f of [...(this.events[n]||[])])f(e);}
    addControl(){} getCanvas(){return element();} addSource(n,o){this.sources[n]=o;} getSource(n){return this.sources[n];} removeSource(n){delete this.sources[n];} addLayer(l){this.layers[l.id]=l;} removeLayer(n){delete this.layers[n];} setLayoutProperty(n,k,v){this.layers[n].layout ||= {};this.layers[n].layout[k]=v;} setTerrain(t){this.terrain=t;} isSourceLoaded(n){return !!this.sources[n] && (n!=='satellite'||this.satelliteLoaded);}
    cameraForBounds(){return {center:[124.8502606,1.3268112],zoom:14};} project(){return {x:width/2,y:225};} getZoom(){return this.camera?.zoom ?? 13;} jumpTo(c){this.camera={...this.camera,...c};this.emit("zoom");} easeTo(c){this.lastEase=c;this.jumpTo(c);} flyTo(c){this.flights.push(c);} remove(){}
  }
  class Marker {constructor(o){this.element=o.element;}setLngLat(c){this.coordinates=c;return this;} addTo(){map.markerInstances.push(this);return this;} setOffset(){throw Error("Marker must not be offset");}}
  class Popup {
    constructor(o){this.options=o;this.open=true;}
    setLngLat(c){this.coordinates=c;return this;}setHTML(h){this.html=h;return this;}
    addTo(){map.activePanel=this;return this;}on(n,f){this[n]=f;return this;}
    remove(){this.open=false;this.close?.();}isOpen(){return this.open;}
  }
  class Bounds {extend(){} getCenter(){return [124.8502606,1.3268112];}}
  class Observer {constructor(f){this.f=f;observer=this;}observe(){}disconnect(){}}
  const document={getElementById:n=>({'paslaten-map-frame':frame,'paslaten-map-canvas':canvas,'paslaten-map-status':status,'paslaten-map-message':element()})[n],createElement:element};
  vm.runInNewContext(source,{diagnostic:console.error,document,window:{matchMedia:()=>({matches:reduced,addEventListener(){}}),IntersectionObserver:Observer},IntersectionObserver:Observer,requestAnimationFrame(){},mockLibrary:{Popup,NavigationControl:class {},Map,Marker,LngLatBounds:Bounds},fetch:async url=>({ok:true,json:async()=>url.startsWith('../')?JSON.parse(fs.readFileSync(path.join(root,url.slice(3)),'utf8')):{tiles:['terrain'],encoding:'terrarium'}}),AbortSignal:{timeout(){}},setTimeout:(f,ms)=>{const t={f,ms};timers.push(t);return t;},clearTimeout:t=>{if(t)t.canceled=true;}});
  await new Promise(r=>setImmediate(r));map.emit('style.load');
  return {map,timers,button,buttons,canvas,visible:()=>observer.f([{isIntersecting:true,intersectionRatio:.5}])};
}
test('Waits for satellite, not terrain; intro plays once and recenter takes 1100ms',async()=>{
  const a=await setup(); a.visible();a.map.emit('render');assert.equal(a.map.flights.length,0);
  a.map.satelliteLoaded=true;a.map.emit('render');assert.equal(a.map.flights[0].duration,2000);assert.equal(a.map.terrain.exaggeration,1);
  a.map.emit('moveend');a.visible();assert.equal(a.map.flights.length,1);a.button.click();assert.equal(a.map.flights[1].duration,1100);
});
test('Satellite timeout installs OSM while preserving local sources; terrain error degrades gracefully',async()=>{
  const a=await setup();a.map.emit('error',{sourceId:'satellite'});assert.equal(a.map.layers.osm.layout.visibility,"none");
  a.timers.find(t=>t.ms===15000).f();assert.ok(a.map.sources.osm);assert.equal(a.map.layers.satellite.layout.visibility,"none");assert.ok(a.map.sources['paslaten-points']);
  a.map.emit('error',{sourceId:'paslaten-terrain'});assert.equal(a.map.terrain,null);a.visible();a.map.emit('render');assert.equal(a.map.flights[0].duration,2000);
});
test('Reduced motion jumps to final camera at all requested mobile widths',async()=>{
  for(const w of [320,375,390,393,412,430]){const a=await setup(true,w);a.map.satelliteLoaded=true;a.visible();a.map.emit('render');assert.equal(a.map.flights.length,0);assert.equal(a.map.camera.pitch,58);assert.equal(a.button.disabled,false);}
});

test('All mode combinations preserve overlays, markers, camera location and the one-time intro', async()=>{
  const a=await setup();a.map.satelliteLoaded=true;a.visible();a.map.emit('render');a.map.emit('moveend');
  const cameraBefore=JSON.stringify(a.map.camera),points=a.map.sources['paslaten-points'],lines=a.map.sources['paslaten-lines'];
  a.buttons.map.click();assert.equal(JSON.stringify(a.map.camera),cameraBefore);assert.equal(a.buttons.map.attributes['aria-pressed'],'true');
  for(const base of ['map','satellite'])for(const dimension of ['2d','3d']){
    const location=JSON.stringify(a.map.camera.center),zoom=a.map.camera.zoom;
    a.buttons[base].click();a.buttons[dimension].click();
    assert.equal(JSON.stringify(a.map.camera.center),location);assert.equal(a.map.camera.zoom,zoom);
    assert.equal(a.map.camera.pitch,dimension==='2d'?0:58);assert.equal(a.map.terrain?.source,dimension==='3d'?'paslaten-terrain':undefined);
    assert.equal(a.map.lastEase.duration,dimension==='2d'?600:700);
    a.button.click();assert.equal(a.map.flights.at(-1).pitch,dimension==='2d'?0:58);
    assert.equal(a.buttons[base].attributes['aria-pressed'],'true');
  }
  assert.equal(a.map.sources['paslaten-points'],points);assert.equal(a.map.sources['paslaten-lines'],lines);
  assert.equal(a.map.markerInstances.length,7);assert.equal(a.map.flights.filter(f=>f.duration===2000).length,1);
});
test('Adaptive marker dimensions stay between 19 and 25px and original coordinates never change',async()=>{
  const a=await setup();const points=JSON.parse(fs.readFileSync(path.join(root,'mygeodata/Point.geojson'),'utf8'));
  for(const zoom of [12,14,14.75,15.5,17,19]){a.map.jumpTo({zoom});const size=parseFloat(a.canvas.style.values['--marker-size']);assert.ok(size>=19&&size<=25);}
  for(const m of a.map.markerInstances){const number=Number(/Lingkungan (\d)/.exec(m.element.attributes['aria-label'])[1]);const f=points.features.find(f=>f.properties.Name==='Lingkungan '+number);assert.deepEqual(Array.from(m.coordinates),f.geometry.coordinates.slice(0,2));}
});
test('Terrain failure selects 2D, disables unavailable 3D and still allows map switching',async()=>{
  const a=await setup(true);a.map.satelliteLoaded=true;a.visible();a.map.emit('render');a.map.emit('error',{sourceId:'paslaten-terrain'});
  assert.equal(a.map.camera.pitch,0);assert.equal(a.buttons['2d'].attributes['aria-pressed'],'true');assert.equal(a.buttons['3d'].disabled,true);
  a.buttons.map.click();a.button.click();assert.equal(a.map.camera.pitch,0);assert.equal(a.map.layers.osm.layout.visibility,'visible');
});

test('Statistics popups remain at original locations across basemap and dimension changes',async()=>{
 const a=await setup(true);a.map.satelliteLoaded=true;a.visible();a.map.emit('render');
 for(const marker of a.map.markerInstances){marker.element.click({stopPropagation(){}});const panel=a.map.activePanel;
   assert.match(panel.html,/Kartu Keluarga/);assert.match(panel.html,/2026/);
   assert.deepEqual(Array.from(panel.coordinates),Array.from(marker.coordinates));
   a.buttons.map.click();a.buttons['2d'].click();a.buttons.satellite.click();a.buttons['3d'].click();
   assert.equal(a.map.activePanel,panel);assert.equal(panel.isOpen(),true);
 }
});
