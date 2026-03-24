/**
 * ═══════════════════════════════════════
 *  SOFIA & NIKITA — WEDDING INVITATION
 *  Gorgeous on every device ✨
 *  Cinematic scroll transitions
 * ═══════════════════════════════════════
 */
'use strict';

const WEDDING = new Date('2026-08-01T15:00:00');
const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 2);

/* ══════════════════════════════════
   LOADING SCREEN
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    startHeroAnimations();
  }, 1800);
});

/* ══════════════════════════════════
   HERO — MASSIVE PARTICLE SYSTEM
   Tons of beautiful shards, petals,
   sparkles, orbs, floating rings
══════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || PREFERS_REDUCED) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, particles = [], animId = null, isVisible = false;

  const COLORS = [
    { r: 212, g: 165, b: 165 }, // rose
    { r: 253, g: 232, b: 224 }, // rose-light
    { r: 201, g: 176, b: 55  }, // gold
    { r: 156, g: 175, b: 136 }, // sage
    { r: 200, g: 184, b: 212 }, // lavender
    { r: 255, g: 255, b: 240 }, // ivory
    { r: 232, g: 208, b: 112 }, // gold-light
    { r: 255, g: 215, b: 180 }, // peach
  ];

  let lockedH = null;

  function resize(force) {
    W = window.innerWidth;
    if (IS_MOBILE) {
      if (!lockedH || force) lockedH = window.innerHeight;
      H = lockedH;
    } else {
      H = window.innerHeight;
    }
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // MUCH MORE particles: lush and rich
  const MAX_PARTICLES = IS_MOBILE ? 90 : 140;

  class Particle {
    constructor(init) { this.reset(init); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -40;
      const ci = Math.floor(Math.random() * COLORS.length);
      this.cr = COLORS[ci].r;
      this.cg = COLORS[ci].g;
      this.cb = COLORS[ci].b;

      // Types: 0=glow orb, 1=petal, 2=sparkle, 3=floating ring, 4=SHARD (new!)
      const rnd = Math.random();
      if (IS_MOBILE) {
        if (rnd < 0.10) this.type = 0;       // glow orbs
        else if (rnd < 0.35) this.type = 1;   // petals
        else if (rnd < 0.60) this.type = 2;   // sparkles
        else if (rnd < 0.75) this.type = 3;   // floating rings
        else this.type = 4;                    // SHARDS ✨
      } else {
        if (rnd < 0.12) this.type = 0;
        else if (rnd < 0.32) this.type = 1;
        else if (rnd < 0.55) this.type = 2;
        else if (rnd < 0.70) this.type = 3;
        else this.type = 4;                   // SHARDS ✨
      }

      if (this.type === 0) { // Glow orb
        this.size = IS_MOBILE ? (12 + Math.random() * 22) : (20 + Math.random() * 40);
        this.opacity = IS_MOBILE ? (0.012 + Math.random() * 0.02) : (0.015 + Math.random() * 0.035);
        this.vy = 0.06 + Math.random() * 0.12;
        this.vx = (Math.random() - 0.5) * 0.1;
      } else if (this.type === 1) { // Petal
        this.size = IS_MOBILE ? (2 + Math.random() * 5) : (3 + Math.random() * 7);
        this.opacity = 0.12 + Math.random() * 0.3;
        this.vy = 0.2 + Math.random() * 0.55;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.025;
      } else if (this.type === 2) { // Sparkle
        this.size = 0.6 + Math.random() * 2;
        this.opacity = 0.2 + Math.random() * 0.55;
        this.vy = 0.04 + Math.random() * 0.2;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.twinkle = Math.random() * 6.28;
        this.twinkleSpeed = 0.025 + Math.random() * 0.05;
      } else if (this.type === 3) { // Floating ring
        this.size = IS_MOBILE ? (3 + Math.random() * 7) : (5 + Math.random() * 11);
        this.opacity = 0.05 + Math.random() * 0.1;
        this.vy = 0.04 + Math.random() * 0.12;
        this.vx = (Math.random() - 0.5) * 0.08;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.006;
      } else { // SHARD — glowing geometric fragment ✨
        this.size = IS_MOBILE ? (2 + Math.random() * 5) : (3 + Math.random() * 8);
        this.opacity = 0.08 + Math.random() * 0.25;
        this.vy = 0.1 + Math.random() * 0.35;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.03;
        this.sides = Math.random() < 0.5 ? 3 : (Math.random() < 0.5 ? 4 : 5);
        this.twinkle = Math.random() * 6.28;
        this.twinkleSpeed = 0.02 + Math.random() * 0.04;
      }
      this.wave = Math.random() * 6.28;
      this.waveAmp = 0.12 + Math.random() * 0.4;
      this.fadeIn = init ? 1 : 0;
    }

    update() {
      this.wave += 0.008;
      this.x += this.vx + Math.sin(this.wave) * this.waveAmp;
      this.y += this.vy;
      if (this.type === 1 || this.type === 3 || this.type === 4) this.rot += this.rotV;
      if (this.type === 2 || this.type === 4) this.twinkle += this.twinkleSpeed;
      if (this.fadeIn < 1) this.fadeIn = Math.min(1, this.fadeIn + 0.012);
      if (this.y > H + 50 || this.x < -50 || this.x > W + 50) this.reset(false);
    }

    draw() {
      const fade = this.fadeIn;
      if (this.type === 0) {
        // Glow orb
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${this.cr},${this.cg},${this.cb},${this.opacity * fade})`);
        grad.addColorStop(1, `rgba(${this.cr},${this.cg},${this.cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
      } else if (this.type === 1) {
        // Petal
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = `rgb(${this.cr},${this.cg},${this.cb})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      } else if (this.type === 2) {
        // Sparkle with twinkle
        const a = this.opacity * fade * (0.35 + 0.65 * Math.sin(this.twinkle));
        if (a < 0.01) return;
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgb(${this.cr},${this.cg},${this.cb})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
        // Cross sparkle for bigger ones
        if (this.size > 1.3) {
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(this.x - this.size * 2, this.y - 0.3, this.size * 4, 0.6);
          ctx.fillRect(this.x - 0.3, this.y - this.size * 2, 0.6, this.size * 4);
        }
        ctx.globalAlpha = 1;
      } else if (this.type === 3) {
        // Floating ring
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.strokeStyle = `rgb(${this.cr},${this.cg},${this.cb})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, 6.28);
        ctx.stroke();
        ctx.restore();
      } else {
        // SHARD — glowing geometric shard ✨
        const a = this.opacity * fade * (0.5 + 0.5 * Math.sin(this.twinkle));
        if (a < 0.01) return;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = `rgba(${this.cr},${this.cg},${this.cb},0.9)`;
        ctx.strokeStyle = `rgba(${this.cr},${this.cg},${this.cb},0.5)`;
        ctx.lineWidth = 0.5;
        // Draw polygon shard
        ctx.beginPath();
        for (let i = 0; i <= this.sides; i++) {
          const angle = (Math.PI * 2 * i) / this.sides - Math.PI / 2;
          const r = this.size * (i % 2 === 0 ? 1 : 0.5);
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Glow aura around shard
        if (this.size > 3) {
          ctx.globalAlpha = a * 0.15;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 2.5, 0, 6.28);
          ctx.fillStyle = `rgb(${this.cr},${this.cg},${this.cb})`;
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const density = IS_MOBILE ? 7 : 6;
    const count = Math.min(Math.floor(W / density), MAX_PARTICLES);
    for (let i = 0; i < count; i++) particles.push(new Particle(true));
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animId = requestAnimationFrame(loop);
  }

  const heroEl = document.getElementById('hero');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.01 });
  obs.observe(heroEl);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const widthDelta = Math.abs(window.innerWidth - W);
      if (!IS_MOBILE || widthDelta > 100) {
        if (IS_MOBILE) lockedH = null;
        init();
      }
    }, 300);
  }, { passive: true });

  init();
})();

/* ══════════════════════════════════
   HERO — ENTRANCE ANIMATIONS
══════════════════════════════════ */
function startHeroAnimations() {
  const items = document.querySelectorAll('.hero__content .anim-item');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 250);
  });
}

