/* ============================================
   Indo Gulf Audit — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Active Navigation Link ──────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Also set mobile nav active states
  document.querySelectorAll('.mobile-nav-panel nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  // ── 2. Mobile Hamburger Menu ───────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobilePanel = document.getElementById('mobile-panel');

  function openMobileMenu() {
    mobileOverlay?.classList.add('active');
    mobilePanel?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('active');
    mobilePanel?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);


  // ── 3. Smooth Scroll for Anchor Links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileMenu();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── 4. Fade-In on Scroll (Intersection Observer) ───────
  const fadeElements = document.querySelectorAll('.fade-in-up');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }


  // ── 5. Counter Animation (About Page Stats) ────────────
  const counterElements = document.querySelectorAll('[data-counter]');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = el.getAttribute('data-counter');
    const suffix = el.getAttribute('data-suffix') || '';
    const isPercent = target.includes('%');
    const isRatio = target.includes('/');

    if (isRatio) {
      // For "24/7" style — just reveal it
      el.textContent = target;
      return;
    }

    const numericValue = parseInt(target.replace(/[^0-9]/g, ''), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * numericValue);

      el.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }


  // ── 6. FAQ Accordion (Company Formation Page) ──────────
  document.querySelectorAll('.faq-item .faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });


  // ── 7. Contact Form Handler (Web3Forms AJAX) ────────────
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');
  const sendAnotherBtn = document.getElementById('send-another-btn');

  // Check URL for ?success=true (redirect-based fallback)
  if (window.location.search.includes('success=true')) {
    if (contactForm) contactForm.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('show');
    // Clean up the URL
    window.history.replaceState({}, '', window.location.pathname);
  }

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending...';
    if (submitSpinner) submitSpinner.classList.remove('hidden');
    if (formError) formError.classList.add('hidden');

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Show success
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        contactForm.reset();
      } else {
        // Show error
        if (formError) formError.classList.remove('hidden');
      }
    } catch (error) {
      // Network or unexpected error
      if (formError) formError.classList.remove('hidden');
    } finally {
      // Reset button state
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Send Message';
      if (submitSpinner) submitSpinner.classList.add('hidden');
    }
  });

  // "Send another message" button
  sendAnotherBtn?.addEventListener('click', () => {
    if (formSuccess) formSuccess.classList.remove('show');
    if (contactForm) {
      contactForm.style.display = '';
      contactForm.reset();
    }
    if (formError) formError.classList.add('hidden');
  });


  // ── 8. Navbar Shadow on Scroll ─────────────────────────
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

});
