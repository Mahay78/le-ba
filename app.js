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
    safeInit('colorVisualizer', initColorVisualizer);
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

      let colorInfo = '';
      if (window.__lebaSelectedColor) {
        colorInfo = `\n🎨 Color elegido en el simulador: ${window.__lebaSelectedColor.name} (${window.__lebaSelectedColor.hex}) — Estancia: ${window.__lebaSelectedColor.room} — Acabado: ${window.__lebaSelectedColor.finish}.`;
      }

      const mensaje =
        `Hola Le&Ba Lanzarote 👋 Soy ${nombre}. Solicito presupuesto para ${servicio}, aprox ${m2}m² en Lanzarote (CP ${cp}). Estimación web orientativa: ${estimateText}.${colorInfo}\nMi teléfono: ${telefono}. ¡Muchas gracias!`;

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
      const banner = document.getElementById('calcColorBanner');
      if (banner) banner.hidden = true;
      window.__lebaSelectedColor = null;
      updateLiveEstimate();
      document.querySelectorAll('.field-input').forEach(f => f.classList.remove('input-error'));
    });
  }

  /* ---------- SIMULADOR INTERACTIVO DE COLOR DE PAREDES ---------- */
  function initColorVisualizer() {
    const section = document.getElementById('simulador');
    if (!section) return;

    // 1. Data Models
    const PALETTES = {
      lanzarote: [
        { name: 'Terracota Yaiza', hex: '#B56247', tag: 'Tierra', desc: 'Tierra cálida inspirada en los tonos rojizos del Parque Nacional de Timanfaya. Aporta personalidad, luminosidad y calidez acogedora.', finish: 'Mate Sedoso' },
        { name: 'Verde Manrique', hex: '#5A7563', tag: 'Botánico', desc: 'Verde atemporal característico de la carpintería tradicional de Lanzarote. Sereno, natural y en perfecta armonía.', finish: 'Mate Sedoso' },
        { name: 'Azul Atlántico', hex: '#2B5B75', tag: 'Profundo', desc: 'Azul océano profundo con matices minerales, ideal para dormitorios y salones relajantes con marcada personalidad.', finish: 'Mate Sedoso' },
        { name: 'Arena de Papagayo', hex: '#DFD0B8', tag: 'Cálido', desc: 'Beige suave y cálido inspirado en las calas vírgenes del sur. Crea una sensación de amplitud y sosiego.', finish: 'Mate Sedoso' },
        { name: 'Blanco Cal Lanzarote', hex: '#F7F7F2', tag: 'Puro', desc: 'El blanco tradicional conejero. Máxima pureza lumínica para multiplicar el sol natural en toda la estancia.', finish: 'Mate Sedoso' },
        { name: 'Ceniza Timanfaya', hex: '#4E5357', tag: 'Volcánico', desc: 'Gris volcánico profundo, el contraste contemporáneo perfecto para destacar una pared de acento elegante.', finish: 'Mate Sedoso' }
      ],
      tendencias: [
        { name: 'Verde Salvia', hex: '#A5B6A3', tag: 'Tendencia', desc: 'Verde suave empolvado, aporta frescura botánica y descanso visual. La mayor tendencia en decoración de interiores.', finish: 'Mate Sedoso' },
        { name: 'Lino Natural', hex: '#E5DDD0', tag: 'Orgánico', desc: 'Tono orgánico neutro que viste las paredes con suave calidez sin recargar visualmente el espacio.', finish: 'Mate Sedoso' },
        { name: 'Gris Niebla Suave', hex: '#D2D6D6', tag: 'Moderno', desc: 'Neutro contemporáneo muy luminoso y versátil, combina con maderas nobles, fibras naturales y suelos claros.', finish: 'Mate Sedoso' },
        { name: 'Rosa Empolvado', hex: '#D7BCB5', tag: 'Elegante', desc: 'Neutro empolvado sofisticado, crea atmósferas envolventes, íntimas y con un toque cálido inigualable.', finish: 'Mate Sedoso' },
        { name: 'Mostaza Cálido', hex: '#D3A248', tag: 'Vital', desc: 'Acento alegre y optimista, perfecto para iluminar comedores, recibidores o una pared especial.', finish: 'Mate Sedoso' },
        { name: 'Bruma Marina', hex: '#7B97A5', tag: 'Costero', desc: 'Azul grisáceo suave y relajante, evoca la serenidad de los amaneceres en la costa atlántica de Lanzarote.', finish: 'Mate Sedoso' }
      ]
    };

    const ROOM_PRESETS = {
      dormitorio: {
        name: 'Dormitorio Principal',
        img: 'img/dormitorio.jpg',
        hasZones: true,
        zones: {
          accent: 'img/mask_dormitorio_accent.png',
          side: 'img/mask_dormitorio_side.png',
          all: 'img/mask_dormitorio_all.png'
        },
        defaultZone: 'accent',
        defaultColor: PALETTES.lanzarote[0], // Terracota Yaiza
        service: 'Interior'
      },
      salon: {
        name: 'Salón Nórdico',
        img: 'img/despues.jpg',
        hasZones: false,
        zones: {
          all: 'img/mask_salon.png'
        },
        defaultZone: 'all',
        defaultColor: PALETTES.lanzarote[1], // Verde Manrique
        service: 'Interior'
      },
      fachada: {
        name: 'Fachada Lanzarote',
        img: 'img/fachada.jpg',
        hasZones: false,
        zones: {
          all: 'img/mask_fachada.png'
        },
        defaultZone: 'all',
        defaultColor: PALETTES.lanzarote[3], // Arena de Papagayo
        service: 'Exterior'
      }
    };

    // 2. DOM Elements
    const baseImg = document.getElementById('visBaseImg');
    const tintLayer = document.getElementById('visTintLayer');
    const customCanvas = document.getElementById('visCustomCanvas');
    const zoneBar = document.getElementById('visZoneBar');
    const zoneBtns = section.querySelectorAll('.vis-zone-btn');
    const roomTabs = section.querySelectorAll('.vis-tab');
    const palTabs = section.querySelectorAll('.vis-pal-tab');
    const swatchesGrid = document.getElementById('visSwatchesGrid');
    const customColorRow = document.getElementById('visCustomColorRow');
    const colorPicker = document.getElementById('visColorPicker');
    const hexInput = document.getElementById('visHexInput');
    const finishChips = section.querySelectorAll('.vis-finish-chip');
    const badgeDot = document.getElementById('visBadgeDot');
    const badgeName = document.getElementById('visBadgeName');
    const badgeHex = document.getElementById('visBadgeHex');
    const summaryTitle = document.getElementById('visSummaryTitle');
    const summaryCode = document.getElementById('visSummaryCode');
    const summaryDesc = document.getElementById('visSummaryDesc');
    const ctaPreview = document.getElementById('visCtaPreview');
    const btnCompare = document.getElementById('visBtnCompare');
    const btnDownload = document.getElementById('visBtnDownload');
    const btnApplyToQuote = document.getElementById('visBtnApplyToQuote');
    const btnWhatsAppColor = document.getElementById('visBtnWhatsAppColor');
    const uploadOverlay = document.getElementById('visUploadOverlay');
    const fileInput = document.getElementById('visFileInput');
    const customTools = document.getElementById('visCustomTools');
    const undoBtn = document.getElementById('visCustomUndo');
    const clearBtn = document.getElementById('visCustomClear');

    // 3. State
    let currentRoom = 'dormitorio';
    let currentZone = 'accent';
    let currentPalette = 'lanzarote';
    let currentColor = { ...PALETTES.lanzarote[0] };
    let currentFinish = 'Mate Sedoso';
    let isOriginalVisible = false;

    // Custom Canvas State (User uploaded photo)
    let customCtx = null;
    let customImgObj = null;
    let customTool = 'magic'; // 'magic' | 'brush' | 'eraser'
    let isDrawing = false;
    const customHistory = [];
    const MAX_HISTORY = 8;

    // Global selected color for calculator & WhatsApp
    function updateGlobalSelection() {
      window.__lebaSelectedColor = {
        name: currentColor.name,
        hex: currentColor.hex,
        room: currentRoom === 'custom' ? 'Foto de mi estancia' : ROOM_PRESETS[currentRoom].name,
        zone: currentZone,
        finish: currentFinish,
        service: currentRoom === 'custom' ? 'Interior' : ROOM_PRESETS[currentRoom].service
      };
    }

    // 4. Render Swatches
    function renderSwatches() {
      if (!swatchesGrid) return;
      swatchesGrid.innerHTML = '';
      if (currentPalette === 'custom') {
        if (customColorRow) customColorRow.hidden = false;
        swatchesGrid.hidden = true;
        return;
      }

      if (customColorRow) customColorRow.hidden = true;
      swatchesGrid.hidden = false;

      const colors = PALETTES[currentPalette] || [];
      colors.forEach(col => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `vis-swatch ${col.hex.toLowerCase() === currentColor.hex.toLowerCase() ? 'active' : ''}`;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', col.hex.toLowerCase() === currentColor.hex.toLowerCase() ? 'true' : 'false');
        btn.innerHTML = `
          <span class="vis-swatch-circle" style="background-color: ${col.hex};"></span>
          <span class="vis-swatch-info">
            <strong class="vis-swatch-name">${col.name}</strong>
            <span class="vis-swatch-code">${col.hex} · ${col.tag}</span>
          </span>
        `;
        btn.addEventListener('click', () => {
          applyColor(col);
        });
        swatchesGrid.appendChild(btn);
      });
    }

    // 5. Apply Color to Views
    function applyColor(col) {
      currentColor = { ...col };
      if (!currentColor.finish) currentColor.finish = currentFinish;

      // Update Tint Layer for Presets
      if (tintLayer && currentRoom !== 'custom') {
        tintLayer.style.backgroundColor = currentColor.hex;
      }

      // Update Badges & Cards
      if (badgeDot) badgeDot.style.backgroundColor = currentColor.hex;
      if (badgeName) badgeName.textContent = currentColor.name;
      if (badgeHex) badgeHex.textContent = currentColor.hex;
      if (ctaPreview) ctaPreview.style.backgroundColor = currentColor.hex;
      if (summaryTitle) summaryTitle.textContent = currentColor.name;
      if (summaryCode) {
        const catLabel = currentPalette === 'lanzarote' ? 'Colección Lanzarote' : (currentPalette === 'tendencias' ? 'Colección Tendencias' : 'Color Personalizado');
        summaryCode.textContent = `${currentColor.hex} · ${catLabel}`;
      }
      if (summaryDesc) {
        summaryDesc.textContent = currentColor.desc || 'Color seleccionado para simulación en vivo.';
      }

      // Update Pickers
      if (colorPicker) colorPicker.value = currentColor.hex;
      if (hexInput) hexInput.value = currentColor.hex;

      // Update active swatch highlight
      section.querySelectorAll('.vis-swatch').forEach(s => {
        const code = s.querySelector('.vis-swatch-code')?.textContent || '';
        const match = code.toUpperCase().includes(currentColor.hex.toUpperCase());
        s.classList.toggle('active', match);
        s.setAttribute('aria-checked', match ? 'true' : 'false');
      });

      // Update WhatsApp direct button
      if (btnWhatsAppColor) {
        const roomName = currentRoom === 'custom' ? 'mi pared' : ROOM_PRESETS[currentRoom].name;
        const msg = `Hola Le&Ba Lanzarote 👋 He estado probando vuestro Simulador de Color y me interesa el tono ${currentColor.name} (${currentColor.hex}) en acabado ${currentFinish} para ${roomName}. ¿Podéis asesorarme o darme presupuesto?`;
        btnWhatsAppColor.href = `https://wa.me/34600123456?text=${encodeURIComponent(msg)}`;
      }

      updateGlobalSelection();
    }

    // 6. Apply Room Preset
    function applyRoom(roomKey) {
      currentRoom = roomKey;

      roomTabs.forEach(t => {
        const isActive = t.dataset.room === roomKey;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (roomKey === 'custom') {
        // Mode: user custom upload
        if (baseImg) baseImg.hidden = true;
        if (tintLayer) tintLayer.hidden = true;
        if (zoneBar) zoneBar.hidden = true;
        if (customCanvas) customCanvas.hidden = false;

        if (!customImgObj) {
          if (uploadOverlay) uploadOverlay.hidden = false;
          if (customTools) customTools.hidden = true;
        } else {
          if (uploadOverlay) uploadOverlay.hidden = true;
          if (customTools) customTools.hidden = false;
        }
        updateGlobalSelection();
        return;
      }

      // Mode: Preset
      if (baseImg) baseImg.hidden = false;
      if (tintLayer) tintLayer.hidden = false;
      if (customCanvas) customCanvas.hidden = true;
      if (uploadOverlay) uploadOverlay.hidden = true;
      if (customTools) customTools.hidden = true;

      const preset = ROOM_PRESETS[roomKey];
      if (!preset) return;

      if (baseImg) {
        baseImg.src = preset.img;
        baseImg.alt = `${preset.name} - Le&Ba Pintores`;
      }

      // Zone bar visibility
      if (preset.hasZones) {
        if (zoneBar) zoneBar.hidden = false;
        currentZone = preset.defaultZone || 'accent';
        zoneBtns.forEach(zb => zb.classList.toggle('active', zb.dataset.zone === currentZone));
      } else {
        if (zoneBar) zoneBar.hidden = true;
        currentZone = 'all';
      }

      updateMask();
      updateGlobalSelection();
    }

    // 7. Update Mask URL
    function updateMask() {
      const preset = ROOM_PRESETS[currentRoom];
      if (!preset || !tintLayer) return;

      const maskUrl = preset.zones[currentZone] || preset.zones.all;
      if (maskUrl) {
        tintLayer.style.webkitMaskImage = `url("${maskUrl}")`;
        tintLayer.style.maskImage = `url("${maskUrl}")`;
      }
    }

    // 8. Compare Button (toggle original)
    function toggleOriginal(showOrig) {
      isOriginalVisible = typeof showOrig === 'boolean' ? showOrig : !isOriginalVisible;
      if (tintLayer) {
        tintLayer.style.opacity = isOriginalVisible ? '0' : '0.95';
      }
      if (btnCompare) {
        btnCompare.style.background = isOriginalVisible ? 'var(--color-accent)' : '';
        btnCompare.style.color = isOriginalVisible ? '#000' : '';
      }
    }

    btnCompare?.addEventListener('click', () => toggleOriginal());
    btnCompare?.addEventListener('mousedown', () => toggleOriginal(true));
    btnCompare?.addEventListener('mouseup', () => toggleOriginal(false));
    btnCompare?.addEventListener('touchstart', (e) => { e.preventDefault(); toggleOriginal(true); }, { passive: false });
    btnCompare?.addEventListener('touchend', () => toggleOriginal(false));

    // 9. Zone Selection
    zoneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        zoneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentZone = btn.dataset.zone;
        updateMask();
        updateGlobalSelection();
      });
    });

    // 10. Room Tabs
    roomTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        applyRoom(tab.dataset.room);
      });
    });

    // 11. Palette Tabs
    palTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        palTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentPalette = tab.dataset.palette;
        renderSwatches();
      });
    });

    // 12. Custom Color Picker & Hex Input
    colorPicker?.addEventListener('input', (e) => {
      const hex = e.target.value.toUpperCase();
      if (hexInput) hexInput.value = hex;
      applyColor({
        name: `Tono Personalizado`,
        hex: hex,
        tag: 'RAL/NCS',
        desc: `Color personalizado ${hex} seleccionado libremente en el simulador.`,
        finish: currentFinish
      });
    });

    hexInput?.addEventListener('change', (e) => {
      let hex = e.target.value.trim().toUpperCase();
      if (!hex.startsWith('#')) hex = '#' + hex;
      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        if (colorPicker) colorPicker.value = hex;
        applyColor({
          name: `Tono Personalizado`,
          hex: hex,
          tag: 'RAL/NCS',
          desc: `Color personalizado ${hex} seleccionado libremente en el simulador.`,
          finish: currentFinish
        });
      }
    });

    // 13. Finish Options
    finishChips.forEach(chip => {
      chip.addEventListener('click', () => {
        finishChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const input = chip.querySelector('input');
        if (input) {
          input.checked = true;
          currentFinish = input.value;
          updateGlobalSelection();
        }
      });
    });

    // 14. Apply To Quote Button
    btnApplyToQuote?.addEventListener('click', () => {
      updateGlobalSelection();

      // Update Calculator Banner
      const banner = document.getElementById('calcColorBanner');
      const bannerChip = document.getElementById('calcColorChip');
      const bannerName = document.getElementById('calcColorBannerName');
      const bannerDetail = document.getElementById('calcColorBannerDetail');

      if (banner && bannerChip && bannerName && bannerDetail) {
        banner.hidden = false;
        bannerChip.style.backgroundColor = currentColor.hex;
        bannerName.textContent = `${currentColor.name} (${currentColor.hex})`;
        const roomTitle = currentRoom === 'custom' ? 'Foto propia' : ROOM_PRESETS[currentRoom].name;
        bannerDetail.textContent = `en ${roomTitle} · Acabado ${currentFinish}`;
      }

      // Pre-select service in calculator
      const serviceValue = currentRoom === 'fachada' ? 'Exterior' : 'Interior';
      const serviceRadio = document.querySelector(`input[name="servicio"][value="${serviceValue}"]`);
      if (serviceRadio) {
        serviceRadio.checked = true;
        // Trigger live estimate recalculation
        if (typeof updateLiveEstimate === 'function') updateLiveEstimate();
      }

      // Smooth scroll to calculator
      const calcSection = document.getElementById('calculadora');
      if (calcSection) {
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 76;
        const top = calcSection.getBoundingClientRect().top + window.pageYOffset - headerOffset - 16;
        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }

      showToast(`¡Color ${currentColor.name} añadido a tu estimación! 🎨`, 'success');
    });

    // Calculator Color Banner Remove button
    const bannerRemoveBtn = document.getElementById('calcColorBannerRemove');
    bannerRemoveBtn?.addEventListener('click', () => {
      const banner = document.getElementById('calcColorBanner');
      if (banner) banner.hidden = true;
      window.__lebaSelectedColor = null;
      showToast('Selección de color retirada del presupuesto.', 'info');
    });

    // 15. Download Design Feature (Canvas Export)
    btnDownload?.addEventListener('click', async () => {
      try {
        showToast('Generando imagen de tu diseño...', 'info');

        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        const W = 1600;
        const H = 900;
        const BANNER_H = 100;
        exportCanvas.width = W;
        exportCanvas.height = H + BANNER_H;

        if (currentRoom === 'custom' && customCanvas) {
          exportCtx.drawImage(customCanvas, 0, 0, W, H);
        } else {
          // Draw Preset Image
          const imgToDraw = new Image();
          imgToDraw.crossOrigin = 'anonymous';
          imgToDraw.src = baseImg.src;
          await new Promise((resolve) => {
            if (imgToDraw.complete) resolve();
            else imgToDraw.onload = resolve;
          });
          exportCtx.drawImage(imgToDraw, 0, 0, W, H);

          // Tint Wall with Mask
          const maskToDraw = new Image();
          maskToDraw.crossOrigin = 'anonymous';
          const preset = ROOM_PRESETS[currentRoom];
          const maskSrc = preset ? (preset.zones[currentZone] || preset.zones.all) : '';
          maskToDraw.src = maskSrc;
          await new Promise((resolve) => {
            if (maskToDraw.complete) resolve();
            else maskToDraw.onload = resolve;
          });

          // Create offscreen mask + color buffer
          const offCanvas = document.createElement('canvas');
          offCanvas.width = W;
          offCanvas.height = H;
          const offCtx = offCanvas.getContext('2d');

          offCtx.fillStyle = currentColor.hex;
          offCtx.fillRect(0, 0, W, H);

          offCtx.globalCompositeOperation = 'destination-in';
          offCtx.drawImage(maskToDraw, 0, 0, W, H);

          exportCtx.globalAlpha = 0.95;
          exportCtx.globalCompositeOperation = 'multiply';
          exportCtx.drawImage(offCanvas, 0, 0);
          exportCtx.globalAlpha = 1.0;
          exportCtx.globalCompositeOperation = 'source-over';
        }

        // Draw Bottom Branding Bar
        exportCtx.fillStyle = '#0F4C5C';
        exportCtx.fillRect(0, H, W, BANNER_H);

        exportCtx.fillStyle = '#F4A300';
        exportCtx.fillRect(0, H, W, 4);

        exportCtx.beginPath();
        exportCtx.arc(50, H + BANNER_H / 2, 28, 0, Math.PI * 2);
        exportCtx.fillStyle = currentColor.hex;
        exportCtx.fill();
        exportCtx.lineWidth = 3;
        exportCtx.strokeStyle = '#FFFFFF';
        exportCtx.stroke();

        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.font = 'bold 26px Outfit, sans-serif';
        exportCtx.fillText(`${currentColor.name} (${currentColor.hex})`, 95, H + BANNER_H / 2 - 4);

        exportCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        exportCtx.font = '16px "Plus Jakarta Sans", sans-serif';
        const roomName = currentRoom === 'custom' ? 'Foto Personalizada' : ROOM_PRESETS[currentRoom].name;
        exportCtx.fillText(`Estancia: ${roomName} · Acabado: ${currentFinish}`, 95, H + BANNER_H / 2 + 24);

        exportCtx.textAlign = 'right';
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.font = 'bold 24px Outfit, sans-serif';
        exportCtx.fillText('Le&Ba Pintores Lanzarote', W - 40, H + BANNER_H / 2 - 4);

        exportCtx.fillStyle = '#F4A300';
        exportCtx.font = '15px "Plus Jakarta Sans", sans-serif';
        exportCtx.fillText('www.lebapintores.es · Tel: 600 123 456', W - 40, H + BANNER_H / 2 + 22);

        // Download
        const link = document.createElement('a');
        link.download = `leba-color-${currentColor.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
        link.href = exportCanvas.toDataURL('image/jpeg', 0.92);
        link.click();
        showToast('¡Diseño descargado con éxito! 🖼️', 'success');
      } catch (err) {
        console.error('Error generating export:', err);
        showToast('No se pudo generar la descarga de imagen.', 'error');
      }
    });

    // 16. Custom Photo Upload & Painting Engine
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          customImgObj = img;
          setupCustomCanvas();
          if (uploadOverlay) uploadOverlay.hidden = true;
          if (customTools) customTools.hidden = false;
          saveCustomHistory();
          showToast('¡Foto cargada! Toca cualquier pared para colorearla. ✨', 'success');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    function setupCustomCanvas() {
      if (!customCanvas || !customImgObj) return;
      const rect = customCanvas.getBoundingClientRect();
      customCanvas.width = rect.width * (window.devicePixelRatio || 1);
      customCanvas.height = rect.height * (window.devicePixelRatio || 1);
      customCtx = customCanvas.getContext('2d', { willReadFrequently: true });
      customCtx.drawImage(customImgObj, 0, 0, customCanvas.width, customCanvas.height);
    }

    window.addEventListener('resize', () => {
      if (currentRoom === 'custom' && customImgObj) {
        setupCustomCanvas();
      }
    });

    section.querySelectorAll('.vis-tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.vis-tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        customTool = btn.dataset.tool;
      });
    });

    function saveCustomHistory() {
      if (!customCanvas || !customCtx) return;
      if (customHistory.length >= MAX_HISTORY) customHistory.shift();
      customHistory.push(customCtx.getImageData(0, 0, customCanvas.width, customCanvas.height));
    }

    undoBtn?.addEventListener('click', () => {
      if (customHistory.length > 1) {
        customHistory.pop();
        const prev = customHistory[customHistory.length - 1];
        customCtx.putImageData(prev, 0, 0);
        showToast('Último cambio deshecho.', 'info');
      } else {
        showToast('No hay más cambios que deshacer.', 'info');
      }
    });

    clearBtn?.addEventListener('click', () => {
      if (customCanvas && customCtx && customImgObj) {
        customCtx.drawImage(customImgObj, 0, 0, customCanvas.width, customCanvas.height);
        saveCustomHistory();
        showToast('Pintura restablecida.', 'info');
      }
    });

    function getCanvasCoords(e) {
      const rect = customCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = Math.floor((clientX - rect.left) * (customCanvas.width / rect.width));
      const y = Math.floor((clientY - rect.top) * (customCanvas.height / rect.height));
      return { x, y };
    }

    function handlePointerDown(e) {
      if (currentRoom !== 'custom' || !customCtx) return;
      const { x, y } = getCanvasCoords(e);

      if (customTool === 'magic') {
        runFloodFill(x, y);
      } else {
        isDrawing = true;
        drawStroke(x, y, true);
      }
    }

    function handlePointerMove(e) {
      if (!isDrawing || currentRoom !== 'custom') return;
      const { x, y } = getCanvasCoords(e);
      drawStroke(x, y, false);
    }

    function handlePointerUp() {
      if (isDrawing) {
        isDrawing = false;
        saveCustomHistory();
      }
    }

    customCanvas?.addEventListener('mousedown', handlePointerDown);
    customCanvas?.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    customCanvas?.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointerDown(e); }, { passive: false });
    customCanvas?.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointerMove(e); }, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    function drawStroke(x, y, isStart) {
      if (!customCtx) return;
      customCtx.lineWidth = 36 * (customCanvas.width / 800);
      customCtx.lineCap = 'round';
      customCtx.lineJoin = 'round';

      if (customTool === 'eraser') {
        customCtx.globalCompositeOperation = 'destination-out';
        customCtx.beginPath();
        customCtx.arc(x, y, customCtx.lineWidth / 2, 0, Math.PI * 2);
        customCtx.fill();
        customCtx.globalCompositeOperation = 'source-over';
      } else {
        customCtx.globalCompositeOperation = 'multiply';
        customCtx.fillStyle = currentColor.hex;
        customCtx.strokeStyle = currentColor.hex;
        if (isStart) {
          customCtx.beginPath();
          customCtx.arc(x, y, customCtx.lineWidth / 2, 0, Math.PI * 2);
          customCtx.fill();
        } else {
          customCtx.lineTo(x, y);
          customCtx.stroke();
          customCtx.beginPath();
          customCtx.moveTo(x, y);
        }
        customCtx.globalCompositeOperation = 'source-over';
      }
    }

    function runFloodFill(startX, startY) {
      const W = customCanvas.width;
      const H = customCanvas.height;
      if (startX < 0 || startX >= W || startY < 0 || startY >= H) return;

      showToast('Pintando pared...', 'info');

      requestAnimationFrame(() => {
        const imgData = customCtx.getImageData(0, 0, W, H);
        const data = imgData.data;

        const targetIdx = (startY * W + startX) * 4;
        const targetR = data[targetIdx];
        const targetG = data[targetIdx + 1];
        const targetB = data[targetIdx + 2];

        const fillR = parseInt(currentColor.hex.slice(1, 3), 16);
        const fillG = parseInt(currentColor.hex.slice(3, 5), 16);
        const fillB = parseInt(currentColor.hex.slice(5, 7), 16);

        const tolerance = 42;
        const visited = new Uint8Array(W * H);
        const queue = [startX + startY * W];
        visited[startX + startY * W] = 1;

        while (queue.length > 0) {
          const pos = queue.pop();
          const px = pos % W;
          const py = Math.floor(pos / W);
          const idx = (py * W + px) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          data[idx] = Math.round((r * fillR) / 235);
          data[idx + 1] = Math.round((g * fillG) / 235);
          data[idx + 2] = Math.round((b * fillB) / 235);

          const neighbors = [
            px > 0 ? pos - 1 : -1,
            px < W - 1 ? pos + 1 : -1,
            py > 0 ? pos - W : -1,
            py < H - 1 ? pos + W : -1
          ];

          for (let i = 0; i < 4; i++) {
            const nPos = neighbors[i];
            if (nPos >= 0 && !visited[nPos]) {
              const nIdx = nPos * 4;
              const dr = Math.abs(data[nIdx] - targetR);
              const dg = Math.abs(data[nIdx + 1] - targetG);
              const db = Math.abs(data[nIdx + 2] - targetB);
              if (dr + dg + db <= tolerance * 2.8) {
                visited[nPos] = 1;
                queue.push(nPos);
              }
            }
          }
        }

        customCtx.putImageData(imgData, 0, 0);
        saveCustomHistory();
        showToast(`¡Pared pintada con ${currentColor.name}! ✨`, 'success');
      });
    }

    // 17. Initial setup
    renderSwatches();
    applyRoom('dormitorio');
    applyColor(PALETTES.lanzarote[0]);
  }

})();