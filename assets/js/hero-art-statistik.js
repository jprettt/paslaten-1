(function(){
  var root=document.querySelector('.hero-art--statistik');
  if(!root)return;
  var bars=root.querySelectorAll('.st-bar'),dots=root.querySelectorAll('.st-dot'),line=root.querySelector('.st-line');
  if(!bars.length||!line)return;
  var BASE=150,MAXH=88,MINH=14,X=[46,64,82,100,118];
  /* tiap batang punya kecepatan, fase, dan arah tren sendiri (g>0 cenderung naik, g<0 cenderung turun) */
  var P=[{f:.9,p:0,g:.22,q:1.3},{f:.6,p:1.7,g:-.18,q:.8},{f:1.1,p:3.1,g:.15,q:1.9},{f:.7,p:4.4,g:-.24,q:1.1},{f:1.3,p:2.2,g:.2,q:.9}];
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ease(x){return 1-Math.pow(1-x,3);}
  function draw(t){var intro=reduce?1:ease(Math.max(0,Math.min(1,(t-.7)/1.4))),pts=[];for(var i=0;i<bars.length;i++){var c=P[i],r=.5+.26*Math.sin(c.f*t+c.p)+.16*Math.sin(.37*c.q*t+c.p*1.7)+c.g*Math.sin(.18*t+c.p);r=Math.max(.15,Math.min(1,r));var h=(MINH+(MAXH-MINH)*r)*intro,y=BASE-h;bars[i].setAttribute('y',y.toFixed(1));bars[i].setAttribute('height',h.toFixed(1));dots[i].setAttribute('cx',X[i]);dots[i].setAttribute('cy',y.toFixed(1));pts.push(X[i]+','+y.toFixed(1));}line.setAttribute('points',pts.join(' '));}
  if(reduce){draw(2);return;}
  var t0=null,raf=0,last=0;function loop(ts){if(t0===null)t0=ts;if(ts-last>=33){last=ts;draw((ts-t0)/1000);}raf=requestAnimationFrame(loop);}function start(){if(!raf)raf=requestAnimationFrame(loop);}function stop(){cancelAnimationFrame(raf);raf=0;}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop();},{threshold:0}).observe(root);}else{start();}
})();
