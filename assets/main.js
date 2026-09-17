(function(){
"use strict";

/* ---------- NAV: scrolled state + current page ---------- */
var nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive:true });
}
var here = (document.body.getAttribute('data-page') || '');
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function(a){
  if (a.getAttribute('data-page') === here) a.classList.add('is-current');
});

/* ---------- MOBILE MENU ---------- */
var toggle = document.getElementById('navToggle');
var mobile = document.getElementById('navMobile');
if (toggle && mobile) {
  toggle.addEventListener('click', function(){
    var open = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  mobile.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mobile.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
  });
}

/* ---------- PAGE TRANSITION VEIL (pure CSS opacity — no GSAP dependency,
   so it can never get stuck covering the page if a CDN script fails) ---------- */
var veil = document.getElementById('veil');
var VEIL_MS = 300;
if (veil) {
  // Arrive with the veil already shown (see HTML), then fade it out.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ veil.classList.remove('show'); });
  });
  document.querySelectorAll('a[href]').forEach(function(a){
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('http') === 0) return;
    a.addEventListener('click', function(e){
      e.preventDefault();
      veil.classList.add('show');
      setTimeout(function(){ window.location.href = href; }, VEIL_MS);
    });
  });
}
/* bfcache restore (browser back/forward): make sure the veil isn't left showing */
window.addEventListener('pageshow', function(e){
  if (veil && e.persisted) veil.classList.remove('show');
});

/* ---------- GSAP-DEPENDENT ENHANCEMENTS (safe no-op if absent) ---------- */
if (typeof gsap !== 'undefined') {
  if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);


  /* hero load sequence */
  window.addEventListener('DOMContentLoaded', function(){
    if (!document.querySelector('.hero-line-inner')) return;
    var tl = gsap.timeline({ delay: .5 });
    tl.from('.hero-line-inner', { y:'112%', duration:1, stagger:.1, ease:'power3.out' })
      .from('.hero-kicker', { opacity:0, y:10, duration:.6, ease:'power2.out' }, 0)
      .from('.hero-foot', { opacity:0, y:14, duration:.7, ease:'power2.out' }, .5);
  });

  /* grouped scroll reveals */
  document.querySelectorAll('[data-reveal]').forEach(function(group){
    var items = group.querySelectorAll('[data-rev-item]');
    var targets = items.length ? items : [group];
    gsap.from(targets, {
      opacity:0, y:24, duration:.8, ease:'power3.out', stagger:.08,
      scrollTrigger:{ trigger: group, start:'top 82%', toggleActions:'play none none none' }
    });
  });

  /* hero cursor spotlight */
  var heroSpot = document.querySelector('.hero-spot');
  if (heroSpot && window.matchMedia('(hover:hover)').matches) {
    document.querySelector('.hero').addEventListener('mousemove', function(e){
      var r = this.getBoundingClientRect();
      heroSpot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      heroSpot.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* magnetic buttons */
  document.querySelectorAll('[data-magnetic]').forEach(function(btn){
    if (!window.matchMedia('(hover:hover)').matches) return;
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      gsap.to(btn, { x:(e.clientX - r.left - r.width/2)*.25, y:(e.clientY - r.top - r.height/2)*.35, duration:.4, ease:'power3.out' });
    });
    btn.addEventListener('mouseleave', function(){ gsap.to(btn, { x:0, y:0, duration:.5, ease:'elastic.out(1,0.4)' }); });
  });

  /* proc line draw (process page) */
  var procLine = document.getElementById('procLine');
  if (procLine) {
    ScrollTrigger.create({
      trigger: '.proc-list', start:'top 65%', end:'bottom 75%', scrub:.6,
      onUpdate: function(self){ procLine.style.height = (self.progress*100)+'%'; }
    });
  }

  /* ghost numeral parallax */
  document.querySelectorAll('.ghost-num').forEach(function(g){
    gsap.to(g, { y: 60, ease:'none', scrollTrigger:{ trigger: g.parentElement, start:'top bottom', end:'bottom top', scrub:true } });
  });
}

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-item').forEach(function(item){
  var q = item.querySelector('.faq-q');
  var a = item.querySelector('.faq-a');
  q.addEventListener('click', function(){
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){
      o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

/* ---------- INDUSTRY / GRID CELL -> jump to contact ---------- */
document.querySelectorAll('[data-goto]').forEach(function(el){
  el.style.cursor = 'pointer';
  el.addEventListener('click', function(){
    var href = el.getAttribute('data-goto');
    window.location.href = href;
  });
});

/* ---------- SMOOTH ANCHOR SCROLL (in-page only) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var href = a.getAttribute('href');
    if (href.length < 2) return;
    var t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
  });
});

})();
