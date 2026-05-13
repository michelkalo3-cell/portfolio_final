/**
 * PORTFOLIO — KALO MICHEL
 * script.js
 * ─────────────────────────────────────────
 * Modules :
 *  1. Loader
 *  2. Custom Cursor
 *  3. Particles Canvas
 *  4. Typing Effect
 *  5. Navbar (scroll glow + mobile toggle)
 *  6. Smooth Scroll
 *  7. Scroll Reveal (sections + timeline)
 *  8. Counter Animation
 *  9. 3D Tilt (about box)
 * 10. Contact Form (EmailJS)
 * ─────────────────────────────────────────
 */

/* ══════════════════════════════════════════
   1. LOADER
   ══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('out');
  }, 1700);
});

/* ══════════════════════════════════════════
   2. CUSTOM CURSOR
   ══════════════════════════════════════════ */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function trail() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trail);
  })();

  // Hover effect on interactive elements
  const hoverSels = [
    'a', 'button', '.btn', '.badge',
    '.proj-card', '.soc-btn', '.c-item',
    '.stat-card', '.chip', '.nav-toggle'
  ].join(',');

  document.querySelectorAll(hoverSels).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ══════════════════════════════════════════
   3. PARTICLES CANVAS
   ══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('pcanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Colour palette
  const COLORS = [
    'rgba(108,99,255,',
    'rgba(168,85,247,',
    'rgba(0,212,255,',
    'rgba(236,72,153,'
  ];

  // Build particles
  const COUNT = 90;
  const particles = Array.from({ length: COUNT }, () => ({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * window.innerHeight,
    r:   Math.random() * 1.8 + 0.4,
    vx:  (Math.random() - 0.5) * 0.45,
    vy:  (Math.random() - 0.5) * 0.3 - 0.1,
    op:  Math.random() * 0.45 + 0.1,
    col: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  const CONNECTION_DIST = 110;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move & draw dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5)             p.y = canvas.height + 5;
      if (p.x < -5)             p.x = canvas.width  + 5;
      if (p.x > canvas.width  + 5) p.x = -5;
      if (p.y > canvas.height + 5) p.y = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.op + ')';
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.14 * (1 - d / CONNECTION_DIST)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════════
   4. TYPING EFFECT
   ══════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;

  const phrases = [
    'Informaticien 💻',
    'Développeur Web 🚀',
    "Créateur d'apps 📱",
    'Web Designer 🎨'
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 95);
  }

  // Start after loader
  setTimeout(type, 1900);
})();

/* ══════════════════════════════════════════
   5. NAVBAR
   ══════════════════════════════════════════ */
(function initNavbar() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!nav) return;

  // Scroll glow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('glow', window.scrollY > 50);
  });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('show');
    });
    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('show');
      });
    });
  }
})();

/* ══════════════════════════════════════════
   6. SMOOTH SCROLL
   ══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   7. SCROLL REVEAL
   ══════════════════════════════════════════ */
(function initReveal() {
  // Generic [data-reveal] elements
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('shown'), i * 70);
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

  // Timeline items
  document.querySelectorAll('.tl-item').forEach((el, i) => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('shown'), i * 200);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
  });
})();

/* ══════════════════════════════════════════
   8. COUNTER ANIMATION
   ══════════════════════════════════════════ */
(function initCounters() {
  /**
   * @param {HTMLElement} el
   * @param {number} target
   */
  function countUp(el, target) {
    let n = 0;
    const step = target / 40;
    const iv = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = Math.floor(n) + '+';
      if (n >= target) clearInterval(iv);
    }, 40);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target, parseInt(entry.target.dataset.count, 10));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════
   9. 3D TILT — About Box
   ══════════════════════════════════════════ */
(function initTilt() {
  const box    = document.getElementById('aboutBox');
  const visual = box && box.closest('.about-visual');
  if (!box || !visual) return;

  visual.addEventListener('mousemove', e => {
    const rect = box.getBoundingClientRect();
    const rx   =  ((e.clientY - rect.top)  / rect.height - 0.5) * 18;
    const ry   = -((e.clientX - rect.left) / rect.width  - 0.5) * 18;
    box.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px)`;
  });

  visual.addEventListener('mouseleave', () => {
    box.style.transform = 'perspective(700px) rotateX(6deg) rotateY(-6deg)';
  });
})();

/* ══════════════════════════════════════════
   10. CONTACT FORM — EmailJS
   ══════════════════════════════════════════ */
(function initContact() {
  // Init EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: 'mmMdyZ7efU8E23dzf',
    });
  }


  const form    = document.getElementById('cformEl');
  if (!form) return;

  const btn     = form.querySelector('button[type="submit"]');
  const inputs  = form.querySelectorAll('input, textarea');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validation
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      } else {
        input.style.borderColor = 'rgba(108,99,255,.5)';
      }
    });

    if (!isValid) {
      alert('⚠️ Veuillez remplir tous les champs.');
      return;
    }

    // Loading state
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';
    btn.disabled   = true;

    const nameInput = form.querySelectorAll('input')[0];
    const emailInput = form.querySelectorAll('input')[1];
    const subjectInput = form.querySelectorAll('input')[2];
    const messageInput = form.querySelector('textarea');

    const params = {
      from_name: (nameInput?.value || '').trim(),
      from_email: (emailInput?.value || '').trim(),
      subject: (subjectInput?.value || '').trim(),
      message: (messageInput?.value || '').trim(),
      to_email: 'michelkalo3@gmail.com',
    };


    if (typeof emailjs !== 'undefined') {
      emailjs
        .send('service_5ha6x3n', 'template_z0ip32b', params)

        .then(() => {
          alert('✅ Message envoyé ! Je vous contacterai bientôt.');
          form.reset();
          inputs.forEach(i => (i.style.borderColor = ''));
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
          btn.disabled  = false;
        })
        .catch(() => {
          alert('❌ Erreur. Contactez-moi directement à michelkalo3@gmail.com');
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
          btn.disabled  = false;
        });
    } else {
      alert('❌ EmailJS non chargé. Contactez-moi à michelkalo3@gmail.com');
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
      btn.disabled  = false;
    }
  });
})();
