/* ==========================================================================
   LE&BA — Pintores Profesionales | app.js v2.0.0 PREMIUM
   GSAP Hero + Scroll Reveal + Testimonial Carousel + Comparator + Counters + Form
   ========================================================================== */
'use strict';

(function () {
  const WA_NUMBER = '34600123456';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initHeroAnimation();
    initScrollReveal();
    initTrustCounters();
    initBeforeAfter();
    initTestimonialCarousel();
    initStepper();
    initForm();
  }

  /* ---------- HEADER STICKY SCROLL EFFECT ---------- */
  function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial state
  }

  /* ---------- MOBILE NAVIGATION ---------- */
  function initMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (!toggle || !mobileNav) return;

    const closeBtn = mobileNav.querySelector('.mobile-nav-close');
    const links = mobileNav.querySelectorAll('a');

    const open = () => {
      mobileNav.hidden = false;
      requestAnimationFrame(() => mobileNav.classList.add('open'));
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    };
    const close = () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(() => { mobileNav.hidden = true; }, 300);
      toggle.focus();
    };

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    links.forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) close();
    });
  }

  /* ---------- SMOOTH ANCHOR SCROLLING ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 76;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 16;
        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        // Update URL without jumping
        history.pushState(null, '', targetId);
      });
    });
  }

  /* ---------- HERO ANIMATION: LAS DOS BROCHAS (GSAP) ---------- */
  function initHeroAnimation() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const skipBtn = document.getElementById('skip-intro');
    const words = hero.querySelectorAll('.hero-word');
    const subtitle = hero.querySelector('.hero-subtitle');
    const ctas = hero.querySelector('.hero-ctas');
    const badge = hero.querySelector('.hero-rating-badge');
    const trustStrip = hero.querySelector('.hero-trust-strip');
    const bgLayer = document.getElementById('heroBgLayer');
    const brush1 = document.getElementById('brush1');
    const brush2 = document.getElementById('brush2');

    const showFinalState = () => {
      gsap.set(bgLayer, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' });
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set([subtitle, ctas, badge, trustStrip], { opacity: 1, y: 0 });
      if (brush1) gsap.set(brush1, { opacity: 0 });
      if (brush2) gsap.set(brush2, { opacity: 0 });
      hero.classList.add('intro-done');
    };

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      showFinalState();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => hero.classList.add('intro-done') });

    // Phase 1 (0–0.6s): Brush 1 diagonal entry + wavy mask reveal
    tl.fromTo(brush1,
      { x: -60, y: -120, rotation: 35, opacity: 0 },
      { x: 200, y: 180, rotation: 15, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0
    )
    .fromTo(bgLayer,
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: function () {
          const p = this.progress();
          const wave = Math.sin(p * Math.PI * 6) * 2;
          const edge = (p * 100).toFixed(1);
          bgLayer.style.clipPath =
            `polygon(0 0, ${edge}% ${wave}%, ${edge}% ${100 - wave}%, 0 100%)`;
        },
        onComplete: () => {
          bgLayer.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
          gsap.to(brush1, { opacity: 0, duration: 0.2 });
        }
      },
      0
    );

    // Rating badge
    tl.fromTo(badge,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.3
    );

    // Phase 2 (0.4–1.4s): Brush 2 sweeps headline, revealing words progressively
    const titleEl = hero.querySelector('.hero-title');
    const titleBox = titleEl.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const startX = 40;
    const endX = Math.min(titleBox.width + 60, heroRect.width - 80);

    tl.fromTo(brush2,
      { x: startX, y: titleBox.top - heroRect.top + titleBox.height * 0.6, rotation: -20, opacity: 0 },
      { opacity: 1, duration: 0.15 },
      0.4
    ).to(brush2, {
      x: endX,
      duration: 0.9,
      ease: 'power1.inOut',
      onUpdate: function () {
        const p = this.progress();
        const revealIndex = Math.floor(p * words.length);
        words.forEach((w, i) => {
          if (i <= revealIndex) {
            gsap.to(w, { opacity: 1, y: 0, duration: 0.18, ease: 'back.out(1.4)', overwrite: 'auto' });
          }
        });
      }
    }, 0.45);

    // Phase 3 (1.4–2.0s): Brush 2 bounce settle → static decorative corner
    tl.to(brush2, {
      x: heroRect.width - 90,
      y: heroRect.height - 130,
      rotation: -5,
      scale: 0.7,
      duration: 0.5,
      ease: 'bounce.out'
    }, 1.45)
    .to(brush2, { opacity: 0.9, duration: 0.2 }, 1.6);

    // Subtitle + CTAs + Trust strip
    tl.fromTo(subtitle,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      1.5
    ).fromTo(ctas,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      1.65
    ).fromTo(trustStrip,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      1.8
    );

    // Safety net
    tl.call(() => {
      gsap.set(words, { opacity: 1, y: 0 });
    }, null, 2.0);

    // Skip button
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        tl.kill();
        showFinalState();
      });
    }

    // Runtime reduced-motion change listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      if (e.matches) {
        tl.kill();
        showFinalState();
      }
    });
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ---------- TRUST BAR COUNTERS ---------- */
  function initTrustCounters() {
    const numbers = document.querySelectorAll('.trust-number[data-target]');
    if (!numbers.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const useComma = el.dataset.format === 'comma';
      const duration = prefersReducedMotion ? 0 : 2000;
      const start = performance.now();

      const format = (n) => {
        const val = useComma ? n.toLocaleString('es-ES') : String(n);
        return `${prefix}${val}${suffix}`;
      };

      if (duration === 0) {
        el.textContent = format(target);
        return;
      }

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
        el.textContent = format(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    numbers.forEach(n => observer.observe(n));
  }

  /* ---------- BEFORE / AFTER COMPARATOR ---------- */
  function initBeforeAfter() {
    const container = document.getElementById('baContainer') || document.querySelector('#baWidget .ba-container');
    const beforeWrapper = document.getElementById('baBeforeWrapper');
    const handle = document.getElementById('baHandle');
    const rangeInput = document.getElementById('baRange');
    if (!container || !beforeWrapper || !handle) return;

    let dragging = false;

    const setPosition = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      beforeWrapper.style.width = clamped + '%';
      handle.style.left = clamped + '%';
      handle.setAttribute('aria-valuenow', Math.round(clamped));
      if (rangeInput) rangeInput.value = Math.round(clamped);
    };

    const percentFromEvent = (clientX) => {
      const rect = container.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    container.addEventListener('pointerdown', (e) => {
      dragging = true;
      container.classList.add('dragging');
      container.setPointerCapture(e.pointerId);
      setPosition(percentFromEvent(e.clientX));
    });

    container.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      e.preventDefault();
      setPosition(percentFromEvent(e.clientX));
    });

    const stopDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      container.classList.remove('dragging');
      try { container.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    container.addEventListener('pointerup', stopDrag);
    container.addEventListener('pointercancel', stopDrag);

    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(current - step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(current + step); }
      if (e.key === 'Home') { e.preventDefault(); setPosition(0); }
      if (e.key === 'End') { e.preventDefault(); setPosition(100); }
    });

    if (rangeInput) {
      rangeInput.addEventListener('input', () => setPosition(parseFloat(rangeInput.value)));
    }

    setPosition(50);
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track) return;

    const slides = track.querySelectorAll('.testimonial-card');
    const total = slides.length;
    if (total === 0) return;

    let current = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 6000;

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    };

    const goTo = (index) => {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
      resetAutoplay();
    };

    const goNext = () => goTo(current + 1);
    const goPrev = () => goTo(current - 1);

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    // Autoplay
    const startAutoplay = () => {
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
    };
    const stopAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause on hover/focus
    const carousel = track.closest('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', startAutoplay);
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
      startAutoplay();
    }, { passive: true });

    // Keyboard navigation within carousel
    if (carousel) {
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      });
    }

    startAutoplay();
  }

  /* ---------- M² STEPPER ---------- */
  function initStepper() {
    const input = document.getElementById('metros');
    if (!input) return;
    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 5000;

    document.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let val = parseInt(input.value, 10) || min;
        val += btn.dataset.action === 'inc' ? 5 : -5;
        input.value = Math.max(min, Math.min(max, val));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  }

  /* ---------- FORM → WHATSAPP SUBMISSION ---------- */
  function initForm() {
    const form = document.getElementById('calcForm');
    if (!form) return;

    const toastArea = document.getElementById('toastArea');

    const showToast = (msg, type = 'error') => {
      if (!toastArea) return;
      toastArea.innerHTML = '';
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = msg;
      toastArea.appendChild(toast);
      setTimeout(() => { toast.remove(); }, 5000);
    };

    const validateField = (el) => {
      let valid = true;
      el.classList.remove('input-error');

      if (el.type === 'checkbox') {
        if (el.hasAttribute('required') && !el.checked) valid = false;
      } else if (el.hasAttribute('required') && !el.value.trim()) {
        valid = false;
      }

      if (valid && el.id === 'telefono' && el.value.trim()) {
        valid = /^[0-9+\s()-]{9,15}$/.test(el.value.replace(/\s/g, ''));
      }
      if (valid && el.id === 'cp' && el.value.trim()) {
        valid = /^[0-9]{5}$/.test(el.value.trim());
      }

      if (!valid) el.classList.add('input-error');
      return valid;
    };

    // Live validation
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        if (el.classList.contains('input-error')) validateField(el);
      });
      el.addEventListener('blur', () => {
        if (el.value.trim() || el.type === 'checkbox') validateField(el);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const servicioEl = form.querySelector('input[name="servicio"]:checked');
      let allValid = true;
      let firstInvalid = null;

      // Validate service
      if (!servicioEl) {
        allValid = false;
        const pillGroup = form.querySelector('.pill-group');
        if (pillGroup && !firstInvalid) firstInvalid = pillGroup;
      }

      // Validate fields
      ['nombre', 'telefono', 'cp', 'rgpd', 'metros'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const ok = validateField(el);
          if (!ok) {
            allValid = false;
            if (!firstInvalid) firstInvalid = el;
          }
        }
      });

      if (!allValid) {
        showToast('Por favor, revisa los campos marcados en rojo.', 'error');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      // Build WhatsApp message
      const nombre = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const cp = document.getElementById('cp').value.trim();
      const m2 = document.getElementById('metros').value;
      const servicio = servicioEl ? servicioEl.value : 'General';

      const mensaje =
        `Hola Le&Ba 👋 Soy ${nombre}. Quiero presupuesto para ${servicio}, aprox ${m2}m² en CP ${cp}. Tel: ${telefono}. ¡Gracias!`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;

      window.open(url, '_blank', 'noopener,noreferrer');

      showToast('¡Redirigiendo a WhatsApp! Gracias por tu solicitud. 🎨', 'success');
      form.reset();
      document.querySelectorAll('.pill-option input').forEach(r => r.checked = false);
      document.querySelectorAll('.field-input').forEach(f => f.classList.remove('input-error'));
    });
  }

})();