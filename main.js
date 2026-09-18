const header = document.getElementById('header');
const nav = document.getElementById('siteNav');
const menuToggle = document.getElementById('menuToggle');
const modal = document.getElementById('modal');
const progress = document.getElementById('pageProgress');
const glow = document.getElementById('cursorGlow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollState() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

document.getElementById('year').textContent = new Date().getFullYear();

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function openContact() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeContact() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.open-contact').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    openContact();
  });
});

document.getElementById('closeModal').addEventListener('click', closeContact);
modal.addEventListener('click', event => {
  if (event.target === modal) closeContact();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeContact();
    nav.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const linkedSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === id));
  });
}, { threshold: 0.55 });

linkedSections.forEach(section => sectionObserver.observe(section));

if (!prefersReducedMotion) {
  window.addEventListener('pointermove', event => {
    glow.style.opacity = '1';
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    glow.style.opacity = '0';
  });

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateX = (0.5 - y) * 5;
      const rotateY = (x - 0.5) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}


function enableDragScroll(selector) {
  document.querySelectorAll(selector).forEach(scroller => {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let resumeTimer;

    const pause = () => {
      scroller.classList.add('is-interacting');
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => scroller.classList.remove('is-interacting'), 1800);
    };

    scroller.addEventListener('pointerdown', event => {
      isDown = true;
      startX = event.pageX;
      startScrollLeft = scroller.scrollLeft;
      pause();
      scroller.setPointerCapture?.(event.pointerId);
    });

    scroller.addEventListener('pointermove', event => {
      if (!isDown) return;
      const walk = event.pageX - startX;
      scroller.scrollLeft = startScrollLeft - walk;
    });

    const endDrag = () => {
      isDown = false;
    };

    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);
    scroller.addEventListener('wheel', pause, { passive: true });
    scroller.addEventListener('touchstart', pause, { passive: true });
    scroller.addEventListener('touchmove', pause, { passive: true });
  });
}

enableDragScroll('.gallery-shell, .review-shell');
