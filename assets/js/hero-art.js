(function(){
  var els=[].slice.call(document.querySelectorAll('.hero-art'));
  if(!els.length||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('is-paused',!e.isIntersecting);});},{threshold:0});
  els.forEach(function(el){io.observe(el);});
})();
