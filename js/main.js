(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');

  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => {
      if (section.id) sectionObserver.observe(section);
    });
  }

  /* ---------------- Reveal-on-scroll ---------------- */
  const revealTargets = document.querySelectorAll(
    '.about__grid, .skill-card, .project-card, .contact__grid, .section-title, .section-lead, .project-figure, .project-gallery, .project-embed, .project-card-info'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Typewriter ---------------- */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    "ingénieur IT & créateur d'expériences",
    'divertissement et arts numériques',
    "passionné d'expériences immersives",
    "bidouilleur professionnel d'idées originales",
  ];

  if (typewriterEl) {
    if (prefersReducedMotion) {
      typewriterEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
          charIndex++;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1800);
            return;
          }
        } else {
          charIndex--;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        setTimeout(tick, deleting ? 35 : 55);
      };

      tick();
    }
  }

  /* ---------------- Contact form (AJAX submit, no reload) ---------------- */
  const form = document.querySelector('.contact__form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Envoi en cours...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          status.textContent = 'Message envoyé, merci ! Je reviens vers vous rapidement.';
          form.reset();
        } else {
          status.textContent = "Oups, une erreur est survenue. Réessayez ou écrivez-moi directement.";
        }
      } catch (err) {
        status.textContent = "Oups, une erreur réseau est survenue. Réessayez plus tard.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------------- Lightbox (project images) ---------------- */
  const lightboxImages = Array.from(document.querySelectorAll('.project-main img'));

  if (lightboxImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visionneuse d\'images');
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer">&times;</button>
      <button class="lightbox__btn lightbox__nav lightbox__nav--prev" type="button" aria-label="Image précédente">&lsaquo;</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" src="" alt="" />
        <figcaption class="lightbox__caption"></figcaption>
      </figure>
      <button class="lightbox__btn lightbox__nav lightbox__nav--next" type="button" aria-label="Image suivante">&rsaquo;</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCaption = lightbox.querySelector('.lightbox__caption');
    const lbClose = lightbox.querySelector('.lightbox__close');
    const lbPrev = lightbox.querySelector('.lightbox__nav--prev');
    const lbNext = lightbox.querySelector('.lightbox__nav--next');
    const multiple = lightboxImages.length > 1;
    let current = 0;
    let lastFocused = null;

    lbPrev.hidden = !multiple;
    lbNext.hidden = !multiple;

    const show = (index) => {
      current = (index + lightboxImages.length) % lightboxImages.length;
      const source = lightboxImages[current];
      lbImg.src = source.currentSrc || source.src;
      lbImg.alt = source.alt;
      const counter = multiple ? `${current + 1} / ${lightboxImages.length}` : '';
      lbCaption.textContent = [counter, source.alt].filter(Boolean).join(' · ');
    };

    const open = (index) => {
      lastFocused = document.activeElement;
      show(index);
      lightbox.hidden = false;
      document.body.classList.add('has-lightbox');
      requestAnimationFrame(() => lightbox.classList.add('is-open'));
      lbClose.focus();
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('has-lightbox');
      lightbox.hidden = true;
      if (lastFocused) lastFocused.focus();
    };

    lightboxImages.forEach((img, index) => {
      img.classList.add('is-zoomable');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', () => open(index));
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(index);
        }
      });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => show(current - 1));
    lbNext.addEventListener('click', () => show(current + 1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.classList.contains('lightbox__figure')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft' && multiple) show(current - 1);
      else if (event.key === 'ArrowRight' && multiple) show(current + 1);
      else if (event.key === 'Tab') {
        const focusables = [lbClose, lbPrev, lbNext].filter((el) => !el.hidden);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    let touchStartX = null;
    lightbox.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (event) => {
      if (touchStartX === null || !multiple) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Background particle network ---------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    const PARTICLE_COUNT_BASE = 9000; // px^2 per particle

    const colors = ['94, 234, 212', '185, 139, 255'];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.max(35, Math.floor((width * height) / PARTICLE_COUNT_BASE)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, 0.7)`;
        ctx.fill();
      }

      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${0.12 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    requestAnimationFrame(step);
  }
})();
