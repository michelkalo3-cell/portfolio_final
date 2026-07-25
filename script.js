/* ══════════════════════════════════════════
   CHARAMOU.DEV — Portfolio v4
   script.js
   ══════════════════════════════════════════ */

/* ── 1. LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('out'), 1500);
});

/* ── 2. CURSOR ── */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cur     = document.getElementById('cur');
  const curRing = document.getElementById('cur-ring');
  if (!cur || !curRing) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn, .proj-card, .skill-card, .c-item, [role="button"]')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

/* ── 3. PARTICLES (orange, optimisées) ── */
(function initParticles() {
  const canvas = document.getElementById('pcanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  const N = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r  = Math.random() * 1.8 + .4;
      this.a  = Math.random() * .4 + .05;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,140,0,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new Particle());

  const LINK_DIST = 120;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      particles[i].update();
      particles[i].draw();
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,140,0,${.12 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();

/* ── 4. NAVBAR ── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('glow', window.scrollY > 50);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      menu.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ── 5. TYPED EFFECT ── */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrases = [
    'Développeur Full-Stack',
    'Développeur Android',
    'Intégrateur IA',
    'Fondateur CHARAMOU.DEV',
    'Builder PME Afrique',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 60, SPEED_DEL = 35, PAUSE = 2200;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 800);
})();

/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('shown');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
})();

/* ── 7. COUNTER ANIMATION ── */
(function initCounters() {
  const nums = document.querySelectorAll('.hstat-num[data-count]');
  if (!nums.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1600;
      const step = end / (dur / 16);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.round(cur) + (end > 9 ? '+' : '');
        if (cur >= end) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  nums.forEach(el => obs.observe(el));
})();

/* ── 8. SKILL BAR ANIMATION ── */
(function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card[data-skill-level]');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill  = e.target.querySelector('.sk-fill');
      const level = e.target.dataset.skillLevel;
      if (fill) {
        setTimeout(() => { fill.style.width = level + '%'; }, 200);
      }
      obs.unobserve(e.target);
    });
  }, { threshold: .2 });
  cards.forEach(el => obs.observe(el));
})();

/* ── 9. TIMELINE REVEAL ── */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('shown'), i * 120);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  items.forEach(el => obs.observe(el));
})();

/* ── 10. ABOUT CARD 3D TILT ── */
(function initTilt() {
  const card = document.getElementById('aboutBox');
  if (!card || window.matchMedia('(pointer: coarse)').matches) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / rect.height) * 10;
    const ry   = ((e.clientX - cx) / rect.width)  * -10;
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(4deg) rotateY(-4deg)';
  });
})();

/* ── 11. HERO 3D PARALLAX ── */
(function initHeroParallax() {
  const hero3d = document.getElementById('hero3d');
  if (!hero3d || window.matchMedia('(pointer: coarse)').matches) return;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - .5) * 18;
    targetY = (e.clientY / window.innerHeight - .5) * 18;
  });
  function animate() {
    currentX += (targetX - currentX) * .06;
    currentY += (targetY - currentY) * .06;
    hero3d.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── 12. ACTIVE NAV LINK ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ── 13. EMAILJS + FORMULAIRE ── */
(function initForm() {
  const SERVICE_ID  = 'service_charamou';
  const TEMPLATE_ID = 'template_portfolio';
  const PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';

  try { emailjs.init({ publicKey: PUBLIC_KEY }); } catch(e) {}

  const form     = document.getElementById('cformEl');
  const btn      = document.getElementById('submitBtn');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  let lastSent = 0;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSent < 30000) {
      setFeedback('Veuillez attendre 30 secondes avant de renvoyer.', 'err'); return;
    }

    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const message = document.getElementById('f-message').value.trim();

    if (!name || !email || !subject || !message) {
      setFeedback('Veuillez remplir tous les champs.', 'err'); return;
    }
    if (!validateEmail(email)) {
      setFeedback('Adresse email invalide.', 'err'); return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    setFeedback('', '');

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      setFeedback('✅ Message envoyé ! Je vous réponds sous 24h.', 'ok');
      form.reset();
      lastSent = Date.now();
    } catch (err) {
      setFeedback('❌ Erreur d\'envoi. Contactez-moi directement par email.', 'err');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
    }
  });
})();

/* ── 14. SMOOTH SCROLL pour liens internes ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 15. ACTIVE NAV STYLE ── */
(function addActiveLinkStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: #FF8C00 !important; }
    .nav-link.active::after {
      content: ''; position: absolute;
      bottom: 4px; left: 25%; width: 50%; height: 2px;
      background: #FF8C00; border-radius: 1px;
    }
  `;
  document.head.appendChild(style);
})();
