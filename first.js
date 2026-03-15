/**
 * Aahara Bhavan — Premium JavaScript
 * Matches updated HTML class names & structure
 */
'use strict';

/* ============================================================
   1. PRELOADER
============================================================ */
(function initPreloader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('animationend', () => loader.remove(), { once: true });
    }, 800);
  });
})();


/* ============================================================
   2. NAVBAR — scroll state, mobile toggle, active link
============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const body   = document.body;

  if (!navbar) return;

  // Scroll-driven class
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section highlighting
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72')}px 0px 0px 0px` });

  sections.forEach(s => sectionObs.observe(s));
})();


/* ============================================================
   3. SMOOTH SCROLL — offset for fixed navbar
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   4. SCROLL REVEAL
============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ============================================================
   5. HERO PARALLAX
============================================================ */
(function initParallax() {
  const content = document.querySelector('.hero-content');
  const mark    = document.querySelector('.hero-mark');
  if (!content) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          content.style.transform = `translateY(${y * 0.28}px)`;
          if (mark) mark.style.transform = `translateY(${y * 0.12}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   6. MENU TABS — ARIA-compliant
============================================================ */
(function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        const isTarget = panel.id === `tab-${target}`;
        panel.classList.toggle('is-active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });
})();


/* ============================================================
   7. ANIMATED COUNTERS
============================================================ */
(function initCounters() {
  const easeOut = t => 1 - (1 - t) ** 3;

  document.querySelectorAll('.story-stats__item strong, .story-stat strong').forEach(el => {
    const raw     = el.textContent.trim();
    const isPlus  = raw.endsWith('+');
    const isPct   = raw.endsWith('%');
    const isTime  = raw.includes('AM') || raw.includes('PM');
    if (isTime) return; // skip times

    const num = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(num)) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      const dur   = 1500;
      const start = performance.now();

      function tick(now) {
        const p   = Math.min((now - start) / dur, 1);
        const val = Math.round(easeOut(p) * num);
        el.textContent = val + (isPlus ? '+' : isPct ? '%' : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });

    obs.observe(el);
  });
})();


/* ============================================================
   8. DISH CARD 3D TILT
============================================================ */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.dish-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-9px) perspective(900px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
})();


/* ============================================================
   9. RESERVATION FORM
============================================================ */
(function initForm() {
  const form  = document.getElementById('reservationForm');
  const toast = document.getElementById('toast');
  if (!form) return;

  function showToast() {
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 4000);
  }

  function validateField(field) {
    const val   = field.value.trim();
    let   valid = true;
    if (field.required && !val)                                                    valid = false;
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid = false;
    if (field.type === 'tel'   && val && !/^[\d\s+\-()]{6,15}$/.test(val))        valid = false;
    field.style.borderBottomColor = valid ? '' : '#c0392b';
    return valid;
  }

  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => {
      if (f.style.borderBottomColor) validateField(f);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields   = form.querySelectorAll('[required]');
    const allValid = [...fields].every(f => validateField(f));
    if (!allValid) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Request Sent';
      showToast();
      setTimeout(() => {
        form.reset();
        btn.textContent = orig;
        btn.disabled = false;
        form.querySelectorAll('input, select, textarea').forEach(f => f.style.borderBottomColor = '');
      }, 3000);
    }, 1100);
  });
})();


/* ============================================================
   10. YEAR
============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();