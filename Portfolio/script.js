(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  /* Navbar scroll effect */
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  }

  /* Highlight active nav link based on scroll position */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* Mobile navigation toggle */
  function toggleNav() {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* Scroll reveal animations */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Stagger reveal for grid children */
  document.querySelectorAll('.skills-grid, .projects-grid').forEach(function (grid) {
    grid.querySelectorAll('.reveal').forEach(function (el, index) {
      el.style.transitionDelay = index * 0.1 + 's';
    });
  });

  /* Contact form handling */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
      }

      const mailtoLink =
        'mailto:fatimataskin44@gmail.com?subject=' +
        encodeURIComponent('Portfolio Contact from ' + name) +
        '&body=' +
        encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

      window.location.href = mailtoLink;
      showFormStatus('Opening your email client…', 'success');
      contactForm.reset();

      setTimeout(function () {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 4000);
    });
  }

  function showFormStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = 'form-status ' + type;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
