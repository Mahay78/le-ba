/* ==========================================================================
   LE&BA — Pintores Profesionales | app.js v2.0.0 PREMIUM
   GSAP Hero + Scroll Reveal + Testimonial Carousel + Comparator + Counters + Form
   ========================================================================== */
'use strict';

(function () {
  const WA_NUMBER = '34600123456';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function safeInit(name, fn) {
    try { fn(); } catch (e) { console.error(`[Le&Ba] ${name} failed:`, e); }
  }

  function init() {
    safeInit('header', initHeader);
    safeInit('mobileNav', initMobileNav);
    safeInit('smoothScroll', initSmoothScroll);
    safeInit('heroAnimation', initHeroAnimation);
    safeInit('scrollReveal', initScrollReveal);
    safeInit('trustCounters', initTrustCounters);
    safeInit('beforeAfter', initBeforeAfter);
    safeInit('testimonialCarousel', initTestimonialCarousel);
    safeInit('stepper', initStepper);
    safeInit('liveCalculator', initLiveCalculator);
    safeInit('serviceCardTriggers', initServiceCardTriggers);
    safeInit('mobileActionBar', initMobileActionBar);
    safeInit('socialProofToast', initSocialProofToast);
    safeInit('form', initForm);
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
        // Update URL without polluting back-button history
        history.replaceState(null, '', targetId);
      });
    });

    // Desplazamiento inicial si se carga la página con un hash (#servicios, #calculadora, etc.)
    if (window.location.hash) {
      const initTarget = document.querySelector(window.location.hash);
      if (initTarget) {
        setTimeout(() => {
          const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 76;
          const elementPosition = initTarget.getBoundingClientRect().top;
          window.scrollTo({
            top: elementPosition + window.pageYOffset - headerOffset - 16,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }, 50);
      }
    }
  }

  /* ---------- HERO ANIMATION: LAS DOS BROCHAS PINTAN EL FONDO (JS NATIVO 60FPS) ---------- */
  function initHeroAnimation() {
    window.__lebaIntro = true;
    const hero = document.getElementById('hero');
    const paintContainer = document.getElementById('heroPaint');
    const skipBtn = document.getElementById('skip-intro');
    const root = document.documentElement;

    if (!hero) {
      root.classList.remove('intro-playing');
      root.classList.add('intro-done');
      return;
    }

    const words = Array.from(hero.querySelectorAll('.hero-word'));

    const finishIntro = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
      words.forEach(w => w.classList.add('painted'));
      root.classList.add('intro-settled');
      root.classList.remove('intro-playing');
      root.classList.add('intro-done');
      if (paintContainer) {
        paintContainer.style.transition = 'opacity 0.35s ease';
        paintContainer.style.opacity = '0';
        setTimeout(() => { paintContainer.innerHTML = ''; }, 380);
      }
    };

    if (prefersReducedMotion || !paintContainer) {
      finishIntro();
      return;
    }

    const canvas = document.createElement('canvas');
    paintContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      finishIntro();
      return;
    }

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Ilustración vectorial de la brocha Le&Ba (madera noble, virola metálica, cerdas cargadas de pintura fresca)
    function drawBrush(ctx, x, y, angle, paintColor, scale) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 10;

      // Mango ergonómico de madera de haya
      const woodGrad = ctx.createLinearGradient(-6, -82, 6, -82);
      woodGrad.addColorStop(0, '#B8824A');
      woodGrad.addColorStop(0.3, '#E2B27D');
      woodGrad.addColorStop(0.7, '#D49B60');
      woodGrad.addColorStop(1, '#966532');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(-6, -82, 12, 56, [5, 5, 2, 2]);
      ctx.fill();

      // Virola de acero inoxidable cepillado con reflejos
      const ferruleGrad = ctx.createLinearGradient(-11, -26, 11, -26);
      ferruleGrad.addColorStop(0, '#888888');
      ferruleGrad.addColorStop(0.25, '#E2E2E2');
      ferruleGrad.addColorStop(0.5, '#F8F8F8');
      ferruleGrad.addColorStop(0.75, '#B4B4B4');
      ferruleGrad.addColorStop(1, '#707070');
      ctx.fillStyle = ferruleGrad;
      ctx.beginPath();
      ctx.roundRect(-11, -26, 22, 16, 2);
      ctx.fill();

      // Remaches y marcas de prensado de la virola
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-11, -20); ctx.lineTo(11, -20);
      ctx.moveTo(-11, -15); ctx.lineTo(11, -15);
      ctx.stroke();

      // Cerdas saturadas de pintura densa
      ctx.fillStyle = paintColor;
      ctx.beginPath();
      ctx.moveTo(-11, -10);
      ctx.lineTo(-11, 16);
      ctx.bezierCurveTo(-11, 26, -5, 30, 0, 31);
      ctx.bezierCurveTo(5, 30, 11, 26, 11, 16);
      ctx.lineTo(11, -10);
      ctx.closePath();
      ctx.fill();

      // Brillo especular de pintura fresca y húmeda
      const sheen = ctx.createLinearGradient(-10, 0, 10, 0);
      sheen.addColorStop(0, 'rgba(255,255,255,0)');
      sheen.addColorStop(0.4, 'rgba(255,255,255,0.4)');
      sheen.addColorStop(0.6, 'rgba(255,255,255,0.1)');
      sheen.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = sheen;
      ctx.fill();

      // Textura individual de cerdas de pintor
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 0.8;
      for (let i = -8; i <= 8; i += 2.8) {
        ctx.beginPath();
        ctx.moveTo(i, -9);
        ctx.lineTo(i * 0.9, 22);
        ctx.stroke();
      }

      ctx.restore();
    }

    function getBezierPoint(p0, p1, p2, p3, t) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      return {
        x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
        y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y
      };
    }

    const DURATION = 1950; // ms
    const startTime = performance.now();
    let animId = null;

    function render(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);

      ctx.clearRect(0, 0, width, height);

      // Trazo 1 (Brocha Le — Teal profundo): diagonal superior barriendo hacia el centro
      const b1P0 = { x: -80, y: -60 };
      const b1P1 = { x: width * 0.32, y: height * 0.12 };
      const b1P2 = { x: width * 0.62, y: height * 0.44 };
      const b1P3 = { x: width * 0.84, y: height * 0.38 };

      // Trazo 2 (Brocha Ba — Oro cálido): diagonal inferior barriendo hacia el centro
      const b2P0 = { x: width + 80, y: height + 60 };
      const b2P1 = { x: width * 0.72, y: height * 0.82 };
      const b2P2 = { x: width * 0.34, y: height * 0.64 };
      const b2P3 = { x: width * 0.84, y: height * 0.38 };

      // Capa de pared sin pintar que las brochas van cubriendo
      if (t < 0.96) {
        ctx.save();
        // Pared de yeso cálido sin pintar
        ctx.fillStyle = '#ECEAE4';
        ctx.fillRect(0, 0, width, height);

        // Textura fina de pared
        ctx.fillStyle = 'rgba(0, 0, 0, 0.016)';
        for (let y = 0; y < height; y += 32) {
          ctx.fillRect(0, y, width, 1);
        }

        // Modo recorte: la pasada de las brochas revela el fondo impecable de Le&Ba
        ctx.globalCompositeOperation = 'destination-out';

        // Recorte Brocha 1 (Le)
        const p1T = Math.min(1, t / 0.74);
        if (p1T > 0) {
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const strokeWidth1 = Math.min(width * 1.3, height * 0.65 * (1 + p1T * 1.8));
          ctx.lineWidth = strokeWidth1;
          ctx.moveTo(b1P0.x, b1P0.y);
          const steps = 36;
          for (let i = 1; i <= Math.floor(steps * p1T); i++) {
            const pt = getBezierPoint(b1P0, b1P1, b1P2, b1P3, i / steps);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Recorte Brocha 2 (Ba)
        const p2T = Math.max(0, Math.min(1, (t - 0.1) / 0.74));
        if (p2T > 0) {
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const strokeWidth2 = Math.min(width * 1.3, height * 0.70 * (1 + p2T * 1.8));
          ctx.lineWidth = strokeWidth2;
          ctx.moveTo(b2P0.x, b2P0.y);
          const steps = 36;
          for (let i = 1; i <= Math.floor(steps * p2T); i++) {
            const pt = getBezierPoint(b2P0, b2P1, b2P2, b2P3, i / steps);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        ctx.restore();
      }

      // Renderizado dinámico de las dos brochas
      const brushScale = width < 600 ? 1.4 : 1.95;
      if (t < 0.96) {
        // Brocha 1 (Le - Teal)
        const p1T = Math.min(1, t / 0.74);
        if (p1T < 1) {
          const pt1 = getBezierPoint(b1P0, b1P1, b1P2, b1P3, p1T);
          const pt1Next = getBezierPoint(b1P0, b1P1, b1P2, b1P3, Math.min(1, p1T + 0.02));
          const angle1 = Math.atan2(pt1Next.y - pt1.y, pt1Next.x - pt1.x) - Math.PI / 2;
          drawBrush(ctx, pt1.x, pt1.y, angle1, '#0F4C5C', brushScale);
        }

        // Brocha 2 (Ba - Ámbar)
        const p2T = Math.max(0, Math.min(1, (t - 0.1) / 0.74));
        if (p2T > 0 && p2T < 1) {
          const pt2 = getBezierPoint(b2P0, b2P1, b2P2, b2P3, p2T);
          const pt2Next = getBezierPoint(b2P0, b2P1, b2P2, b2P3, Math.min(1, p2T + 0.02));
          const angle2 = Math.atan2(pt2Next.y - pt2.y, pt2Next.x - pt2.x) - Math.PI / 2;
          drawBrush(ctx, pt2.x, pt2.y, angle2, '#F4A300', brushScale);
        }

        // Clímax: las dos brochas se cruzan al final formando el emblema de Le&Ba
        if (t >= 0.74 && t < 0.95) {
          const crossT = (t - 0.74) / 0.21;
          const crossOpacity = crossT < 0.7 ? 1 : (1 - (crossT - 0.7) / 0.3);
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, crossOpacity));
          const crossX = width * 0.84;
          const crossY = height * 0.38;

          // Brocha Le (inclinada -38°)
          drawBrush(ctx, crossX - 12, crossY, -0.66, '#0F4C5C', brushScale * 1.05);
          // Brocha Ba (inclinada +38°)
          drawBrush(ctx, crossX + 12, crossY, 0.66, '#F4A300', brushScale * 1.05);

          // Pincelada dorada arqueada debajo de las brochas (el trazo del logo)
          ctx.strokeStyle = '#F4A300';
          ctx.lineWidth = 4 * brushScale;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(244, 163, 0, 0.6)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(crossX, crossY + 44, 38, Math.PI * 0.2, Math.PI * 0.8, false);
          ctx.stroke();

          ctx.restore();
        }
      }

      // Revelado rítmico de palabras según avanza la pintura
      const wordProgress = Math.min(1, Math.max(0, (t - 0.15) / 0.65));
      const wordIdx = Math.floor(wordProgress * (words.length + 1));
      words.forEach((w, i) => {
        if (i < wordIdx) w.classList.add('painted');
      });

      // Al 80% de pintura entran el subtítulo, badges y botones
      if (t >= 0.8) {
        root.classList.add('intro-settled');
      }

      if (t < 1) {
        animId = requestAnimationFrame(render);
      } else {
        finishIntro();
      }
    }

    // Soporte para captura estática de frames en pruebas automatizadas (?intro=0.4)
    const urlParams = new URLSearchParams(window.location.search);
    const staticT = urlParams.get('intro');
    if (staticT !== null) {
      render(startTime + Math.max(0, Math.min(1, parseFloat(staticT))) * DURATION);
      return;
    }

    animId = requestAnimationFrame(render);

    // Controles para saltar
    if (skipBtn) skipBtn.addEventListener('click', finishIntro);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && root.classList.contains('intro-playing')) finishIntro();
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40 && root.classList.contains('intro-playing')) finishIntro();
    }, { passive: true, once: true });

    // En caso de cambio a reduced motion en runtime
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      if (e.matches) finishIntro();
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
      beforeWrapper.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
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
    const min = parseInt(input.min, 10) || 10;
    const max = parseInt(input.max, 10) || 5000;

    document.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let val = parseInt(input.value, 10) || min;
        val += btn.dataset.action === 'inc' ? 5 : -5;
        input.value = Math.max(min, Math.min(max, val));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  /* ---------- LIVE PRICE ESTIMATOR ---------- */
  const SERVICE_RATES = {
    'Interior': { min: 8, max: 12, label: 'Pintura Interior' },
    'Exterior': { min: 10, max: 15, label: 'Pintura Exterior & Fachadas' },
    'Lacado': { min: 14, max: 22, label: 'Lacado Puertas y Muebles' },
    'Empapelado': { min: 12, max: 18, label: 'Empapelado Decorativo' },
    'Alisado/Gotelé': { min: 7, max: 11, label: 'Alisado de Gotelé y Paredes' },
    'Impermeabilización': { min: 16, max: 26, label: 'Impermeabilización de Azoteas' }
  };

  function updateLiveEstimate() {
    const priceEl = document.getElementById('estimatePrice');
    const labelEl = document.getElementById('estimateServiceName');
    if (!priceEl || !labelEl) return;

    const checkedRadio = document.querySelector('input[name="servicio"]:checked');
    const serviceKey = checkedRadio ? checkedRadio.value : 'Interior';
    const rate = SERVICE_RATES[serviceKey] || SERVICE_RATES['Interior'];

    const metrosInput = document.getElementById('metros');
    let m2 = metrosInput ? parseInt(metrosInput.value, 10) : 50;
    if (isNaN(m2) || m2 < 10) m2 = 10;
    if (m2 > 5000) m2 = 5000;

    const minTotal = Math.round(m2 * rate.min);
    const maxTotal = Math.round(m2 * rate.max);

    priceEl.textContent = `${minTotal.toLocaleString('es-ES')} € – ${maxTotal.toLocaleString('es-ES')} €`;
    labelEl.textContent = `${rate.label} (${m2} m²)`;

    priceEl.classList.remove('pop');
    void priceEl.offsetWidth; // Force CSS reflow to replay animation
    priceEl.classList.add('pop');
    setTimeout(() => priceEl.classList.remove('pop'), 220);
  }

  function initLiveCalculator() {
    const form = document.getElementById('calcForm');
    if (!form) return;

    form.querySelectorAll('input[name="servicio"]').forEach(radio => {
      radio.addEventListener('change', updateLiveEstimate);
    });

    const metrosInput = document.getElementById('metros');
    if (metrosInput) {
      metrosInput.addEventListener('input', updateLiveEstimate);
      metrosInput.addEventListener('change', updateLiveEstimate);
    }

    updateLiveEstimate();
  }

  /* ---------- SERVICE CARD TRIGGERS ---------- */
  function selectServiceAndScroll(serviceKey) {
    const radio = document.querySelector(`input[name="servicio"][value="${serviceKey}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    updateLiveEstimate();

    const calc = document.getElementById('calculadora');
    if (calc) {
      const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 76;
      const elementPosition = calc.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 16;
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }

  function initServiceCardTriggers() {
    document.querySelectorAll('.service-card[data-service-trigger]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-action-link')) return; // handled by link
        const service = card.dataset.serviceTrigger;
        selectServiceAndScroll(service);
      });
    });

    document.querySelectorAll('.card-action-link[data-select-service]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const service = link.dataset.selectService;
        selectServiceAndScroll(service);
      });
    });
  }

  /* ---------- FORM → WHATSAPP SUBMISSION ---------- */
  /* ---------- MOBILE STICKY ACTION BAR ---------- */
  function initMobileActionBar() {
    const bar = document.getElementById('mobileActionBar');
    if (!bar) return;
    // Solo visible en móvil (<768px)
    const mq = window.matchMedia('(max-width: 767px)');
    const updateVisibility = () => {
      if (mq.matches && window.scrollY > 300) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { updateVisibility(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    mq.addEventListener('change', updateVisibility);
    updateVisibility();
  }

  /* ---------- SOCIAL PROOF TOAST ---------- */
  function initSocialProofToast() {
    const toast = document.getElementById('socialProofToast');
    const avatarEl = document.getElementById('spAvatar');
    const messageEl = document.getElementById('spMessage');
    const timeEl = document.getElementById('spTime');
    const closeBtn = document.getElementById('spClose');
    if (!toast || !messageEl) return;

    const notifications = [
      { initials: 'MG', name: 'María G.', zone: 'Chamberí, Madrid', action: 'pidió presupuesto de pintura interior', ago: 'hace 3 min' },
      { initials: 'CR', name: 'Carlos R.', zone: 'Salamanca, Madrid', action: 'contrató alisado + pintura', ago: 'hace 12 min' },
      { initials: 'AF', name: 'Ana F.', zone: 'Pozuelo de Alarcón', action: 'solicitó lacado de puertas', ago: 'hace 25 min' },
      { initials: 'JP', name: 'Javier P.', zone: 'Getafe, Madrid', action: 'pidió impermeabilización terraza', ago: 'hace 41 min' },
      { initials: 'LS', name: 'Laura S.', zone: 'Las Rozas, Madrid', action: 'reservó visita gratuita', ago: 'hace 58 min' },
      { initials: 'DM', name: 'David M.', zone: 'Alcobendas, Madrid', action: 'contrató pintura exterior fachada', ago: 'hace 1 h' },
      { initials: 'PR', name: 'Paula R.', zone: 'Majadahonda, Madrid', action: 'pidió empapelado decorativo', ago: 'hace 2 h' },
      { initials: 'JT', name: 'Jorge T.', zone: 'Rivas-Vaciamadrid', action: 'solicitó presupuesto completo piso', ago: 'hace 3 h' },
    ];

    let idx = 0;
    let dismissed = sessionStorage.getItem('leba_sp_dismissed') === 'true';
    let hideTimer = null;

    const show = () => {
      if (dismissed) return;
      const n = notifications[idx % notifications.length];
      if (avatarEl) avatarEl.textContent = n.initials;
      messageEl.innerHTML = `<strong>${n.name}</strong> (${n.zone}) ${n.action}`;
      if (timeEl) timeEl.textContent = n.ago;
      toast.classList.add('visible');

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        toast.classList.remove('visible');
        idx++;
        // Rotar cada 12-18s aleatorio
        const nextDelay = 12000 + Math.random() * 6000;
        setTimeout(show, nextDelay);
      }, 5000);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dismissed = true;
        sessionStorage.setItem('leba_sp_dismissed', 'true');
        toast.classList.remove('visible');
        clearTimeout(hideTimer);
      });
    }

    // Primera aparición a los 8 segundos tras cargar
    setTimeout(show, 8000);
  }

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

      // Build WhatsApp message tailored to Lanzarote
      const nombre = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const cp = document.getElementById('cp').value.trim();
      const m2 = document.getElementById('metros').value;
      const servicio = servicioEl ? servicioEl.value : 'Pintura';
      const estimateText = document.getElementById('estimatePrice')?.textContent || '';

      const mensaje =
        `Hola Le&Ba Lanzarote 👋 Soy ${nombre}. Solicito presupuesto para ${servicio}, aprox ${m2}m² en Lanzarote (CP ${cp}). Estimación web orientativa: ${estimateText}. Mi teléfono: ${telefono}. ¡Muchas gracias!`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;

      window.open(url, '_blank', 'noopener,noreferrer');

      showToast('¡Redirigiendo a WhatsApp! Gracias por contactar con Le&Ba Lanzarote. 🎨', 'success');
      form.reset();
      // Restore default service and CP for Lanzarote
      const defRadio = form.querySelector('input[name="servicio"][value="Interior"]');
      if (defRadio) defRadio.checked = true;
      const cpField = document.getElementById('cp');
      if (cpField) cpField.value = '35500';
      const m2Field = document.getElementById('metros');
      if (m2Field) m2Field.value = '50';
      updateLiveEstimate();
      document.querySelectorAll('.field-input').forEach(f => f.classList.remove('input-error'));
    });
  }

})();