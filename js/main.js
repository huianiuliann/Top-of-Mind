(function(){
"use strict";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
let cx = -100, cy = -100;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

function renderCursor() {
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(renderCursor);
}
renderCursor();

const interactiveEls = 'a, button, .contact-phone, .service-panel, .about-val';
document.addEventListener('mouseover', e => {
  if (e.target.closest(interactiveEls)) cursor.classList.add('active');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(interactiveEls)) cursor.classList.remove('active');
});

// hide custom cursor on touch devices
if ('ontouchstart' in window) cursor.style.display = 'none';

/* ═══════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════ */
const preloader = document.getElementById('preloader');
const preloaderText = document.getElementById('preloaderText');
const preloaderPct = document.getElementById('preloaderPct');

const letters = 'TOPOFMIND'.split('');
letters.forEach(l => {
  const s = document.createElement('span');
  s.textContent = l;
  preloaderText.appendChild(s);
});

// space between words
preloaderText.children[3].style.marginLeft = '0.25em';
preloaderText.children[5].style.marginLeft = '0.25em';

const plSpans = preloaderText.querySelectorAll('span');

const plTl = gsap.timeline({
  onComplete: () => {
    gsap.to(preloader, {
      yPercent: -100, duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        startHeroAnimations();
      }
    });
  }
});

// letter reveal
plTl.to(plSpans, {
  y: 0, opacity: 1,
  duration: 0.6, stagger: 0.05,
  ease: 'power3.out'
}, 0);

// counter
let pctObj = { val: 0 };
plTl.to(pctObj, {
  val: 100, duration: 1.6, ease: 'power2.inOut',
  onUpdate: () => { preloaderPct.textContent = Math.round(pctObj.val) + '%'; }
}, 0);

plTl.to({}, { duration: 0.3 }); // brief pause before slide up

/* ═══════════════════════════════════════
   THREE.JS HERO
   ═══════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const shapes = [];
const geos = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(0.9, 0),
  new THREE.TetrahedronGeometry(0.7, 0),
  new THREE.IcosahedronGeometry(0.6, 0),
  new THREE.OctahedronGeometry(0.5, 0),
];
const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.12 });

for (let i = 0; i < geos.length; i++) {
  const mesh = new THREE.Mesh(geos[i], mat.clone());
  mesh.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 6 - 2
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  mesh.userData = {
    rotSpeedX: (Math.random() - 0.5) * 0.004,
    rotSpeedY: (Math.random() - 0.5) * 0.006,
    baseY: mesh.position.y
  };
  scene.add(mesh);
  shapes.push(mesh);
}

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

function animateThree() {
  requestAnimationFrame(animateThree);
  const heroH = window.innerHeight;
  const progress = Math.min(scrollY / heroH, 1);

  shapes.forEach((m, i) => {
    m.rotation.x += m.userData.rotSpeedX;
    m.rotation.y += m.userData.rotSpeedY;
    m.position.y = m.userData.baseY + progress * 3;
    m.material.opacity = 0.12 * (1 - progress);
  });

  renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ═══════════════════════════════════════
   HERO ANIMATIONS
   ═══════════════════════════════════════ */
