/**
 * ═══════════════════════════════════════
 *  SOFIA & NIKITA — WEDDING INVITATION
 *  Gorgeous + 60fps on Safari iOS ✨
 *  v3: Mobile-first performance
 * ═══════════════════════════════════════
 */
'use strict';

const WEDDING = new Date('2026-08-01T15:00:00');
const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
const IS_IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 2);

/* ══════════════════════════════════
   LOADING SCREEN
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.classList.add('loaded');
    // On mobile, add performance class for CSS optimizations
    if (IS_MOBILE) document.body.classList.add('is-mobile');
    startHeroAnimations();
  }, 1800);
});

/* ══════════════════════════════════
   HERO — PARTICLE SYSTEM
   v3: Mobile gets 45 particles, no
   radialGradient, no glow, simpler shards
══════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || PREFERS_REDUCED) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, particles = [], animId = null, isVisible = false;

  const COLORS = [
    { r: 212, g: 165, b: 165 },
    { r: 253, g: 232, b: 224 },
    { r: 201, g: 176, b: 55  },
    { r: 156, g: 175, b: 136 },
    { r: 200, g: 184, b: 212 },
    { r: 255, g: 255, b: 240 },
    { r: 232, g: 208, b: 112 },
    { r: 255, g: 215, b: 180 },
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

  // Mobile: 45 (smooth), Desktop: 120
  const MAX_PARTICLES = IS_MOBILE ? 45 : 120;

  class Particle {
    constructor(init) { this.reset(init); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -40;
      const ci = Math.floor(Math.random() * COLORS.length);
      this.cr = COLORS[ci].r;
      this.cg = COLORS[ci].g;
      this.cb = COLORS[ci].b;
      // Pre-compute color strings to avoid runtime string concatenation
      this.fillColor = `rgb(${this.cr},${this.cg},${this.cb})`;

      const rnd = Math.random();
      if (IS_MOBILE) {
        // Mobile: 3 types only — petals, sparkles, shards (all simple fills)
        if (rnd < 0.38) this.type = 1;       // petals — ellipse fill
        else if (rnd < 0.68) this.type = 2;   // sparkles — tiny circles
        else this.type = 4;                    // shards — simple triangles
      } else {
        if (rnd < 0.10) this.type = 0;        // glow orbs (desktop only)
        else if (rnd < 0.30) this.type = 1;   // petals
        else if (rnd < 0.52) this.type = 2;   // sparkles
        else if (rnd < 0.68) this.type = 3;   // rings
        else this.type = 4;                    // shards
      }

      if (this.type === 0) {
        this.size = 20 + Math.random() * 40;
        this.opacity = 0.015 + Math.random() * 0.035;
        this.vy = 0.06 + Math.random() * 0.12;
        this.vx = (Math.random() - 0.5) * 0.1;
      } else if (this.type === 1) {
        this.size = IS_MOBILE ? (2 + Math.random() * 4) : (3 + Math.random() * 7);
        this.opacity = 0.12 + Math.random() * 0.3;
        this.vy = 0.2 + Math.random() * 0.55;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.rot = Math.random() * 6.28;
        this.rotV = (Math.random() - 0.5) * 0.02;
      } else if (this.type === 2) {
        this.size = 0.6 + Math.random() * 1.8;
        this.opacity = 0.2 + Math.random() * 0.55;
        this.vy = 0.04 + Math.random() * 0.2;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.twinkle = Math.random() * 6.28;
        this.twinkleSpeed = 0.02 + Math.random() * 0.04;
      } else if (this.type === 3) {
        this.size = 5 + Math.random() * 11;
        this.opacity = 0.05 + Math.random() * 0.1;
        this.vy = 0.04 + Math.random() * 0.12;
        this.vx = (Math.random() - 0.5) * 0.08;
        this.rot = Math.random() * 6.28;
        this.rotV = (Math.random() - 0.5) * 0.006;
      } else {
        // Shards — smaller on mobile for cheaper draws
        this.size = IS_MOBILE ? (1.5 + Math.random() * 3.5) : (3 + Math.random() * 8);
        this.opacity = 0.1 + Math.random() * 0.25;
        this.vy = 0.1 + Math.random() * 0.35;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.rot = Math.random() * 6.28;
        this.rotV = (Math.random() - 0.5) * 0.025;
        // Mobile: only triangles (3 sides) — fewer vertices = faster
        this.sides = IS_MOBILE ? 3 : (Math.random() < 0.5 ? 3 : (Math.random() < 0.5 ? 4 : 5));
        this.twinkle = Math.random() * 6.28;
        this.twinkleSpeed = 0.015 + Math.random() * 0.03;
      }
      this.wave = Math.random() * 6.28;
      this.waveAmp = 0.1 + Math.random() * 0.35;
      this.fadeIn = init ? 1 : 0;
    }

    update() {
      this.wave += 0.007;
      this.x += this.vx + Math.sin(this.wave) * this.waveAmp;
      this.y += this.vy;
      if (this.type === 1 || this.type === 3 || this.type === 4) this.rot += this.rotV;
      if (this.type === 2 || this.type === 4) this.twinkle += this.twinkleSpeed;
      if (this.fadeIn < 1) this.fadeIn = Math.min(1, this.fadeIn + 0.015);
      if (this.y > H + 50 || this.x < -50 || this.x > W + 50) this.reset(false);
    }

    draw() {
      const fade = this.fadeIn;

      if (this.type === 0) {
        // Glow orb — desktop only (radialGradient)
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${this.cr},${this.cg},${this.cb},${this.opacity * fade})`);
        grad.addColorStop(1, `rgba(${this.cr},${this.cg},${this.cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
      } else if (this.type === 1) {
        // Petal — simple ellipse
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      } else if (this.type === 2) {
        // Sparkle — tiny circle + optional cross (desktop only)
        const a = this.opacity * fade * (0.35 + 0.65 * Math.sin(this.twinkle));
        if (a < 0.02) return;
        ctx.globalAlpha = a;
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
        if (!IS_MOBILE && this.size > 1.3) {
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(this.x - this.size * 2, this.y - 0.3, this.size * 4, 0.6);
          ctx.fillRect(this.x - 0.3, this.y - this.size * 2, 0.6, this.size * 4);
        }
        ctx.globalAlpha = 1;
      } else if (this.type === 3) {
        // Ring — desktop only
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.strokeStyle = this.fillColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, 6.28);
        ctx.stroke();
        ctx.restore();
      } else {
        // SHARD — simple polygon, NO glow aura on mobile
        const a = this.opacity * fade * (0.5 + 0.5 * Math.sin(this.twinkle));
        if (a < 0.02) return;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        const sides = this.sides;
        for (let i = 0; i <= sides; i++) {
          const angle = (6.28 * i) / sides - 1.5708;
          const r = this.size * (i % 2 === 0 ? 1 : 0.5);
          i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
                   : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        // Glow aura — desktop only, large shards
        if (!IS_MOBILE && this.size > 4) {
          ctx.globalAlpha = a * 0.12;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 2.5, 0, 6.28);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const density = IS_MOBILE ? 9 : 6;
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
      const wd = Math.abs(window.innerWidth - W);
      if (!IS_MOBILE || wd > 100) { if (IS_MOBILE) lockedH = null; init(); }
    }, 400);
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
   SCROLL TRANSITIONS — CSS-DRIVEN
   
   IntersectionObserver toggles classes.
   All animation done via CSS transitions
   → compositor thread, zero jank.
   
   v3: On mobile, transitions are simpler
   (opacity-only, no transform) for max perf
══════════════════════════════════ */
(function initScrollTransitions() {
  if (PREFERS_REDUCED) return;

  // Hero parallax — desktop only
  if (!IS_MOBILE) {
    const heroContent = document.getElementById('heroContent');
    const heroFrame = document.querySelector('.hero__frame');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxH = window.innerHeight;
        if (y <= maxH && heroContent) {
          const pct = y / maxH;
          heroContent.style.transform = `translate3d(0,${y * 0.35}px,0)`;
          heroContent.style.opacity = String(Math.max(0, 1 - pct * 1.5));
          if (heroFrame) heroFrame.style.opacity = String(Math.max(0, 1 - pct * 2));
        }
        ticking = false;
      });
    }, { passive: true });
  }

  // Section transitions via IntersectionObserver — pure CSS
  const sections = document.querySelectorAll('.about, .countdown, .savedate, .footer');
  
  const enterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('section-visible');
      } else {
        if (e.boundingClientRect.top > 0) {
          e.target.classList.remove('section-visible');
        }
      }
    });
  }, {
    threshold: IS_MOBILE ? 0.03 : 0.05,
    rootMargin: '0px 0px -6% 0px'
  });

  sections.forEach(s => enterObs.observe(s));
})();