/* ══════════════════════════════════
   CINEMATIC SCROLL TRANSITIONS
   Each section animates in beautifully
══════════════════════════════════ */
(function initScrollTransitions() {
  if (PREFERS_REDUCED) return;

  const sections = document.querySelectorAll('.about, .countdown, .savedate, .footer');
  if (!sections.length) return;

  // Configure per-section transition effects
  const heroContent = document.getElementById('heroContent');
  const heroFrame = document.querySelector('.hero__frame');

  let ticking = false;
  let lastScrollY = 0;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateTransitions);
      ticking = true;
    }
  }

  function updateTransitions() {
    ticking = false;
    const scrollY = lastScrollY;
    const winH = window.innerHeight;

    // Hero parallax + fade on scroll
    if (heroContent) {
      const heroPct = Math.min(1, scrollY / winH);
      if (scrollY <= winH) {
        heroContent.style.transform = `translate3d(0,${scrollY * 0.35}px,0) scale(${1 - heroPct * 0.05})`;
        heroContent.style.opacity = String(Math.max(0, 1 - heroPct * 1.5));
        if (heroFrame) heroFrame.style.opacity = String(Math.max(0, 1 - heroPct * 2));
      }
    }

    // Each section — calculate visibility ratio
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const top = rect.top;
      const h = rect.height;

      // How far into viewport (0 = just entering from bottom, 1 = fully visible)
      const enterProgress = Math.max(0, Math.min(1, (winH - top) / (winH * 0.6)));
      // How far out the top (0 = still visible, 1 = gone above)
      const exitProgress = Math.max(0, Math.min(1, -(top) / (h * 0.5)));

      // Apply entrance transform
      if (enterProgress < 1) {
        const translateY = (1 - enterProgress) * 60;
        const scale = 0.96 + enterProgress * 0.04;
        const opacity = enterProgress;
        section.style.transform = `translate3d(0,${translateY}px,0) scale(${scale})`;
        section.style.opacity = String(opacity);
      } else if (exitProgress > 0 && section.tagName !== 'FOOTER') {
        // Subtle exit: slight scale down + fade
        const scale = 1 - exitProgress * 0.03;
        const opacity = 1 - exitProgress * 0.4;
        section.style.transform = `translate3d(0,0,0) scale(${scale})`;
        section.style.opacity = String(Math.max(0.3, opacity));
      } else {
        section.style.transform = 'translate3d(0,0,0) scale(1)';
        section.style.opacity = '1';
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial call
  updateTransitions();
})();

