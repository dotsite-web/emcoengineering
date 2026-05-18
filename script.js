/* ================================================================
   EMCO ENGINEERING — SHARED JAVASCRIPT
   Page transitions · Scroll reveals · Hero anim · Mobile nav
   ================================================================ */

(function () {
  'use strict';

  /* ── PAGE TRANSITION ─────────────────────────────────────── */
  const overlay = document.getElementById('page-overlay');

  // Reveal page on load (overlay slides out to the right)
  function revealPage() {
    if (!overlay) return;
    gsap.to(overlay, {
      scaleX: 0,
      duration: 0.9,
      ease: 'power3.inOut',
      transformOrigin: 'right',
      delay: 0.1,
      onComplete: () => { overlay.style.pointerEvents = 'none'; }
    });
  }

  // Navigate with transition
  function navigateTo(url) {
    if (!overlay) { window.location.href = url; return; }
    overlay.style.transformOrigin = 'left';
    overlay.style.pointerEvents = 'all';
    gsap.fromTo(overlay,
      { scaleX: 0 },
      {
        scaleX: 1, duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => { window.location.href = url; }
      }
    );
  }

  // Intercept nav links
  document.querySelectorAll('a.nav-link-anim').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('https:') || link.target === '_blank') return;
      const dest = new URL(href, window.location.href);
      if (dest.origin !== window.location.origin || dest.pathname === window.location.pathname) return;
      e.preventDefault();
      navigateTo(href);
    });
  });

  /* ── NAVBAR ──────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  function handleNavbar() {
    const y = window.scrollY;
    if (y > 40) { navbar.classList.add('scrolled'); }
    else { navbar.classList.remove('scrolled'); }
    lastScroll = y;
  }
  if (navbar) { window.addEventListener('scroll', handleNavbar, { passive: true }); handleNavbar(); }

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  const ham    = document.getElementById('hamburger');
  const menu   = document.getElementById('mobileMenu');
  const scrim  = document.getElementById('mobileScrim');

  function toggleMenu(open) {
    ham?.classList.toggle('open', open);
    menu?.classList.toggle('open', open);
    scrim?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  ham?.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  scrim?.addEventListener('click', () => toggleMenu(false));

  /* ── SCROLL REVEALS ──────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => io.observe(el));

  /* ── STAT COUNTERS ───────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 4); // easeOutQuart

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(t) * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

  /* ── HERO ANIMATION ──────────────────────────────────────── */
  function initHero() {
    const wordInners = document.querySelectorAll('.hero-title .word-inner');
    const label      = document.getElementById('heroLabel');
    const sub        = document.getElementById('heroSub');
    const cta        = document.getElementById('heroCta');
    const scroll     = document.getElementById('heroScroll');

    if (!wordInners.length) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Label fade in
    if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0);

    // Words stagger up
    tl.to(wordInners, {
      y: '0%', duration: 1.0, stagger: 0.1,
      ease: 'power3.out'
    }, 0.15);

    // Sub + CTA
    if (sub)    tl.to(sub,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.7);
    if (cta)    tl.to(cta,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85);
    if (scroll) tl.to(scroll, { opacity: 1, duration: 0.6 }, 1.2);
  }

  /* ── PROJECT FILTER ──────────────────────────────────────── */
  function initFilter() {
    const btns  = document.querySelectorAll('.f-btn');
    const cards = document.querySelectorAll('.proj-card');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;

        cards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── CONTACT FORM ────────────────────────────────────────── */
  function initForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent — We\'ll be in touch!';
        form.reset();
        setTimeout(() => { btn.textContent = 'Send Enquiry'; btn.disabled = false; }, 4000);
      }, 1200);
    });
  }

  /* ── INIT ────────────────────────────────────────────────── */
  window.addEventListener('DOMContentLoaded', () => {
    revealPage();
    initHero();
    initFilter();
    initForm();
  });

})();