function startHeroAnimations() {
  const lines = document.querySelectorAll('.hero-line-inner');
  const tl = gsap.timeline();

  tl.to(lines[0], { y: 0, duration: 0.9, ease: 'power3.out' })
    .to(lines[1], { y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55')
    .to(lines[2], { y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
    .to('#heroSub', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .to('#heroScroll', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
}

/* ═══════════════════════════════════════
   INDUSTRY TICKER
   ═══════════════════════════════════════ */
const tickerItems = document.querySelectorAll('#heroTicker span');
let tickerIdx = 0;

setInterval(() => {
  tickerItems[tickerIdx].classList.remove('active');
  tickerItems[tickerIdx].classList.add('exit');
  setTimeout(() => { tickerItems[tickerIdx].classList.remove('exit'); }, 500);

  tickerIdx = (tickerIdx + 1) % tickerItems.length;
  tickerItems[tickerIdx].classList.add('active');
}, 2200);

/* hide ticker after hero */
gsap.to('.hero-industries', {
  opacity: 0, pointerEvents: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'bottom 80%',
    end: 'bottom 30%',
    scrub: true
  }
});

/* ═══════════════════════════════════════
   NAV SCROLL EFFECT + MOBILE MENU
   ═══════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ═══════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════ */
const marqueeTrack = document.getElementById('marqueeTrack');
const marqueeContent = 'PAID ADS <span class="dot">•</span> WEBSITE & SEO <span class="dot">•</span> SOCIAL MEDIA <span class="dot">•</span> LEAD GENERATION <span class="dot">•</span> DIGITAL STRATEGY <span class="dot">•</span> INDUSTRIAL MARKETING <span class="dot">•</span> ';
for (let i = 0; i < 4; i++) {
  const div = document.createElement('div');
  div.className = 'marquee-item';
  div.innerHTML = marqueeContent;
  marqueeTrack.appendChild(div);
}

/* ═══════════════════════════════════════
   SERVICES — HORIZONTAL SCROLL
   ═══════════════════════════════════════ */
const servicesTrack = document.getElementById('servicesTrack');
const progressBar = document.getElementById('servicesProgressBar');

const hScroll = gsap.to(servicesTrack, {
  x: () => -(servicesTrack.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.services',
    pin: true,
    scrub: 1,
    end: () => '+=' + servicesTrack.scrollWidth,
    onUpdate: self => {
      progressBar.style.width = (self.progress * 100) + '%';
    }
  }
});

/* ═══════════════════════════════════════
   PORTFOLIO — CURTAIN REVEAL
   ═══════════════════════════════════════ */
document.querySelectorAll('.portfolio-item').forEach(item => {
  const top = item.querySelector('.pi-curtain-top');
  const bot = item.querySelector('.pi-curtain-bottom');

  gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: 'top 70%',
      end: 'top 20%',
      scrub: 1,
    }
  })
  .to(top, { yPercent: -100, ease: 'none' }, 0)
  .to(bot, { yPercent: 100, ease: 'none' }, 0);
});

/* ═══════════════════════════════════════
   FOUNDATION ANIMATIONS
   ═══════════════════════════════════════ */
// separator line
gsap.to('#foundationLine', {
  scaleX: 1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '#foundation', start: 'top 85%', toggleActions: 'play none none none' }
});

// label
gsap.from('#fndLabel', {
  opacity: 0, y: 10, duration: 0.6, ease: 'power3.out',
  scrollTrigger: { trigger: '#foundation', start: 'top 75%', toggleActions: 'play none none none' }
});

// title — split into chars
const fndTitle = document.getElementById('fndTitle');
const fndTitleText = fndTitle.textContent;
fndTitle.innerHTML = '';
fndTitleText.split('').forEach(ch => {
  const span = document.createElement('span');
  span.className = 'fnd-char';
  span.textContent = ch === ' ' ? '\u00A0' : ch;
  fndTitle.appendChild(span);
});
gsap.to('.fnd-char', {
  y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power3.out',
  scrollTrigger: { trigger: '#foundation', start: 'top 70%', toggleActions: 'play none none none' }
});

// tagline + body
gsap.from('#fndTagline', {
  opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '#fndTagline', start: 'top 85%', toggleActions: 'play none none none' }
});
gsap.from('#fndBody', {
  opacity: 0, y: 30, duration: 0.7, delay: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '#fndBody', start: 'top 85%', toggleActions: 'play none none none' }
});

// pills
gsap.from('.fnd-pill', {
  opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.08, ease: 'power3.out',
  scrollTrigger: { trigger: '#fndPills', start: 'top 85%', toggleActions: 'play none none none' }
});

// who is this for items
gsap.to('.fnd-who-item', {
  opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '#fndWhoList', start: 'top 85%', toggleActions: 'play none none none' }
});

// right column
gsap.from('#fndRight', {
  opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: 'power3.out',
  scrollTrigger: { trigger: '#foundation', start: 'top 65%', toggleActions: 'play none none none' }
});

// 5th panel CTA scroll to foundation
document.getElementById('foundationLink').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('foundation').scrollIntoView({ behavior: 'smooth' });
});

/* ═══════════════════════════════════════
   ABOUT — WORD REVEAL
   ═══════════════════════════════════════ */
const aboutText = document.getElementById('aboutText');
const rawText = aboutText.textContent.trim();
aboutText.innerHTML = '';
const words = rawText.split(/\s+/);
words.forEach(w => {
  const span = document.createElement('span');
  span.className = 'word';
  span.textContent = w;
  aboutText.appendChild(span);
});

const wordEls = aboutText.querySelectorAll('.word');

gsap.to(wordEls, {
  opacity: 1,
  stagger: 0.04,
  ease: 'none',
  scrollTrigger: {
    trigger: '.about',
    start: 'top 70%',
    end: 'top 10%',
    scrub: 1,
  }
});

/* About values stagger */
gsap.to('.about-val', {
  opacity: 1, x: 0,
  duration: 0.7,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-values',
    start: 'top 80%',
    toggleActions: 'play none none none'
  }
});

/* ═══════════════════════════════════════
   CONTACT — FLASH EFFECT
   ═══════════════════════════════════════ */
const contactFlash = document.getElementById('contactFlash');

ScrollTrigger.create({
  trigger: '.contact',
  start: 'top 80%',
  onEnter: () => {
    gsap.to(contactFlash, { opacity: 1, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.in' });
  },
  once: true
});

// Animate contact elements
gsap.from('.contact-title', {
  y: 60, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 60%', toggleActions: 'play none none none' }
});
gsap.from('.contact-sub', {
  y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 60%', toggleActions: 'play none none none' }
});
gsap.from('.contact-phone', {
  y: 20, opacity: 0, duration: 0.7, delay: 0.4, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 60%', toggleActions: 'play none none none' }
});
gsap.from('.contact-social', {
  y: 20, opacity: 0, duration: 0.6, delay: 0.5, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 60%', toggleActions: 'play none none none' }
});

/* ═══════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
   ═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

})();
