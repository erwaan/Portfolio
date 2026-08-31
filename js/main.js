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
