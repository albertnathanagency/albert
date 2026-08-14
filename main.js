/* ============================================
   ALBERT NATHAN AGENCY — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- NAVIGATION SCROLL ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---- MOBILE MENU ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- FAQ ACCORDION ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- COOKIE CONSENT ----
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieDecline = document.querySelector('.cookie-decline');

  if (cookieBanner) {
    const cookieConsent = localStorage.getItem('ana_cookie_consent');
    if (!cookieConsent) {
      setTimeout(function () {
        cookieBanner.classList.add('show');
      }, 1500);
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () {
        localStorage.setItem('ana_cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
        initAnalytics();
      });
    }

    if (cookieDecline) {
      cookieDecline.addEventListener('click', function () {
        localStorage.setItem('ana_cookie_consent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // ---- COUNTER ANIMATION ----
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- ANALYTICS INIT ----
  function initAnalytics() {
    // Replace GA_MEASUREMENT_ID with your actual Google Analytics ID
    // Example: G-XXXXXXXXXX
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  // ---- FORMSPREE HANDLER ----
  const forms = document.querySelectorAll('form[data-formspree]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = 'Sending…';
        btn.disabled = true;
      }

      const endpoint = form.getAttribute('data-formspree');
      const data = new FormData(form);

      fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            window.location.href = 'thank-you.html';
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
          alert('There was an issue submitting your enquiry. Please email us directly at albertnathan@bookpromotionuk.com');
        });
    });
  });

});