/* ══════════════════════════════════
   SCROLL REVEAL with stagger
══════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 100;
    obs.observe(el);
  });
})();

/* ══════════════════════════════════
   COUNTDOWN TIMER with tick animation
══════════════════════════════════ */
(function initCountdown() {
  const dE = document.getElementById('days');
  const hE = document.getElementById('hours');
  const mE = document.getElementById('minutes');
  const sE = document.getElementById('seconds');
  if (!dE) return;

  function pad(n, l = 2) { return String(n).padStart(l, '0'); }
  let prev = { d: -1, h: -1, m: -1, s: -1 };

  function tick(el) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  }

  function update() {
    const diff = WEDDING - Date.now();
    if (diff <= 0) {
      dE.textContent = '000'; hE.textContent = '00';
      mE.textContent = '00'; sE.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);

    if (d !== prev.d) { dE.textContent = pad(d, 3); prev.d = d; }
    if (h !== prev.h) { hE.textContent = pad(h); prev.h = h; }
    if (m !== prev.m) { mE.textContent = pad(m); prev.m = m; }
    if (s !== prev.s) { sE.textContent = pad(s); tick(sE); prev.s = s; }
  }

  update();
  setInterval(update, 1000);
})();

/* ══════════════════════════════════
   COUNTDOWN — FLOATING PARTICLES
══════════════════════════════════ */
(function initCountdownParticles() {
  if (PREFERS_REDUCED) return;
  const canvas = document.getElementById('countdownParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], animId = null, isVisible = false;

  function resize() {
    const p = canvas.parentElement;
    W = canvas.width = p.offsetWidth;
    H = canvas.height = p.offsetHeight;
  }

  const MAX_DOTS = IS_MOBILE ? 22 : 45;

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = 0.8 + Math.random() * 1.8;
      this.vy = -(0.08 + Math.random() * 0.2);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.gold = Math.random() > 0.5;
      this.wave = Math.random() * 6.28;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.gold ? '#C9B037' : '#D4A5A5';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
      if (this.gold && this.size > 1.2 && !IS_MOBILE) {
        ctx.globalAlpha = this.opacity * 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, 6.28);
        ctx.fill();
      }
    }
    update() {
      this.wave += 0.015;
      this.x += this.vx + Math.sin(this.wave) * 0.15;
      this.y += this.vy;
      this.opacity -= 0.0003;
      if (this.y < -10 || this.opacity <= 0) this.reset(false);
    }
  }

  function init() {
    resize(); dots = [];
    const count = Math.min(Math.floor(W / (IS_MOBILE ? 20 : 16)), MAX_DOTS);
    for (let i = 0; i < count; i++) dots.push(new Dot());
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) { dots[i].update(); dots[i].draw(); }
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('countdown');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.05 });
  obs.observe(section);

  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 300); }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   SAVE THE DATE — STARFIELD CANVAS