/* ══════════════════════════════════
   SCROLL REVEAL — inner elements
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
   COUNTDOWN TIMER
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
   v3: Reduced count on mobile, simpler draws
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

  const MAX_DOTS = IS_MOBILE ? 14 : 35;

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = 0.8 + Math.random() * 1.5;
      this.vy = -(0.08 + Math.random() * 0.18);
      this.vx = (Math.random() - 0.5) * 0.12;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.gold = Math.random() > 0.5;
      this.fillColor = this.gold ? '#C9B037' : '#D4A5A5';
      this.wave = Math.random() * 6.28;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.fillColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
    }
    update() {
      this.wave += 0.012;
      this.x += this.vx + Math.sin(this.wave) * 0.12;
      this.y += this.vy;
      this.opacity -= 0.0003;
      if (this.y < -10 || this.opacity <= 0) this.reset(false);
    }
  }

  function init() {
    resize(); dots = [];
    const count = Math.min(Math.floor(W / (IS_MOBILE ? 28 : 18)), MAX_DOTS);
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

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 400); }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   SAVE THE DATE — STARFIELD
   v3: Fewer stars on mobile, no shooting stars
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

  const MAX_STARS = IS_MOBILE ? 25 : 80;

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = 0.4 + Math.random() * 1.6;
      this.opacity = 0.1 + Math.random() * 0.5;
      this.phase = Math.random() * 6.28;
      this.speed = 0.005 + Math.random() * 0.015;
      this.gold = Math.random() < 0.35;
      this.fillColor = this.gold ? '#C9B037' : '#FDE8E0';
    }
    draw() {
      const o = this.opacity * (0.35 + 0.65 * Math.sin(this.phase));
      if (o < 0.03) return;
      ctx.globalAlpha = o;
      ctx.fillStyle = this.fillColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
      // Cross sparkle — desktop only, larger stars
      if (!IS_MOBILE && this.size > 1.2) {
        ctx.globalAlpha = o * 0.3;
        ctx.fillRect(this.x - this.size * 2.5, this.y - 0.25, this.size * 5, 0.5);
        ctx.fillRect(this.x - 0.25, this.y - this.size * 2.5, 0.5, this.size * 5);
      }
    }
    update() { this.phase += this.speed; }
  }

  class ShootingStar {
    constructor() { this.reset(); }
    reset() { this.active = false; this.timer = 180 + Math.random() * 400; }
    activate() {
      this.active = true; this.x = Math.random() * W * 0.7; this.y = Math.random() * H * 0.4;
      this.vx = 3 + Math.random() * 4; this.vy = 1.5 + Math.random() * 2;
      this.opacity = 0.7; this.len = 40 + Math.random() * 60;
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
      ctx.strokeStyle = grad; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * this.len / 5, this.y - this.vy * this.len / 5);
      ctx.stroke();
    }
  }

  function init() {
    resize(); stars = []; shootingStars = [];
    const count = Math.min(Math.floor(W * H / (IS_MOBILE ? 10000 : 4000)), MAX_STARS);
    for (let i = 0; i < count; i++) stars.push(new Star());
    // Shooting stars — desktop only
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

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 400); }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   TOUCH SPARKLE (mobile)
   v3: Fewer sparkles, simpler CSS
══════════════════════════════════ */
(function initTouchSparkle() {
  if (!IS_MOBILE) return;
  const colors = ['#C9B037', '#D4A5A5', '#9CAF88', '#FDE8E0', '#E8D070'];
  let lastBurst = 0;

  function burst(x, y) {
    // Throttle: max 1 burst per 200ms
    const now = Date.now();
    if (now - lastBurst < 200) return;
    lastBurst = now;

    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 3;
      const angle = (6.28 * i) / count + (Math.random() - 0.5) * 0.4;
      const dist = 18 + Math.random() * 25;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      sp.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${c};opacity:0.7;transition:all 0.5s cubic-bezier(0.16,1,0.3,1);transform:translate(-50%,-50%) scale(1);`;
      document.body.appendChild(sp);
      requestAnimationFrame(() => {
        sp.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
        sp.style.opacity = '0';
      });
      setTimeout(() => sp.remove(), 550);
    }
  }

  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) burst(t.clientX, t.clientY);
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
    cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
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
(function() {
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