══════════════════════════════════ */
(function initSavedateCanvas() {
  if (PREFERS_REDUCED) return;
  const canvas = document.getElementById('savedateCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [], animId = null, isVisible = false;

  function resize() {
    const p = canvas.parentElement;
    W = canvas.width = p.offsetWidth;
    H = canvas.height = p.offsetHeight;
  }

  const MAX_STARS = IS_MOBILE ? 45 : 100;

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = 0.4 + Math.random() * 1.8;
      this.opacity = 0.1 + Math.random() * 0.5;
      this.phase = Math.random() * 6.28;
      this.speed = 0.006 + Math.random() * 0.02;
      this.gold = Math.random() < 0.35;
    }
    draw() {
      const o = this.opacity * (0.35 + 0.65 * Math.sin(this.phase));
      if (o < 0.02) return;
      ctx.globalAlpha = o;
      ctx.fillStyle = this.gold ? '#C9B037' : '#FDE8E0';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
      if (this.size > 1.2) {
        ctx.globalAlpha = o * 0.3;
        ctx.fillRect(this.x - this.size * 2.5, this.y - 0.25, this.size * 5, 0.5);
        ctx.fillRect(this.x - 0.25, this.y - this.size * 2.5, 0.5, this.size * 5);
      }
    }
    update() { this.phase += this.speed; }
  }

  class ShootingStar {
    constructor() { this.reset(); }
    reset() { this.active = false; this.timer = 150 + Math.random() * 350; }
    activate() {
      this.active = true;
      this.x = Math.random() * W * 0.7;
      this.y = Math.random() * H * 0.4;
      this.vx = 3 + Math.random() * 4;
      this.vy = 1.5 + Math.random() * 2;
      this.opacity = 0.7;
      this.len = 40 + Math.random() * 60;
    }
    update() {
      if (!this.active) { this.timer--; if (this.timer <= 0) this.activate(); return; }
      this.x += this.vx; this.y += this.vy; this.opacity -= 0.015;
      if (this.opacity <= 0 || this.x > W || this.y > H) this.reset();
    }
    draw() {
      if (!this.active) return;
      const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * this.len / 5, this.y - this.vy * this.len / 5);
      grad.addColorStop(0, `rgba(255,255,240,${this.opacity})`);
      grad.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * this.len / 5, this.y - this.vy * this.len / 5);
      ctx.stroke();
    }
  }

  function init() {
    resize(); stars = []; shootingStars = [];
    const count = Math.min(Math.floor(W * H / (IS_MOBILE ? 7000 : 3500)), MAX_STARS);
    for (let i = 0; i < count; i++) stars.push(new Star());
    if (!IS_MOBILE) { shootingStars.push(new ShootingStar()); shootingStars.push(new ShootingStar()); }
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < stars.length; i++) { stars[i].update(); stars[i].draw(); }
    for (let i = 0; i < shootingStars.length; i++) { shootingStars[i].update(); shootingStars[i].draw(); }
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('savedate');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.05 });
  obs.observe(section);

  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 300); }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   TOUCH SPARKLE — Mobile magic ✨
══════════════════════════════════ */
(function initTouchSparkle() {
  if (!IS_MOBILE) return;
  const colors = ['#C9B037', '#D4A5A5', '#9CAF88', '#FDE8E0', '#E8D070'];

  function burst(x, y) {
    const count = 6 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 5;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 25 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      sp.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${c};opacity:0.8;transition:all 0.7s cubic-bezier(0.16,1,0.3,1);transform:translate(-50%,-50%) scale(1);`;
      document.body.appendChild(sp);
      requestAnimationFrame(() => {
        sp.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
        sp.style.opacity = '0';
      });
      setTimeout(() => sp.remove(), 750);
    }
  }

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) burst(touch.clientX, touch.clientY);
  }, { passive: true });
})();

/* ══════════════════════════════════
   CURSOR GLOW + SPARKLE (desktop)
══════════════════════════════════ */
(function initCursorGlow() {
  if (IS_MOBILE) return;
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function follow() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.transform = `translate3d(${cx - 200}px, ${cy - 200}px, 0)`;
    requestAnimationFrame(follow);
  }
  follow();
})();

(function initSparkle() {
  if (IS_MOBILE) return;
  const colors = ['#C9B037', '#D4A5A5', '#9CAF88', '#FDE8E0', '#E8D070'];
  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.92) {
      const sp = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 2 + Math.random() * 4;
      sp.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:${c};opacity:0.7;transition:all 0.7s cubic-bezier(0.16,1,0.3,1);transform:translate(-50%,-50%) scale(1);`;
      document.body.appendChild(sp);
      requestAnimationFrame(() => {
        sp.style.transform = `translate(${(Math.random()-0.5)*50}px,${-25-Math.random()*30}px) scale(0)`;
        sp.style.opacity = '0';
      });
      setTimeout(() => sp.remove(), 750);
    }
  }, { passive: true });
})();

/* ══════════════════════════════════
   MUSIC BUTTON
══════════════════════════════════ */
(function initMusic() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('playing');
    btn.querySelector('i').className = btn.classList.contains('playing') ? 'fas fa-pause' : 'fas fa-music';
  });
})();

/* ══════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════ */
(function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
